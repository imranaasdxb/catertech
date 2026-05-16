import Link from "next/link";
import { AdminLeadStatsChart } from "./AdminLeadStatsChart";

export type DashboardMetrics = {
  productCount: number;
  blogCount: number;
  messageCount: number;
  enquiryCount: number;
  rfqCount: number;
  quoteCount: number;
  newContacts: number;
  newQuotes: number;
};

function buildTrend(end: number, points = 10): number[] {
  const e = Math.max(0, end);
  const start = Math.max(0, Math.round(e * 0.42));
  return Array.from({ length: points }, (_, i) => {
    const t = points <= 1 ? 1 : i / (points - 1);
    return Math.round(start + (e - start) * t);
  });
}

const ACCENTS = [
  { tile: "#EDE8F7", ink: "#5B2D9B" },
  { tile: "#E8F1FF", ink: "#2563EB" },
  { tile: "#E6F7ED", ink: "#16A34A" },
  { tile: "#E6F7F4", ink: "#0D9488" },
] as const;

const WEEK_LABELS = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9", "W10"];

function formatNum(n: number) {
  return n.toLocaleString();
}

function pct(part: number, whole: number) {
  if (whole <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((part / whole) * 100)));
}

export function AdminDashboardView(m: DashboardMetrics) {
  const {
    productCount,
    blogCount,
    messageCount,
    enquiryCount,
    rfqCount,
    quoteCount,
    newContacts,
    newQuotes,
  } = m;

  const cards = [
    { label: "Products", value: productCount, href: "/admin/products" },
    { label: "Blog posts", value: blogCount, href: "/admin/blogs" },
    { label: "Contact messages", value: messageCount, href: "/admin/contacts" },
    { label: "New contacts", value: newContacts, href: "/admin/contacts" },
    { label: "Quick enquiries", value: enquiryCount, href: "/admin/enquiries" },
    { label: "Trade enquiries (RFQ)", value: rfqCount, href: "/admin/rfq" },
    { label: "Cart quotations", value: quoteCount, href: "/admin/quotations" },
    { label: "New quotes", value: newQuotes, href: "/admin/quotations" },
  ];

  const leadTotal = enquiryCount + rfqCount + quoteCount + newContacts + newQuotes;
  const catalogScore = pct(productCount, productCount + blogCount + Math.max(1, leadTotal));
  const contentScore = pct(blogCount, productCount + blogCount + Math.max(1, leadTotal));
  const pipelineScore = pct(enquiryCount + rfqCount, Math.max(1, leadTotal));

  const productsSeries = buildTrend(productCount);
  const blogSeries = buildTrend(blogCount);
  const leadsSeries = buildTrend(enquiryCount + rfqCount + messageCount);

  const activities = [
    newContacts > 0
      ? {
          title: `${newContacts} new contact message${newContacts === 1 ? "" : "s"} to review`,
          sub: "Contacts inbox",
          href: "/admin/contacts",
        }
      : null,
    newQuotes > 0
      ? {
          title: `${newQuotes} new quotation${newQuotes === 1 ? "" : "s"} awaiting review`,
          sub: "Quotations",
          href: "/admin/quotations",
        }
      : null,
    {
      title: `${formatNum(productCount)} products live in catalogue`,
      sub: "Products",
      href: "/admin/products",
    },
    {
      title: `${formatNum(blogCount)} blog post${blogCount === 1 ? "" : "s"} published`,
      sub: "Blog",
      href: "/admin/blogs",
    },
  ].filter(Boolean) as { title: string; sub: string; href: string }[];

  const quickLinks = [
    {
      title: "Products",
      meta: `${formatNum(productCount)} items`,
      excerpt: "Manage catalogue, pricing, and availability.",
      href: "/admin/products",
      tag: "CATALOGUE",
      tag2: "ADMIN",
      swatch: "#EDE8F7",
      letter: "P",
    },
    {
      title: "Blog",
      meta: `${formatNum(blogCount)} posts`,
      excerpt: "Publish updates, guides, and company news.",
      href: "/admin/blogs",
      tag: "CONTENT",
      tag2: "EDITORIAL",
      swatch: "#E8F1FF",
      letter: "B",
    },
    {
      title: "Quotations",
      meta: `${formatNum(quoteCount)} quotes`,
      excerpt: "Review carts sent for formal pricing.",
      href: "/admin/quotations",
      tag: "SALES",
      tag2: "BASKET",
      swatch: "#E6F7ED",
      letter: "Q",
    },
  ];

  const modules = [
    { name: "Products", meta: `${formatNum(productCount)} SKUs`, href: "/admin/products", color: "#6366F1" },
    { name: "Blog", meta: `${formatNum(blogCount)} articles`, href: "/admin/blogs", color: "#22C55E" },
    { name: "Contacts", meta: `${formatNum(messageCount)} threads`, href: "/admin/contacts", color: "#F97316" },
    {
      name: "Trade enquiries",
      meta: `${formatNum(rfqCount)} RFQs`,
      href: "/admin/rfq",
      color: "#EC4899",
    },
  ];

  return (
    <div className="space-y-8 font-sans">
      <div>
        <h2 className="text-2xl md:text-[28px] font-bold text-[#1a1a1a] tracking-tight">Overview</h2>
        <p className="text-sm text-[#1a1a1a]/50 mt-2 max-w-2xl leading-relaxed">
          Snapshot counts from your database. Use the sidebar to manage catalogue, content, and leads.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
        {cards.map((c, i) => {
          const pal = ACCENTS[i % ACCENTS.length];
          return (
            <Link
              key={c.label}
              href={c.href}
              className="group flex items-stretch gap-4 rounded-[24px] bg-white p-6 transition-transform hover:-translate-y-0.5"
              style={{ boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.05)" }}
            >
              <span
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
                style={{ background: pal.tile, color: pal.ink }}
              >
                <StatIcon kind={i % 4} />
              </span>
              <span className="flex flex-col justify-between min-w-0 flex-1">
                <span className="text-xs font-semibold text-[#1a1a1a]/45 uppercase tracking-wide">{c.label}</span>
                <span className="text-2xl md:text-3xl font-bold text-[#1a1a1a] tabular-nums leading-tight text-right">
                  {formatNum(c.value)}
                </span>
              </span>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
        <section
          className="lg:col-span-4 rounded-[24px] bg-white p-6 md:p-8 flex flex-col items-center text-center"
          style={{ boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.05)" }}
        >
          <div className="relative w-36 h-36 mb-6">
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 120 120" aria-hidden>
              <circle cx="60" cy="60" r="54" fill="none" stroke="#EDE8F7" strokeWidth="10" />
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="#5B2D9B"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${0.72 * 2 * Math.PI * 54} ${2 * Math.PI * 54}`}
              />
            </svg>
            <span
              className="absolute inset-0 m-auto flex h-[88px] w-[88px] items-center justify-center rounded-full text-white text-lg font-bold"
              style={{
                background: "linear-gradient(145deg, #5B2D9B, #7c5ce0)",
                boxShadow: "0px 10px 25px rgba(75, 38, 164, 0.35)",
              }}
            >
              CT
            </span>
          </div>
          <h3 className="text-lg font-bold text-[#1a1a1a]">CaterTech admin</h3>
          <p className="text-sm text-[#1a1a1a]/45 mt-1">Operations &amp; catalogue</p>

          <div className="mt-8 w-full flex flex-wrap justify-center gap-6">
            <SkillRing label="Catalogue" value={catalogScore} color="#F97316" />
            <SkillRing label="Content" value={contentScore} color="#22C55E" />
            <SkillRing label="Pipeline" value={pipelineScore} color="#0D9488" />
          </div>
        </section>

        <div className="lg:col-span-8 min-h-0">
          <AdminLeadStatsChart
            products={productsSeries}
            blog={blogSeries}
            leads={leadsSeries}
            labels={WEEK_LABELS}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <section
          className="lg:col-span-5 rounded-[24px] bg-white p-6 md:p-8 flex flex-col"
          style={{ boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.05)" }}
        >
          <h3 className="text-lg font-bold text-[#1a1a1a] mb-6">Recent focus</h3>
          <ul className="space-y-4 flex-1">
            {activities.map((a) => (
              <li key={a.title}>
                <Link
                  href={a.href}
                  className="flex gap-3 rounded-2xl p-3 -mx-3 hover:bg-[#F5F5F7] transition-colors"
                >
                  <span
                    className="mt-1 h-9 w-9 shrink-0 rounded-xl flex items-center justify-center text-white"
                    style={{ background: "#5B2D9B" }}
                  >
                    <ChevronDotIcon />
                  </span>
                  <span className="min-w-0 text-left">
                    <span className="block text-sm font-semibold text-[#1a1a1a] leading-snug">{a.title}</span>
                    <span className="block text-xs text-[#1a1a1a]/45 mt-1">{a.sub}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex justify-center mt-6">
            <Link
              href="/admin/contacts"
              className="h-11 w-11 rounded-full border border-black/[0.08] flex items-center justify-center text-[#5B2D9B] hover:bg-[#F5F5F7] transition-colors"
              aria-label="Go to contacts"
            >
              <DownChevronIcon />
            </Link>
          </div>
        </section>

        <section className="lg:col-span-7 space-y-5">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-[#1a1a1a]">Quick access</h3>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1">
            {quickLinks.map((job) => (
              <Link
                key={job.title}
                href={job.href}
                className="min-w-[260px] max-w-[280px] shrink-0 rounded-[24px] bg-white p-5 flex flex-col gap-3 transition-transform hover:-translate-y-0.5"
                style={{ boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.05)" }}
              >
                <div className="flex items-start gap-3">
                  <span
                    className="h-12 w-12 rounded-2xl flex items-center justify-center text-sm font-bold text-[#1a1a1a]"
                    style={{ background: job.swatch }}
                  >
                    {job.letter}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-bold text-[#1a1a1a] leading-tight">{job.title}</span>
                    <span className="block text-xs font-semibold text-[#1a1a1a]/45 mt-1">{job.meta}</span>
                  </span>
                </div>
                <p className="text-xs text-[#1a1a1a]/50 leading-relaxed line-clamp-3">{job.excerpt}</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="rounded-full bg-[#F5F5F7] px-3 py-1 text-[10px] font-bold tracking-wide text-[#1a1a1a]/55">
                    {job.tag}
                  </span>
                  <span className="rounded-full bg-[#F5F5F7] px-3 py-1 text-[10px] font-bold tracking-wide text-[#1a1a1a]/55">
                    {job.tag2}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <section>
        <div className="flex items-center justify-between gap-4 mb-5">
          <h3 className="text-lg font-bold text-[#1a1a1a]">Modules</h3>
          <Link
            href="/admin/products"
            className="text-xs font-bold uppercase tracking-wide"
            style={{ color: "#5B2D9B" }}
          >
            View more
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {modules.map((mod) => (
            <Link
              key={mod.name}
              href={mod.href}
              className="rounded-[20px] bg-white p-4 flex items-center gap-3 hover:-translate-y-0.5 transition-transform"
              style={{ boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.05)" }}
            >
              <span
                className="h-11 w-11 rounded-xl shrink-0 flex items-center justify-center text-white text-sm font-bold"
                style={{ background: mod.color }}
              >
                {mod.name.slice(0, 1)}
              </span>
              <span className="min-w-0">
                <span className="block font-bold text-[#1a1a1a] text-sm truncate">{mod.name}</span>
                <span className="block text-xs text-[#1a1a1a]/45 truncate">{mod.meta}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function SkillRing({ label, value, color }: { label: string; value: number; color: string }) {
  const r = 22;
  const c = 2 * Math.PI * r;
  const dash = (value / 100) * c;
  return (
    <div className="flex flex-col items-center gap-2 w-[72px]">
      <svg width="56" height="56" viewBox="0 0 56 56" className="-rotate-90" aria-hidden>
        <circle cx="28" cy="28" r={r} fill="none" stroke="#EFEFF4" strokeWidth="6" />
        <circle
          cx="28"
          cy="28"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
        />
      </svg>
      <span className="text-[10px] font-semibold text-[#1a1a1a]/45 text-center leading-tight">
        {label}
        <span className="block text-[#1a1a1a] mt-0.5">{value}%</span>
      </span>
    </div>
  );
}

function StatIcon({ kind }: { kind: number }) {
  if (kind === 0) {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5z" />
      </svg>
    );
  }
  if (kind === 1) {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2M15 2H9a1 1 0 00-1 1v2a1 1 0 001 1h6a1 1 0 001-1V3a1 1 0 00-1-1z" />
      </svg>
    );
  }
  if (kind === 2) {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="8.5" cy="7" r="4" />
        <path d="M20 8v6M23 11h-6" />
      </svg>
    );
  }
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <path d="M22 6l-10 7L2 6" />
    </svg>
  );
}

function ChevronDotIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M8 6h13M8 12h13M8 18h13M4 6h.01M4 12h.01M4 18h.01" strokeLinecap="round" />
    </svg>
  );
}

function DownChevronIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
