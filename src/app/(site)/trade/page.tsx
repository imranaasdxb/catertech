import Container from "@/components/Container";
import { ArrowRight, Building2, ClipboardList, MessageSquareText, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";

const industries = [
  "Hotels & Resorts",
  "Event Companies",
  "Restaurants & Cafes",
  "Government & Municipality",
  "Hospitals & Healthcare",
  "Catering Companies",
  "Wedding Planners",
  "Corporate Offices",
];

const tradeBenefits = [
  { icon: ShieldCheck, label: "Verified trade support" },
  { icon: Truck, label: "UAE-wide fulfilment" },
  { icon: ClipboardList, label: "Structured quotations" },
];

function TradeGraphic() {
  return (
    <div className="relative mx-auto w-full max-w-[430px]" aria-hidden>
      <div className="absolute -left-6 top-8 h-20 w-20 rounded-full bg-accent-soft/80 blur-2xl" />
      <div className="absolute -right-8 bottom-4 h-28 w-28 rounded-full bg-primary-soft blur-2xl" />
      <svg
        viewBox="0 0 420 340"
        className="relative h-auto w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="54" y="78" width="270" height="184" rx="30" fill="#F8F7F7" stroke="#E5E1DA" />
        <rect x="86" y="111" width="138" height="18" rx="9" fill="#322B81" opacity=".14" />
        <rect x="86" y="146" width="200" height="12" rx="6" fill="#D8D4CC" />
        <rect x="86" y="172" width="170" height="12" rx="6" fill="#D8D4CC" />
        <rect x="86" y="198" width="190" height="12" rx="6" fill="#D8D4CC" />
        <rect x="86" y="226" width="96" height="28" rx="14" fill="#322B81" />
        <path d="M108 240h42" stroke="white" strokeWidth="4" strokeLinecap="round" />

        <g>
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0; 0 -9; 0 0"
            dur="4.8s"
            repeatCount="indefinite"
          />
          <rect x="250" y="42" width="96" height="82" rx="22" fill="#FFFFFF" stroke="#E5E1DA" />
          <path d="M277 83h42M277 101h30" stroke="#C21722" strokeWidth="8" strokeLinecap="round" />
          <circle cx="273" cy="63" r="9" fill="#FDE8E9" />
          <path d="m269 63 3 3 6-7" stroke="#C21722" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        <g>
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0; 8 0; 0 0"
            dur="5.5s"
            repeatCount="indefinite"
          />
          <rect x="222" y="210" width="132" height="86" rx="24" fill="#FFFFFF" stroke="#E5E1DA" />
          <path d="M253 254h88" stroke="#322B81" strokeWidth="10" strokeLinecap="round" opacity=".16" />
          <path d="M253 274h62" stroke="#322B81" strokeWidth="10" strokeLinecap="round" opacity=".16" />
          <path d="M250 236h24l8 12h42l8-12h24" stroke="#C21722" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        <g opacity=".9">
          <circle cx="68" cy="62" r="7" fill="#C21722">
            <animate attributeName="opacity" values=".25;1;.25" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="370" cy="166" r="6" fill="#322B81">
            <animate attributeName="opacity" values="1;.25;1" dur="3.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="46" cy="280" r="5" fill="#322B81" opacity=".3" />
        </g>
      </svg>
    </div>
  );
}

export default function TradePage() {
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
        className="pointer-events-none absolute -left-28 top-[34rem] h-[360px] w-[360px] rounded-full opacity-60"
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
              <span className="block font-sans">Corporate & trade accounts</span>
              <span
                className="mt-1 block font-normal italic text-ink"
                style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}
              >
                made simple
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-body-muted md:text-lg">
              Volume pricing, dedicated account handling, and clear quotation workflows
              for UAE hotels, caterers, venues, and event teams.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {tradeBenefits.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3 rounded-xl border border-border/70 bg-white/80 px-4 py-3 shadow-sm">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-soft">
                    <Icon className="h-4 w-4 text-primary" strokeWidth={1.9} aria-hidden />
                  </span>
                  <span className="text-sm font-semibold leading-snug text-ink">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <TradeGraphic />
        </div>

        <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-2 lg:mt-20">
          <Link
            href="/trade/enquiry"
            className="group rounded-2xl border border-[#e5e7eb] bg-white p-7 shadow-[0_18px_60px_rgba(20,19,31,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_24px_70px_rgba(20,19,31,0.1)] sm:p-8"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#fef9c3]">
              <MessageSquareText className="h-6 w-6 text-ink" strokeWidth={1.75} aria-hidden />
            </span>
            <h2 className="mt-6 text-2xl font-bold tracking-tight text-ink">Quick Enquiry</h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-body-muted">
              Send a short message about your requirement and our team will reply within
              10 minutes.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-primary">
              Submit enquiry
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2} />
            </span>
          </Link>

          <Link
            href="/trade/rfq"
            className="group rounded-2xl border border-[#e5e7eb] bg-white p-7 shadow-[0_18px_60px_rgba(20,19,31,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_24px_70px_rgba(20,19,31,0.1)] sm:p-8"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#dbeafe]">
              <Building2 className="h-6 w-6 text-ink" strokeWidth={1.75} aria-hidden />
            </span>
            <h2 className="mt-6 text-2xl font-bold tracking-tight text-ink">Request a Quote</h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-body-muted">
              Submit a formal RFQ with line items, quantities, timeline, and trade
              details for a structured response.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-primary">
              Start RFQ
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2} />
            </span>
          </Link>
        </div>

        <div className="mt-16 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Industries We Serve</p>
          <div className="mx-auto mt-6 flex max-w-5xl flex-wrap justify-center gap-3">
            {industries.map((industry) => (
              <span
                key={industry}
                className="rounded-full border border-[#e8e4df] bg-white px-4 py-2 text-xs font-semibold tracking-wide text-body-muted shadow-sm"
              >
                {industry}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
