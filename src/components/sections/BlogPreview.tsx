import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container";

const POSTS = [
  {
    slug: "top-catering-equipment-trends-2025",
    category: "Industry",
    date: "April 12, 2025",
    title: "Top Catering Equipment Trends Shaping UAE Events in 2025",
    image:
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=900&h=560&fit=crop&q=80",
    imageAlt: "Professional chef preparing food in a commercial kitchen",
  },
  {
    slug: "how-to-plan-a-corporate-event-dubai",
    category: "Corporate",
    date: "March 02, 2025",
    title: "How to Plan a Flawless Corporate Event in Dubai",
    image:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=900&h=560&fit=crop&q=80",
    imageAlt: "Corporate conference and event setup",
  },
  {
    slug: "wedding-equipment-rental-guide-uae",
    category: "Wedding",
    date: "January 18, 2025",
    title: "The Complete Wedding Equipment Rental Guide for UAE Couples",
    image:
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=900&h=560&fit=crop&q=80",
    imageAlt: "Elegant wedding reception table setting",
  },
];

export default function BlogPreview() {
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
          {POSTS.map((post) => (
            <article key={post.slug}>
              <Link href={`/blog/${post.slug}`} className="group block">
                <div className="relative mb-4 aspect-[16/10] overflow-hidden rounded-2xl bg-[#f3f4f6]">
                  <Image
                    src={post.image}
                    alt={post.imageAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <span className="absolute left-4 top-4 rounded-sm bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-[#0a0a0a]">
                    {post.category}
                  </span>
                </div>

                <time
                  dateTime={post.date}
                  className="mb-3 block text-sm text-[#9ca3af]"
                >
                  {post.date}
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
