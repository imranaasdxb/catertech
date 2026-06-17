import Link from "next/link";
import Container from "@/components/Container";
import BlogCoverImage from "@/components/blog/BlogCoverImage";
import { getLatestBlogPosts } from "@/lib/blog-posts";

export default async function BlogPreview() {
  const posts = await getLatestBlogPosts(3);

  return (
    <section className="bg-white py-16 md:py-24">
      <Container>
        <header className="mb-12 max-w-2xl md:mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-[#0a0a0a] md:text-4xl md:leading-tight">
            Read latest collection
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#6b7280] md:text-lg">
            Industry news, event guides, and CaterTech insights for hotels, caterers,
            and event teams across the UAE.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {posts.map((post) => (
            <article key={post.slug}>
              <Link href={`/blog/${post.slug}`} className="group block">
                <div className="relative mb-4 aspect-[16/10] overflow-hidden rounded-2xl bg-[#f3f4f6]">
                  <BlogCoverImage
                    src={post.coverImage}
                    alt={post.coverImageAlt}
                    fill
                    sanityWidth={800}
                    sanityHeight={500}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <span className="absolute left-4 top-4 rounded-sm bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-[#0a0a0a]">
                    {post.category}
                  </span>
                </div>

                <time
                  dateTime={post.dateLabel}
                  className="mb-3 block text-sm text-[#9ca3af]"
                >
                  {post.dateLabel}
                </time>

                <h3 className="mb-5 text-xl font-bold leading-snug text-[#0a0a0a] transition-colors group-hover:text-[#322b81]">
                  {post.title}
                </h3>

                <span className="inline-flex items-center gap-1 border-b-2 border-[#0a0a0a] pb-1 text-[11px] font-bold uppercase tracking-wide text-[#0a0a0a] transition-colors group-hover:border-[#322b81] group-hover:text-[#322b81]">
                  Continue Reading
                  <span aria-hidden className="text-sm leading-none">
                    →
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
