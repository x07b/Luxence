import { pool } from "../lib/db.js";

interface Specification {
  label: string;
  value: string;
}

interface Product {
  id: string;
  collectionId: string | null;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  slug: string;
  pdfFile?: string | null;
  pdfFilename?: string | null;
  specifications: Specification[];
}

function dbProductToApi(dbProduct: any, images: any[], specs: any[]): Product {
  return {
    id: dbProduct.id,
    collectionId: dbProduct.collection_id,
    name: dbProduct.name,
    description: dbProduct.description,
    price: Number(dbProduct.price || 0),
    images: images
      .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
      .map((img) => img.image_url),
    category: dbProduct.category,
    slug: dbProduct.slug,
    pdfFile: dbProduct.pdf_file || null,
    pdfFilename: dbProduct.pdf_filename || null,
    specifications: specs
      .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
      .map((spec) => ({
        label: spec.label,
        value: spec.value,
      })),
  };
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function getProducts(_req: any, res: any) {
  try {
    const productsResult = await pool.query(
      `SELECT *
       FROM products
       ORDER BY created_at DESC NULLS LAST, id DESC`,
    );

    const products = productsResult.rows;

    if (products.length === 0) {
      return res.json([]);
    }

    const productIds = products.map((p) => p.id);

    const [imagesResult, specsResult] = await Promise.all([
      pool.query(
        `SELECT *
         FROM product_images
         WHERE product_id = ANY($1::text[])`,
        [productIds],
      ),
      pool.query(
        `SELECT *
         FROM product_specifications
         WHERE product_id = ANY($1::text[])`,
        [productIds],
      ),
    ]);

    const imagesByProduct = new Map<string, any[]>();
    const specsByProduct = new Map<string, any[]>();

    for (const img of imagesResult.rows) {
      if (!imagesByProduct.has(img.product_id)) {
        imagesByProduct.set(img.product_id, []);
      }
      imagesByProduct.get(img.product_id)!.push(img);
    }

    for (const spec of specsResult.rows) {
      if (!specsByProduct.has(spec.product_id)) {
        specsByProduct.set(spec.product_id, []);
      }
      specsByProduct.get(spec.product_id)!.push(spec);
    }

    const productsWithRelations = products.map((product) =>
      dbProductToApi(
        product,
        imagesByProduct.get(product.id) || [],
        specsByProduct.get(product.id) || [],
      ),
    );

    return res.json(productsWithRelations);
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ error: "Failed to fetch products" });
  }
}

export async function getProductById(req: any, res: any) {
  try {
    const { id } = req.params;

    const productResult = await pool.query(
      `SELECT *
       FROM products
       WHERE id = $1 OR slug = $1
       LIMIT 1`,
      [id],
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    const product = productResult.rows[0];

    const [imagesResult, specsResult] = await Promise.all([
      pool.query(
        `SELECT *
         FROM product_images
         WHERE product_id = $1
         ORDER BY order_index ASC NULLS LAST, id ASC`,
        [product.id],
      ),
      pool.query(
        `SELECT *
         FROM product_specifications
         WHERE product_id = $1
         ORDER BY order_index ASC NULLS LAST, id ASC`,
        [product.id],
      ),
    ]);

    const productWithRelations = dbProductToApi(
      product,
      imagesResult.rows,
      specsResult.rows,
    );

    return res.json(productWithRelations);
  } catch (error) {
    console.error("Error fetching product:", error);
    return res.status(500).json({ error: "Failed to fetch product" });
  }
}

export async function createProduct(req: any, res: any) {
  const client = await pool.connect();

  try {
    const {
      name,
      description,
      price,
      images,
      category,
      collectionId,
      pdfFile,
      pdfFilename,
      specifications,
    } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        error: "Missing required fields: name and description are required",
      });
    }

    const slug = generateSlug(name);
    const id = `product-${Date.now()}`;

    await client.query("BEGIN");

    const productInsert = await client.query(
      `INSERT INTO products (
         id,
         collection_id,
         name,
         description,
         price,
         category,
         slug,
         pdf_file,
         pdf_filename
       )
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING *`,
      [
        id,
        collectionId || null,
        name,
        description,
        price || 0,
        category || "Uncategorized",
        slug,
        pdfFile || null,
        pdfFilename || null,
      ],
    );

    const product = productInsert.rows[0];

    if (images && Array.isArray(images) && images.length > 0) {
      const imageRecords = images
        .filter((img: string) => img && img.trim())
        .map((img: string, index: number) => ({
          product_id: id,
          image_url: img,
          order_index: index,
        }));

      for (const record of imageRecords) {
        await client.query(
          `INSERT INTO product_images (product_id, image_url, order_index)
           VALUES ($1, $2, $3)`,
          [record.product_id, record.image_url, record.order_index],
        );
      }
    }

    if (
      specifications &&
      Array.isArray(specifications) &&
      specifications.length > 0
    ) {
      const specRecords = specifications
        .filter(
          (spec: any) =>
            spec &&
            spec.label &&
            spec.value &&
            spec.label.trim() &&
            spec.value.trim(),
        )
        .map((spec: any, index: number) => ({
          product_id: id,
          label: spec.label,
          value: spec.value,
          order_index: index,
        }));

      for (const record of specRecords) {
        await client.query(
          `INSERT INTO product_specifications (product_id, label, value, order_index)
           VALUES ($1, $2, $3, $4)`,
          [record.product_id, record.label, record.value, record.order_index],
        );
      }
    }

    await client.query("COMMIT");

    const [imagesResult, specsResult] = await Promise.all([
      pool.query(
        `SELECT *
         FROM product_images
         WHERE product_id = $1
         ORDER BY order_index ASC NULLS LAST, id ASC`,
        [id],
      ),
      pool.query(
        `SELECT *
         FROM product_specifications
         WHERE product_id = $1
         ORDER BY order_index ASC NULLS LAST, id ASC`,
        [id],
      ),
    ]);

    const productWithRelations = dbProductToApi(
      product,
      imagesResult.rows,
      specsResult.rows,
    );

    return res.status(201).json(productWithRelations);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating product:", error);
    return res.status(500).json({ error: "Failed to create product" });
  } finally {
    client.release();
  }
}

