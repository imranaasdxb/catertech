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

const CATEGORY_COLORS: Record<string, string> = {
  Industry: "bg-sand/10 text-sand",
  Corporate: "bg-navy/10 text-navy",
  Wedding: "bg-rose-50 text-rose-600",
};

export default function BlogPreview() {
  return (
    <section className="bg-offwhite py-24">
      <Container>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <SectionHeader
            eyebrow="From Our Blog"
            title="Stories & Insights"
            subtitle="Industry news, event guides, and Catertech updates."
          />
          <Link
            href="/blog"
            className="text-sand text-sm font-medium tracking-wider hover:text-sand-dark transition-colors shrink-0 flex items-center gap-2"
          >
            View All Stories →
          </Link>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {POSTS.map((post, i) => (
            <Link
              key={i}
              href={`/blog/${post.slug}`}
              className="group bg-white border border-border hover:border-sand/30 hover:shadow-md transition-all duration-300 block"
            >
              {/* Image placeholder */}
              <div className="aspect-[16/9] bg-cream  overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#D4B483" strokeWidth="1">
                    <rect x="3" y="3" width="18" height="18" rx="1" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
                <span
                  className={`absolute top-3 left-3 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 ${
                    CATEGORY_COLORS[post.category] || "bg-border text-muted"
                  }`}
                >
                  {post.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-3 text-[10px] text-muted tracking-wider uppercase mb-3">
                  <span>{post.date}</span>
                  <span>·</span>
                  <span>{post.readTime}</span>
                </div>
                <h4 className="text-charcoal text-base font-serif leading-snug mb-3 group-hover:text-sand transition-colors line-clamp-2">
                  {post.title}
                </h4>
                <p className="text-muted text-sm leading-relaxed line-clamp-3 mb-4">
                  {post.excerpt}
                </p>
                <span className="text-sand text-xs font-semibold tracking-wider uppercase flex items-center gap-1.5 group-hover:gap-3 transition-all">
                  Read Story
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
