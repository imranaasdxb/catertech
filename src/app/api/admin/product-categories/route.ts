import { asc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { productCategories, productSubcategories } from "@/db/schema";
import {
  uniqueCategorySlug,
} from "@/lib/product-taxonomy";
import { z } from "zod";

const createSchema = z.object({
  name: z.string().min(1).max(160),
});

export async function GET() {
  const db = getDb();
  if (!db)
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const cats = await db
    .select()
    .from(productCategories)
    .orderBy(asc(productCategories.sortOrder), asc(productCategories.name));

  const subs = await db
    .select()
    .from(productSubcategories)
    .orderBy(asc(productSubcategories.sortOrder), asc(productSubcategories.name));

  const categories = cats.map((c) => ({
    ...c,
    subcategories: subs.filter((s) => s.categoryId === c.id),
  }));

  return NextResponse.json({ categories });
}

export async function POST(request: Request) {
  const db = getDb();
  if (!db)
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const name = parsed.data.name.trim();
  const slug = await uniqueCategorySlug(db, name);

  const [row] = await db
    .insert(productCategories)
    .values({ name, slug })
    .returning();

  return NextResponse.json(row, { status: 201 });
}
