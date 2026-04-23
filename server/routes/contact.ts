import { z } from "zod";
import { pool } from "../lib/db.js";
import { sendEmail } from "../lib/email.js";

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

    const emailSent = await sendContactEmail(validatedData);

    res.status(200).json({
      success: true,
      message: emailSent
        ? "Message envoyé avec succès et email notification reçue"
        : "Message reçu avec succès (email non configuré)",
      messageId,
      emailSent,
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

// Email function (unchanged)
async function sendContactEmail(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<boolean> {

  try {
    const adminEmail =
      process.env.ADMIN_EMAIL || "fboudhraa2@gmail.com";

    const html = `
      <h2>Nouveau message</h2>
      <p><b>Nom:</b> ${escapeHtml(data.name)}</p>
      <p><b>Email:</b> ${escapeHtml(data.email)}</p>
      <p><b>Sujet:</b> ${escapeHtml(data.subject)}</p>
      <p>${escapeHtml(data.message)}</p>
    `;

    const result = await sendEmail({
      to: adminEmail,
      subject: `Contact: ${data.subject}`,
      html,
    });

    return result.success;
  } catch (err) {
    console.error(err);
    return false;
  }
}

// Escape HTML
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
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