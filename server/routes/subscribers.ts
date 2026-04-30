import { Router } from "express";
import { pool } from "../lib/db.js";

const router = Router();

router.post("/newsletter", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const result = await pool.query(
      `
      INSERT INTO newsletter_subscribers (email)
      VALUES ($1)
      ON CONFLICT (email) DO NOTHING
      RETURNING *
      `,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(409).json({ error: "Email already subscribed" });
    }

    return res.status(201).json({
      message: "Newsletter subscription saved",
      subscriber: result.rows[0],
    });
  } catch (error) {
    console.error("Error subscribing newsletter:", error);
    return res.status(500).json({ error: "Failed to subscribe newsletter" });
  }
});

router.get("/subscribers", async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM newsletter_subscribers ORDER BY created_at DESC NULLS LAST, id DESC`,
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching subscribers:", error);
    res.status(500).json({ error: "Failed to fetch subscribers" });
  }
});

router.delete("/subscribers/:id", async (req, res) => {
  try {
    await pool.query(`DELETE FROM newsletter_subscribers WHERE id = $1`, [
      req.params.id,
    ]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete subscriber" });
  }
});

export default router;