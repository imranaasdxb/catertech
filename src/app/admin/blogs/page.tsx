import { desc } from "drizzle-orm";
import Link from "next/link";
import AdminBlogsTable from "@/components/admin/AdminBlogsTable";
import { ADMIN_PURPLE, admin } from "@/components/admin/adminTheme";
import { getDb } from "@/db";
import { blogPosts } from "@/db/schema";

export const dynamic = "force-dynamic";

export default async function AdminBlogsPage() {
  const db = getDb();
  if (!db) {
    return <p className={`${admin.page} ${admin.muted}`}>Configure DATABASE_URL.</p>;
  }

  const raw = await db
    .select({
      id: blogPosts.id,
      title: blogPosts.title,
      slug: blogPosts.slug,
      excerpt: blogPosts.excerpt,
      content: blogPosts.content,
      published: blogPosts.published,
      coverImage: blogPosts.coverImage,
      images: blogPosts.images,
    })
    .from(blogPosts)
    .orderBy(desc(blogPosts.updatedAt));

  const rows = raw.map((r) => ({
    id: r.id,
    title: r.title,
    slug: r.slug,
    excerptSnippet: clipExcerpt(
      (r.excerpt?.trim() ? r.excerpt.trim() : null) ?? plainTextPreview(r.content ?? "")
    ),
    published: r.published,
    thumbUrl: r.coverImage ?? r.images?.[0] ?? null,
  }));

  return (
    <div className={admin.page}>
      <div className={admin.headerRow}>
        <div className={admin.headerLead}>
          <h1 className={admin.h1}>Blog</h1>
          <p className={`${admin.muted} mt-1`}>Create and publish posts for your site.</p>
        </div>
        <Link
          href="/admin/blogs/new"
          className={`${admin.primaryBtn} shrink-0 justify-center`}
          style={{ backgroundColor: ADMIN_PURPLE }}
        >
          New post
        </Link>
      </div>
      <AdminBlogsTable rows={rows} />
    </div>
  );
}

function plainTextPreview(html: string, maxScan = 2000): string | null {
  const t = html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxScan)
    .trim();
  return t.length ? t : null;
}

function clipExcerpt(s: string | null, maxChars = 80): string | null {
  if (!s) return null;
  const t = s.replace(/\s+/g, " ").trim();
  if (!t.length) return null;
  if (t.length <= maxChars) return t;
  return `${t.slice(0, maxChars).trim()}…`;
}
