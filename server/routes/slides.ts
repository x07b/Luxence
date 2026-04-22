import { pool } from "../lib/db.js";

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
    title: "Slide Title",
    description: "Slide description",
    button1_text: "Découvrir",
    button1_link: "/products",
    button2_text: "En savoir plus",
    button2_link: "/about",
  };
}

// GET all slides
export async function getHeroSlides(_req: any, res: any) {
  try {
    const result = await pool.query(
      `SELECT * FROM hero_slides
       ORDER BY order_index ASC NULLS LAST, id ASC`,
    );

    res.json(result.rows.map(dbSlideToApi));
  } catch (error) {
    console.error("Error fetching hero slides:", error);
    res.status(500).json({ error: "Failed to fetch hero slides" });
  }
}

// CREATE slide
export async function createHeroSlide(req: any, res: any) {
  try {
    const { image, alt, order } = req.body;

    if (!image) {
      return res.status(400).json({ error: "Image URL is required" });
    }

    let orderIndex = order;

    if (orderIndex === undefined) {
      const max = await pool.query(
        `SELECT order_index
         FROM hero_slides
         ORDER BY order_index DESC NULLS LAST
         LIMIT 1`,
      );

      orderIndex =
        max.rows.length > 0 ? (max.rows[0].order_index || 0) + 1 : 0;
    }

    const id = `slide_${Date.now()}`;

    const result = await pool.query(
      `INSERT INTO hero_slides
       (id, image, alt, order_index)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [id, image, alt || "Hero slide", orderIndex],
    );

    res.status(201).json(dbSlideToApi(result.rows[0]));
  } catch (error) {
    console.error("Error creating hero slide:", error);
    res.status(500).json({ error: "Failed to create hero slide" });
  }
}

// UPDATE slide
export async function updateHeroSlide(req: any, res: any) {
  try {
    const { id } = req.params;
    const { image, alt, order } = req.body;

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

    if (fields.length === 0) {
      return res.json({ message: "Nothing to update" });
    }

    values.push(id);

    const result = await pool.query(
      `UPDATE hero_slides
       SET ${fields.join(", ")}
       WHERE id = $${i}
       RETURNING *`,
      values,
    );

    res.json(dbSlideToApi(result.rows[0]));
  } catch (error) {
    console.error("Error updating hero slide:", error);
    res.status(500).json({ error: "Failed to update hero slide" });
  }
}

// DELETE slide
export async function deleteHeroSlide(req: any, res: any) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM hero_slides
       WHERE id = $1
       RETURNING *`,
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
