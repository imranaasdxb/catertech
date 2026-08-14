import tradeBgImage from "@/assets/trade/trade-cta-background.png";
import Container from "@/components/layout/PageContainer";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  Briefcase,
  Building,
  Building2,
  Clock,
  ConciergeBell,
  CreditCard,
  Hospital,
  Landmark,
  ShoppingCart,
  Truck,
  Users,
  UtensilsCrossed,
} from "lucide-react";

const PERKS = [
  { value: "2-4 hrs", label: "Enquiry response time", icon: Clock },
  { value: "All UAE", label: "Delivery coverage", icon: Truck },
  { value: "No minimum", label: "Order requirement", icon: Award },
  { value: "Flexible", label: "Payment terms for trade", icon: CreditCard },
] as const;

const SECTORS = [
  { label: "Hotels", icon: Building },
  { label: "Event companies", icon: Users },
  { label: "Restaurants", icon: UtensilsCrossed },
  { label: "Government", icon: Landmark },
  { label: "Catering firms", icon: ConciergeBell },
  { label: "Hospitals", icon: Hospital },
] as const;

const EMIRATES = ["Dubai", "Abu Dhabi", "Sharjah", "RAK", "Fujairah", "Ajman", "UAQ"] as const;

function TradeCtaButton({
  href,
  variant,
  children,
}: {
  href: string;
  variant: "primary" | "secondary";
  children: string;
}) {
  const isPrimary = variant === "primary";

  return (
    <Link
      href={href}
      className={`group inline-flex min-h-10 items-center gap-2 rounded-lg border-2 border-accent px-4 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.12em] transition-colors sm:min-h-11 sm:gap-3 sm:px-5 sm:py-2.5 sm:text-[0.68rem] md:min-h-12 md:px-6 md:text-[0.72rem] ${
        isPrimary
          ? "bg-primary text-white hover:bg-primary-dark"
          : "bg-white text-primary hover:bg-accent-soft"
      }`}
    >
      <span>{children}</span>
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent text-primary transition-transform group-hover:translate-x-0.5 sm:size-8">
        <ArrowRight className="size-3.5 sm:size-4" strokeWidth={2.5} />
      </span>
    </Link>
  );
}

