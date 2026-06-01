import Link from "next/link";
import Container from "@/components/Container";
import SectionHeader from "@/components/ui/SectionHeader";

const POSTS = [
  {
    slug: "top-catering-equipment-trends-2025",
    category: "Industry",
    date: "12 Apr 2025",
    title: "Top Catering Equipment Trends Shaping UAE Events in 2025",
    excerpt:
      "From sustainable serving ware to smart kitchen appliances, discover what's changing in UAE's catering and hospitality space.",
    readTime: "5 min read",
  },
  {
    slug: "how-to-plan-a-corporate-event-dubai",
    category: "Corporate",
    date: "02 Mar 2025",
    title: "How to Plan a Flawless Corporate Event in Dubai",
    excerpt:
      "A practical guide to venue selection, equipment rental, and coordination for corporate events at Dubai's leading business venues.",
    readTime: "7 min read",
  },
  {
    slug: "wedding-equipment-rental-guide-uae",
    category: "Wedding",
    date: "18 Jan 2025",
    title: "The Complete Wedding Equipment Rental Guide for UAE Couples",
    excerpt:
      "Tables, chairs, linen, chafing dishes — everything you need to know about renting wedding equipment in Dubai and Abu Dhabi.",
    readTime: "6 min read",
  },
];

export default function BlogPreview() {
  return (
    <section className="bg-white py-24">
      <Container>
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeader
            eyebrow="From Our Blog"
            title="Stories & Insights"
            subtitle="Industry news, event guides, and Catertech updates."
          />
          <Link
            href="/blog"
            className="flex shrink-0 items-center gap-2 text-sm font-medium tracking-wider text-ink/70 transition-colors hover:text-ink"
          >
            View All Stories →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {POSTS.map((post, i) => (
            <Link
              key={i}
              href={`/blog/${post.slug}`}
              className="group block rounded-2xl border border-border/60 bg-surface-card transition-all duration-300 hover:-translate-y-0.5 hover:border-border hover:bg-white hover:shadow-md"
            >
              <div className="relative aspect-[16/9] overflow-hidden rounded-t-2xl bg-surface-container">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#6b6860" strokeWidth="1">
                    <rect x="3" y="3" width="18" height="18" rx="1" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
                <span className="absolute left-3 top-3 bg-surface-container px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink">
                  {post.category}
                </span>
              </div>

              <div className="p-6">
                <div className="mb-3 flex items-center gap-3 text-[11px] text-muted">
                  <span>{post.date}</span>
                  <span>·</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="font-display mb-3 text-lg leading-snug text-ink transition-colors group-hover:text-ink">
                  {post.title}
                </h3>
                <p className="line-clamp-2 text-sm leading-relaxed text-body-muted">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
