import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { getDb } from "@/db";
import { quotations } from "@/db/schema";
import { sendQuoteRequestEmail } from "@/lib/smtp-mail";
import { quoteSchema } from "@/lib/validations/forms";

export const dynamic = "force-dynamic";

function generateQuoteNumber() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const suffix = randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();
  return `CTQ-${date}-${suffix}`;
}

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

  const parsed = quoteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const d = parsed.data;
  const source = d.source === "whatsapp" ? "whatsapp" : "email";
  const quoteNumber = generateQuoteNumber();

  const itemsForStore = d.items.map((item) => ({
    name: item.name,
    category: item.category,
    qty: item.qty,
    price: item.price?.trim() || "",
  }));

  const [row] = await db
    .insert(quotations)
    .values({
      quoteNumber,
      customerName: d.customerName,
      email: d.email,
      phone: d.phone,
      company: d.company || null,
      address: d.address,
      source,
      message: d.message || null,
      items: itemsForStore,
    })
    .returning({ id: quotations.id, quoteNumber: quotations.quoteNumber });

  revalidatePath("/admin");
  revalidatePath("/admin/quotations");

  const mail = await sendQuoteRequestEmail({
    quoteNumber: row.quoteNumber ?? quoteNumber,
    customerName: d.customerName,
    email: d.email,
    phone: d.phone,
    address: d.address,
    company: d.company || null,
    message: d.message || null,
    source,
    items: itemsForStore,
  });
  if (!mail.ok) {
    console.error("[quote] notify email failed:", mail.reason);
  }

  return NextResponse.json({ ok: true, id: row.id, quoteNumber: row.quoteNumber ?? quoteNumber });
}
