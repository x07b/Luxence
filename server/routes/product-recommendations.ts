import { Router } from "express";
import { pool } from "../lib/db.js";

const router = Router();

// Helper function to get recommended products by their IDs
async function getRecommendedProductsByIds(
  productIds: string[],
): Promise<Map<string, any>> {
  if (productIds.length === 0) return new Map();

  const productsResult = await pool.query(
    `
    SELECT id, name, slug, description, category, price
    FROM products
    WHERE id = ANY($1::text[])
    `,
    [productIds],
  );

  const imageResults = await pool.query(
    `
    SELECT product_id, image_url, order_index
    FROM product_images
    WHERE product_id = ANY($1::text[])
    ORDER BY product_id, order_index ASC
    `,
    [productIds],
  );

  const imagesByProduct = new Map<string, string[]>();

  for (const img of imageResults.rows) {
    if (!imagesByProduct.has(img.product_id)) {
      imagesByProduct.set(img.product_id, []);
    }
    imagesByProduct.get(img.product_id)!.push(img.image_url);
  }

  const productsMap = new Map<string, any>();

  for (const product of productsResult.rows) {
    productsMap.set(product.id, {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      category: product.category,
      price: Number(product.price || 0),
      images: imagesByProduct.get(product.id) || [],
    });
  }

  return productsMap;
}

// Route for fetching recommended products for a specific product
router.get("/:productId/recommendations", async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    const result = await pool.query(
      `
      SELECT recommended_product_id, order_index
      FROM product_recommendations
      WHERE product_id = $1
      ORDER BY order_index ASC, id ASC
      `,
      [productId],
    );

    const recommendedProductIds = result.rows.map(
      (row) => row.recommended_product_id,
    );

    const productsMap = await getRecommendedProductsByIds(recommendedProductIds);

    const recommendations = recommendedProductIds
      .map((id) => productsMap.get(id))
      .filter(Boolean);

    return res.json(recommendations);
  } catch (error) {
    console.error("Error fetching product recommendations:", error);

    return res.status(500).json({
      error: "Failed to fetch product recommendations",
    });
  }
});

// Route for updating or inserting product recommendations
router.put("/:productId/recommendations", async (req, res) => {
  const client = await pool.connect();

  try {
    const { productId } = req.params;
    const { recommendations } = req.body;

    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    if (!Array.isArray(recommendations)) {
      return res.status(400).json({
        error: "Recommendations must be an array",
      });
    }

    const uniqueRecommendations = [...new Set(recommendations)];

    if (uniqueRecommendations.length > 3) {
      return res.status(400).json({
        error: "Maximum 3 recommended products allowed",
      });
    }

    if (uniqueRecommendations.includes(productId)) {
      return res.status(400).json({
        error: "A product cannot recommend itself",
      });
    }

    const productExists = await client.query(
      `
      SELECT id
      FROM products
      WHERE id = $1
      `,
      [productId],
    );

    if (productExists.rows.length === 0) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    if (uniqueRecommendations.length > 0) {
      const validProducts = await client.query(
        `
        SELECT id
        FROM products
        WHERE id = ANY($1::text[])
        `,
        [uniqueRecommendations],
      );

      if (validProducts.rows.length !== uniqueRecommendations.length) {
        return res.status(400).json({
          error: "One or more recommended products do not exist",
        });
      }
    }

    await client.query("BEGIN");

    await client.query(
      `
      DELETE FROM product_recommendations
      WHERE product_id = $1
      `,
      [productId],
    );

    for (let i = 0; i < uniqueRecommendations.length; i++) {
      await client.query(
        `
        INSERT INTO product_recommendations
          (product_id, recommended_product_id, order_index)
        VALUES ($1, $2, $3)
        `,
        [productId, uniqueRecommendations[i], i],
      );
    }

    await client.query("COMMIT");

    const productsMap = await getRecommendedProductsByIds(uniqueRecommendations);

    const apiRecommendations = uniqueRecommendations
      .map((id) => productsMap.get(id))
      .filter(Boolean);

    return res.json(apiRecommendations);
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Error saving product recommendations:", error);

    return res.status(500).json({
      error: "Failed to save product recommendations",
    });
  } finally {
    client.release();
  }
});

export default router;