export default function TradeCTASection() {
  return (
    <section
      className="relative z-20 isolate w-full overflow-hidden bg-[#f9f4ec] py-10 shadow-[0_32px_72px_-20px_rgba(27,43,75,0.22)] sm:py-12 md:py-16 lg:py-20"
      aria-labelledby="trade-cta-heading"
    >
      <Image
        src={tradeBgImage}
        alt=""
        fill
        className="-z-10 object-contain object-fill"
        sizes="100vw"
      />

      {/* Soft vignette over bg image — depth at section bottom */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-[5] h-[50%] bg-linear-to-t from-[#1b2b4b]/14 via-[#1b2b4b]/5 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-[5] h-40 bg-[radial-gradient(ellipse_140%_100%_at_50%_100%,rgba(27,43,75,0.12)_0%,transparent_65%)] sm:h-48 md:h-56"
        aria-hidden
      />
      {/* Blend into journey section tone — no hard lines */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-36 bg-linear-to-t from-[#F5F0E8] from-15% via-[#f5f0e8]/55 to-transparent sm:h-44 md:h-52"
        aria-hidden
      />

      <Container className="relative z-10">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-stretch lg:gap-10 xl:gap-14">
          {/* Left column */}
          <div className="flex min-w-0 flex-col lg:h-full">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-accent-dark">
              For business
            </p>

            <div className="mt-2 flex max-w-full flex-wrap items-center gap-x-2 gap-y-1 sm:mt-3 sm:gap-x-3">
              <h2
                id="trade-cta-heading"
                className="min-w-0 max-w-full font-display text-[clamp(1.35rem,4.2vw,2.65rem)] font-medium leading-[1.08] tracking-tight text-primary lg:text-[clamp(1.45rem,2.4vw,2.125rem)] xl:text-[clamp(1.65rem,2.75vw,2.5rem)] 2xl:text-[clamp(1.85rem,3vw,2.65rem)]"
              >
                Trade &amp; Corporate{" "}
                <span className="text-accent">Solutions</span>
              </h2>
              <span className="shrink-0 text-accent" aria-hidden>
                ◆
              </span>
            </div>

            <div className="mt-3 grid w-full max-w-lg grid-cols-2 gap-2.5 sm:mt-4 sm:gap-3 md:gap-4">
              <div className="flex flex-col items-center rounded-xl border border-accent/70 bg-primary px-3 py-4 text-center sm:px-4 sm:py-5 md:px-5 md:py-6">
                <span className="flex size-10 items-center justify-center rounded-full border border-accent/50 bg-primary sm:size-11 md:size-12">
                  <ShoppingCart className="size-4 text-accent sm:size-5 md:size-6" strokeWidth={1.5} />
                </span>
                <p className="mt-2 font-display text-base font-medium text-white sm:mt-3 sm:text-lg md:text-xl">Trade</p>
                <p className="mt-2 text-[11px] leading-snug text-white/80 sm:text-xs">
                  Bulk orders, procurement pricing, delivery coverage.
                </p>
              </div>

              <div className="flex flex-col items-center rounded-xl border border-accent/70 bg-white/55 px-3 py-4 text-center shadow-[0_10px_36px_rgba(27,43,75,0.06)] backdrop-blur-[2px] sm:px-4 sm:py-5 md:px-5 md:py-6">
                <span className="flex size-10 items-center justify-center rounded-full border border-accent/40 bg-white sm:size-11 md:size-12">
                  <Briefcase className="size-4 text-accent sm:size-5 md:size-6" strokeWidth={1.5} />
                </span>
                <p className="mt-2 font-display text-base font-medium text-primary sm:mt-3 sm:text-lg md:text-xl">
                  Corporate
                </p>
                <p className="mt-2 text-[11px] leading-snug text-body-muted sm:text-xs">
                  Events, account support, formal quotations, managed solutions.
                </p>
              </div>
            </div>

            <div className="mt-4 max-w-lg rounded-xl bg-white/55 px-3 py-3 shadow-[0_6px_28px_rgba(27,43,75,0.1)] backdrop-blur-sm sm:mt-5 sm:px-4 md:mt-6 md:px-5 md:py-4 lg:flex lg:min-h-[12.5rem] lg:flex-1 lg:flex-col lg:justify-center lg:py-6 xl:min-h-[13.5rem]">
              <div className="flex items-start gap-3">
                <ConciergeBell
                  className="mt-0.5 size-5 shrink-0 text-accent sm:size-6"
                  strokeWidth={1.5}
                />
                <p className="font-display text-sm font-medium leading-snug text-primary sm:text-base md:text-lg">
                  Supplying hotels, venues &amp; F&amp;B brands at scale.
                </p>
              </div>

              <p className="mt-2 text-xs leading-relaxed text-body-muted sm:mt-3 sm:text-sm md:text-[15px]">
                Trade and corporate accounts get our full catalogue, volume pricing and a dedicated
                account manager. Submit an enquiry or request a formal quote for your next project.
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2.5 sm:mt-5 sm:gap-3 md:mt-6 md:gap-9 lg:mt-auto lg:pt-4">
              <TradeCtaButton href="/trade/enquiry" variant="primary">
                Submit an enquiry
              </TradeCtaButton>
              {/* <TradeCtaButton href="/trade/rfq" variant="secondary">
                Request full quote
              </TradeCtaButton> */}
            </div>
          </div>

          {/* Right column */}
          <div className="flex w-full flex-col items-stretch gap-5 sm:gap-6 lg:ml-auto lg:h-full lg:max-w-2xl lg:gap-8">
            <div className="grid w-full grid-cols-2 gap-2.5 sm:gap-3 md:gap-4">
              {PERKS.map((perk) => {
                const Icon = perk.icon;
                return (
                  <div
                    key={perk.label}
                    className="flex min-h-[132px] w-full flex-col items-center rounded-xl border border-border/60 bg-white/95 px-3 py-4 text-center shadow-[0_8px_28px_rgba(27,43,75,0.07)] sm:min-h-[148px] sm:px-4 sm:py-5 md:min-h-[160px] md:px-5 md:py-6"
                  >
                    <span className="flex size-9 items-center justify-center rounded-full border border-accent/35 bg-accent-soft/40 sm:size-10 md:size-11">
                      <Icon className="size-3.5 text-accent-dark sm:size-4 md:size-[18px]" strokeWidth={1.5} />
                    </span>
                    <p className="mt-2 font-display text-lg font-medium leading-none text-primary sm:mt-3 sm:text-xl md:text-2xl">
                      {perk.value}
                    </p>
                    <p className="mt-2 text-[11px] leading-snug text-body-muted sm:text-xs">
                      {perk.label}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="flex w-full flex-col items-center">
              <div className="flex w-full items-center gap-3 sm:gap-4">
                <span className="h-px flex-1 bg-primary/15 sm:h-0.5" aria-hidden />
                <p className="shrink-0 rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-primary shadow-[0_2px_10px_rgba(27,43,75,0.08)] ring-1 ring-accent/45 sm:px-4 sm:py-2 sm:text-sm sm:tracking-[0.16em] md:text-[15px] lg:px-5">
                  Delivery coverage
                </p>
                <span className="h-px flex-1 bg-primary/15 sm:h-0.5" aria-hidden />
              </div>

              <ul
                className="mt-4 flex w-full flex-wrap items-center justify-center gap-1.5 sm:flex-nowrap sm:gap-2"
                role="list"
              >
                {EMIRATES.map((emirate) => (
                  <li key={emirate}>
                    <span className="inline-block whitespace-nowrap rounded-full border border-accent/45 bg-white/95 px-2.5 py-1.5 text-[10px] font-medium text-primary shadow-sm sm:px-3 sm:py-1.5 sm:text-[11px]">
                      {emirate}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sectors bar — compact, directly below delivery */}
            <div className="flex w-full flex-col items-center gap-3 rounded-2xl border border-border/50 bg-white/90 px-4 py-4 shadow-[0_10px_36px_rgba(27,43,75,0.06)] sm:gap-4 sm:px-5 sm:py-5 md:gap-5 md:px-6 md:py-6 lg:mt-auto">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-full border border-accent/40 bg-accent-soft/50">
                  <Building2 className="size-5 text-accent-dark" strokeWidth={1.5} />
                </span>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent-dark sm:text-xs">
                  Sectors we serve
                </p>
              </div>

              <ul
                className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2 sm:gap-x-2"
                role="list"
              >
                {SECTORS.map((sector, index) => {
                  const Icon = sector.icon;
                  return (
                    <li key={sector.label} className="flex items-center">
                      {index > 0 ? (
                        <span className="mx-1.5 h-4 w-px bg-border/70 sm:mx-2" aria-hidden />
                      ) : null}
                      <span className="inline-flex items-center gap-2 px-1 py-0.5 text-xs font-medium text-primary sm:text-sm">
                        <Icon className="size-3.5 text-primary/75 sm:size-4" strokeWidth={1.5} />
                        {sector.label}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
