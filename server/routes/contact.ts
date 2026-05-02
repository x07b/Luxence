import { z } from "zod";
import { pool } from "../lib/db.js";
import { sendContactFormEmail } from "../lib/email.js";

// Validation schema
const contactFormSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email(),
  subject: z.string().trim().min(3).max(200),
  message: z.string().trim().min(10).max(5000),
});

export async function handleContact(req: any, res: any) {
  try {
    const validatedData = contactFormSchema.parse(req.body);

    const messageId = `msg_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 11)}`;

    await pool.query(
      `INSERT INTO contact_messages
       (id, name, email, subject, message, status)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [
        messageId,
        validatedData.name,
        validatedData.email,
        validatedData.subject,
        validatedData.message,
        "new",
      ],
    );

    const emailResult = await sendContactFormEmail({
      name: validatedData.name,
      email: validatedData.email,
      subject: validatedData.subject,
      message: validatedData.message,
    });

    res.status(200).json({
      success: true,
      message: emailResult.success
        ? "Message envoyé avec succès et email notification reçue"
        : "Message reçu avec succès (email non configuré)",
      messageId,
      emailSent: emailResult.success,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation échouée",
        errors: error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      });
    }

    console.error("Contact form error:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'envoi du message",
    });
  }
}

// GET messages
export async function getContactMessages(_req: any, res: any) {
  try {
    const result = await pool.query(
      `SELECT * FROM contact_messages
       ORDER BY created_at DESC NULLS LAST`,
    );

    const apiMessages = result.rows.map((msg) => ({
      id: msg.id,
      name: msg.name,
      email: msg.email,
      subject: msg.subject,
      message: msg.message,
      timestamp: new Date(msg.created_at),
      status: msg.status,
    }));

    res.json(apiMessages);
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
}

// UPDATE status
export async function markMessageAsRead(req: any, res: any) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE contact_messages
       SET status = 'read'
       WHERE id = $1
       RETURNING id`,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    res.json({
      success: true,
      message: "Message marked as read",
    });
  } catch (error) {
    console.error("Error updating message:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update message",
    });
  }
}