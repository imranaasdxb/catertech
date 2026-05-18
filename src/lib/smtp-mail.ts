import nodemailer from "nodemailer";

function smtpConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS
  );
}

export function getSmtpTransport() {
  if (!smtpConfigured()) return null;
  const port = Number(process.env.SMTP_PORT || "587");
  const secure = process.env.SMTP_SECURE === "true" || port === 465;
  /** Gmail app passwords are shown with spaces; SMTP expects 16 chars without spaces. */
  const pass = (process.env.SMTP_PASS || "").trim().replace(/\s+/g, "");
  const user = (process.env.SMTP_USER || "").trim();
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
}

export async function sendSignupOtpEmail(
  toEmail: string,
  code: string
): Promise<{ ok: true } | { ok: false; reason: string }> {
  const transport = getSmtpTransport();
  if (!transport) {
    return {
      ok: false,
      reason:
        "SMTP not configured — set SMTP_HOST, SMTP_USER, SMTP_PASS (optional SMTP_PORT, SMTP_SECURE, SMTP_FROM).",
    };
  }
  const user = (process.env.SMTP_USER || "").trim();
  const fromRaw = (process.env.SMTP_FROM || user || "").trim();
  const appName = process.env.MAIL_FROM_NAME?.trim() || "CaterTech";

  try {
    await transport.sendMail({
      from: `"${appName}" <${fromRaw}>`,
      to: toEmail,
      subject: `${appName} — your sign-up code`,
      text: `Your verification code is ${code}. It expires in 10 minutes. If you did not request this, ignore this email.`,
      html: `<p>Your verification code is:</p><p style="font-size:22px;font-weight:bold;letter-spacing:0.2em;">${code}</p><p>This code expires in 10 minutes.</p><p style="color:#666;font-size:13px;">If you did not request this, you can ignore this email.</p>`,
    });
    return { ok: true };
  } catch (err: unknown) {
    const code =
      err && typeof err === "object" && "code" in err
        ? String((err as { code?: string }).code)
        : "";
    const msg =
      err && typeof err === "object" && "message" in err
        ? String((err as { message?: string }).message)
        : String(err);

    if (code === "EAUTH" || msg.includes("535") || msg.includes("BadCredentials")) {
      const u = (process.env.SMTP_USER || "").trim().toLowerCase();
      const workspaceHint =
        u && !u.endsWith("@gmail.com")
          ? " If this is Google Workspace (custom domain like @aasit.ae), your admin may need to allow app passwords or SMTP AUTH in Google Admin → Security → Authentication. Some orgs block both; then you must use OAuth2 or another mail provider."
          : "";
      return {
        ok: false,
        reason:
          "Gmail SMTP rejected login — use a 16-character App Password (not your normal password), enable 2-Step Verification, and set SMTP_USER and SMTP_FROM to the exact same address (e.g. imran@aasit.ae). Host stays smtp.gmail.com with port 587." +
          workspaceHint +
          " https://support.google.com/mail/?p=BadCredentials",
      };
    }
    return {
      ok: false,
      reason: `Mail failed: ${msg}`,
    };
  }
}

const DEFAULT_QUOTE_NOTIFY = "aasimran26@gmail.com";

export type QuoteNotifyItem = {
  name: string;
  category: string;
  qty: number;
};

/** Notify admin inbox about a cart quotation (SMTP must be configured). */
export async function sendQuoteRequestEmail(opts: {
  quotationId: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  company: string | null;
  message: string | null;
  source: "email" | "whatsapp";
  items: QuoteNotifyItem[];
}): Promise<{ ok: true } | { ok: false; reason: string }> {
  const transport = getSmtpTransport();
  if (!transport) {
    return {
      ok: false,
      reason:
        "SMTP not configured — set SMTP_HOST, SMTP_USER, SMTP_PASS (optional SMTP_PORT, SMTP_SECURE, SMTP_FROM).",
    };
  }

  const user = (process.env.SMTP_USER || "").trim();
  const fromRaw = (process.env.SMTP_FROM || user || "").trim();
  const appName = process.env.MAIL_FROM_NAME?.trim() || "CaterTech";
  const toRaw = (
    process.env.QUOTE_NOTIFY_EMAIL || DEFAULT_QUOTE_NOTIFY
  ).trim();

  const sourceLabel = opts.source === "whatsapp" ? "WhatsApp" : "Email form";
  const itemRows = opts.items
    .map(
      (i) =>
        `<tr><td style="padding:6px;border:1px solid #eee">${escapeHtml(i.name)}</td><td style="padding:6px;border:1px solid #eee">${escapeHtml(i.category)}</td><td style="padding:6px;border:1px solid #eee;text-align:center">${i.qty}</td></tr>`
    )
    .join("");

  const html = `
<p><strong>New cart quotation</strong> — ${escapeHtml(sourceLabel)}</p>
<p style="color:#666;font-size:13px">Quotation ID: <code>${escapeHtml(opts.quotationId)}</code></p>
<table style="border-collapse:collapse;max-width:560px;margin:12px 0">
<tbody>
<tr><td style="padding:4px 8px 4px 0"><strong>Name</strong></td><td>${escapeHtml(opts.customerName)}</td></tr>
<tr><td style="padding:4px 8px 4px 0"><strong>Email</strong></td><td>${escapeHtml(opts.email)}</td></tr>
<tr><td style="padding:4px 8px 4px 0"><strong>Phone</strong></td><td>${escapeHtml(opts.phone)}</td></tr>
<tr><td style="padding:4px 8px 4px 0"><strong>Address</strong></td><td>${escapeHtml(opts.address)}</td></tr>
${opts.company ? `<tr><td style="padding:4px 8px 4px 0"><strong>Company</strong></td><td>${escapeHtml(opts.company)}</td></tr>` : ""}
</tbody></table>
${opts.message ? `<p><strong>Notes</strong></p><p style="white-space:pre-wrap">${escapeHtml(opts.message)}</p>` : ""}
<p><strong>Items</strong></p>
<table style="border-collapse:collapse;font-size:13px;width:100%;max-width:640px">
<thead><tr style="background:#f5f5f5"><th style="padding:8px;border:1px solid #eee;text-align:left">Product</th><th style="padding:8px;border:1px solid #eee;text-align:left">Category</th><th style="padding:8px;border:1px solid #eee;text-align:center">Qty</th></tr></thead>
<tbody>${itemRows}</tbody></table>
`;

  const textLines = [
    `New cart quotation (${sourceLabel})`,
    `Quotation ID: ${opts.quotationId}`,
    "",
    `Name: ${opts.customerName}`,
    `Email: ${opts.email}`,
    `Phone: ${opts.phone}`,
    `Address: ${opts.address}`,
    ...(opts.company ? [`Company: ${opts.company}`] : []),
    ...(opts.message ? ["", "Notes:", opts.message] : []),
    "",
    "Items:",
    ...opts.items.map((i) => `- ${i.name} × ${i.qty} (${i.category})`),
  ];

  try {
    await transport.sendMail({
      from: `"${appName}" <${fromRaw}>`,
      to: toRaw,
      replyTo: opts.email,
      subject: `[${appName}] Quote request — ${opts.customerName} (${sourceLabel})`,
      text: textLines.join("\n"),
      html,
    });
    return { ok: true };
  } catch (err: unknown) {
    const msg =
      err && typeof err === "object" && "message" in err
        ? String((err as { message?: string }).message)
        : String(err);
    return { ok: false, reason: `Mail failed: ${msg}` };
  }
}

