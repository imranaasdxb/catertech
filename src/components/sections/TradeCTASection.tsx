import Link from "next/link";
import Container from "@/components/Container";
import SectionHeader from "@/components/ui/SectionHeader";

const PERKS = [
  { value: "4 hrs", label: "Enquiry response time" },
  { value: "All UAE", label: "Delivery coverage" },
  { value: "No minimum", label: "Order requirement" },
  { value: "Flexible", label: "Payment terms for trade" },
];

const INDUSTRIES = [
  "Hotels",
  "Event Companies",
  "Restaurants",
  "Government",
  "Catering Firms",
  "Hospitals",
];

const EMIRATES = ["Dubai", "Abu Dhabi", "Sharjah", "RAK", "Fujairah", "Ajman", "UAQ"];

export default function TradeCTASection() {
  return (
    <section className="relative overflow-hidden bg-white py-24">
      <Container>
        <div className="mb-14 flex flex-col gap-6 border-b border-border/70 pb-10 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            eyebrow="For Business"
            title="Trade & Corporate"
            subtitle="Volume pricing, dedicated account support and formal quotes for hospitality procurement teams."
          />
          <span className="hidden text-[10px] font-mono uppercase tracking-[0.2em] text-muted md:block">
            Est.&nbsp;2005&nbsp;·&nbsp;Dubai,&nbsp;UAE
          </span>
        </div>

        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div className="flex flex-col">
            <h2 className="font-display mb-7 text-4xl leading-[1.07] text-ink md:text-5xl lg:text-[3rem]">
              Supplying hotels, venues &amp; F&amp;B brands across UAE.
            </h2>

            <p className="mb-10 max-w-sm text-[0.9375rem] leading-relaxed text-body-muted">
              Trade and corporate accounts receive access to our full catalogue, volume pricing and a
              dedicated account manager. Submit an enquiry or request a formal quote for your project.
            </p>

            <div className="mb-12 flex flex-wrap gap-3">
              <Link
                href="/trade/enquiry"
                className="brand-gradient-bg inline-flex items-center gap-2.5 px-7 py-4 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-95"
              >
                Submit an Enquiry
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/trade/rfq"
                className="inline-flex items-center gap-2.5 rounded-xl border border-border bg-surface-card px-7 py-4 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-white"
              >
                Request Full Quote
              </Link>
            </div>

            <div className="mt-auto border-t border-border/70 pt-8">
              <p className="mb-3 text-[9px] uppercase tracking-[0.22em] text-muted">Sectors we serve</p>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {INDUSTRIES.map((ind) => (
                  <span key={ind} className="cursor-default text-[11px] tracking-wide text-body-muted">
                    {ind}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              {PERKS.map((p, i) => (
                <div
                  key={i}
                  className="card-hover-glow group rounded-2xl border border-border/60 bg-surface-card px-5 pb-6 pt-5 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_16px_40px_-28px_rgba(20,19,31,0.18)]"
                >
                  <span className="mb-3 block font-mono text-[9px] tracking-widest text-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="font-display mb-3 text-[2rem] font-bold leading-none tracking-tight text-ink md:text-[2.2rem]">
                    {p.value}
                  </div>
                  <div className="mb-2.5 h-px w-5 bg-border transition-all duration-300 group-hover:w-8" />
                  <p className="text-[0.75rem] leading-snug text-body-muted">{p.label}</p>
                </div>
              ))}
            </div>

            <div className="overflow-hidden rounded-2xl border border-border/60 bg-surface-card">
              <div className="flex items-center gap-3 border-b border-border/60 px-5 py-3.5">
                <div className="size-1.5 rounded-full bg-ink/40" />
                <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-muted">
                  Delivery Coverage
                </span>
                <div className="h-px flex-1 bg-border/60" />
                <span className="font-mono text-[10px] tracking-wider text-ink/70">All UAE</span>
              </div>
              <div className="grid grid-cols-4 gap-px bg-border/40 p-px">
                {EMIRATES.map((em) => (
                  <div
                    key={em}
                    className="flex items-center justify-center bg-surface-card py-3 transition-colors hover:bg-white"
                  >
                    <span className="text-[10px] font-medium uppercase tracking-widest text-body-muted">
                      {em}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
