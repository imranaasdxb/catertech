"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Container from "@/components/Container";
import BlogCoverImage from "@/components/blog/BlogCoverImage";
import type { BlogPostPublic } from "@/lib/blog-posts";

type Props = {
  posts: BlogPostPublic[];
};

export default function BlogIndexClient({ posts }: Props) {
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(posts.map((p) => p.category)))],
    [posts]
  );
  const [active, setActive] = useState("All");

  const filtered = useMemo(
    () =>
      active === "All"
        ? posts
        : posts.filter((p) => p.category === active),
    [active, posts]
  );

  return (
    <section className="relative overflow-hidden bg-white pt-32 pb-20 md:pt-40 md:pb-28">
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full opacity-70 md:h-[520px] md:w-[520px]"
        style={{
          background:
            "radial-gradient(circle, rgba(180, 120, 220, 0.40) 0%, rgba(240, 225, 255, 0.18) 45%, transparent 70%)",
        }}
        aria-hidden
      />

      <Container className="relative z-10">
        <header className="mb-10 max-w-2xl md:mb-12">
          <h1 className="text-[2.35rem] font-bold leading-[1.08] tracking-[-0.03em] text-ink sm:text-[2.75rem] lg:text-[3.1rem]">
            <span className="block font-sans">Stories, guides &amp;</span>
            <span
              className="mt-1 block font-normal italic text-ink"
              style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}
            >
              industry insights
            </span>
          </h1>
          <p className="mt-5 text-base leading-relaxed text-body-muted md:text-lg">
            Industry news, event guides, and CaterTech insights for hotels,
            caterers, and event teams across the UAE.
          </p>
        </header>

        <div className="mb-10 flex gap-2 overflow-x-auto border-b border-[#e8e4df] pb-px md:mb-12">
          {categories.map((cat) => {
            const isActive = active === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActive(cat)}
                className={`relative shrink-0 px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] transition-colors whitespace-nowrap ${
                  isActive
                    ? "text-primary"
                    : "text-muted hover:text-primary"
                }`}
              >
                {cat}
                {isActive ? (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {filtered.map((post) => (
            <article key={post.slug}>
              <Link href={`/blog/${post.slug}`} className="group block">
                <div className="relative mb-4 aspect-16/10 overflow-hidden rounded-2xl bg-[#f3f4f6]">
                  <BlogCoverImage
                    src={post.coverImage}
                    alt={post.coverImageAlt}
                    fill
                    sanityWidth={800}
                    sanityHeight={500}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <span className="absolute left-4 top-4 rounded-sm bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-ink">
                    {post.category}
                  </span>
                </div>

                <time className="mb-3 block text-sm text-[#9ca3af]">
                  {post.dateLabel}
                </time>

                <h2 className="mb-3 line-clamp-2 text-xl font-bold leading-snug text-ink transition-colors group-hover:text-primary">
                  {post.title}
                </h2>

                <p className="mb-5 line-clamp-2 text-sm leading-relaxed text-body-muted">
                  {post.excerpt}
                </p>

                <span className="inline-flex items-center gap-1 border-b-2 border-ink pb-1 text-[11px] font-bold uppercase tracking-wide text-ink transition-colors group-hover:border-primary group-hover:text-primary">
                  Continue Reading
                  <span aria-hidden className="text-sm leading-none">
                    -&gt;
                  </span>
                </span>
              </Link>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
