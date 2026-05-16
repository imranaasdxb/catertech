import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { rfqSubmissions } from "@/db/schema";
import { rfqSchema } from "@/lib/validations/forms";

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

  const parsed = rfqSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const d = parsed.data;
  const [row] = await db
    .insert(rfqSubmissions)
    .values({
      companyName: d.companyName,
      tradeLicenceNo: d.tradeLicenceNo || null,
      contactPerson: d.contactPerson,
      phone: d.phone,
      email: d.email,
      budgetAed: d.budgetAed || null,
      emirate: d.emirate || null,
      requiredDate: d.requiredDate || null,
      lineItems: d.lineItems,
      attachmentUrls: [],
    })
    .returning({ id: rfqSubmissions.id });

  return NextResponse.json({
    ok: true,
    id: row.id,
    reference: row.id.slice(0, 8).toUpperCase(),
  });
}