export async function updateProduct(req: any, res: any) {
  const client = await pool.connect();

  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      images,
      category,
      collectionId,
      pdfFile,
      pdfFilename,
      specifications,
    } = req.body;

    const existingProductResult = await client.query(
      `SELECT id
       FROM products
       WHERE id = $1`,
      [id],
    );

    if (existingProductResult.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    const updateFields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (name !== undefined) {
      updateFields.push(`name = $${paramIndex++}`);
      values.push(name);
      updateFields.push(`slug = $${paramIndex++}`);
      values.push(generateSlug(name));
    }

    if (description !== undefined) {
      updateFields.push(`description = $${paramIndex++}`);
      values.push(description);
    }

    if (price !== undefined) {
      updateFields.push(`price = $${paramIndex++}`);
      values.push(price);
    }

    if (category !== undefined) {
      updateFields.push(`category = $${paramIndex++}`);
      values.push(category);
    }

    if (collectionId !== undefined) {
      updateFields.push(`collection_id = $${paramIndex++}`);
      values.push(collectionId || null);
    }

    if (pdfFile !== undefined) {
      updateFields.push(`pdf_file = $${paramIndex++}`);
      values.push(pdfFile || null);
    }

    if (pdfFilename !== undefined) {
      updateFields.push(`pdf_filename = $${paramIndex++}`);
      values.push(pdfFilename || null);
    }

    await client.query("BEGIN");

    let product: any;

    if (updateFields.length > 0) {
      values.push(id);

      const updateResult = await client.query(
        `UPDATE products
         SET ${updateFields.join(", ")}
         WHERE id = $${paramIndex}
         RETURNING *`,
        values,
      );

      product = updateResult.rows[0];
    } else {
      const unchangedResult = await client.query(
        `SELECT *
         FROM products
         WHERE id = $1`,
        [id],
      );
      product = unchangedResult.rows[0];
    }

    if (images !== undefined && Array.isArray(images)) {
      await client.query(
        `DELETE FROM product_images
         WHERE product_id = $1`,
        [id],
      );

      const imageRecords = images
        .filter((img: string) => img && img.trim())
        .map((img: string, index: number) => ({
          product_id: id,
          image_url: img,
          order_index: index,
        }));

      for (const record of imageRecords) {
        await client.query(
          `INSERT INTO product_images (product_id, image_url, order_index)
           VALUES ($1, $2, $3)`,
          [record.product_id, record.image_url, record.order_index],
        );
      }
    }

    if (specifications !== undefined && Array.isArray(specifications)) {
      await client.query(
        `DELETE FROM product_specifications
         WHERE product_id = $1`,
        [id],
      );

      const specRecords = specifications
        .filter(
          (spec: any) =>
            spec &&
            spec.label &&
            spec.value &&
            spec.label.trim() &&
            spec.value.trim(),
        )
        .map((spec: any, index: number) => ({
          product_id: id,
          label: spec.label,
          value: spec.value,
          order_index: index,
        }));

      for (const record of specRecords) {
        await client.query(
          `INSERT INTO product_specifications (product_id, label, value, order_index)
           VALUES ($1, $2, $3, $4)`,
          [record.product_id, record.label, record.value, record.order_index],
        );
      }
    }

    await client.query("COMMIT");

    const [imagesResult, specsResult] = await Promise.all([
      pool.query(
        `SELECT *
         FROM product_images
         WHERE product_id = $1
         ORDER BY order_index ASC NULLS LAST, id ASC`,
        [id],
      ),
      pool.query(
        `SELECT *
         FROM product_specifications
         WHERE product_id = $1
         ORDER BY order_index ASC NULLS LAST, id ASC`,
        [id],
      ),
    ]);

    const productWithRelations = dbProductToApi(
      product,
      imagesResult.rows,
      specsResult.rows,
    );

    return res.json(productWithRelations);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating product:", error);
    return res.status(500).json({ error: "Failed to update product" });
  } finally {
    client.release();
  }
}

