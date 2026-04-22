import { Resend } from "resend";

// Configuration
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "itsazizsaidi@gmail.com";
const SENDER_EMAIL = process.env.SENDER_EMAIL || "notifications@luxence.fr";

// Lazy initialize Resend client only when needed
let resend: Resend | null = null;

function getResendClient(): Resend {
  if (!resend) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY environment variable is not set");
    }
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
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
    if (!process.env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY not configured");
      return { success: false, error: "Email service not configured" };
    }

    const client = getResendClient();
    const response = await client.emails.send({
      from: SENDER_EMAIL,
      to,
      subject,
      html,
    });

    if (response.error) {
      console.error("Resend error:", response.error);
      return { success: false, error: response.error.message };
    }

    console.log("Email sent successfully:", response.data?.id);
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
  items: Array<{ name: string; quantity: number; price: number }>,
  total: number,
): Promise<{ success: boolean; error?: string }> {
  const itemsHtml = items
    .map(
      (item) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(item.name)}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${item.price.toFixed(2)}€</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${(item.price * item.quantity).toFixed(2)}€</td>
    </tr>
  `,
    )
    .join("");

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #2c3e50;">Confirmation de Commande</h2>
      <p>Bonjour ${escapeHtml(customerName)},</p>
      <p>Merci pour votre commande! Voici les détails de votre commande:</p>
      
      <div style="background-color: #f5f5f5; padding: 16px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Code Panier:</strong> ${escapeHtml(panierCode)}</p>
      </div>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background-color: #f5f5f5;">
            <th style="padding: 8px; text-align: left; border-bottom: 2px solid #ddd;">Produit</th>
            <th style="padding: 8px; text-align: center; border-bottom: 2px solid #ddd;">Quantité</th>
            <th style="padding: 8px; text-align: right; border-bottom: 2px solid #ddd;">Prix</th>
            <th style="padding: 8px; text-align: right; border-bottom: 2px solid #ddd;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
          <tr style="font-weight: bold; font-size: 16px;">
            <td colspan="3" style="padding: 12px; text-align: right;">TOTAL:</td>
            <td style="padding: 12px; text-align: right; border-top: 2px solid #ddd;">${total.toFixed(2)}€</td>
          </tr>
        </tbody>
      </table>
      
      <p style="margin-top: 20px; color: #666;">Nous vous contacterons bientôt pour confirmer les détails de votre commande.</p>
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
  items: Array<{ name: string; quantity: number; price: number }>,
  total: number,
): Promise<{ success: boolean; error?: string }> {
  const itemsHtml = items
    .map(
      (item) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(item.name)}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${item.price.toFixed(2)}€</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${(item.price * item.quantity).toFixed(2)}€</td>
    </tr>
  `,
    )
    .join("");

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #e74c3c;">🔔 Nouvelle Commande Reçue</h2>
      
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
            <th style="padding: 8px; text-align: right; border-bottom: 2px solid #ddd;">Prix</th>
            <th style="padding: 8px; text-align: right; border-bottom: 2px solid #ddd;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
          <tr style="font-weight: bold; font-size: 16px; background-color: #f5f5f5;">
            <td colspan="3" style="padding: 12px; text-align: right;">TOTAL:</td>
            <td style="padding: 12px; text-align: right; border-top: 2px solid #ddd;">${total.toFixed(2)}€</td>
          </tr>
        </tbody>
      </table>
      
      <p style="margin-top: 20px; padding: 12px; background-color: #d4edda; border-radius: 4px; border-left: 4px solid #28a745;">
        ✅ Veuillez traiter cette commande dès que possible.
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
      <p>Merci pour votre intérêt envers nos produits. Nous avons bien reçu votre demande de devis pour:</p>
      
      <div style="background-color: #f5f5f5; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3498db;">
        <strong style="font-size: 16px;">${escapeHtml(productName)}</strong>
      </div>
      
      <p>Notre équipe d'experts examinera votre demande et vous contacterons dans les plus brefs délais pour vous fournir un devis personnalisé.</p>
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
      <h2 style="color: #e74c3c;">🔔 Nouvelle Demande de Devis</h2>
      
      <div style="background-color: #fff3cd; padding: 12px; border-radius: 4px; margin: 20px 0; border-left: 4px solid #ffc107;">
        <strong>Produit:</strong> ${escapeHtml(productName)}
      </div>
      
      <h3>Informations du Client</h3>
      <p>
        <strong>Nom:</strong> ${escapeHtml(clientName)}<br/>
        <strong>Email:</strong> <a href="mailto:${escapeHtml(clientEmail)}">${escapeHtml(clientEmail)}</a>
      </p>
      
      <p style="margin-top: 20px; padding: 12px; background-color: #d4edda; border-radius: 4px; border-left: 4px solid #28a745;">
        ✅ Veuillez contacter le client pour fournir un devis détaillé.
      </p>
    </div>
  `;

  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `[DEMANDE DE DEVIS] ${productName} - ${escapeHtml(clientName)}`,
    html,
  });
}

// Helper function to escape HTML special characters (XSS prevention)
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
