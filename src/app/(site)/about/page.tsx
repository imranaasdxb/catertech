import Container from "@/components/Container";
import { ArrowRight, Award, Building2, CheckCircle2, Clock3, Handshake, Languages, PackageCheck, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";

const values = [
  {
    icon: ShieldCheck,
    title: "Reliability",
    desc: "20 years of consistent product quality and dependable delivery for demanding UAE events.",
    tone: "bg-[#fef9c3]",
  },
  {
    icon: PackageCheck,
    title: "Range",
    desc: "Catering, kitchen, and event equipment supplied from one coordinated source.",
    tone: "bg-[#dbeafe]",
  },
  {
    icon: Handshake,
    title: "Service",
    desc: "Dedicated account support, responsive communication, and practical terms for corporate clients.",
    tone: "bg-accent-soft",
  },
];

const reasons = [
  { icon: Clock3, title: "20+ Years Experience", desc: "Deep understanding of UAE hospitality, catering, and event requirements." },
  { icon: PackageCheck, title: "Full-Range Supply", desc: "Catering, kitchen, and event equipment from one trusted supplier." },
  { icon: Truck, title: "Same-Day Delivery", desc: "Emergency and same-day support available across Dubai and RAK." },
  { icon: Building2, title: "Volume Pricing", desc: "Competitive rates for trade accounts and bulk corporate orders." },
  { icon: Languages, title: "Arabic & English", desc: "Bilingual service for smooth communication with every stakeholder." },
  { icon: Award, title: "After-Sales Support", desc: "Replacement guidance, warranty handling, and maintenance referrals." },
];

function AboutGraphic() {
  return (
    <div className="relative mx-auto w-full max-w-[440px]" aria-hidden>
      <div className="absolute -left-8 top-10 h-24 w-24 rounded-full bg-accent-soft/80 blur-2xl" />
      <div className="absolute -right-8 bottom-4 h-32 w-32 rounded-full bg-primary-soft blur-2xl" />
      <svg
        viewBox="0 0 440 350"
        className="relative h-auto w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="68" y="72" width="238" height="196" rx="34" fill="#F8F7F7" stroke="#E5E1DA" />
        <rect x="98" y="110" width="90" height="16" rx="8" fill="#322B81" opacity=".16" />
        <rect x="98" y="148" width="168" height="12" rx="6" fill="#D8D4CC" />
        <rect x="98" y="176" width="142" height="12" rx="6" fill="#D8D4CC" />
        <rect x="98" y="204" width="158" height="12" rx="6" fill="#D8D4CC" />
        <path d="M122 246h112" stroke="#322B81" strokeWidth="12" strokeLinecap="round" opacity=".12" />
        <path d="M122 246h58" stroke="#C21722" strokeWidth="12" strokeLinecap="round" />

        <g>
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0;0 -9;0 0"
            dur="4.7s"
            repeatCount="indefinite"
          />
          <rect x="256" y="42" width="106" height="86" rx="25" fill="#FFFFFF" stroke="#E5E1DA" />
          <path d="M286 82h48M286 101h34" stroke="#C21722" strokeWidth="8" strokeLinecap="round" />
          <circle cx="284" cy="64" r="9" fill="#FDE8E9" />
          <path d="m280 64 3 3 7-8" stroke="#C21722" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        <g>
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0;8 0;0 0"
            dur="5.4s"
            repeatCount="indefinite"
          />
          <rect x="236" y="218" width="134" height="82" rx="26" fill="#FFFFFF" stroke="#E5E1DA" />
          <path d="M266 258h78" stroke="#322B81" strokeWidth="10" strokeLinecap="round" opacity=".16" />
          <path d="M266 278h54" stroke="#322B81" strokeWidth="10" strokeLinecap="round" opacity=".16" />
          <path d="M262 242h24l8 12h34l8-12h24" stroke="#C21722" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        <g opacity=".9">
          <circle cx="72" cy="58" r="7" fill="#C21722">
            <animate attributeName="opacity" values=".25;1;.25" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="386" cy="168" r="6" fill="#322B81">
            <animate attributeName="opacity" values="1;.25;1" dur="3.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="48" cy="290" r="5" fill="#322B81" opacity=".3" />
        </g>
      </svg>
    </div>
  );
}

export default function AboutPage() {
  return (
    <section className="relative overflow-hidden bg-white pt-32 pb-20 md:pt-40 md:pb-28">
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full opacity-70 md:h-[540px] md:w-[540px]"
        style={{
          background:
            "radial-gradient(circle, rgba(180, 120, 220, 0.40) 0%, rgba(240, 225, 255, 0.18) 45%, transparent 70%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-28 top-[36rem] h-[360px] w-[360px] rounded-full opacity-60"
        style={{
          background:
            "radial-gradient(circle, rgba(180, 120, 220, 0.40) 0%, rgba(240, 225, 255, 0.18) 45%, transparent 70%)",
        }}
        aria-hidden
      />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 xl:gap-12">
          <div className="max-w-2xl">
            <h1 className="text-[2.35rem] font-bold leading-[1.08] tracking-[-0.03em] text-ink sm:text-[2.75rem] lg:text-[3.1rem]">
              <span className="block font-sans">Dubai equipment partner</span>
              <span
                className="mt-1 block font-normal italic text-ink"
                style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}
              >
                since 2005
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-body-muted md:text-lg">
              Catertech supports the UAE hospitality and events industry with reliable
              catering, kitchen, and event equipment for corporate clients.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                { label: "Founded in Dubai", value: "2005" },
                { label: "Corporate clients", value: "500+" },
                { label: "UAE coverage", value: "Dubai & RAK" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl border border-border/70 bg-white/80 px-4 py-4 shadow-sm">
                  <p className="text-2xl font-bold tracking-tight text-ink">{stat.value}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-body-muted">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/about/journey"
                className="btn-brand min-h-11 rounded-xl px-6 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.14em]"
              >
                <span className="btn-brand__content gap-2">
                  Our Journey
                  <span className="btn-brand__arrow h-8 w-8" aria-hidden>
                    <ArrowRight className="size-4" strokeWidth={2} />
                  </span>
                </span>
              </Link>
              <Link
                href="/contact"
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#e5e7eb] bg-white px-6 py-2.5 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:border-primary hover:text-primary"
              >
                Get in Touch
              </Link>
            </div>
          </div>

          <AboutGraphic />
        </div>

        <div className="mt-16 grid grid-cols-1 gap-5 lg:mt-20 lg:grid-cols-3">
          {values.map(({ icon: Icon, title, desc, tone }) => (
            <div
              key={title}
              className="rounded-2xl border border-[#e5e7eb] bg-white p-7 shadow-[0_18px_60px_rgba(20,19,31,0.06)] sm:p-8"
            >
              <span className={`flex h-14 w-14 items-center justify-center rounded-full ${tone}`}>
                <Icon className="h-6 w-6 text-ink" strokeWidth={1.75} aria-hidden />
              </span>
              <h2 className="mt-6 text-2xl font-bold tracking-tight text-ink">{title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-body-muted">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Why Catertech</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-ink md:text-4xl lg:text-[2.75rem] lg:leading-[1.12]">
              Six reasons clients choose us
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-body-muted">
              We combine practical product knowledge, responsive coordination, and
              supply coverage built for the pace of UAE hospitality.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {reasons.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-[0_14px_45px_rgba(20,19,31,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_20px_55px_rgba(20,19,31,0.09)]"
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                    <Icon className="h-5 w-5" strokeWidth={1.85} aria-hidden />
                  </span>
                  <div>
                    <h3 className="text-base font-bold tracking-tight text-ink">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-body-muted">{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 rounded-2xl border border-[#e5e7eb] bg-white p-7 shadow-[0_18px_60px_rgba(20,19,31,0.06)] sm:p-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent-soft">
                <CheckCircle2 className="h-6 w-6 text-accent" strokeWidth={1.9} aria-hidden />
              </span>
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-ink">Ready to work with Catertech?</h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-body-muted">
                  Talk to our team about equipment supply, event needs, or trade account
                  support across the UAE.
                </p>
              </div>
            </div>
            <Link
              href="/trade"
              className="btn-brand min-h-11 rounded-xl px-6 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.14em]"
            >
              <span className="btn-brand__content gap-2">
                Trade Accounts
                <span className="btn-brand__arrow h-8 w-8" aria-hidden>
                  <ArrowRight className="size-4" strokeWidth={2} />
                </span>
              </span>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
