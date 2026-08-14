import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/db";
import { tradeEnquiries } from "@/db/schema";
import { sendTradeEnquiryNotifyEmail } from "@/lib/smtp-mail";
import { sanitizeMultilineText, sanitizePhone, sanitizeText } from "@/lib/security";

const chatbotLeadSchema = z.object({
  name: z.string().min(2).max(200),
  phone: z.string().min(5).max(50),
  need: z.string().min(1).max(200),
  details: z.string().max(5000).optional().or(z.literal("")),
});

const CHATBOT_EMAIL_FALLBACK = "chatbot-lead@catertech.local";

export async function POST(request: Request) {
  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = chatbotLeadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const lead = {
    name: sanitizeText(parsed.data.name),
    phone: sanitizePhone(parsed.data.phone),
    need: sanitizeText(parsed.data.need),
    details: sanitizeMultilineText(parsed.data.details || ""),
  };
  if (!lead.name || !lead.phone || !lead.need) {
    return NextResponse.json({ error: "Invalid lead details" }, { status: 400 });
  }
  const message = [
    "Source: Website chat assistant",
    "",
    `Request type: ${lead.need}`,
    `Phone: ${lead.phone}`,
    "",
    "Message:",
    lead.details || "No extra message provided.",
  ].join("\n");

  const [row] = await db
    .insert(tradeEnquiries)
    .values({
      companyName: "Website Chat Lead",
      contactName: lead.name,
      phone: lead.phone,
      email: CHATBOT_EMAIL_FALLBACK,
      emirate: null,
      serviceInterest: lead.need,
      message,
      attachmentUrl: null,
    })
    .returning({ id: tradeEnquiries.id });

  const mail = await sendTradeEnquiryNotifyEmail({
    enquiryId: row.id,
    companyName: "Website Chat Lead",
    contactName: lead.name,
    phone: lead.phone,
    email: CHATBOT_EMAIL_FALLBACK,
    emirate: null,
    serviceInterest: lead.need,
    message,
  });

  if (!mail.ok) {
    console.error("[chatbot-leads] notify email failed:", mail.reason);
  }

  return NextResponse.json({ ok: true, id: row.id });
}
