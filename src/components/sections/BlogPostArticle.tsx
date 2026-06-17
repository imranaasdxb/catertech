import Link from "next/link";
import Container from "@/components/Container";
import BlogArticleBody from "@/components/blog/BlogArticleBody";
import BlogCoverImage from "@/components/blog/BlogCoverImage";
import type { BlogPostPublic } from "@/lib/blog-posts";

type Props = {
  post: BlogPostPublic;
  related?: BlogPostPublic[];
};

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

            <div className="relative mt-10 aspect-square w-full max-w-[420px] overflow-hidden rounded-2xl bg-[#f3f4f6]">
              <BlogCoverImage
                src={post.coverImage}
                alt={post.coverImageAlt}
                fill
                priority
                sanityWidth={840}
                sanityHeight={840}
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 420px"
              />
            </div>

            {post.dateLabel ? (
              <time className="mt-6 block text-sm text-muted">{post.dateLabel}</time>
            ) : null}
          </aside>

          <div className="min-w-0 lg:pt-1">
            <BlogArticleBody excerpt={post.excerpt} content={post.content} />
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
                    <BlogCoverImage
                      src={item.coverImage}
                      alt={item.coverImageAlt}
                      fill
                      sanityWidth={640}
                      sanityHeight={400}
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
