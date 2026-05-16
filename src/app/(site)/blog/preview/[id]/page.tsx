import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getDb } from "@/db";
import { blogPosts } from "@/db/schema";
import { isAdminGuestAuthed } from "@/lib/admin-guest-auth";

type Props = { params: Promise<{ id: string }> };

export const metadata: Metadata = {
  title: "Blog preview | CaterTech",
  robots: { index: false, follow: false },
};

/** Draft / published preview for logged-in admin only (guest cookie). */
export default async function AdminBlogPreviewPage({ params }: Props) {
  if (!(await isAdminGuestAuthed())) notFound();

  const { id } = await params;
  const db = getDb();
  if (!db) notFound();

  const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
  if (!post) notFound();

  const cover = post.coverImage ?? post.images?.[0];

  return (
    <article className="bg-offwhite min-h-[50vh]">
      <div className="border-b border-amber-200 bg-amber-50 text-amber-950 px-5 py-3 text-center text-sm">
        Admin preview {!post.published ? "(draft — not public)" : null}
        {" · "}
        <Link href={`/admin/blogs/${post.id}`} className="font-semibold underline">
          Edit
        </Link>
      </div>
      <section className="pt-14 pb-10 md:pt-16 border-b border-border bg-navy text-white">
        <div className="max-w-3xl mx-auto px-5 md:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-sand/90 mb-4">Blog</p>
          <h1 className="font-serif text-3xl md:text-4xl leading-tight">{post.title}</h1>
          {post.excerpt ? (
            <p className="mt-4 text-white/60 text-lg leading-relaxed">{post.excerpt}</p>
          ) : null}
        </div>
      </section>
      {cover ? (
        <div className="max-w-4xl mx-auto px-5 md:px-8 -mt-8 mb-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cover}
            alt=""
            className="w-full rounded-lg border border-border shadow-md object-cover max-h-[420px]"
          />
        </div>
      ) : null}
      <div className="max-w-3xl mx-auto px-5 md:px-8 pb-20 md:pb-28">
        <div
          className="rounded-xl border border-border bg-white p-6 md:p-10 text-charcoal [&_img]:max-w-full [&_img]:h-auto [&_video]:max-w-full"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </article>
  );
}
