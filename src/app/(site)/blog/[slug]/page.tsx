import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDb } from "@/db";
import { blogPosts } from "@/db/schema";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const db = getDb();
  if (!db) return { title: "Blog | CaterTech" };
  const [post] = await db
    .select({ title: blogPosts.title })
    .from(blogPosts)
    .where(eq(blogPosts.slug, slug))
    .limit(1);
  if (!post) return { title: "Blog | CaterTech" };
  return { title: `${post.title} | CaterTech Blog` };
}

export default async function PublicBlogPostPage({ params }: Props) {
  const { slug } = await params;
  const db = getDb();
  if (!db) notFound();

  const [post] = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.slug, slug))
    .limit(1);

  if (!post || !post.published) notFound();

  const cover = post.coverImage ?? post.images?.[0];

  return (
    <article className="bg-offwhite min-h-[50vh]">
      <section className="pt-36 pb-12 md:pt-44 border-b border-border bg-navy text-white">
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
