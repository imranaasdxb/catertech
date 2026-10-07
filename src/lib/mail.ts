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

function getSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "";
  if (explicit.trim()) return explicit.trim().replace(/\/$/, "");
  const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL || "";
  if (vercelProductionUrl.trim()) {
    return `https://${vercelProductionUrl.trim().replace(/^https?:\/\//, "").replace(/\/$/, "")}`;
  }
  const vercelUrl = process.env.VERCEL_URL || "";
  if (vercelUrl.trim()) return `https://${vercelUrl.trim().replace(/\/$/, "")}`;
  return "https://catertech-ae.vercel.app";
}

function getMailLogoUrl() {
  const explicit = process.env.MAIL_LOGO_URL || "";
  if (explicit.trim()) return explicit.trim();
  const siteUrl = getSiteUrl();
  return `${siteUrl}/brand/logo.png`;
}

const VAT_RATE = 0.05;

function parseAedPrice(value?: string) {
  if (!value) return null;
  const cleaned = value
    .replace(/\bAED\b/gi, "")
    .replace(/\bper\s+day\b/gi, "")
    .replace(/\/\s*day\b/gi, "")
    .trim();
  const token = cleaned.match(/\d[\d,.]*/)?.[0];
  if (!token) return null;

  let normalized = token;
  if (token.includes(",") && token.includes(".")) {
    normalized = token.replace(/,/g, "");
  } else if (token.includes(",") && !token.includes(".")) {
    const parts = token.split(",");
    normalized =
      parts.length === 2 && parts[1].length === 2
        ? parts.join(".")
        : token.replace(/,/g, "");
  }

  const amount = Number(normalized);
  return Number.isFinite(amount) ? amount : null;
}