/** Notify company inbox when a visitor submits Quick Enquiry (trade_enquiries). */
export async function sendTradeEnquiryNotifyEmail(opts: {
  enquiryId: string;
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  emirate: string | null;
  serviceInterest: string | null;
  message: string;
}): Promise<{ ok: true } | { ok: false; reason: string }> {
  const transport = getSmtpTransport();
  if (!transport) {
    return {
      ok: false,
      reason:
        "SMTP not configured — set SMTP_HOST, SMTP_USER, SMTP_PASS (optional SMTP_PORT, SMTP_SECURE, SMTP_FROM).",
    };
  }

  const user = (process.env.SMTP_USER || "").trim();
  const fromRaw = (process.env.SMTP_FROM || user || "").trim();
  const appName = process.env.MAIL_FROM_NAME?.trim() || "CaterTech";
  const toRaw = (
    process.env.ENQUIRY_NOTIFY_EMAIL ||
    process.env.QUOTE_NOTIFY_EMAIL ||
    DEFAULT_QUOTE_NOTIFY
  ).trim();

  const html = `
<p><strong>New quick enquiry</strong> — web form</p>
<p style="color:#666;font-size:13px">Enquiry ID: <code>${escapeHtml(opts.enquiryId)}</code></p>
<table style="border-collapse:collapse;max-width:560px;margin:12px 0">
<tbody>
<tr><td style="padding:4px 8px 4px 0"><strong>Company</strong></td><td>${escapeHtml(opts.companyName)}</td></tr>
<tr><td style="padding:4px 8px 4px 0"><strong>Contact</strong></td><td>${escapeHtml(opts.contactName)}</td></tr>
<tr><td style="padding:4px 8px 4px 0"><strong>Email</strong></td><td>${escapeHtml(opts.email)}</td></tr>
<tr><td style="padding:4px 8px 4px 0"><strong>Phone</strong></td><td>${escapeHtml(opts.phone)}</td></tr>
${opts.emirate ? `<tr><td style="padding:4px 8px 4px 0"><strong>Emirate</strong></td><td>${escapeHtml(opts.emirate)}</td></tr>` : ""}
${opts.serviceInterest ? `<tr><td style="padding:4px 8px 4px 0"><strong>Service interest</strong></td><td>${escapeHtml(opts.serviceInterest)}</td></tr>` : ""}
</tbody></table>
<p><strong>Message</strong></p>
<p style="white-space:pre-wrap">${escapeHtml(opts.message)}</p>
`;

  const textLines = [
    "New quick enquiry (website form)",
    `Enquiry ID: ${opts.enquiryId}`,
    "",
    `Company: ${opts.companyName}`,
    `Contact: ${opts.contactName}`,
    `Email: ${opts.email}`,
    `Phone: ${opts.phone}`,
    ...(opts.emirate ? [`Emirate: ${opts.emirate}`] : []),
    ...(opts.serviceInterest ? [`Service interest: ${opts.serviceInterest}`] : []),
    "",
    "Message:",
    opts.message,
  ];

  try {
    await transport.sendMail({
      from: `"${appName}" <${fromRaw}>`,
      to: toRaw,
      replyTo: opts.email,
      subject: `[${appName}] Quick enquiry — ${opts.companyName}`,
      text: textLines.join("\n"),
      html,
    });
    return { ok: true };
  } catch (err: unknown) {
    const msg =
      err && typeof err === "object" && "message" in err
        ? String((err as { message?: string }).message)
        : String(err);
    return { ok: false, reason: `Mail failed: ${msg}` };
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