export async function bulkImportProducts(req: any, res: any) {
  const { products: rows } = req.body;

  if (!Array.isArray(rows) || rows.length === 0) {
    return res.status(400).json({ error: "No products provided" });
  }

  const results = { created: 0, failed: 0, errors: [] as string[] };

  for (const row of rows) {
    const client = await pool.connect();
    try {
      const { name, description, price, category, images, specifications } = row;

      if (!name?.trim() || !description?.trim()) {
        results.failed++;
        results.errors.push(`"${name || "sans nom"}": name et description requis`);
        client.release();
        continue;
      }

      const id = `product-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const slug = generateSlug(name);

      await client.query("BEGIN");

      await client.query(
        `INSERT INTO products (id, name, description, price, category, slug)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          id,
          name.trim(),
          description.trim(),
          Number(price) || 0,
          (category || "Uncategorized").trim(),
          slug,
        ],
      );

      if (Array.isArray(images)) {
        for (let i = 0; i < images.length; i++) {
          if (images[i]?.trim()) {
            await client.query(
              `INSERT INTO product_images (product_id, image_url, order_index)
               VALUES ($1, $2, $3)`,
              [id, images[i].trim(), i],
            );
          }
        }
      }

      if (Array.isArray(specifications)) {
        for (let i = 0; i < specifications.length; i++) {
          const spec = specifications[i];
          if (spec?.label?.trim() && spec?.value?.trim()) {
            await client.query(
              `INSERT INTO product_specifications (product_id, label, value, order_index)
               VALUES ($1, $2, $3, $4)`,
              [id, spec.label.trim(), spec.value.trim(), i],
            );
          }
        }
      }

      await client.query("COMMIT");
      results.created++;
    } catch (err: any) {
      await client.query("ROLLBACK");
      results.failed++;
      results.errors.push(`"${row.name}": ${err.message}`);
    } finally {
      client.release();
    }
  }

  return res.json({ success: true, ...results });
}

export async function deleteProduct(req: any, res: any) {
  try {
    const { id } = req.params;

    const existingProductResult = await pool.query(
      `SELECT id
       FROM products
       WHERE id = $1`,
      [id],
    );

    if (existingProductResult.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    await pool.query(
      `DELETE FROM products
       WHERE id = $1`,
      [id],
    );

    return res.json({ id, deleted: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({ error: "Failed to delete product" });
  }
}

export async function addProductImage(req: any, res: any) {
  try {
    const { id } = req.params;
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: "Image URL required" });
    }

    const productResult = await pool.query(
      `SELECT *
       FROM products
       WHERE id = $1`,
      [id],
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    const maxOrderResult = await pool.query(
      `SELECT order_index
       FROM product_images
       WHERE product_id = $1
       ORDER BY order_index DESC NULLS LAST
       LIMIT 1`,
      [id],
    );

    const nextOrderIndex =
      maxOrderResult.rows.length > 0
        ? (maxOrderResult.rows[0].order_index || 0) + 1
        : 0;

    await pool.query(
      `INSERT INTO product_images (product_id, image_url, order_index)
       VALUES ($1, $2, $3)`,
      [id, imageUrl, nextOrderIndex],
    );

    const [imagesResult, specsResult] = await Promise.all([
      pool.query(
        `SELECT *
         FROM product_images
         WHERE product_id = $1
         ORDER BY order_index ASC NULLS LAST, id ASC`,
        [id],
      ),
      pool.query(
        `SELECT *
         FROM product_specifications
         WHERE product_id = $1
         ORDER BY order_index ASC NULLS LAST, id ASC`,
        [id],
      ),
    ]);

    const productWithRelations = dbProductToApi(
      productResult.rows[0],
      imagesResult.rows,
      specsResult.rows,
    );

    return res.json(productWithRelations);
  } catch (error) {
    console.error("Error adding product image:", error);
    return res.status(500).json({ error: "Failed to add product image" });
  }
}

export async function removeProductImage(req: any, res: any) {
  try {
    const { id } = req.params;
    const imageUrl = req.query.imageUrl || req.body?.imageUrl;

    if (!imageUrl) {
      return res.status(400).json({
        error:
          "Image URL required. Use query parameter ?imageUrl=... or body property imageUrl",
      });
    }

    const productResult = await pool.query(
      `SELECT *
       FROM products
       WHERE id = $1`,
      [id],
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    await pool.query(
      `DELETE FROM product_images
       WHERE product_id = $1
         AND image_url = $2`,
      [id, imageUrl],
    );

    const [imagesResult, specsResult] = await Promise.all([
      pool.query(
        `SELECT *
         FROM product_images
         WHERE product_id = $1
         ORDER BY order_index ASC NULLS LAST, id ASC`,
        [id],
      ),
      pool.query(
        `SELECT *
         FROM product_specifications
         WHERE product_id = $1
         ORDER BY order_index ASC NULLS LAST, id ASC`,
        [id],
      ),
    ]);

    const productWithRelations = dbProductToApi(
      productResult.rows[0],
      imagesResult.rows,
      specsResult.rows,
    );

    return res.json(productWithRelations);
  } catch (error) {
    console.error("Error removing product image:", error);
    return res.status(500).json({ error: "Failed to remove product image" });
  }
}
