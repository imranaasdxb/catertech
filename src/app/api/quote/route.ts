import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getDb } from "@/db";
import { quotations } from "@/db/schema";
import { sendQuoteRequestEmail } from "@/lib/smtp-mail";
import { quoteSchema } from "@/lib/validations/forms";

export const dynamic = "force-dynamic";

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

  const itemsForStore = d.items.map((item) => ({
    name: item.name,
    category: item.category,
    qty: item.qty,
    price: item.price?.trim() || "",
  }));

  const [row] = await db
    .insert(quotations)
    .values({
      customerName: d.customerName,
      email: d.email,
      phone: d.phone,
      company: d.company || null,
      address: d.address,
      source,
      message: d.message || null,
      items: itemsForStore,
    })
    .returning({ id: quotations.id });

  revalidatePath("/admin");
  revalidatePath("/admin/quotations");

  const mail = await sendQuoteRequestEmail({
    quotationId: row.id,
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

  return NextResponse.json({ ok: true, id: row.id });
}
