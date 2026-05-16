import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { tradeEnquiries } from "@/db/schema";
import { enquirySchema } from "@/lib/validations/forms";
import { sendTradeEnquiryNotifyEmail } from "@/lib/smtp-mail";

export async function POST(request: Request) {
  const db = getDb();
  if (!db) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const d = parsed.data;
  const [row] = await db
    .insert(tradeEnquiries)
    .values({
      companyName: d.companyName,
      contactName: d.contactName,
      phone: d.phone,
      email: d.email,
      emirate: d.emirate || null,
      serviceInterest: d.serviceInterest || null,
      message: d.message,
      attachmentUrl: null,
    })
    .returning({ id: tradeEnquiries.id });

  const emirateTrim = (d.emirate || "").trim() || null;
  const svcTrim = (d.serviceInterest || "").trim() || null;

  const mail = await sendTradeEnquiryNotifyEmail({
    enquiryId: row.id,
    companyName: d.companyName,
    contactName: d.contactName,
    phone: d.phone,
    email: d.email,
    emirate: emirateTrim,
    serviceInterest: svcTrim,
    message: d.message,
  });
  if (!mail.ok) {
    console.error("[enquiry] notify email failed:", mail.reason);
  }

  return NextResponse.json({ ok: true, id: row.id });
}