function formatAedAmount(value: number) {
  return `AED ${value.toLocaleString("en-AE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatRequestDate() {
  return new Date().toLocaleString("en-AE", {
    timeZone: "Asia/Dubai",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function sendViaResend(message: MailMessage): Promise<MailResult | null> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const fromRaw = (process.env.MAIL_FROM || process.env.EMAIL_FROM || "").trim();
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

async function sendMailMessage(message: MailMessage): Promise<MailResult> {
  const resend = await sendViaResend(message);
  if (resend?.ok) return resend;

  if (resend) return resend;

  return {
    ok: false,
    reason: "Mail not configured — set RESEND_API_KEY and MAIL_FROM.",
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
    process.env.QUOTE_NOTIFY_EMAIL ||
    process.env.QUOTE_REQUEST_TO ||
    DEFAULT_QUOTE_NOTIFY
  ).trim();

  const logoUrl = getMailLogoUrl();
  const totalQty = opts.items.reduce((sum, item) => sum + item.qty, 0);
  const requestDate = formatRequestDate();
  const pricedLines = opts.items.map((item) => {
    const unitPrice = parseAedPrice(item.price);
    return {
      ...item,
      unitPrice,
      lineTotal: unitPrice !== null ? unitPrice * item.qty : null,
    };
  });
  const subtotal = pricedLines.reduce((sum, item) => sum + (item.lineTotal ?? 0), 0);
  const vat = subtotal * VAT_RATE;
  const total = subtotal + vat;
  const hasUnpricedItems = pricedLines.some((item) => item.lineTotal === null);
  const sourceLabel = opts.source === "whatsapp" ? "WhatsApp request" : "Email form";
  const logoHtml = logoUrl
    ? `<img src="${escapeHtml(logoUrl)}" width="210" alt="Catertech" style="display:block;width:210px;max-width:210px;height:auto;border:0;outline:none;text-decoration:none;" />`
    : `<div style="font-size:24px;font-weight:800;letter-spacing:0.08em;color:#1b2b4b;text-transform:uppercase;">Catertech</div>`;
  const itemRows = pricedLines
    .map((item, index) => {
      return `<tr>
        <td style="padding:13px 12px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:12px;text-align:center;">${index + 1}</td>
        <td style="padding:13px 12px;border-bottom:1px solid #e5e7eb;color:#111827;font-weight:700;">${escapeHtml(item.name)}<div style="margin-top:3px;color:#6b7280;font-size:12px;font-weight:400;line-height:1.4;">${escapeHtml(item.category)}</div></td>
        <td style="padding:13px 12px;border-bottom:1px solid #e5e7eb;color:#111827;font-weight:700;text-align:center;">${item.qty}</td>
        <td style="padding:13px 12px;border-bottom:1px solid #e5e7eb;color:#111827;font-weight:600;white-space:nowrap;text-align:right;">${item.unitPrice !== null ? formatAedAmount(item.unitPrice) : "Quote"}</td>
        <td style="padding:13px 12px;border-bottom:1px solid #e5e7eb;color:#111827;font-weight:700;white-space:nowrap;text-align:right;">${item.lineTotal !== null ? formatAedAmount(item.lineTotal) : "Quote"}</td>
      </tr>`;
    })
    .join("");

  const html = `
<div style="margin:0;padding:0;background:#f7f8fb;font-family:Arial,Helvetica,sans-serif;color:#111827;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;background:#f7f8fb;">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table role="presentation" width="760" cellspacing="0" cellpadding="0" style="width:100%;max-width:760px;border-collapse:collapse;background:#ffffff;border:1px solid #e5e7eb;">
          <tr>
            <td style="padding:22px 28px 16px;background:#ffffff;border-bottom:3px solid #c9a84c;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;">
                <tr>
                  <td style="vertical-align:middle;">${logoHtml}</td>
                  <td align="right" style="vertical-align:middle;">
                    <div style="color:#6b7280;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;">${escapeHtml(sourceLabel)}</div>
                    <div style="margin-top:6px;color:#111827;font-size:13px;font-weight:700;">${escapeHtml(requestDate)}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 28px 0;background:#ffffff;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;border-bottom:1px solid #e5e7eb;padding-bottom:18px;">
                <tr>
                  <td style="vertical-align:top;">
                    <div style="color:#6b7280;font-size:11px;font-weight:800;letter-spacing:0.16em;text-transform:uppercase;">Quotation request</div>
                    <h1 style="margin:8px 0 0;color:#111827;font-size:24px;line-height:1.25;font-weight:800;">${escapeHtml(opts.customerName)}</h1>
                  </td>
                  <td align="right" style="vertical-align:top;">
                    <div style="color:#6b7280;font-size:12px;font-weight:700;">Quote No.</div>
                    <div style="margin-top:5px;color:#111827;font-size:15px;font-weight:800;">${escapeHtml(opts.quoteNumber)}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:22px 28px;background:#ffffff;">
              <p style="margin:0 0 12px;color:#111827;font-size:14px;font-weight:800;">Client details</p>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;">
                <tr>
                  <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;background:#f9fafb;color:#6b7280;font-size:12px;font-weight:800;width:28%;">Name</td>
                  <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;color:#111827;font-size:13px;font-weight:600;">${escapeHtml(opts.customerName)}</td>
                  <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;background:#f9fafb;color:#6b7280;font-size:12px;font-weight:800;width:20%;">Phone</td>
                  <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;color:#111827;font-size:13px;font-weight:600;">${escapeHtml(opts.phone)}</td>
                </tr>
                <tr>
                  <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;background:#f9fafb;color:#6b7280;font-size:12px;font-weight:800;">Email</td>
                  <td colspan="3" style="padding:10px 12px;border-bottom:1px solid #e5e7eb;color:#111827;font-size:13px;font-weight:600;"><a href="mailto:${escapeHtml(opts.email)}" style="color:#1b6d85;text-decoration:none;">${escapeHtml(opts.email)}</a></td>
                </tr>
                <tr>
                  <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;background:#f9fafb;color:#6b7280;font-size:12px;font-weight:800;">Address</td>
                  <td colspan="3" style="padding:10px 12px;border-bottom:1px solid #e5e7eb;color:#111827;font-size:13px;font-weight:600;">${escapeHtml(opts.address)}</td>
                </tr>
                ${opts.company ? `<tr>
                  <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;background:#f9fafb;color:#6b7280;font-size:12px;font-weight:800;">Company</td>
                  <td colspan="3" style="padding:10px 12px;border-bottom:1px solid #e5e7eb;color:#111827;font-size:13px;font-weight:600;">${escapeHtml(opts.company)}</td>
                </tr>` : ""}
                <tr>
                  <td style="padding:10px 12px;background:#f9fafb;color:#6b7280;font-size:12px;font-weight:800;">Notes</td>
                  <td colspan="3" style="padding:10px 12px;color:#111827;font-size:13px;line-height:1.6;white-space:pre-wrap;">${opts.message ? escapeHtml(opts.message) : "No additional notes provided."}</td>
                </tr>
              </table>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;margin-top:18px;">
                <tr>
                  <td style="color:#111827;font-size:14px;font-weight:800;">Requested items</td>
                  <td align="right" style="color:#6b7280;font-size:12px;font-weight:700;">${opts.items.length} items • ${totalQty} total qty</td>
                </tr>
              </table>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;margin-top:10px;border-collapse:collapse;border:1px solid #e5e7eb;font-size:13px;">
                <thead>
                  <tr style="background:#f9fafb;">
                    <th style="padding:11px 12px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:11px;text-align:center;text-transform:uppercase;letter-spacing:0.08em;">#</th>
                    <th style="padding:11px 12px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:11px;text-align:left;text-transform:uppercase;letter-spacing:0.08em;">Item</th>
                    <th style="padding:11px 12px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:11px;text-align:center;text-transform:uppercase;letter-spacing:0.08em;">Qty</th>
                    <th style="padding:11px 12px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:11px;text-align:right;text-transform:uppercase;letter-spacing:0.08em;">Rate</th>
                    <th style="padding:11px 12px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:11px;text-align:right;text-transform:uppercase;letter-spacing:0.08em;">Line total</th>
                  </tr>
                </thead>
                <tbody>${itemRows}</tbody>
              </table>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;margin-top:16px;">
                <tr>
                  <td style="width:55%;"></td>
                  <td style="padding:8px 0;color:#6b7280;font-size:13px;">Subtotal</td>
                  <td align="right" style="padding:8px 0;color:#111827;font-size:13px;font-weight:700;">${formatAedAmount(subtotal)}</td>
                </tr>
                <tr>
                  <td></td>
                  <td style="padding:8px 0;border-top:1px solid #e5e7eb;color:#6b7280;font-size:13px;">VAT 5%</td>
                  <td align="right" style="padding:8px 0;border-top:1px solid #e5e7eb;color:#111827;font-size:13px;font-weight:700;">${formatAedAmount(vat)}</td>
                </tr>
                <tr>
                  <td></td>
                  <td style="padding:12px 0;border-top:2px solid #111827;color:#111827;font-size:15px;font-weight:800;">Estimated total</td>
                  <td align="right" style="padding:12px 0;border-top:2px solid #111827;color:#111827;font-size:15px;font-weight:800;">${formatAedAmount(total)}</td>
                </tr>
                ${hasUnpricedItems ? `<tr>
                  <td></td>
                  <td colspan="2" style="padding:4px 0 0;color:#6b7280;font-size:11px;line-height:1.5;">Items marked Quote are not included in the automatic total.</td>
                </tr>` : ""}
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</div>
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
    process.env.QUOTE_REQUEST_TO ||
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
