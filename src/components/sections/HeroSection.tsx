import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Globe2, Handshake, Truck } from "lucide-react";
import Container from "@/components/Container";
import HeroShopCategories from "@/components/sections/HeroShopCategories";
import heroBackground from "@/assets/hero2.png";

const HERO_CHIPS = [
  { icon: BadgeCheck, title: "Commercial Quality", sub: "Built for Performance" },
  { icon: Truck, title: "Fast Delivery", sub: "Across the UAE" },
  { icon: Handshake, title: "Trade Support", sub: "& Bulk Solutions" },
  { icon: Globe2, title: "Local Expertise", sub: "Global Standards" },
];

const PARTNERS = [
  { name: "ATLANTIS", sub: "THE PALM, DUBAI" },
  { name: "Jumeirah", sub: "HOTELS & RESORTS" },
  { name: "ADDRESS", sub: "HOTELS + RESORTS" },
  { name: "MARRIOTT" },
  { name: "RAFFLES", sub: "HOTELS & RESORTS" },
  { name: "RIXOS", sub: "HOTELS" },
  { name: "ROTANA", sub: "HOTELS & RESORTS" },
  { name: "HILTON" },
];

function PartnerLogo({ name, sub }: { name: string; sub?: string }) {
  return (
    <div className="flex shrink-0 flex-col items-center text-center text-white/85">
      <span
        className="text-sm font-semibold uppercase leading-none tracking-[0.16em] sm:text-base"
        style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}
      >
        {name}
      </span>
      {sub ? (
        <span className="mt-0.5 text-[8px] uppercase tracking-[0.22em] text-white/45">{sub}</span>
      ) : null}
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative flex h-dvh max-h-dvh min-h-[620px] flex-col overflow-hidden bg-bg-warm">
      {/* Hero backdrop: top of page → marquee top edge */}
      <div className="relative flex min-h-0 flex-1 flex-col">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <Image
            src={heroBackground}
            alt="Catertech hospitality supplies across the Dubai skyline"
            fill
            priority
            sizes="100vw"
            className="h-full w-full object-cover object-right"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(245,240,232,0.92) 0%, rgba(245,240,232,0.78) 30%, rgba(245,240,232,0.32) 52%, rgba(245,240,232,0) 68%)",
            }}
            aria-hidden
          />
        </div>

        <div className="relative z-10 flex min-h-0 flex-1 flex-col">
          <div className="h-(--header-height) shrink-0" aria-hidden />
          <Container className="flex min-h-0 flex-1 flex-col justify-center py-2 md:py-3">
            <div className="max-w-4xl">
              <p className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-accent-dark sm:text-[11px]">
                <span className="h-px w-8 bg-accent" aria-hidden />
                Powering Hospitality Across the UAE
              </p>

              <h1 className="mt-2.5 font-display text-[clamp(1.75rem,3.75vw,3rem)] font-extrabold leading-[1.05] tracking-tight text-ink md:mt-3">
                Powering Hospitality
                <span className="block">for a New Era in the UAE</span>
              </h1>

              <p className="mt-3 max-w-md text-[13px] leading-relaxed text-body-muted sm:text-sm">
                Catertech supplies hotel, venue and F&amp;B teams with commercial-grade
                buffetware, kitchen equipment and trade sourcing support across Dubai and
                the UAE.
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-3 sm:mt-5 sm:gap-4">
                <Link
                  href="/shop"
                  className="group inline-flex items-center gap-3 rounded-xl bg-primary py-2.5 pl-5 pr-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white shadow-[0_12px_30px_rgba(27,43,75,0.25)] transition-colors hover:bg-primary-dark sm:py-3 sm:pl-6 sm:pr-3 sm:text-[11px]"
                >
                  Browse Equipment
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-primary transition-transform duration-300 group-hover:translate-x-0.5 sm:h-8 sm:w-8">
                    <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2.25} />
                  </span>
                </Link>

                <Link
                  href="/trade/rfq"
                  className="group inline-flex items-center gap-3 rounded-xl border-2 border-primary/25 bg-white/40 py-2.5 pl-5 pr-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary backdrop-blur-sm transition-colors hover:border-primary hover:bg-white/70 sm:py-3 sm:pl-6 sm:pr-3 sm:text-[11px]"
                >
                  Request a Quote
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-primary/35 text-primary transition-transform duration-300 group-hover:translate-x-0.5 sm:h-8 sm:w-8">
                    <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2.25} />
                  </span>
                </Link>
              </div>

              <div className="mt-4 flex flex-nowrap items-center overflow-x-auto border-t border-primary/10 pt-3.5 [-ms-overflow-style:none] [scrollbar-width:none] sm:mt-5 sm:pt-4 [&::-webkit-scrollbar]:hidden">
                {HERO_CHIPS.map(({ icon: Icon, title, sub }, i) => (
                  <div key={title} className="flex shrink-0 items-center">
                    {i > 0 ? (
                      <span className="mx-3 h-7 w-px shrink-0 bg-primary/15 sm:mx-4" aria-hidden />
                    ) : null}
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 shrink-0 text-accent" strokeWidth={1.8} />
                      <div className="whitespace-nowrap text-[10px] leading-tight">
                        <p className="font-semibold text-ink">{title}</p>
                        <p className="text-body-muted">{sub}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </div>
      </div>

      {/* Trust bar — image ends at this top edge */}
      <div className="relative z-10 shrink-0 bg-primary text-white">
        <Container>
          <div className="flex min-h-[62px] items-center gap-3 py-3 sm:min-h-[70px] sm:gap-5 sm:py-4">
            <div className="shrink-0 border-r border-white/15 pr-3 text-[8px] font-semibold uppercase leading-tight tracking-[0.18em] text-white/70 sm:pr-5 sm:text-[9px]">
              Trusted by leading
              <br />
              hospitality brands
            </div>

            <div className="relative min-w-0 flex-1 overflow-hidden">
              <div className="hero-partner-marquee-track items-center gap-8 sm:gap-12">
                {[...PARTNERS, ...PARTNERS].map((partner, i) => (
                  <PartnerLogo key={`${partner.name}-${i}`} {...partner} />
                ))}
              </div>
              <div
                className="pointer-events-none absolute inset-y-0 left-0 w-10 sm:w-14"
                style={{ background: "linear-gradient(90deg, #1b2b4b, transparent)" }}
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-y-0 right-0 w-10 sm:w-14"
                style={{ background: "linear-gradient(270deg, #1b2b4b, transparent)" }}
                aria-hidden
              />
            </div>

            <div className="shrink-0 border-l border-white/15 pl-3 text-[8px] font-medium uppercase leading-tight tracking-[0.18em] text-white/45 sm:pl-5 sm:text-[9px]">
              And many
              <br />
              more
            </div>
          </div>
        </Container>
      </div>

      <div className="relative z-10 shrink-0 bg-bg-warm">
        <Container>
          <HeroShopCategories />
        </Container>
      </div>
    </section>
  );
}
