import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { ArrowRight, BadgeCheck, Globe2, Handshake, Truck } from "lucide-react";
import Container from "@/components/Container";
import HeroBentoGrid from "@/components/sections/HeroBentoGrid";
import HeroShopCategories from "@/components/sections/HeroShopCategories";
import heroDesktop from "@/assets/heroplane4.png";
import heroTablet from "@/assets/herotablet2.png";
import heroMobile from "@/assets/heromobile2.png";

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

const HERO_ALT = "Catertech hospitality supplies across the Dubai skyline";

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
    <section className="hero-section relative flex min-h-dvh flex-col overflow-hidden bg-bg-warm max-lg:h-auto lg:min-h-[620px] xl:h-dvh xl:max-h-dvh">
      <div className="hero-section__body relative flex min-h-0 flex-1 flex-col max-lg:min-h-0">
        <div className="pointer-events-none absolute inset-0 overflow-hidden max-md:min-h-[calc(var(--header-height)+360px)] md:max-lg:min-h-[300px]">
          {/* Mobile */}
          <Image
            src={heroMobile}
            alt={HERO_ALT}
            fill
            priority
            sizes="100vw"
            className="h-full w-full object-cover object-top-right md:hidden"
          />
          {/* Tablet */}
          <Image
            src={heroTablet}
            alt={HERO_ALT}
            fill
            priority
            sizes="100vw"
            className="hidden h-full w-full object-contain object-right md:block lg:hidden"
          />
          {/* Desktop */}
          <Image
            src={heroDesktop}
            alt={HERO_ALT}
            fill
            priority
            sizes="100vw"
            className="hidden h-full w-full object-cover object-right lg:block"
          />

          {/* Left text shadow — mobile & tablet */}
          <div
            className="absolute inset-0 md:block lg:hidden"
            style={{
              background:
                "linear-gradient(90deg, rgba(245,240,232,0.94) 0%, rgba(245,240,232,0.82) 38%, rgba(245,240,232,0.42) 58%, rgba(245,240,232,0.08) 78%, transparent 92%)",
            }}
            aria-hidden
          />
          {/* Desktop gradient */}
          <div
            className="absolute inset-0 hidden lg:block"
            style={{
              background:
                "linear-gradient(90deg, rgba(245,240,232,0.92) 0%, rgba(245,240,232,0.78) 30%, rgba(245,240,232,0.32) 52%, rgba(245,240,232,0) 68%)",
            }}
            aria-hidden
          />
        </div>

        <div className="hero-section__content relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="h-[var(--header-height)] shrink-0" aria-hidden />
          <Container className="hero-section__container flex min-h-0 flex-1 flex-col justify-center py-3 sm:py-4 md:py-5 lg:justify-start lg:py-3 xl:justify-center">
            <div className="hero-section__grid grid grid-cols-1 items-center gap-4 sm:gap-5 md:grid-cols-[minmax(0,1fr)_minmax(260px,50%)] md:gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(340px,46%)] lg:items-start lg:gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(480px,50%)] xl:items-center xl:gap-10 2xl:gap-12">
              <div className="hero-section__copy relative z-10 max-w-4xl">
                <h1 className="hero-section__title font-display text-[clamp(1.65rem,5vw,3rem)] font-extrabold leading-[1.05] tracking-tight text-ink">
                  Powering Hospitality Across the Region
                </h1>

                <p className="hero-section__lead mt-3 max-w-md text-[13px] leading-relaxed text-body-muted sm:text-sm">
                  Catertech supplies hotel, venue and F&amp;B teams with commercial grade
                  buffetware, kitchen equipment and trade sourcing support across Dubai and
                  the UAE.
                </p>

                <div className="hero-section__cta mt-4 flex flex-wrap items-center gap-3 sm:mt-5 sm:gap-4">
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

                <div className="hero-section__chips mt-4 grid grid-cols-4 items-start gap-x-0.5 overflow-hidden border-t border-primary/10 pt-3.5 sm:mt-5 sm:flex sm:flex-nowrap sm:items-center sm:gap-0 sm:overflow-x-auto sm:pt-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {HERO_CHIPS.map(({ icon: Icon, title, sub }, i) => (
                    <Fragment key={title}>
                      {i > 0 ? (
                        <span
                          className="mx-3 hidden h-7 w-px shrink-0 bg-primary/15 sm:mx-4 sm:block"
                          aria-hidden
                        />
                      ) : null}
                      <div
                        className={`flex min-w-0 items-start gap-0.5 sm:shrink-0 sm:items-center sm:gap-2 ${
                          i > 0 ? "border-l border-primary/15 pl-1 sm:border-l-0 sm:pl-0" : ""
                        }`}
                      >
                        <Icon
                          className="mt-px h-3 w-3 shrink-0 text-accent sm:mt-0 sm:h-4 sm:w-4"
                          strokeWidth={1.8}
                        />
                        <div className="min-w-0 text-[7px] leading-[1.2] sm:whitespace-nowrap sm:text-[10px] sm:leading-tight">
                          <p className="font-semibold text-ink">{title}</p>
                          <p className="text-body-muted">{sub}</p>
                        </div>
                      </div>
                    </Fragment>
                  ))}
                </div>
              </div>

              <div className="hero-section__bento relative z-10 flex w-full justify-center max-md:mt-1 lg:py-2 xl:py-10 2xl:py-12">
                <HeroBentoGrid className="mx-auto" />
              </div>
            </div>
          </Container>
        </div>

        <div className="hero-partner-bar__shell relative z-20 mt-2 flex min-h-[56px] w-full shrink-0 items-stretch sm:min-h-[62px] sm:mt-3 md:min-h-[70px] xl:mt-0">
          <div className="hero-partner-side-panel hidden items-center border-r border-white/15 px-4 py-3 sm:flex sm:px-5 sm:py-4 md:px-6 lg:px-8">
            <p className="text-[8px] font-semibold uppercase leading-tight tracking-[0.18em] text-white/85 sm:text-[9px]">
              Trusted by leading
              <br />
              hospitality brands
            </p>
          </div>

          <div className="hero-partner-glass relative min-w-0 flex-1 overflow-hidden">
            <div className="flex min-h-full items-center py-2.5 sm:py-3 md:py-4">
              <div className="hero-partner-marquee-track items-center gap-6 sm:gap-8 md:gap-12">
                {[...PARTNERS, ...PARTNERS].map((partner, i) => (
                  <PartnerLogo key={`${partner.name}-${i}`} {...partner} />
                ))}
              </div>
            </div>
            <div
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 sm:w-10 md:w-14"
              style={{
                background:
                  "linear-gradient(90deg, rgba(27, 43, 75, 0.88) 0%, rgba(27, 43, 75, 0.45) 55%, transparent 100%)",
              }}
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 sm:w-10 md:w-14"
              style={{
                background:
                  "linear-gradient(270deg, rgba(27, 43, 75, 0.88) 0%, rgba(27, 43, 75, 0.45) 55%, transparent 100%)",
              }}
              aria-hidden
            />
          </div>

          <div className="hero-partner-side-panel hidden items-center border-l border-white/15 px-4 py-3 sm:flex sm:px-5 sm:py-4 md:px-6 lg:px-8">
            <p className="text-[8px] font-medium uppercase leading-tight tracking-[0.18em] text-white/60 sm:text-[9px]">
              And many
              <br />
              more
            </p>
          </div>
        </div>
      </div>

      <div className="hero-section__categories relative z-10 shrink-0 bg-bg-warm pb-1 sm:pb-2">
        <Container>
          <HeroShopCategories />
        </Container>
      </div>
    </section>
  );
}
