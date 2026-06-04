import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container";
import type { BlogPostPublic } from "@/lib/blog-posts";

type Props = {
  post: BlogPostPublic;
  related?: BlogPostPublic[];
};

type ProseBlock = { type: "lead" | "bold" | "body"; text: string };

function splitBlogTitle(title: string): { lead: string; accent: string } {
  const words = title.trim().split(/\s+/);
  if (words.length <= 4) {
    return { lead: title, accent: "" };
  }
  const accentCount = Math.min(5, Math.max(2, Math.ceil(words.length * 0.38)));
  const accentWords = words.splice(words.length - accentCount);
  return {
    lead: words.join(" "),
    accent: accentWords.join(" "),
  };
}

function parseContentParagraphs(html: string): string[] {
  const matches = html.match(/<p[^>]*>([\s\S]*?)<\/p>/gi);
  if (!matches?.length) return [];

  return matches
    .map((block) =>
      block
        .replace(/<p[^>]*>|<\/p>/gi, "")
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .trim(),
    )
    .filter(Boolean);
}

function buildProseBlocks(post: BlogPostPublic): ProseBlock[] {
  const paragraphs = parseContentParagraphs(post.content);
  const blocks: ProseBlock[] = [];

  if (post.excerpt) {
    blocks.push({ type: "lead", text: post.excerpt });
  }

  paragraphs.forEach((text, index) => {
    if (post.excerpt && index === 0) {
      blocks.push({ type: "bold", text });
      return;
    }
    if (!post.excerpt && index === 0) {
      blocks.push({ type: "lead", text });
      return;
    }
    if (!post.excerpt && index === 1) {
      blocks.push({ type: "bold", text });
      return;
    }
    blocks.push({ type: "body", text });
  });

  return blocks;
}

function BlogTitle({ title }: { title: string }) {
  const { lead, accent } = splitBlogTitle(title);

  return (
    <h1 className="text-[2.35rem] font-bold leading-[1.08] tracking-[-0.03em] text-ink sm:text-[2.75rem] lg:text-[3.15rem]">
      <span className="block font-sans">{lead}</span>
      {accent ? (
        <span
          className="mt-1 block font-normal italic text-ink"
          style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}
        >
          {accent}
        </span>
      ) : null}
    </h1>
  );
}

export default function BlogPostArticle({ post, related = [] }: Props) {
  const proseBlocks = buildProseBlocks(post);
  const useRichHtml = proseBlocks.length === 0;

  return (
    <article className="bg-white">
      <Container className="pb-16 pt-32 md:pb-24 md:pt-40">
        <nav
          className="mb-10 flex flex-wrap items-center gap-2 text-sm text-body-muted md:mb-14"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="transition-colors hover:text-primary">
            Home
          </Link>
          <span aria-hidden className="text-border">
            /
          </span>
          <Link href="/blog" className="transition-colors hover:text-primary">
            Blog
          </Link>
          <span aria-hidden className="text-border">
            /
          </span>
          <span className="line-clamp-1 text-ink">{post.title}</span>
        </nav>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 xl:gap-24">
          <aside className="lg:max-w-[520px]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c49a6c]">
              {post.category}
            </p>

            <div className="mt-5">
              <BlogTitle title={post.title} />
            </div>

            <div className="relative mt-10 aspect-square w-full max-w-[420px] overflow-hidden bg-[#f3f4f6]">
              <Image
                src={post.coverImage}
                alt={post.coverImageAlt}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 420px"
              />
            </div>

            {post.dateLabel ? (
              <time className="mt-6 block text-sm text-muted">{post.dateLabel}</time>
            ) : null}
          </aside>

          <div className="min-w-0 lg:pt-1">
            {useRichHtml ? (
              <div
                className="blog-prose text-[#3d3d45] [&_a]:text-primary [&_a]:underline [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-ink [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-semibold [&_img]:my-8 [&_img]:max-w-full [&_img]:rounded-lg [&_li]:mb-2 [&_ol]:my-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-6 [&_p]:text-[17px] [&_p]:leading-[1.8] [&_ul]:my-6 [&_ul]:list-disc [&_ul]:pl-6"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            ) : (
              <div className="space-y-6 md:space-y-7">
                {proseBlocks.map((block, index) => (
                  <p
                    key={`${block.type}-${index}`}
                    className={
                      block.type === "lead"
                        ? "text-[1.2rem] font-medium leading-[1.75] text-[#2a2a32] md:text-[1.35rem] md:leading-[1.72]"
                        : block.type === "bold"
                          ? "text-[17px] font-bold leading-[1.75] text-ink"
                          : "text-[17px] leading-[1.85] text-[#3d3d45]"
                    }
                  >
                    {block.text}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-6 border-t border-border pt-8 md:mt-24">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-ink transition-colors hover:text-primary"
          >
            <span aria-hidden>←</span>
            Back to all articles
          </Link>
          <Link
            href="/contact"
            className="text-sm font-semibold text-primary underline-offset-4 transition-colors hover:text-accent hover:underline"
          >
            Talk to our team
          </Link>
        </div>
      </Container>

      {related.length > 0 ? (
        <section className="border-t border-border bg-[#faf9f7] py-14 md:py-16">
          <Container>
            <h2 className="text-2xl font-bold tracking-tight text-ink md:text-3xl">
              More to read
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/blog/${item.slug}`}
                  className="group block overflow-hidden rounded-2xl border border-border bg-white transition-shadow hover:shadow-[0_10px_30px_rgba(15,15,15,0.08)]"
                >
                  <div className="relative aspect-16/10 overflow-hidden bg-[#f3f4f6]">
                    <Image
                      src={item.coverImage}
                      alt={item.coverImageAlt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted">
                      {item.dateLabel}
                    </p>
                    <h3 className="mt-2 line-clamp-2 text-lg font-bold leading-snug text-ink group-hover:text-primary">
                      {item.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      ) : null}
    </article>
  );
}
