import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { productCategories, productSubcategories } from "@/db/schema";
import { uniqueSubcategorySlug } from "@/lib/product-taxonomy";
import { z } from "zod";

const createSchema = z.object({
  categoryId: z.string().uuid(),
  name: z.string().min(1).max(160),
});

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

  const catId = parsed.data.categoryId;
  const [cat] = await db
    .select({ id: productCategories.id })
    .from(productCategories)
    .where(eq(productCategories.id, catId))
    .limit(1);
  if (!cat) {
    return NextResponse.json({ error: "Category not found" }, { status: 400 });
  }

  const name = parsed.data.name.trim();
  const slug = await uniqueSubcategorySlug(db, catId, name);

  const [row] = await db
    .insert(productSubcategories)
    .values({ categoryId: catId, name, slug })
    .returning();

  return NextResponse.json(row, { status: 201 });
}
