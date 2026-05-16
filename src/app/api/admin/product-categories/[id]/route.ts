import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { productCategories } from "@/db/schema";
import {
  countProductsUsingCategory,
  uniqueCategorySlugForUpdate,
} from "@/lib/product-taxonomy";
import { z } from "zod";

const patchSchema = z.object({
  name: z.string().min(1).max(160),
});
export async function PATCH(
  request: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const db = getDb();
  if (!db)
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const [row] = await db
    .select()
    .from(productCategories)
    .where(eq(productCategories.id, id))
    .limit(1);
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const name = parsed.data.name.trim();
  const slug =
    name === row.name ? row.slug : await uniqueCategorySlugForUpdate(db, name, id);

  const [updated] = await db
    .update(productCategories)
    .set({ name, slug, updatedAt: new Date() })
    .where(eq(productCategories.id, id))
    .returning();

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const db = getDb();
  if (!db)
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const n = await countProductsUsingCategory(db, id);
  if (n > 0) {
    return NextResponse.json(
      {
        error: `Cannot delete: ${n} product(s) use this category. Reassign them first.`,
      },
      { status: 409 }
    );
  }

  const deleted = await db
    .delete(productCategories)
    .where(eq(productCategories.id, id))
    .returning({ id: productCategories.id });

  if (!deleted.length)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
