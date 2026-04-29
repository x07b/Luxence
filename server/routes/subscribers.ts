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

export default router;