import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { rfqSubmissions } from "@/db/schema";

export async function GET() {
  const db = getDb();
  if (!db)
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const rows = await db
    .select()
    .from(rfqSubmissions)
    .orderBy(desc(rfqSubmissions.createdAt));

  return NextResponse.json(rows);
}
