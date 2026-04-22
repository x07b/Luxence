import { z } from "zod";
import { pool } from "../lib/db.js";
import {
  sendQuoteRequestConfirmationEmail,
  sendQuoteRequestAdminNotificationEmail,
} from "../lib/email.js";

// Validation schema
const quoteRequestSchema = z.object({
  clientName: z.string().trim().min(2),
  clientEmail: z.string().trim().email(),
  productId: z.string().min(1),
  productName: z.string().trim().min(1),
  message: z.string().trim().optional().default(""),
});

// CREATE
export async function createQuoteRequest(req: any, res: any) {
  try {
    const validatedData = quoteRequestSchema.parse(req.body);

    const quoteId = `quote_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 11)}`;

    await pool.query(
      `INSERT INTO quote_requests
       (id, client_name, client_email, product_id, product_name, message, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [
        quoteId,
        validatedData.clientName,
        validatedData.clientEmail,
        validatedData.productId,
        validatedData.productName,
        validatedData.message,
        "new",
      ],
    );

    // Emails (optional, no crash if fails)
    await sendQuoteRequestConfirmationEmail(
      validatedData.clientEmail,
      validatedData.clientName,
      validatedData.productName,
    );

    await sendQuoteRequestAdminNotificationEmail(
      validatedData.clientName,
      validatedData.clientEmail,
      validatedData.productName,
    );

    res.status(201).json({
      success: true,
      message: "Demande de devis créée",
      quoteId,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        errors: error.errors,
      });
    }

    console.error(error);
    res.status(500).json({
      success: false,
      message: "Erreur création devis",
    });
  }
}

// GET ALL
export async function getQuoteRequests(_req: any, res: any) {
  try {
    const result = await pool.query(
      `SELECT * FROM quote_requests
       ORDER BY created_at DESC NULLS LAST`,
    );

    const apiQuotes = result.rows.map((q) => ({
      id: q.id,
      clientName: q.client_name,
      clientEmail: q.client_email,
      productId: q.product_id,
      productName: q.product_name,
      message: q.message,
      status: q.status,
      createdAt: new Date(q.created_at),
    }));

    res.json({
      success: true,
      quotes: apiQuotes,
      count: apiQuotes.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Erreur récupération devis",
    });
  }
}

// GET BY ID
export async function getQuoteRequestById(req: any, res: any) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT * FROM quote_requests WHERE id = $1`,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Not found",
      });
    }

    const q = result.rows[0];

    res.json({
      success: true,
      quote: {
        id: q.id,
        clientName: q.client_name,
        clientEmail: q.client_email,
        productId: q.product_id,
        productName: q.product_name,
        message: q.message,
        status: q.status,
        createdAt: new Date(q.created_at),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Erreur récupération devis",
    });
  }
}

// UPDATE STATUS
export async function updateQuoteRequestStatus(req: any, res: any) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const valid = ["new", "read", "responded"];
    if (!valid.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const result = await pool.query(
      `UPDATE quote_requests
       SET status = $1
       WHERE id = $2
       RETURNING *`,
      [status, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false });
    }

    res.json({
      success: true,
      message: "Updated",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Erreur update",
    });
  }
}

// DELETE
export async function deleteQuoteRequest(req: any, res: any) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM quote_requests
       WHERE id = $1
       RETURNING id`,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false });
    }

    res.json({
      success: true,
      id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Erreur suppression",
    });
  }
}
