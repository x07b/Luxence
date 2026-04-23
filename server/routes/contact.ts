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
    const adminEmail = process.env.ADMIN_EMAIL || "fboudhraa2@gmail.com";

    const html = `
      <div style="margin:0;padding:0;background-color:#f3f4f6;font-family:Arial,sans-serif;color:#111827;">
        <div style="max-width:640px;margin:0 auto;padding:32px 16px;">
          <div style="background-color:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 4px 18px rgba(0,0,0,0.08);">

            <div style="background:#111827;padding:28px 24px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;">Luxence</h1>
              <p style="margin:8px 0 0;color:#d1d5db;font-size:13px;">
                Nouveau message de contact
              </p>
            </div>

            <div style="padding:32px 24px;">
              <h2 style="margin:0 0 16px;font-size:22px;color:#1f2937;">
                Nouvelle demande reçue
              </h2>

              <p style="margin:0 0 20px;line-height:1.6;color:#4b5563;">
                Un nouveau message a été envoyé depuis le formulaire de contact du site.
              </p>

              <div style="background:#fff7ed;border-left:4px solid #f59e0b;padding:16px;border-radius:8px;margin-bottom:24px;">
                <p style="margin:0;color:#92400e;line-height:1.6;">
                  <strong>Action requise :</strong> merci de consulter ce message et de répondre au client dans les meilleurs délais.
                </p>
              </div>

              <table style="width:100%;border-collapse:collapse;margin:0 0 24px;">
                <tbody>
                  <tr>
                    <td style="padding:12px;background:#f9fafb;border:1px solid #e5e7eb;font-weight:bold;color:#374151;width:160px;">
                      Nom
                    </td>
                    <td style="padding:12px;border:1px solid #e5e7eb;color:#111827;">
                      ${escapeHtml(data.name)}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:12px;background:#f9fafb;border:1px solid #e5e7eb;font-weight:bold;color:#374151;">
                      Email
                    </td>
                    <td style="padding:12px;border:1px solid #e5e7eb;color:#111827;">
                      <a href="mailto:${escapeHtml(data.email)}" style="color:#2563eb;text-decoration:none;">
                        ${escapeHtml(data.email)}
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:12px;background:#f9fafb;border:1px solid #e5e7eb;font-weight:bold;color:#374151;">
                      Sujet
                    </td>
                    <td style="padding:12px;border:1px solid #e5e7eb;color:#111827;">
                      ${escapeHtml(data.subject)}
                    </td>
                  </tr>
                </tbody>
              </table>

              <h3 style="margin:0 0 12px;font-size:18px;color:#1f2937;">Message du client</h3>

              <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:18px;color:#374151;line-height:1.7;white-space:pre-wrap;">
                ${escapeHtml(data.message)}
              </div>
            </div>

            <div style="background:#f9fafb;padding:20px 24px;border-top:1px solid #e5e7eb;">
              <p style="margin:0 0 6px;font-size:14px;font-weight:bold;color:#111827;">Luxence</p>
              <p style="margin:0;font-size:13px;color:#6b7280;line-height:1.6;">
                Notification automatique du formulaire de contact.
              </p>
            </div>

          </div>
        </div>
      </div>
    `;

    const result = await sendEmail({
      to: adminEmail,
      subject: `Nouveau message de contact - ${data.subject}`,
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