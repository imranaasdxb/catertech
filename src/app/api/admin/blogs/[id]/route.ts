import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { blogPosts } from "@/db/schema";
import { slugify } from "@/lib/slug";
import { z } from "zod";

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  excerpt: z.string().nullable().optional(),
  content: z.string().min(1).optional(),
  images: z.array(z.string()).optional(),
  coverImage: z.string().nullable().optional(),
  published: z.boolean().optional(),
});

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const db = getDb();
  if (!db)
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const [row] = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.id, id))
    .limit(1);

  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(row);
}

export async function PUT(
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

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const d = parsed.data;
  const [row] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const nextSlug =
    d.title !== undefined ? slugify(d.title) : row.slug;

  const nextImages =
    d.images !== undefined ? d.images : (row.images ?? []);
  const nextCover =
    d.images !== undefined
      ? (nextImages.length > 0 ? nextImages[0] : null)
      : d.coverImage !== undefined
        ? d.coverImage
        : row.coverImage;

  const [updated] = await db
    .update(blogPosts)
    .set({
      title: d.title ?? row.title,
      slug: nextSlug,
      excerpt: d.excerpt !== undefined ? d.excerpt : row.excerpt,
      content: d.content ?? row.content,
      coverImage: nextCover,
      images: nextImages,
      published: d.published ?? row.published,
      updatedAt: new Date(),
    })
    .where(eq(blogPosts.id, id))
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

  const deleted = await db
    .delete(blogPosts)
    .where(eq(blogPosts.id, id))
    .returning({ id: blogPosts.id });

  if (!deleted.length)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
