import nodemailer from "nodemailer";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "fboudhraa2@gmail.com";
const SENDER_EMAIL = process.env.SENDER_EMAIL || "fboudhraa2@gmail.com";
const SITE_URL = process.env.SITE_URL || "https://luxence.fr";

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
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
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
    const info = await transporter.sendMail({ from: SENDER_EMAIL, to, subject, html });
    console.log("Email sent:", info.messageId);
    return { success: true };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// ─── Shared layout helpers ────────────────────────────────────────────────────

function emailWrapper(content: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Luxence</title>
</head>
<body style="margin:0;padding:0;background-color:#f0ede8;font-family:'Helvetica Neue',Arial,sans-serif;color:#1a1a1a;">
  <div style="max-width:620px;margin:0 auto;padding:32px 16px;">
    ${emailHeader()}
    <div style="background:#ffffff;border-radius:0 0 16px 16px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.10);">
      ${content}
      ${emailFooter()}
    </div>
    <p style="text-align:center;font-size:11px;color:#a89f91;margin-top:20px;font-family:'Helvetica Neue',Arial,sans-serif;">
      © ${new Date().getFullYear()} Luxence · Tous droits réservés · <a href="${SITE_URL}" style="color:#c9a96e;text-decoration:none;">luxence.fr</a>
    </p>
  </div>
</body>
</html>`;
}

function emailHeader(): string {
  return `
  <div style="background:linear-gradient(135deg,#111827 0%,#1f2937 100%);border-radius:16px 16px 0 0;padding:36px 32px 28px;text-align:center;">
    <div style="display:inline-block;border-bottom:2px solid #c9a96e;padding-bottom:12px;margin-bottom:12px;">
      <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;font-family:'Helvetica Neue',Arial,sans-serif;">
        LUXENCE
      </h1>
    </div>
    <p style="margin:0;color:#9ca3af;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;font-family:'Helvetica Neue',Arial,sans-serif;">
      Luminaires d'Art &amp; Excellence
    </p>
  </div>`;
}

function emailFooter(): string {
  return `
  <div style="background:#f8f6f2;border-top:1px solid #e8e2d9;padding:28px 32px;text-align:center;">
    <div style="margin-bottom:16px;">
      <a href="${SITE_URL}/products" style="display:inline-block;margin:0 8px;color:#c9a96e;font-size:12px;text-decoration:none;letter-spacing:0.08em;text-transform:uppercase;font-family:'Helvetica Neue',Arial,sans-serif;">Collection</a>
      <span style="color:#d4ccc2;">·</span>
      <a href="${SITE_URL}/about" style="display:inline-block;margin:0 8px;color:#c9a96e;font-size:12px;text-decoration:none;letter-spacing:0.08em;text-transform:uppercase;font-family:'Helvetica Neue',Arial,sans-serif;">À propos</a>
      <span style="color:#d4ccc2;">·</span>
      <a href="${SITE_URL}/contact" style="display:inline-block;margin:0 8px;color:#c9a96e;font-size:12px;text-decoration:none;letter-spacing:0.08em;text-transform:uppercase;font-family:'Helvetica Neue',Arial,sans-serif;">Contact</a>
    </div>
    <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#1a1a1a;letter-spacing:0.05em;font-family:'Helvetica Neue',Arial,sans-serif;">LUXENCE</p>
    <p style="margin:0;font-size:12px;color:#7d7266;line-height:1.8;font-family:'Helvetica Neue',Arial,sans-serif;">
      <a href="mailto:contact@luxence.fr" style="color:#7d7266;text-decoration:none;">contact@luxence.fr</a>
      &nbsp;·&nbsp; <a href="${SITE_URL}" style="color:#7d7266;text-decoration:none;">luxence.fr</a>
    </p>
  </div>`;
}

function goldDivider(): string {
  return `<div style="height:1px;background:linear-gradient(90deg,transparent,#c9a96e,transparent);margin:28px 0;"></div>`;
}

function badge(text: string): string {
  return `<span style="display:inline-block;background:#c9a96e;color:#ffffff;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;padding:4px 12px;border-radius:20px;font-family:'Helvetica Neue',Arial,sans-serif;">${text}</span>`;
}

// ─── Order Confirmation (→ Customer) ─────────────────────────────────────────

export async function sendOrderConfirmationEmail(
  customerEmail: string,
  customerName: string,
  panierCode: string,
  items: Array<{ name: string; quantity: number }>,
  _total: number | null,
): Promise<{ success: boolean; error?: string }> {
  const itemRows = items
    .map(
      (item, i) => `
      <tr style="background:${i % 2 === 0 ? "#ffffff" : "#faf9f7"};">
        <td style="padding:14px 16px;font-size:14px;color:#1a1a1a;border-bottom:1px solid #f0ede8;font-family:'Helvetica Neue',Arial,sans-serif;">
          ${escapeHtml(item.name)}
        </td>
        <td style="padding:14px 16px;font-size:14px;color:#1a1a1a;text-align:center;font-weight:700;border-bottom:1px solid #f0ede8;font-family:'Helvetica Neue',Arial,sans-serif;">
          ${item.quantity}
        </td>
      </tr>`,
    )
    .join("");

  const content = `
    <div style="padding:40px 32px 32px;">
      <div style="text-align:center;margin-bottom:32px;">
        ${badge("Commande confirmée")}
        <h2 style="margin:20px 0 8px;font-size:26px;font-weight:800;color:#111827;letter-spacing:-0.02em;font-family:'Helvetica Neue',Arial,sans-serif;">
          Merci pour votre commande, ${escapeHtml(customerName.split(" ")[0])} !
        </h2>
        <p style="margin:0;font-size:15px;color:#6b6b6b;line-height:1.6;font-family:'Helvetica Neue',Arial,sans-serif;">
          Votre demande de devis a bien été reçue. Notre équipe vous contactera très prochainement.
        </p>
      </div>

      ${goldDivider()}

      <!-- Code panier -->
      <div style="background:linear-gradient(135deg,#111827,#1f2937);border-radius:12px;padding:24px;text-align:center;margin-bottom:28px;">
        <p style="margin:0 0 6px;font-size:11px;color:#9ca3af;letter-spacing:0.2em;text-transform:uppercase;font-family:'Helvetica Neue',Arial,sans-serif;">
          Votre code de suivi
        </p>
        <p style="margin:0;font-size:22px;font-weight:800;color:#c9a96e;letter-spacing:0.08em;font-family:'Helvetica Neue',Arial,sans-serif;">
          ${escapeHtml(panierCode)}
        </p>
        <p style="margin:8px 0 0;font-size:12px;color:#6b7280;font-family:'Helvetence Neue',Arial,sans-serif;">
          Conservez ce code pour suivre votre commande
        </p>
      </div>

      <!-- Articles -->
      <h3 style="margin:0 0 14px;font-size:13px;font-weight:700;color:#1a1a1a;letter-spacing:0.12em;text-transform:uppercase;font-family:'Helvetica Neue',Arial,sans-serif;">
        Récapitulatif de votre sélection
      </h3>
      <table style="width:100%;border-collapse:collapse;border-radius:10px;overflow:hidden;border:1px solid #e8e2d9;margin-bottom:28px;">
        <thead>
          <tr style="background:#111827;">
            <th style="padding:12px 16px;text-align:left;font-size:11px;color:#9ca3af;letter-spacing:0.12em;text-transform:uppercase;font-weight:600;font-family:'Helvetica Neue',Arial,sans-serif;">Produit</th>
            <th style="padding:12px 16px;text-align:center;font-size:11px;color:#9ca3af;letter-spacing:0.12em;text-transform:uppercase;font-weight:600;font-family:'Helvetica Neue',Arial,sans-serif;">Qté</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>

      <!-- Prochaines étapes -->
      <div style="background:#f8f6f2;border-radius:12px;padding:24px;margin-bottom:28px;border-left:3px solid #c9a96e;">
        <h4 style="margin:0 0 16px;font-size:13px;font-weight:700;color:#1a1a1a;letter-spacing:0.08em;text-transform:uppercase;font-family:'Helvetica Neue',Arial,sans-serif;">
          Prochaines étapes
        </h4>
        ${["Notre équipe étudie votre sélection et prépare votre devis personnalisé.", "Vous serez contacté(e) par téléphone ou email sous 24 à 48h.", "Une fois le devis validé, la fabrication de vos pièces débutera."]
          .map(
            (step, i) => `
          <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:${i < 2 ? "12px" : "0"};">
            <div style="width:24px;height:24px;border-radius:50%;background:#c9a96e;color:#ffffff;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;text-align:center;line-height:24px;font-family:'Helvetica Neue',Arial,sans-serif;">${i + 1}</div>
            <p style="margin:0;font-size:13px;color:#4b4b4b;line-height:1.6;padding-top:3px;font-family:'Helvetica Neue',Arial,sans-serif;">${step}</p>
          </div>`,
          )
          .join("")}
      </div>

      <div style="text-align:center;">
        <a href="${SITE_URL}/products" style="display:inline-block;background:#111827;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;font-family:'Helvetica Neue',Arial,sans-serif;">
          Continuer à explorer
        </a>
      </div>
    </div>`;

  return sendEmail({
    to: customerEmail,
    subject: `Votre demande de devis Luxence — ${panierCode}`,
    html: emailWrapper(content),
  });
}

// ─── Order Admin Notification ────────────────────────────────────────────────

export async function sendOrderAdminNotificationEmail(
  customerName: string,
  customerEmail: string,
  panierCode: string,
  items: Array<{ name: string; quantity: number }>,
  _total: number | null,
  customerPhone?: string,
  customerCity?: string,
  message?: string,
): Promise<{ success: boolean; error?: string }> {
  const itemRows = items
    .map(
      (item, i) => `
      <tr style="background:${i % 2 === 0 ? "#ffffff" : "#faf9f7"};">
        <td style="padding:12px 16px;font-size:14px;color:#1a1a1a;border-bottom:1px solid #f0ede8;font-family:'Helvetica Neue',Arial,sans-serif;">
          ${escapeHtml(item.name)}
        </td>
        <td style="padding:12px 16px;font-size:14px;font-weight:700;color:#c9a96e;text-align:center;border-bottom:1px solid #f0ede8;font-family:'Helvetica Neue',Arial,sans-serif;">
          ×${item.quantity}
        </td>
      </tr>`,
    )
    .join("");

  const infoRows = [
    { label: "Nom", value: customerName },
    { label: "Email", value: customerEmail, link: `mailto:${customerEmail}` },
    customerPhone ? { label: "Téléphone", value: customerPhone, link: `tel:${customerPhone}` } : null,
    customerCity ? { label: "Ville", value: customerCity } : null,
  ]
    .filter(Boolean)
    .map(
      (row: any) => `
      <tr>
        <td style="padding:12px 16px;font-size:13px;color:#7d7266;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;background:#f8f6f2;border-bottom:1px solid #f0ede8;width:120px;font-family:'Helvetica Neue',Arial,sans-serif;">${row.label}</td>
        <td style="padding:12px 16px;font-size:14px;color:#1a1a1a;border-bottom:1px solid #f0ede8;font-family:'Helvetica Neue',Arial,sans-serif;">
          ${row.link ? `<a href="${row.link}" style="color:#c9a96e;text-decoration:none;font-weight:600;">${escapeHtml(row.value)}</a>` : escapeHtml(row.value)}
        </td>
      </tr>`,
    )
    .join("");

  const content = `
    <div style="padding:40px 32px 32px;">
      <div style="text-align:center;margin-bottom:32px;">
        ${badge("Nouvelle commande")}
        <h2 style="margin:20px 0 8px;font-size:26px;font-weight:800;color:#111827;font-family:'Helvetica Neue',Arial,sans-serif;">
          Nouvelle demande reçue
        </h2>
        <p style="margin:0;font-size:15px;color:#6b6b6b;font-family:'Helvetica Neue',Arial,sans-serif;">
          Un client vient de soumettre une demande de devis
        </p>
      </div>

      <!-- Code panier highlight -->
      <div style="background:linear-gradient(135deg,#111827,#1f2937);border-radius:12px;padding:20px;text-align:center;margin-bottom:28px;">
        <p style="margin:0 0 4px;font-size:11px;color:#9ca3af;letter-spacing:0.2em;text-transform:uppercase;font-family:'Helvetica Neue',Arial,sans-serif;">Code panier</p>
        <p style="margin:0;font-size:24px;font-weight:800;color:#c9a96e;letter-spacing:0.1em;font-family:'Helvetica Neue',Arial,sans-serif;">${escapeHtml(panierCode)}</p>
        <p style="margin:6px 0 0;font-size:11px;color:#6b7280;font-family:'Helvetica Neue',Arial,sans-serif;">
          ${new Date().toLocaleString("fr-FR", { dateStyle: "full", timeStyle: "short" })}
        </p>
      </div>

      ${goldDivider()}

      <!-- Infos client -->
      <h3 style="margin:0 0 12px;font-size:13px;font-weight:700;color:#1a1a1a;letter-spacing:0.12em;text-transform:uppercase;font-family:'Helvetica Neue',Arial,sans-serif;">
        Informations client
      </h3>
      <table style="width:100%;border-collapse:collapse;border-radius:10px;overflow:hidden;border:1px solid #e8e2d9;margin-bottom:28px;">
        <tbody>${infoRows}</tbody>
      </table>

      <!-- Articles -->
      <h3 style="margin:0 0 12px;font-size:13px;font-weight:700;color:#1a1a1a;letter-spacing:0.12em;text-transform:uppercase;font-family:'Helvetica Neue',Arial,sans-serif;">
        Articles sélectionnés (${items.length})
      </h3>
      <table style="width:100%;border-collapse:collapse;border-radius:10px;overflow:hidden;border:1px solid #e8e2d9;margin-bottom:28px;">
        <thead>
          <tr style="background:#111827;">
            <th style="padding:12px 16px;text-align:left;font-size:11px;color:#9ca3af;letter-spacing:0.12em;text-transform:uppercase;font-weight:600;font-family:'Helvetica Neue',Arial,sans-serif;">Produit</th>
            <th style="padding:12px 16px;text-align:center;font-size:11px;color:#9ca3af;letter-spacing:0.12em;text-transform:uppercase;font-weight:600;font-family:'Helvetica Neue',Arial,sans-serif;">Quantité</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>

      ${message ? `
      <!-- Message client -->
      <h3 style="margin:0 0 12px;font-size:13px;font-weight:700;color:#1a1a1a;letter-spacing:0.12em;text-transform:uppercase;font-family:'Helvetica Neue',Arial,sans-serif;">
        Message du client
      </h3>
      <div style="background:#f8f6f2;border-radius:10px;padding:20px;border-left:3px solid #c9a96e;margin-bottom:28px;">
        <p style="margin:0;font-size:14px;color:#4b4b4b;line-height:1.7;white-space:pre-wrap;font-family:'Helvetica Neue',Arial,sans-serif;">${escapeHtml(message)}</p>
      </div>
      ` : ""}

      <!-- Action requise -->
      <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;padding:20px;margin-bottom:28px;">
        <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#92400e;letter-spacing:0.06em;text-transform:uppercase;font-family:'Helvetica Neue',Arial,sans-serif;">⚡ Action requise</p>
        <p style="margin:0;font-size:14px;color:#78350f;line-height:1.6;font-family:'Helvetica Neue',Arial,sans-serif;">
          Contactez le client dans les <strong>24 heures</strong> pour confirmer sa sélection et établir le devis personnalisé.
        </p>
      </div>

      <!-- CTA -->
      <div style="text-align:center;display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
        <a href="mailto:${escapeHtml(customerEmail)}?subject=Votre%20demande%20Luxence%20${escapeHtml(panierCode)}" style="display:inline-block;background:#c9a96e;color:#ffffff;text-decoration:none;padding:14px 24px;border-radius:8px;font-size:13px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;font-family:'Helvetica Neue',Arial,sans-serif;">
          Répondre au client
        </a>
        <a href="${SITE_URL}/admin#orders" style="display:inline-block;background:#111827;color:#ffffff;text-decoration:none;padding:14px 24px;border-radius:8px;font-size:13px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;font-family:'Helvetica Neue',Arial,sans-serif;">
          Voir dans l'admin
        </a>
      </div>
    </div>`;

  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `⚡ Nouvelle commande — ${escapeHtml(customerName)} · ${panierCode}`,
    html: emailWrapper(content),
  });
}

// ─── Contact Form Email (→ Admin) ─────────────────────────────────────────────

export async function sendContactFormEmail(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<{ success: boolean; error?: string }> {
  const content = `
    <div style="padding:40px 32px 32px;">
      <div style="text-align:center;margin-bottom:32px;">
        ${badge("Nouveau message")}
        <h2 style="margin:20px 0 8px;font-size:26px;font-weight:800;color:#111827;font-family:'Helvetica Neue',Arial,sans-serif;">
          Nouveau message de contact
        </h2>
        <p style="margin:0;font-size:15px;color:#6b6b6b;font-family:'Helvetica Neue',Arial,sans-serif;">
          Reçu le ${new Date().toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" })}
        </p>
      </div>

      ${goldDivider()}

      <!-- Infos expéditeur -->
      <h3 style="margin:0 0 12px;font-size:13px;font-weight:700;color:#1a1a1a;letter-spacing:0.12em;text-transform:uppercase;font-family:'Helvetica Neue',Arial,sans-serif;">
        Expéditeur
      </h3>
      <table style="width:100%;border-collapse:collapse;border-radius:10px;overflow:hidden;border:1px solid #e8e2d9;margin-bottom:28px;">
        <tbody>
          <tr>
            <td style="padding:12px 16px;font-size:13px;color:#7d7266;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;background:#f8f6f2;border-bottom:1px solid #f0ede8;width:120px;font-family:'Helvetica Neue',Arial,sans-serif;">Nom</td>
            <td style="padding:12px 16px;font-size:14px;color:#1a1a1a;border-bottom:1px solid #f0ede8;font-family:'Helvetica Neue',Arial,sans-serif;">${escapeHtml(data.name)}</td>
          </tr>
          <tr>
            <td style="padding:12px 16px;font-size:13px;color:#7d7266;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;background:#f8f6f2;border-bottom:1px solid #f0ede8;font-family:'Helvetica Neue',Arial,sans-serif;">Email</td>
            <td style="padding:12px 16px;font-size:14px;border-bottom:1px solid #f0ede8;font-family:'Helvetica Neue',Arial,sans-serif;">
              <a href="mailto:${escapeHtml(data.email)}" style="color:#c9a96e;text-decoration:none;font-weight:600;">${escapeHtml(data.email)}</a>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 16px;font-size:13px;color:#7d7266;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;background:#f8f6f2;font-family:'Helvetica Neue',Arial,sans-serif;">Sujet</td>
            <td style="padding:12px 16px;font-size:14px;color:#1a1a1a;font-family:'Helvetica Neue',Arial,sans-serif;">${escapeHtml(data.subject)}</td>
          </tr>
        </tbody>
      </table>

      <!-- Message -->
      <h3 style="margin:0 0 12px;font-size:13px;font-weight:700;color:#1a1a1a;letter-spacing:0.12em;text-transform:uppercase;font-family:'Helvetica Neue',Arial,sans-serif;">
        Message
      </h3>
      <div style="background:#f8f6f2;border-radius:12px;padding:24px;border-left:3px solid #c9a96e;margin-bottom:28px;">
        <p style="margin:0;font-size:14px;color:#2d2d2d;line-height:1.8;white-space:pre-wrap;font-family:'Helvetica Neue',Arial,sans-serif;">${escapeHtml(data.message)}</p>
      </div>

      <!-- Action -->
      <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;padding:20px;margin-bottom:28px;">
        <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#92400e;letter-spacing:0.06em;text-transform:uppercase;font-family:'Helvetica Neue',Arial,sans-serif;">Action recommandée</p>
        <p style="margin:0;font-size:14px;color:#78350f;line-height:1.6;font-family:'Helvetica Neue',Arial,sans-serif;">
          Répondez à ce message dans les <strong>24 à 48 heures</strong> pour offrir une expérience client à la hauteur de l'excellence Luxence.
        </p>
      </div>

      <div style="text-align:center;">
        <a href="mailto:${escapeHtml(data.email)}?subject=Re:%20${encodeURIComponent(data.subject)}" style="display:inline-block;background:#c9a96e;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:13px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;font-family:'Helvetica Neue',Arial,sans-serif;">
          Répondre à ${escapeHtml(data.name.split(" ")[0])}
        </a>
      </div>
    </div>`;

  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `Message de ${escapeHtml(data.name)} — ${escapeHtml(data.subject)}`,
    html: emailWrapper(content),
  });
}

// ─── Quote Request Emails ────────────────────────────────────────────────────

export async function sendQuoteRequestConfirmationEmail(
  clientEmail: string,
  clientName: string,
  productName: string,
): Promise<{ success: boolean; error?: string }> {
  const content = `
    <div style="padding:40px 32px 32px;">
      <div style="text-align:center;margin-bottom:32px;">
        ${badge("Demande reçue")}
        <h2 style="margin:20px 0 8px;font-size:26px;font-weight:800;color:#111827;font-family:'Helvetica Neue',Arial,sans-serif;">
          Bonjour ${escapeHtml(clientName.split(" ")[0])} !
        </h2>
        <p style="margin:0;font-size:15px;color:#6b6b6b;line-height:1.6;font-family:'Helvetica Neue',Arial,sans-serif;">
          Votre demande de devis a bien été reçue. Nous vous remercions de l'intérêt que vous portez à nos créations.
        </p>
      </div>

      ${goldDivider()}

      <div style="background:linear-gradient(135deg,#111827,#1f2937);border-radius:12px;padding:24px;text-align:center;margin-bottom:28px;">
        <p style="margin:0 0 6px;font-size:11px;color:#9ca3af;letter-spacing:0.2em;text-transform:uppercase;font-family:'Helvetica Neue',Arial,sans-serif;">Produit demandé</p>
        <p style="margin:0;font-size:18px;font-weight:700;color:#ffffff;font-family:'Helvetica Neue',Arial,sans-serif;">${escapeHtml(productName)}</p>
      </div>

      <div style="background:#f8f6f2;border-radius:12px;padding:24px;border-left:3px solid #c9a96e;margin-bottom:28px;">
        <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#1a1a1a;letter-spacing:0.06em;text-transform:uppercase;font-family:'Helvetica Neue',Arial,sans-serif;">La suite</p>
        <p style="margin:8px 0 0;font-size:14px;color:#4b4b4b;line-height:1.7;font-family:'Helvetica Neue',Arial,sans-serif;">
          Notre équipe étudiera votre demande et vous contactera sous <strong>24 à 48 heures</strong> avec un devis personnalisé adapté à votre projet.
        </p>
      </div>

      <div style="text-align:center;">
        <a href="${SITE_URL}/products" style="display:inline-block;background:#111827;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;font-family:'Helvetica Neue',Arial,sans-serif;">
          Explorer la collection
        </a>
      </div>
    </div>`;

  return sendEmail({
    to: clientEmail,
    subject: `Votre demande de devis — ${escapeHtml(productName)}`,
    html: emailWrapper(content),
  });
}

export async function sendQuoteRequestAdminNotificationEmail(
  clientName: string,
  clientEmail: string,
  productName: string,
): Promise<{ success: boolean; error?: string }> {
  const content = `
    <div style="padding:40px 32px 32px;">
      <div style="text-align:center;margin-bottom:32px;">
        ${badge("Demande de devis")}
        <h2 style="margin:20px 0 8px;font-size:26px;font-weight:800;color:#111827;font-family:'Helvetica Neue',Arial,sans-serif;">
          Nouvelle demande de devis
        </h2>
      </div>

      ${goldDivider()}

      <div style="background:linear-gradient(135deg,#111827,#1f2937);border-radius:12px;padding:20px;text-align:center;margin-bottom:28px;">
        <p style="margin:0 0 4px;font-size:11px;color:#9ca3af;letter-spacing:0.2em;text-transform:uppercase;font-family:'Helvetica Neue',Arial,sans-serif;">Produit</p>
        <p style="margin:0;font-size:18px;font-weight:700;color:#c9a96e;font-family:'Helvetica Neue',Arial,sans-serif;">${escapeHtml(productName)}</p>
      </div>

      <table style="width:100%;border-collapse:collapse;border-radius:10px;overflow:hidden;border:1px solid #e8e2d9;margin-bottom:28px;">
        <tbody>
          <tr>
            <td style="padding:12px 16px;font-size:13px;color:#7d7266;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;background:#f8f6f2;border-bottom:1px solid #f0ede8;width:120px;font-family:'Helvetica Neue',Arial,sans-serif;">Nom</td>
            <td style="padding:12px 16px;font-size:14px;color:#1a1a1a;border-bottom:1px solid #f0ede8;font-family:'Helvetica Neue',Arial,sans-serif;">${escapeHtml(clientName)}</td>
          </tr>
          <tr>
            <td style="padding:12px 16px;font-size:13px;color:#7d7266;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;background:#f8f6f2;font-family:'Helvetica Neue',Arial,sans-serif;">Email</td>
            <td style="padding:12px 16px;font-size:14px;font-family:'Helvetica Neue',Arial,sans-serif;">
              <a href="mailto:${escapeHtml(clientEmail)}" style="color:#c9a96e;text-decoration:none;font-weight:600;">${escapeHtml(clientEmail)}</a>
            </td>
          </tr>
        </tbody>
      </table>

      <div style="text-align:center;">
        <a href="mailto:${escapeHtml(clientEmail)}?subject=Votre%20demande%20de%20devis%20${encodeURIComponent(productName)}" style="display:inline-block;background:#c9a96e;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:13px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;font-family:'Helvetica Neue',Arial,sans-serif;">
          Répondre au client
        </a>
      </div>
    </div>`;

  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `Demande de devis — ${escapeHtml(clientName)} · ${escapeHtml(productName)}`,
    html: emailWrapper(content),
  });
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

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
