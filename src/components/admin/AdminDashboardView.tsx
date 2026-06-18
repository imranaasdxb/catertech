import Link from "next/link";
import { AdminLeadStatsChart } from "./AdminLeadStatsChart";
import { AdminWidgetCard } from "./AdminWidgetCard";
import { adminCard } from "./adminTheme";

export type DashboardMetrics = {
  productCount: number;
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

const CARD_SUBTITLES: Record<string, string> = {
  Products: "Live in catalogue",
  "Contact messages": "Total inbox threads",
  "New contacts": "Awaiting review",
  "Quick enquiries": "Submitted enquiries",
  "Events RFQ enquiry": "Event RFQ requests",
  "Cart quotations": "Quote submissions",
  "New quotes": "Pending quotations",
};

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
    messageCount,
    enquiryCount,
    rfqCount,
    quoteCount,
    newContacts,
    newQuotes,
  } = m;

  const cards = [
    { label: "Products", value: productCount, href: "/admin/products" },
    { label: "Contact messages", value: messageCount, href: "/admin/contacts" },
    { label: "New contacts", value: newContacts, href: "/admin/contacts" },
    { label: "Quick enquiries", value: enquiryCount, href: "/admin/enquiries" },
    { label: "Events RFQ enquiry", value: rfqCount, href: "/admin/rfq" },
    { label: "Cart quotations", value: quoteCount, href: "/admin/quotations" },
    { label: "New quotes", value: newQuotes, href: "/admin/quotations" },
  ];

  const leadTotal = enquiryCount + rfqCount + quoteCount + newContacts + newQuotes;
  const catalogScore = pct(productCount, productCount + Math.max(1, leadTotal));
  const contactsScore = pct(messageCount, messageCount + Math.max(1, leadTotal));
  const pipelineScore = pct(enquiryCount + rfqCount, Math.max(1, leadTotal));

  const productsSeries = buildTrend(productCount);
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
  ].filter(Boolean) as { title: string; sub: string; href: string }[];

  const quickLinks = [
    {
      title: "Products",
      meta: `${formatNum(productCount)} items`,
      excerpt: "Manage catalogue, pricing, and availability.",
      href: "/admin/products",
      tag: "CATALOGUE",
      tag2: "ADMIN",
      swatch: "#fdeadf",
      letter: "P",
    },
    {
      title: "Quotations",
      meta: `${formatNum(quoteCount)} quotes`,
      excerpt: "Review carts sent for formal pricing.",
      href: "/admin/quotations",
      tag: "SALES",
      tag2: "BASKET",
      swatch: "#eceaec",
      letter: "Q",
    },
  ];

  const modules = [
    { name: "Products", meta: `${formatNum(productCount)} SKUs`, href: "/admin/products", color: "#f87941" },
    { name: "Contacts", meta: `${formatNum(messageCount)} threads`, href: "/admin/contacts", color: "#ec6326" },
    {
      name: "Events RFQ enquiry",
      meta: `${formatNum(rfqCount)} RFQs`,
      href: "/admin/rfq",
      color: "#2f3035",
    },
  ];

  return (
    <div className="space-y-8 font-sans">
      <div>
        <h2 className="text-2xl md:text-[28px] font-bold text-admin-ink tracking-tight">Overview</h2>
        <p className="text-sm text-admin-ink/50 mt-2 max-w-2xl leading-relaxed">
          Snapshot counts from your database. Use the sidebar to manage catalogue, content, and leads.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 md:gap-5">
        {cards.map((c, i) => (
          <AdminWidgetCard
            key={c.label}
            title={c.label}
            value={formatNum(c.value)}
            subtitle={CARD_SUBTITLES[c.label]}
            href={c.href}
            icon={<StatIcon kind={i % 4} />}
            variant={i}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
        <section
          className={`lg:col-span-4 p-6 md:p-8 flex flex-col items-center text-center ${adminCard}`}
        >
          <div className="relative w-36 h-36 mb-6">
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 120 120" aria-hidden>
              <circle cx="60" cy="60" r="54" fill="none" stroke="#fdeadf" strokeWidth="10" />
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="#f87941"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${0.72 * 2 * Math.PI * 54} ${2 * Math.PI * 54}`}
              />
            </svg>
            <span
              className="absolute inset-0 m-auto flex h-[88px] w-[88px] items-center justify-center rounded-full text-white text-lg font-bold"
              style={{
                background: "linear-gradient(145deg, #f87941, #f9b095)",
                boxShadow: "0px 10px 25px rgba(248, 121, 65, 0.35)",
              }}
            >
              CT
            </span>
          </div>
          <h3 className="text-lg font-bold text-admin-ink">CaterTech admin</h3>
          <p className="text-sm text-admin-ink/45 mt-1">Operations &amp; catalogue</p>

          <div className="mt-8 w-full flex flex-wrap justify-center gap-6">
            <SkillRing label="Catalogue" value={catalogScore} color="#f87941" />
            <SkillRing label="Contacts" value={contactsScore} color="#f9b095" />
            <SkillRing label="Pipeline" value={pipelineScore} color="#2f3035" />
          </div>
        </section>

        <div className="lg:col-span-8 min-h-0">
          <AdminLeadStatsChart
            products={productsSeries}
            leads={leadsSeries}
            labels={WEEK_LABELS}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <section
          className={`lg:col-span-5 p-6 md:p-8 flex flex-col ${adminCard}`}
        >
          <h3 className="text-lg font-bold text-admin-ink mb-6">Recent focus</h3>
          <ul className="space-y-4 flex-1">
            {activities.map((a) => (
              <li key={a.title}>
                <Link
                  href={a.href}
                  className="flex gap-3 rounded-2xl p-3 -mx-3 hover:bg-admin-bg transition-colors"
                >
                  <span
                    className="mt-1 h-9 w-9 shrink-0 rounded-xl flex items-center justify-center text-white"
                    style={{ background: "#f87941" }}
                  >
                    <ChevronDotIcon />
                  </span>
                  <span className="min-w-0 text-left">
                    <span className="block text-sm font-semibold text-admin-ink leading-snug">{a.title}</span>
                    <span className="block text-xs text-admin-ink/45 mt-1">{a.sub}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex justify-center mt-6">
            <Link
              href="/admin/contacts"
              className="h-11 w-11 rounded-full border border-black/[0.08] flex items-center justify-center text-admin-accent hover:bg-admin-bg transition-colors"
              aria-label="Go to contacts"
            >
              <DownChevronIcon />
            </Link>
          </div>
        </section>

        <section className="lg:col-span-7 space-y-5">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-admin-ink">Quick access</h3>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1">
            {quickLinks.map((job) => (
              <Link
                key={job.title}
                href={job.href}
                className={`min-w-[260px] max-w-[280px] shrink-0 p-5 flex flex-col gap-3 ${adminCard} hover:-translate-y-0.5`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className="h-12 w-12 rounded-2xl flex items-center justify-center text-sm font-bold text-admin-ink"
                    style={{ background: job.swatch }}
                  >
                    {job.letter}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-bold text-admin-ink leading-tight">{job.title}</span>
                    <span className="block text-xs font-semibold text-admin-ink/45 mt-1">{job.meta}</span>
                  </span>
                </div>
                <p className="text-xs text-admin-ink/50 leading-relaxed line-clamp-3">{job.excerpt}</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="rounded-full bg-admin-bg px-3 py-1 text-[10px] font-bold tracking-wide text-admin-ink/55">
                    {job.tag}
                  </span>
                  <span className="rounded-full bg-admin-bg px-3 py-1 text-[10px] font-bold tracking-wide text-admin-ink/55">
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
          <h3 className="text-lg font-bold text-admin-ink">Modules</h3>
          <Link
            href="/admin/products"
            className="text-xs font-bold uppercase tracking-wide"
            style={{ color: "#f87941" }}
          >
            View more
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {modules.map((mod) => (
            <Link
              key={mod.name}
              href={mod.href}
              className={`p-4 flex items-center gap-3 ${adminCard} hover:-translate-y-0.5`}
            >
              <span
                className="h-11 w-11 rounded-xl shrink-0 flex items-center justify-center text-white text-sm font-bold"
                style={{ background: mod.color }}
              >
                {mod.name.slice(0, 1)}
              </span>
              <span className="min-w-0">
                <span className="block font-bold text-admin-ink text-sm truncate">{mod.name}</span>
                <span className="block text-xs text-admin-ink/45 truncate">{mod.meta}</span>
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
        <circle cx="28" cy="28" r={r} fill="none" stroke="#eceaec" strokeWidth="6" />
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
      <span className="text-[10px] font-semibold text-admin-ink/45 text-center leading-tight">
        {label}
        <span className="block text-admin-ink mt-0.5">{value}%</span>
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
