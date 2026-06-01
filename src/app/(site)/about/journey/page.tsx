import Link from "next/link";
import Container from "@/components/Container";
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
      <section className="relative min-h-[70vh] bg-navy flex items-center justify-center overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
          }}
        />
        <div aria-hidden className="absolute top-12 left-8 md:left-16 w-8 h-8 border-t border-l border-sand/30" />
        <div aria-hidden className="absolute bottom-12 right-8 md:right-16 w-8 h-8 border-b border-r border-sand/30" />

        <Container className="relative z-10 text-center py-24">
          <span className="text-[10px] font-semibold tracking-[0.35em] uppercase text-sand block mb-6">
            Our Story
          </span>
          <div className="w-10 h-px bg-sand/50 mx-auto mb-8" />
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white leading-none mb-6">
            22&nbsp;Years
            <br />
            <em className="not-italic text-sand">in the Making</em>
          </h1>
          <p className="text-white/40 text-base md:text-lg leading-relaxed max-w-md mx-auto mt-6">
            From a small Dubai trading company to the UAE&rsquo;s trusted catering and event equipment partner.
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
