import Link from "next/link";
import Container from "@/components/layout/PageContainer";
import JourneySection from "@/components/sections/JourneySection";

const CLOSING_STATS = [
  { value: "22+", label: "Years active" },
  { value: "1,000+", label: "Events served" },
  { value: "500+", label: "Corporate clients" },
  { value: "2", label: "Warehouse locations" },
];

export default function JourneyPage() {
  return (
    <div>
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-[#f9f4ec]">
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center opacity-[0.14] mix-blend-multiply"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1541123437800-1bb1317fddb9?auto=format&fit=crop&w=1920&q=80)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(249,244,236,0.72)_0%,rgba(249,244,236,0.92)_55%,#f9f4ec_100%)]"
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
          }}
        />
        <div
          aria-hidden
          className="absolute top-12 left-8 h-8 w-8 border-t border-l border-[#8b7355]/35 md:left-16"
        />
        <div
          aria-hidden
          className="absolute right-8 bottom-12 h-8 w-8 border-r border-b border-[#8b7355]/35 md:right-16"
        />

        <Container className="relative z-10 py-24 text-center">
          <span className="mb-6 block text-[10px] font-semibold tracking-[0.35em] text-sand uppercase">
            Our Story
          </span>
          <div className="mx-auto mb-8 h-px w-10 bg-[#8b7355]/40" />
          <h1 className="mb-6 font-serif text-5xl leading-none text-charcoal md:text-7xl lg:text-8xl">
            22&nbsp;Years
            <br />
            <em className="text-sand not-italic">in the Making</em>
          </h1>
          <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-muted md:text-lg">
            From a small Dubai trading company to the UAE&rsquo;s trusted catering and event
            equipment partner.
          </p>
        </Container>
      </section>

      <JourneySection />

      <section className="bg-offwhite py-32 md:py-40">
        <Container>
          <div className="text-center mb-20">
            <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-sand block mb-4">
              Where We Stand Today
            </span>
            <div className="w-8 h-px bg-sand mx-auto mb-7" />
            <h2 className="font-serif text-4xl md:text-5xl text-charcoal leading-tight max-w-xl mx-auto">
              Two decades of craft, one unwavering standard.
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border mb-20">
            {CLOSING_STATS.map((s) => (
              <div
                key={s.label}
                className="bg-offwhite px-8 py-10 text-center group hover:bg-cream transition-colors duration-300"
              >
                <div className="font-serif text-4xl md:text-5xl text-charcoal font-bold mb-2 group-hover:text-sand transition-colors duration-300">
                  {s.value}
                </div>
                <p className="text-muted text-xs tracking-widest uppercase">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 bg-charcoal text-white text-sm font-medium px-8 py-4 hover:bg-sand transition-colors duration-300"
            >
              Partner with us
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center gap-3 border border-charcoal/20 text-charcoal text-sm font-medium px-8 py-4 hover:border-sand hover:text-sand transition-all duration-300"
            >
              Browse equipment
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
