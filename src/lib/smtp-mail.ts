import nodemailer from "nodemailer";

type MailResult = { ok: true } | { ok: false; reason: string };

type MailMessage = {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
};

function getAppName() {
  return process.env.MAIL_FROM_NAME?.trim() || "CaterTech";
}

function formatMailAddress(name: string, email: string) {
  return `"${name.replace(/"/g, "'")}" <${email}>`;
}

function parseRecipients(to: string) {
  return to
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
}

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

async function sendViaResend(message: MailMessage): Promise<MailResult | null> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const fromRaw = process.env.MAIL_FROM?.trim();
  if (!apiKey || !fromRaw) return null;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: formatMailAddress(getAppName(), fromRaw),
        to: parseRecipients(message.to),
        subject: message.subject,
        text: message.text,
        html: message.html,
        ...(message.replyTo ? { reply_to: message.replyTo } : {}),
      }),
    });

    if (res.ok) return { ok: true };

    const body = await res.text().catch(() => "");
    return {
      ok: false,
      reason: `Resend failed (${res.status}): ${body || res.statusText}`,
    };
  } catch (err: unknown) {
    const msg =
      err && typeof err === "object" && "message" in err
        ? String((err as { message?: string }).message)
        : String(err);
    return { ok: false, reason: `Resend failed: ${msg}` };
  }
}

