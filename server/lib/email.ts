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
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #2c3e50;">Confirmation de Commande</h2>
      <p>Bonjour ${escapeHtml(customerName)},</p>
      <p>Merci pour votre commande.</p>

      <div style="background-color: #f5f5f5; padding: 16px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Code Panier:</strong> ${escapeHtml(panierCode)}</p>
      </div>

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

      <p style="margin-top: 20px; color: #666;">
        Nous vous contacterons bientôt par téléphone pour confirmer les détails et le prix.
      </p>
      <p style="color: #999; font-size: 12px; margin-top: 20px;">Luxence</p>
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
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(item.name)}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
    </tr>
  `,
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