import { z } from "zod";
import { pool } from "../lib/db.js";

const collectionSchema = z.object({
  name: z.string().trim().min(2).max(100),
  description: z.string().trim().max(1000).optional().default(""),
  image: z.string().url().max(2000).nullable().optional(),
});

interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
}

function dbCollectionToApi(dbCollection: any): Collection {
  return {
    id: dbCollection.id,
    name: dbCollection.name,
    slug: dbCollection.slug,
    description: dbCollection.description || "",
    image: dbCollection.image || undefined,
  };
}

// GET all collections
export async function getCollections(_req: any, res: any) {
  try {
    const result = await pool.query(
      `SELECT * FROM collections
       ORDER BY created_at DESC NULLS LAST, id DESC`,
    );

    const collections = result.rows.map(dbCollectionToApi);
    res.json(collections);
  } catch (error) {
    console.error("Error fetching collections:", error);
    res.status(500).json({ error: "Failed to fetch collections" });
  }
}

// GET one collection
export async function getCollectionById(req: any, res: any) {
  try {
    const { id } = req.params;

    const collectionResult = await pool.query(
      `SELECT * FROM collections
       WHERE id = $1 OR slug = $1
       LIMIT 1`,
      [id],
    );

    if (collectionResult.rows.length === 0) {
      return res.status(404).json({ error: "Collection not found" });
    }

    const collection = collectionResult.rows[0];

    const productsResult = await pool.query(
      `SELECT * FROM products
       WHERE collection_id = $1`,
      [collection.id],
    );

    const apiCollection = dbCollectionToApi(collection);

    res.json({
      ...apiCollection,
      products: productsResult.rows,
    });
  } catch (error) {
    console.error("Error fetching collection:", error);
    res.status(500).json({ error: "Failed to fetch collection" });
  }
}

// CREATE collection
export async function createCollection(req: any, res: any) {
  try {
    const parsed = collectionSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Données invalides", details: parsed.error.flatten() });
    }
    const { name, description, image } = parsed.data;

    const slug = name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

    const id = slug;

    // Check if exists
    const existing = await pool.query(
      `SELECT id FROM collections WHERE id = $1`,
      [id],
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: "Collection already exists" });
    }

    const result = await pool.query(
      `INSERT INTO collections (id, name, slug, description, image)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING *`,
      [id, name, slug, description || "", image || null],
    );

    res.status(201).json(dbCollectionToApi(result.rows[0]));
  } catch (error: any) {
    console.error("Error creating collection:", error);
    if (error.code === "23505") {
      return res.status(400).json({ error: "Collection already exists" });
    }
    res.status(500).json({ error: "Failed to create collection" });
  }
}

// UPDATE collection
export async function updateCollection(req: any, res: any) {
  try {
    const { id } = req.params;
    const parsed = collectionSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Données invalides", details: parsed.error.flatten() });
    }
    const { name, description, image } = parsed.data;

    const existing = await pool.query(
      `SELECT id FROM collections WHERE id = $1`,
      [id],
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ error: "Collection not found" });
    }

    const updateFields: string[] = [];
    const values: any[] = [];
    let index = 1;

    if (name !== undefined) {
      updateFields.push(`name = $${index++}`);
      values.push(name);
    }

    if (description !== undefined) {
      updateFields.push(`description = $${index++}`);
      values.push(description);
    }

    if (image !== undefined) {
      updateFields.push(`image = $${index++}`);
      values.push(image || null);
    }

    if (updateFields.length === 0) {
      return res.json({ message: "Nothing to update" });
    }

    values.push(id);

    const result = await pool.query(
      `UPDATE collections
       SET ${updateFields.join(", ")}
       WHERE id = $${index}
       RETURNING *`,
      values,
    );

    res.json(dbCollectionToApi(result.rows[0]));
  } catch (error) {
    console.error("Error updating collection:", error);
    res.status(500).json({ error: "Failed to update collection" });
  }
}

// DELETE collection
export async function deleteCollection(req: any, res: any) {
  try {
    const { id } = req.params;

    const existing = await pool.query(
      `SELECT id FROM collections WHERE id = $1`,
      [id],
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ error: "Collection not found" });
    }

    const products = await pool.query(
      `SELECT id FROM products WHERE collection_id = $1 LIMIT 1`,
      [id],
    );

    if (products.rows.length > 0) {
      return res.status(400).json({
        error:
          "Cannot delete collection with products. Delete all products first.",
      });
    }

    await pool.query(`DELETE FROM collections WHERE id = $1`, [id]);

    res.json({ id, deleted: true });
  } catch (error) {
    console.error("Error deleting collection:", error);
    res.status(500).json({ error: "Failed to delete collection" });
  }
}