async function sendViaSmtp(message: MailMessage): Promise<MailResult | null> {
  const transport = getSmtpTransport();
  if (!transport) return null;

  const user = (process.env.SMTP_USER || "").trim();
  const fromRaw = (process.env.SMTP_FROM || user || "").trim();

  try {
    await transport.sendMail({
      from: formatMailAddress(getAppName(), fromRaw),
      to: message.to,
      ...(message.replyTo ? { replyTo: message.replyTo } : {}),
      subject: message.subject,
      text: message.text,
      html: message.html,
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
          ? " If this is a custom domain mailbox, make sure the SMTP password belongs to the same mailbox as SMTP_USER and SMTP AUTH is enabled by the mail admin."
          : "";
      return {
        ok: false,
        reason:
          "SMTP rejected login — check SMTP_USER, SMTP_PASS, SMTP_FROM, and provider SMTP settings." +
          workspaceHint,
      };
    }

    return { ok: false, reason: `SMTP failed: ${msg}` };
  }
}

async function sendMailMessage(message: MailMessage): Promise<MailResult> {
  const resend = await sendViaResend(message);
  if (resend?.ok) return resend;

  const smtp = await sendViaSmtp(message);
  if (smtp?.ok) return smtp;

  if (smtp) return smtp;
  if (resend) return resend;

  return {
    ok: false,
    reason:
      "Mail not configured — set RESEND_API_KEY and MAIL_FROM, or set SMTP_HOST, SMTP_USER, SMTP_PASS (optional SMTP_PORT, SMTP_SECURE, SMTP_FROM).",
  };
}

export async function sendSignupOtpEmail(
  toEmail: string,
  code: string
): Promise<MailResult> {
  const appName = getAppName();
  return sendMailMessage({
    to: toEmail,
    subject: `${appName} — your sign-up code`,
    text: `Your verification code is ${code}. It expires in 10 minutes. If you did not request this, ignore this email.`,
    html: `<p>Your verification code is:</p><p style="font-size:22px;font-weight:bold;letter-spacing:0.2em;">${code}</p><p>This code expires in 10 minutes.</p><p style="color:#666;font-size:13px;">If you did not request this, you can ignore this email.</p>`,
  });
}

export async function sendPasswordResetOtpEmail(opts: {
  toEmail: string;
  code: string;
  fullName: string;
}): Promise<MailResult> {
  const appName = getAppName();
  return sendMailMessage({
    to: opts.toEmail,
    subject: `${appName} — reset your admin password`,
    text: `Hi ${opts.fullName}, use code ${opts.code} to reset your admin password. It expires in 10 minutes. If you did not request this, ignore this email.`,
    html: `<p>Hi <strong>${escapeHtml(opts.fullName)}</strong>, use this code to reset your admin password:</p><p style="font-size:22px;font-weight:bold;letter-spacing:0.2em;">${opts.code}</p><p>This code expires in 10 minutes.</p><p style="color:#666;font-size:13px;">If you did not request this, you can ignore this email.</p>`,
  });
}

export async function sendAdminEmailChangeOtpEmail(opts: {
  toEmail: string;
  code: string;
  adminName: string;
}): Promise<MailResult> {
  const appName = getAppName();
  return sendMailMessage({
    to: opts.toEmail,
    subject: `${appName} — verify admin email change`,
    text: `Use code ${opts.code} to change the admin email for ${opts.adminName}. It expires in 10 minutes. If you did not request this, ignore this email.`,
    html: `<p>Use this code to change the admin email for <strong>${escapeHtml(opts.adminName)}</strong>:</p><p style="font-size:22px;font-weight:bold;letter-spacing:0.2em;">${opts.code}</p><p>This code expires in 10 minutes.</p><p style="color:#666;font-size:13px;">If you did not request this, you can ignore this email.</p>`,
  });
}

export async function sendAdminCreatedUserOtpEmail(opts: {
  toEmail: string;
  code: string;
  fullName: string;
}): Promise<MailResult> {
  const appName = getAppName();
  return sendMailMessage({
    to: opts.toEmail,
    subject: `${appName} — verify your admin account`,
    text: `Hi ${opts.fullName}, your admin verification code is ${opts.code}. It expires in 10 minutes.`,
    html: `<p>Hi <strong>${escapeHtml(opts.fullName)}</strong>, use this code to verify your admin account:</p><p style="font-size:22px;font-weight:bold;letter-spacing:0.2em;">${opts.code}</p><p>This code expires in 10 minutes.</p>`,
  });
}

const DEFAULT_QUOTE_NOTIFY = "sales@catertech.ae";

export type QuoteNotifyItem = {
  name: string;
  category: string;
  qty: number;
  price?: string;
};

/** Notify admin inbox about a cart quotation. */
export async function sendQuoteRequestEmail(opts: {
  quoteNumber: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  company: string | null;
  message: string | null;
  source: "email" | "whatsapp";
  items: QuoteNotifyItem[];
}): Promise<MailResult> {
  const appName = getAppName();
  const toRaw = (
    process.env.QUOTE_NOTIFY_EMAIL || DEFAULT_QUOTE_NOTIFY
  ).trim();

  const hasPrice = opts.items.some((item) => item.price?.trim());
  const itemRows = opts.items
    .map((item) => {
      const priceCell = hasPrice
        ? `<td style="padding:6px;border:1px solid #eee">${escapeHtml(item.price?.trim() || "—")}</td>`
        : "";
      return `<tr><td style="padding:6px;border:1px solid #eee">${escapeHtml(item.name)}</td><td style="padding:6px;border:1px solid #eee">${escapeHtml(item.category)}</td><td style="padding:6px;border:1px solid #eee;text-align:center">${item.qty}</td>${priceCell}</tr>`;
    })
    .join("");

  const html = `
<p><strong>Quote request</strong></p>
<table style="border-collapse:collapse;max-width:560px;margin:12px 0">
<tbody>
<tr><td style="padding:4px 8px 4px 0"><strong>Quote No.</strong></td><td>${escapeHtml(opts.quoteNumber)}</td></tr>
<tr><td style="padding:4px 8px 4px 0"><strong>Name</strong></td><td>${escapeHtml(opts.customerName)}</td></tr>
<tr><td style="padding:4px 8px 4px 0"><strong>Email</strong></td><td>${escapeHtml(opts.email)}</td></tr>
<tr><td style="padding:4px 8px 4px 0"><strong>Phone</strong></td><td>${escapeHtml(opts.phone)}</td></tr>
<tr><td style="padding:4px 8px 4px 0"><strong>Address</strong></td><td>${escapeHtml(opts.address)}</td></tr>
${opts.company ? `<tr><td style="padding:4px 8px 4px 0"><strong>Company</strong></td><td>${escapeHtml(opts.company)}</td></tr>` : ""}
${opts.message ? `<tr><td style="padding:4px 8px 4px 0"><strong>Notes</strong></td><td style="white-space:pre-wrap">${escapeHtml(opts.message)}</td></tr>` : ""}
</tbody></table>
<p><strong>Items</strong></p>
<table style="border-collapse:collapse;font-size:13px;width:100%;max-width:640px">
<thead><tr style="background:#f5f5f5"><th style="padding:8px;border:1px solid #eee;text-align:left">Product</th><th style="padding:8px;border:1px solid #eee;text-align:left">Category</th><th style="padding:8px;border:1px solid #eee;text-align:center">Qty</th>${hasPrice ? '<th style="padding:8px;border:1px solid #eee;text-align:left">Price</th>' : ""}</tr></thead>
<tbody>${itemRows}</tbody></table>
`;

  const textLines = [
    "Quote request",
    `Quote No.: ${opts.quoteNumber}`,
    `Name: ${opts.customerName}`,
    `Email: ${opts.email}`,
    `Phone: ${opts.phone}`,
    `Address: ${opts.address}`,
    ...(opts.company ? [`Company: ${opts.company}`] : []),
    ...(opts.message ? [`Notes: ${opts.message}`] : []),
    "",
    "Items:",
    ...opts.items.map((item) => {
      const pricePart = item.price?.trim() ? ` — ${item.price.trim()}` : "";
      return `- ${item.name} × ${item.qty}${pricePart} (${item.category})`;
    }),
  ];

  return sendMailMessage({
    to: toRaw,
    replyTo: opts.email,
    subject: `${opts.customerName} - Quote request ${opts.quoteNumber} | ${appName}`,
    text: textLines.join("\n"),
    html,
  });
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
}): Promise<MailResult> {
  const appName = getAppName();
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

  return sendMailMessage({
    to: toRaw,
    replyTo: opts.email,
    subject: `[${appName}] Quick enquiry — ${opts.companyName}`,
    text: textLines.join("\n"),
    html,
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
