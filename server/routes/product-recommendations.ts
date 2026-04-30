import { pool } from "../lib/db.js";

export interface RecommendedProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  images: string[];
  price: number;
}

async function getRecommendedProductsByIds(
  productIds: string[],
): Promise<Map<string, RecommendedProduct>> {
  if (productIds.length === 0) return new Map();

  const productsResult = await pool.query(
    `SELECT id, name, slug, description, category, price
     FROM products
     WHERE id = ANY($1::text[])`,
    [productIds],
  );

  const imageResults = await pool.query(
    `SELECT product_id, image_url, order_index
     FROM product_images
     WHERE product_id = ANY($1::text[])
     ORDER BY product_id, order_index ASC`,
    [productIds],
  );

  const imagesByProduct = new Map<string, string[]>();
  for (const img of imageResults.rows) {
    if (!imagesByProduct.has(img.product_id)) {
      imagesByProduct.set(img.product_id, []);
    }
    imagesByProduct.get(img.product_id)!.push(img.image_url);
  }

  const productsMap = new Map<string, RecommendedProduct>();
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

export async function getProductRecommendations(req: any, res: any) {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    const result = await pool.query(
      `SELECT pr.id, pr.recommended_product_id, pr.order_index
       FROM product_recommendations pr
       WHERE pr.product_id = $1
       ORDER BY pr.order_index ASC, pr.id ASC`,
      [productId],
    );

    const recommendedProductIds = result.rows.map(
      (row) => row.recommended_product_id,
    );
    const productsMap = await getRecommendedProductsByIds(recommendedProductIds);

    const recommendations = result.rows
      .map((row) => productsMap.get(row.recommended_product_id))
      .filter((p) => p !== undefined) as RecommendedProduct[];

    return res.json(recommendations);
  } catch (error) {
    console.error("Error fetching product recommendations:", error);
    return res
      .status(500)
      .json({ error: "Failed to fetch product recommendations" });
  }
}

export async function upsertProductRecommendations(req: any, res: any) {
  const client = await pool.connect();

  try {
    const { productId } = req.params;
    const { recommendations } = req.body;

    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    if (!Array.isArray(recommendations)) {
      return res.status(400).json({ error: "Recommendations must be an array" });
    }

    // Validate that we don't exceed 3 recommendations
    if (recommendations.length > 3) {
      return res.status(400).json({
        error: "Maximum 3 recommended products allowed",
      });
    }

    // Validate that no recommended product is the same as the product itself
    for (const rec of recommendations) {
      if (rec === productId) {
        return res.status(400).json({
          error: "A product cannot recommend itself",
        });
      }
    }

    await client.query("BEGIN");

    await client.query(
      `DELETE FROM product_recommendations
       WHERE product_id = $1`,
      [productId],
    );

    if (recommendations.length > 0) {
      for (let i = 0; i < recommendations.length; i++) {
        await client.query(
          `INSERT INTO product_recommendations
           (product_id, recommended_product_id, order_index)
           VALUES ($1, $2, $3)`,
          [productId, recommendations[i], i],
        );
      }
    }

    await client.query("COMMIT");

    const result = await pool.query(
      `SELECT pr.recommended_product_id
       FROM product_recommendations pr
       WHERE pr.product_id = $1
       ORDER BY pr.order_index ASC`,
      [productId],
    );

    const recommendedProductIds = result.rows.map(
      (row) => row.recommended_product_id,
    );
    const productsMap = await getRecommendedProductsByIds(recommendedProductIds);

    const apiRecommendations = recommendedProductIds
      .map((id) => productsMap.get(id))
      .filter((p) => p !== undefined) as RecommendedProduct[];

    return res.json(apiRecommendations);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error upserting product recommendations:", error);
    return res
      .status(500)
      .json({ error: "Failed to save product recommendations" });
  } finally {
    client.release();
  }
}
