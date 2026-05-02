import { z } from "zod";
import { pool } from "../lib/db.js";

const slideSchema = z.object({
  image: z.string().url().max(2000),
  alt: z.string().trim().max(200).optional().default("Hero slide"),
  order: z.number().int().min(0).optional(),
  title: z.string().trim().max(200).optional().default(""),
  description: z.string().trim().max(1000).optional().default(""),
  button1_text: z.string().trim().max(100).optional().default(""),
  button1_link: z.string().trim().max(2000).optional().default(""),
  button2_text: z.string().trim().max(100).optional().default(""),
  button2_link: z.string().trim().max(2000).optional().default(""),
});

export interface HeroSlide {
  id: string;
  image: string;
  alt: string;
  order: number;
  title: string;
  description: string;
  button1_text: string;
  button1_link: string;
  button2_text: string;
  button2_link: string;
}

function dbSlideToApi(dbSlide: any): HeroSlide {
  return {
    id: dbSlide.id,
    image: dbSlide.image,
    alt: dbSlide.alt || "Hero slide",
    order: dbSlide.order_index || 0,
    title: dbSlide.title || "",
    description: dbSlide.description || "",
    button1_text: dbSlide.button1_text || "",
    button1_link: dbSlide.button1_link || "",
    button2_text: dbSlide.button2_text || "",
    button2_link: dbSlide.button2_link || "",
  };
}

export async function getHeroSlides(_req: any, res: any) {
  try {
    const result = await pool.query(`
      SELECT * FROM hero_slides
      ORDER BY order_index ASC NULLS LAST, id ASC
    `);

    res.json(result.rows.map(dbSlideToApi));
  } catch (error) {
    console.error("Error fetching hero slides:", error);
    res.status(500).json({ error: "Failed to fetch hero slides" });
  }
}

export async function createHeroSlide(req: any, res: any) {
  try {
    const parsed = slideSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Données invalides", details: parsed.error.flatten() });
    }
    const { image, alt, order, title, description, button1_text, button1_link, button2_text, button2_link } = parsed.data;

    let orderIndex = order;

    if (orderIndex === undefined) {
      const max = await pool.query(`
        SELECT order_index
        FROM hero_slides
        ORDER BY order_index DESC NULLS LAST
        LIMIT 1
      `);

      orderIndex =
        max.rows.length > 0 ? (max.rows[0].order_index || 0) + 1 : 0;
    }

    const id = `slide_${Date.now()}`;

    const result = await pool.query(
      `
      INSERT INTO hero_slides
      (
        id,
        image,
        alt,
        order_index,
        title,
        description,
        button1_text,
        button1_link,
        button2_text,
        button2_link
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *
      `,
      [
        id,
        image,
        alt || "Hero slide",
        orderIndex,
        title || "",
        description || "",
        button1_text || "",
        button1_link || "",
        button2_text || "",
        button2_link || "",
      ],
    );

    res.status(201).json(dbSlideToApi(result.rows[0]));
  } catch (error) {
    console.error("Error creating hero slide:", error);
    res.status(500).json({ error: "Failed to create hero slide" });
  }
}

export async function updateHeroSlide(req: any, res: any) {
  try {
    const { id } = req.params;

    const parsed = slideSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Données invalides", details: parsed.error.flatten() });
    }
    const { image, alt, order, title, description, button1_text, button1_link, button2_text, button2_link } = parsed.data;

    const existing = await pool.query(
      `SELECT id FROM hero_slides WHERE id = $1`,
      [id],
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ error: "Slide not found" });
    }

    const fields: string[] = [];
    const values: any[] = [];
    let i = 1;

    if (image !== undefined) {
      fields.push(`image = $${i++}`);
      values.push(image);
    }

    if (alt !== undefined) {
      fields.push(`alt = $${i++}`);
      values.push(alt);
    }

    if (order !== undefined) {
      fields.push(`order_index = $${i++}`);
      values.push(order);
    }

    if (title !== undefined) {
      fields.push(`title = $${i++}`);
      values.push(title);
    }

    if (description !== undefined) {
      fields.push(`description = $${i++}`);
      values.push(description);
    }

    if (button1_text !== undefined) {
      fields.push(`button1_text = $${i++}`);
      values.push(button1_text);
    }

    if (button1_link !== undefined) {
      fields.push(`button1_link = $${i++}`);
      values.push(button1_link);
    }

    if (button2_text !== undefined) {
      fields.push(`button2_text = $${i++}`);
      values.push(button2_text);
    }

    if (button2_link !== undefined) {
      fields.push(`button2_link = $${i++}`);
      values.push(button2_link);
    }

    if (fields.length === 0) {
      return res.json({ message: "Nothing to update" });
    }

    values.push(id);

    const result = await pool.query(
      `
      UPDATE hero_slides
      SET ${fields.join(", ")}
      WHERE id = $${i}
      RETURNING *
      `,
      values,
    );

    res.json(dbSlideToApi(result.rows[0]));
  } catch (error) {
    console.error("Error updating hero slide:", error);
    res.status(500).json({ error: "Failed to update hero slide" });
  }
}

export async function deleteHeroSlide(req: any, res: any) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM hero_slides
      WHERE id = $1
      RETURNING *
      `,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Slide not found" });
    }

    res.json(dbSlideToApi(result.rows[0]));
  } catch (error) {
    console.error("Error deleting hero slide:", error);
    res.status(500).json({ error: "Failed to delete hero slide" });
  }
}