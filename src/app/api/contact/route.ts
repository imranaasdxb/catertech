import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { contactMessages } from "@/db/schema";
import { contactSchema } from "@/lib/validations/forms";

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

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { fullName, email, phone, message } = parsed.data;

  const [row] = await db
    .insert(contactMessages)
    .values({
      fullName,
      email,
      phone: phone || null,
      message,
    })
    .returning({ id: contactMessages.id });

  return NextResponse.json({ ok: true, id: row.id });
}
