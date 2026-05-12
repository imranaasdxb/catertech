import Link from "next/link";

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
    <section className="bg-navy relative overflow-hidden">

      {/* Subtle vertical edge lines */}
      <div aria-hidden className="absolute inset-y-0 left-0 w-px bg-white/5 pointer-events-none" />
      <div aria-hidden className="absolute inset-y-0 right-0 w-px bg-white/5 pointer-events-none" />

      {/* Faint radial glow — top right */}
      <div
        aria-hidden
        className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(196,162,101,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-5 md:px-8">

        {/* ── Top section heading bar ───────────────────── */}
        <div className="flex items-end justify-between py-7 border-b border-white/8 gap-6">
          <div>
            <span className="text-[9px] font-semibold tracking-[0.28em] uppercase text-sand block mb-2">
              For Business
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-[2.75rem] text-white leading-tight">
              Trade &amp; <span className="text-sand">Corporate</span>
            </h2>
          </div>
          <span className="hidden md:block text-[10px] font-mono tracking-[0.2em] uppercase text-white/20 pb-1 shrink-0">
            Est.&nbsp;2005&nbsp;·&nbsp;Dubai,&nbsp;UAE
          </span>
        </div>

        {/* ── Main two-column grid ───────────────────────── */}
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 py-20">

          {/* LEFT — headline · text · CTAs · industry pills */}
          <div className="flex flex-col">

            <h2 className="font-serif text-4xl md:text-5xl lg:text-[3.2rem] text-white leading-[1.07] mb-7">
              Supplying Hotels,<br />
              Venues &amp;&nbsp;F&amp;B<br />
              Brands Across&nbsp;UAE.
            </h2>

            <p className="text-white/45 text-[0.9375rem] leading-relaxed mb-10 max-w-sm">
              Trade and corporate accounts receive access to our full catalogue, volume pricing and a dedicated account manager. Submit an enquiry or request a formal quote for your project.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mb-12">
              <Link
                href="/trade/enquiry"
                className="inline-flex items-center gap-2.5 bg-sand text-white text-[0.75rem] font-semibold tracking-[0.14em] uppercase px-7 py-4 hover:bg-sand-dark transition-colors duration-200"
              >
                Submit an Enquiry
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/trade/rfq"
                className="inline-flex items-center gap-2.5 border border-white/20 text-white text-[0.75rem] font-semibold tracking-[0.14em] uppercase px-7 py-4 hover:border-sand hover:text-sand transition-all duration-200"
              >
                Request Full Quote
              </Link>
            </div>

            {/* Industry tags */}
            <div className="mt-auto pt-8 border-t border-white/8">
              <p className="text-[9px] tracking-[0.22em] uppercase text-white/25 mb-3">Sectors we serve</p>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {INDUSTRIES.map((ind) => (
                  <span
                    key={ind}
                    className="text-[11px] tracking-wide text-white/40 hover:text-sand/70 transition-colors duration-200 cursor-default"
                  >
                    {ind}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — extraordinary stat cards + coverage */}
          <div className="flex flex-col gap-4">

            {/* 2 × 2 bold stat card grid */}
            <div className="grid grid-cols-2 gap-3">
              {PERKS.map((p, i) => (
                <div
                  key={i}
                  className="relative group border border-white/8 bg-white/3 px-5 pt-5 pb-6 overflow-hidden hover:border-sand/30 hover:bg-white/5 transition-all duration-300"
                >
                  {/* Top-left corner accent */}
                  <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-sand/25 group-hover:border-sand/60 transition-colors duration-300" />

                  {/* Bottom-right corner accent */}
                  <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-white/8 group-hover:border-sand/20 transition-colors duration-300" />

                  {/* Index number */}
                  <span className="text-[9px] font-mono text-white/15 block mb-3 tracking-widest">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Large value */}
                  <div className="font-serif text-[2rem] md:text-[2.4rem] text-sand font-bold leading-none mb-3 tracking-tight">
                    {p.value}
                  </div>

                  {/* Gold rule */}
                  <div className="w-5 h-px bg-sand/40 mb-2.5 group-hover:w-8 transition-all duration-300" />

                  {/* Label */}
                  <p className="text-white/35 text-[0.75rem] leading-snug group-hover:text-white/55 transition-colors duration-300">
                    {p.label}
                  </p>

                  {/* Bottom glow line */}
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-sand/0 to-transparent group-hover:via-sand/30 transition-all duration-500" />
                </div>
              ))}
            </div>

            {/* Emirates coverage panel */}
            <div className="border border-white/8 bg-white/2 overflow-hidden">
              {/* Panel header */}
              <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/8">
                <div className="w-1.5 h-1.5 rounded-full bg-sand" />
                <span className="text-[9px] font-semibold tracking-[0.25em] uppercase text-white/30">
                  Delivery Coverage
                </span>
                <div className="flex-1 h-px bg-white/6" />
                <span className="text-[10px] font-mono text-sand/70 tracking-wider">All UAE</span>
              </div>

              {/* Emirate grid */}
              <div className="grid grid-cols-4 gap-px bg-white/5 p-px">
                {EMIRATES.map((em) => (
                  <div
                    key={em}
                    className="bg-navy/90 flex items-center justify-center py-3 group hover:bg-sand/8 transition-colors duration-200"
                  >
                    <span className="text-[10px] font-medium tracking-widest uppercase text-white/40 group-hover:text-sand/80 transition-colors duration-200">
                      {em}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ── Bottom gold fade line ──────────────────────── */}
        <div className="h-px bg-linear-to-r from-transparent via-sand/25 to-transparent" />

      </div>
    </section>
  );
}
