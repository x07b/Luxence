import { randomUUID } from "node:crypto";
import { pool } from "../lib/db.js";

export interface DetailSection {
  id?: string;
  title: string;
  content: string;
  order?: number;
}

function dbSectionToApi(dbSection: any): DetailSection {
  return {
    id: dbSection.id,
    title: dbSection.title,
    content: dbSection.content,
    order: dbSection.order_index || 0,
  };
}

export async function getProductDetails(req: any, res: any) {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    const result = await pool.query(
      `SELECT *
       FROM product_details_sections
       WHERE product_id = $1
       ORDER BY order_index ASC NULLS LAST, id ASC`,
      [productId],
    );

    const apiSections = result.rows.map(dbSectionToApi);
    return res.json(apiSections);
  } catch (error) {
    console.error("Error fetching product details:", error);
    return res.status(500).json({ error: "Failed to fetch product details" });
  }
}

export async function upsertProductDetails(req: any, res: any) {
  const client = await pool.connect();

  try {
    const { productId } = req.params;
    const { sections } = req.body;

    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    if (!Array.isArray(sections)) {
      return res.status(400).json({ error: "Sections must be an array" });
    }

    await client.query("BEGIN");

    await client.query(
      `DELETE FROM product_details_sections
       WHERE product_id = $1`,
      [productId],
    );

    const sectionsToInsert = sections
      .filter((s: any) => s.title && s.content)
      .map((s: any, index: number) => ({
        id: s.id || randomUUID(),
        product_id: productId,
        title: s.title,
        content: s.content,
        order_index: s.order ?? index,
      }));

    if (sectionsToInsert.length > 0) {
      for (const section of sectionsToInsert) {
        await client.query(
          `INSERT INTO product_details_sections
           (id, product_id, title, content, order_index)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            section.id,
            section.product_id,
            section.title,
            section.content,
            section.order_index,
          ],
        );
      }
    }

    await client.query("COMMIT");

    const result = await pool.query(
      `SELECT *
       FROM product_details_sections
       WHERE product_id = $1
       ORDER BY order_index ASC NULLS LAST, id ASC`,
      [productId],
    );

    const apiSections = result.rows.map(dbSectionToApi);
    return res.json(apiSections);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error upserting product details:", error);
    return res.status(500).json({ error: "Failed to save product details" });
  } finally {
    client.release();
  }
}

export async function deleteProductDetail(req: any, res: any) {
  try {
    const { sectionId } = req.params;

    if (!sectionId) {
      return res.status(400).json({ error: "Section ID is required" });
    }

    const result = await pool.query(
      `DELETE FROM product_details_sections
       WHERE id = $1
       RETURNING id`,
      [sectionId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Section not found" });
    }

    return res.json({ success: true });
  } catch (error) {
    console.error("Error deleting product detail:", error);
    return res.status(500).json({ error: "Failed to delete product detail" });
  }
}
