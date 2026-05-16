import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { blogPosts } from "@/db/schema";
import { slugify } from "@/lib/slug";
import { z } from "zod";

const createSchema = z.object({
  title: z.string().min(1),
  excerpt: z.string().optional(),
  content: z.string().min(1),
  /** Stored gallery URLs; primary cover is derived from first when present */
  images: z.array(z.string()).optional(),
  coverImage: z.string().optional(),
  published: z.boolean().optional(),
});

export async function GET() {
  const db = getDb();
  if (!db)
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const rows = await db
    .select()
    .from(blogPosts)
    .orderBy(desc(blogPosts.updatedAt));

  return NextResponse.json(rows);
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

  const d = parsed.data;
  const imgs =
    d.images != null && d.images.length > 0
      ? d.images
      : d.coverImage != null && d.coverImage.trim() !== ""
        ? [d.coverImage.trim()]
        : [];

  let base = slugify(d.title);
  let slug = base;
  let n = 0;
  while (n < 20) {
    const clash = await db
      .select({ id: blogPosts.id })
      .from(blogPosts)
      .where(eq(blogPosts.slug, slug))
      .limit(1);
    if (!clash.length) break;
    n += 1;
    slug = `${base}-${n}`;
  }

  const [row] = await db
    .insert(blogPosts)
    .values({
      title: d.title,
      slug,
      excerpt: d.excerpt ?? null,
      content: d.content,
      coverImage: imgs[0] ?? null,
      images: imgs,
      published: d.published ?? false,
    })
    .returning();

  return NextResponse.json(row, { status: 201 });
}
