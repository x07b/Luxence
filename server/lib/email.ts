import nodemailer from "nodemailer";

// Configuration
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "fboudhraa2@gmail.com";
const SENDER_EMAIL = process.env.SENDER_EMAIL || "fboudhraa2@gmail.com";

function getTransporter() {
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_PORT ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASS
  ) {
    throw new Error("SMTP environment variables are not fully configured");
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({
  to,
  subject,
  html,
}: SendEmailParams): Promise<{ success: boolean; error?: string }> {
  try {
    if (
      !process.env.SMTP_HOST ||
      !process.env.SMTP_PORT ||
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASS
    ) {
      console.warn("SMTP not configured");
      return { success: false, error: "Email service not configured" };
    }

    const transporter = getTransporter();

    const info = await transporter.sendMail({
      from: SENDER_EMAIL,
      to,
      subject,
      html,
    });

    console.log("Email sent:", info.messageId);
    return { success: true };
  } catch (error) {
    console.error("Failed to send email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Send order confirmation email to client
export async function sendOrderConfirmationEmail(
  customerEmail: string,
  customerName: string,
  panierCode: string,
  items: Array<{ name: string; quantity: number }>,
  _total: number | null,
): Promise<{ success: boolean; error?: string }> {
  const itemsHtml = items
    .map(
      (item) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(item.name)}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
    </tr>
  `,
    )
    .join("");

  const html = `
  <div style="margin:0;padding:0;background-color:#f3f4f6;font-family:Arial,sans-serif;color:#111827;">
    <div style="max-width:640px;margin:0 auto;padding:32px 16px;">
      <div style="background-color:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 4px 18px rgba(0,0,0,0.08);">
        
        <div style="background:#111827;padding:28px 24px;text-align:center;">
          <h1 style="margin:0;color:#ffffff;font-size:24px;">Luxence</h1>
          <p style="margin:8px 0 0;color:#d1d5db;font-size:13px;">
            Confirmation de votre commande
          </p>
        </div>

        <div style="padding:32px 24px;">
          <h2 style="margin:0 0 16px;font-size:22px;color:#1f2937;">Bonjour ${escapeHtml(customerName)},</h2>

          <p style="margin:0 0 16px;line-height:1.6;color:#4b5563;">
            Nous vous remercions pour votre commande et pour la confiance que vous accordez à <strong>Luxence</strong>.
          </p>

          <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:16px;margin:24px 0;">
            <p style="margin:0;font-size:14px;color:#6b7280;">Référence panier</p>
            <p style="margin:6px 0 0;font-size:18px;font-weight:bold;color:#111827;">${escapeHtml(panierCode)}</p>
          </div>

          <h3 style="margin:0 0 12px;font-size:18px;color:#1f2937;">Détails de la commande</h3>

          <table style="width:100%;border-collapse:collapse;margin:0 0 24px;">
            <thead>
              <tr>
                <th style="text-align:left;padding:12px;background:#f3f4f6;color:#374151;font-size:14px;border-bottom:1px solid #e5e7eb;">Produit</th>
                <th style="text-align:center;padding:12px;background:#f3f4f6;color:#374151;font-size:14px;border-bottom:1px solid #e5e7eb;">Quantité</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div style="background:#ecfdf5;border-left:4px solid #10b981;padding:16px;border-radius:8px;margin-bottom:24px;">
            <p style="margin:0;color:#065f46;line-height:1.6;">
              Notre équipe vous contactera dans les plus brefs délais afin de confirmer les détails de votre commande et finaliser le prix.
            </p>
          </div>

          <p style="margin:0;line-height:1.6;color:#4b5563;">
            Pour toute question, vous pouvez répondre directement à cet email ou contacter notre service client.
          </p>
        </div>

        <div style="background:#f9fafb;padding:20px 24px;border-top:1px solid #e5e7eb;">
          <p style="margin:0 0 6px;font-size:14px;font-weight:bold;color:#111827;">Luxence</p>
          <p style="margin:0;font-size:13px;color:#6b7280;line-height:1.6;">
            Merci pour votre confiance.<br/>
            Email : contact@luxence.fr<br/>
            Téléphone : +33 X XX XX XX XX
          </p>
        </div>
      </div>
    </div>
  </div>
`;

  return sendEmail({
    to: customerEmail,
    subject: `Confirmation de Commande - ${panierCode}`,
    html,
  });
}

// Send new order notification to admin
export async function sendOrderAdminNotificationEmail(
  customerName: string,
  customerEmail: string,
  panierCode: string,
  items: Array<{ name: string; quantity: number }>,
  _total: number | null,
): Promise<{ success: boolean; error?: string }> {
  const itemsHtml = items
  .map(
    (item) => `
      <tr>
        <td style="padding:14px 12px;border-bottom:1px solid #e5e7eb;color:#111827;">
          ${escapeHtml(item.name)}
        </td>
        <td style="padding:14px 12px;border-bottom:1px solid #e5e7eb;text-align:center;color:#111827;font-weight:bold;">
          ${item.quantity}
        </td>
      </tr>
    `
  )
  .join("");

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #e74c3c;">Nouvelle Commande Reçue</h2>

      <div style="background-color: #fff3cd; padding: 12px; border-radius: 4px; margin: 20px 0; border-left: 4px solid #ffc107;">
        <strong>Code Panier:</strong> ${escapeHtml(panierCode)}
      </div>

      <h3>Client</h3>
      <p>
        <strong>Nom:</strong> ${escapeHtml(customerName)}<br/>
        <strong>Email:</strong> ${escapeHtml(customerEmail)}
      </p>

      <h3>Articles Commandés</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background-color: #f5f5f5;">
            <th style="padding: 8px; text-align: left; border-bottom: 2px solid #ddd;">Produit</th>
            <th style="padding: 8px; text-align: center; border-bottom: 2px solid #ddd;">Quantité</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <p style="margin-top: 20px; padding: 12px; background-color: #d4edda; border-radius: 4px; border-left: 4px solid #28a745;">
        Veuillez contacter le client pour confirmer le prix par téléphone.
      </p>
    </div>
  `;

  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `[NOUVELLE COMMANDE] ${panierCode} - ${escapeHtml(customerName)}`,
    html,
  });
}

// Send quote request confirmation to client
export async function sendQuoteRequestConfirmationEmail(
  clientEmail: string,
  clientName: string,
  productName: string,
): Promise<{ success: boolean; error?: string }> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #2c3e50;">Demande de Devis Reçue</h2>
      <p>Bonjour ${escapeHtml(clientName)},</p>
      <p>Nous avons bien reçu votre demande de devis pour :</p>

      <div style="background-color: #f5f5f5; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3498db;">
        <strong style="font-size: 16px;">${escapeHtml(productName)}</strong>
      </div>

      <p>Notre équipe vous contactera prochainement.</p>
      <p style="margin-top: 20px; color: #666;">Cordialement,<br/>L'équipe Luxence</p>
    </div>
  `;

  return sendEmail({
    to: clientEmail,
    subject: `Demande de Devis Reçue - ${productName}`,
    html,
  });
}

// Send quote request notification to admin
export async function sendQuoteRequestAdminNotificationEmail(
  clientName: string,
  clientEmail: string,
  productName: string,
): Promise<{ success: boolean; error?: string }> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #e74c3c;">Nouvelle Demande de Devis</h2>

      <div style="background-color: #fff3cd; padding: 12px; border-radius: 4px; margin: 20px 0; border-left: 4px solid #ffc107;">
        <strong>Produit:</strong> ${escapeHtml(productName)}
      </div>

      <h3>Informations du Client</h3>
      <p>
        <strong>Nom:</strong> ${escapeHtml(clientName)}<br/>
        <strong>Email:</strong> <a href="mailto:${escapeHtml(clientEmail)}">${escapeHtml(clientEmail)}</a>
      </p>

      <p style="margin-top: 20px; padding: 12px; background-color: #d4edda; border-radius: 4px; border-left: 4px solid #28a745;">
        Veuillez contacter le client pour fournir un devis détaillé.
      </p>
    </div>
  `;

  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `[DEMANDE DE DEVIS] ${productName} - ${escapeHtml(clientName)}`,
    html,
  });
}

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