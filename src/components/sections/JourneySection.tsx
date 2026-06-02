"use client";

import Container from "@/components/Container";
import { BrandCtaWithIcon } from "@/components/ui/WaterRiseCta";

const BRAND_PURPLE = "#322b81";
const BRAND_RED = "#c21722";
const CARD_BG = "#eceaf8";
const STICKY_TOP = 88;
const STICKY_STEP = 18;

export type JourneyMilestone = {
  year: string;
  step: number;
  title: string;
  description: string;
  tagline: string;
  image?: string;
  imageAlt?: string;
  imageFallback?: string;
};

export const JOURNEY_MILESTONES: JourneyMilestone[] = [
  {
    year: "2002",
    step: 1,
    title: "Where It All Began",
    description:
      "Our founders saw a gap in the UAE hospitality market: dependable, hotel-grade catering supply was still hard to source. Catertech began with a small Dubai warehouse and a standard that refused shortcuts.",
    tagline: "START SMALL. THINK BIG.",
  },
  {
    year: "2005",
    step: 2,
    title: "Founded in Dubai",
    description:
      "Catertech was formally established to supply premium catering equipment to hotels, restaurants and banqueting teams across a rapidly expanding city.",
    tagline: "BUILT ON TRUST.",
  },
  {
    year: "2010",
    step: 3,
    title: "Events Division Launched",
    description:
      "As corporate events and weddings accelerated across the Emirates, we added event rentals: tables, chairs, linen, staging and decor delivered with disciplined timing.",
    tagline: "LEARN BY DOING.",
  },
  {
    year: "2015",
    step: 4,
    title: "Kitchen Equipment",
    description:
      "Our commercial kitchen division launched for restaurants, hotel back-of-house teams and institutional kitchens needing ovens, refrigeration and food-prep lines.",
    tagline: "CLARITY DRIVES PROGRESS.",
  },
  {
    year: "2020",
    step: 5,
    title: "Northern Emirates Expansion",
    description:
      "A second warehouse and logistics hub in Ras Al Khaimah shortened delivery times, strengthened stock access and extended our operating footprint.",
    tagline: "SCALE WITH CONFIDENCE.",
  },
  {
    year: "2024",
    step: 6,
    title: "Full-Service Partner",
    description:
      "Today Catertech supports 500+ corporate clients with catering hire, kitchen supply, event management and digital quoting across Dubai, RAK and the wider UAE.",
    tagline: "PARTNER FOR THE LONG RUN.",
  },
];

type JourneySectionProps = {
  milestones?: JourneyMilestone[];
  className?: string;
  ctaHref?: string;
  ctaLabel?: string;
};

function TimelineDot({ dimmed }: { dimmed?: boolean }) {
  return (
    <span
      className="relative z-10 mt-12 block size-4 shrink-0 rounded-full border-[2.5px] bg-white"
      style={{ borderColor: BRAND_RED, opacity: dimmed ? 0.5 : 1 }}
      aria-hidden
    />
  );
}

function JourneyCard({
  milestone,
  stickyIndex,
  isLast,
  staticLayout,
}: {
  milestone: JourneyMilestone;
  stickyIndex: number;
  isLast: boolean;
  staticLayout?: boolean;
}) {
  return (
    <article
      className={[
        "flex w-full flex-col justify-between rounded-[1.75rem] px-7 py-8 sm:min-h-[260px] sm:px-9 sm:py-10 lg:min-h-[280px] lg:px-11 lg:py-11",
        isLast ? "bg-[#6b7280]" : "bg-[#0a0a0a]",
        staticLayout ? "mb-5" : "sticky mb-5",
      ].join(" ")}
      style={
        staticLayout
          ? undefined
          : {
              top: STICKY_TOP + stickyIndex * STICKY_STEP,
              zIndex: stickyIndex + 1,
            }
      }
    >
      <div className="flex items-start justify-between gap-6">
        <h3
          className="max-w-[min(100%,32rem)] text-2xl font-bold leading-[1.12] tracking-tight sm:text-3xl lg:text-[2rem]"
          style={{ color: BRAND_RED }}
        >
          {milestone.title}
        </h3>
        <span
          className="shrink-0 text-sm font-semibold sm:text-base"
          style={{ color: BRAND_PURPLE }}
        >
          {milestone.year}
        </span>
      </div>

      <div className="mt-8 flex flex-col gap-6 sm:mt-10 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
        <p className="max-w-2xl text-sm leading-relaxed text-white/78 sm:text-[15px] lg:flex-1">
          {milestone.description}
        </p>
        <p className="shrink-0 text-[10px] font-bold uppercase tracking-[0.2em] text-white/90 sm:text-[11px] lg:max-w-[220px] lg:text-right">
          {milestone.tagline}
        </p>
      </div>
    </article>
  );
}

function CardRunway({
  milestones,
  staticLayout,
}: {
  milestones: JourneyMilestone[];
  staticLayout?: boolean;
}) {
  return (
    <div className={staticLayout ? "flex flex-col" : "flex flex-col pb-20 lg:pb-32"}>
      {milestones.map((milestone, index) => (
        <div
          key={`${milestone.year}-${milestone.title}`}
          className="relative w-full"
          style={
            staticLayout
              ? undefined
              : {
                  minHeight:
                    index < milestones.length - 1
                      ? "clamp(420px, 52vh, 560px)"
                      : "clamp(360px, 44vh, 480px)",
                }
          }
        >
          <JourneyCard
            milestone={milestone}
            stickyIndex={index}
            isLast={index === milestones.length - 1}
            staticLayout={staticLayout}
          />
        </div>
      ))}
    </div>
  );
}

export default function JourneySection({
  milestones = JOURNEY_MILESTONES,
  className = "",
  ctaHref = "/contact",
  ctaLabel = "Contact Us",
}: JourneySectionProps) {
  return (
    <section
      className={`w-full overflow-clip bg-white py-14 text-[#0a0a0a] sm:py-16 lg:py-20 ${className}`.trim()}
      aria-labelledby="journey-section-heading"
    >
      <Container>
        {/* Desktop: sticky left + timeline + stacking cards */}
        <div className="hidden w-full lg:grid lg:grid-cols-[minmax(0,33%)_52px_minmax(0,1fr)] lg:gap-x-8 xl:grid-cols-[minmax(0,30%)_56px_minmax(0,1fr)] xl:gap-x-12">
          <div className="sticky top-24 self-start">
            <h2
              id="journey-section-heading"
              className="text-[2.65rem] font-bold leading-[1.08] tracking-tight xl:text-[2.85rem]"
            >
              From bold ideas to performance-driven partnerships
            </h2>
            <p className="mt-6 max-w-md text-[17px] leading-relaxed text-[#6b7280]">
              A scroll through the milestones that shaped Catertech — from a single Dubai
              warehouse to trusted equipment, events and kitchen supply across the UAE.
            </p>
            <BrandCtaWithIcon
              href={ctaHref}
              className="mt-10 text-[15px]"
              iconClassName="size-11"
            >
              {ctaLabel}
            </BrandCtaWithIcon>
          </div>

          <div className="relative" aria-hidden>
            <div className="absolute top-12 bottom-24 left-1/2 w-px -translate-x-1/2 bg-[#e5e7eb]" />
            <div className="flex flex-col">
              {milestones.map((m, i) => (
                <div
                  key={`dot-${m.year}`}
                  className="flex justify-center"
                  style={{
                    minHeight:
                      i < milestones.length - 1
                        ? "clamp(420px, 52vh, 560px)"
                        : "clamp(360px, 44vh, 480px)",
                  }}
                >
                  <TimelineDot dimmed={i === milestones.length - 1} />
                </div>
              ))}
            </div>
          </div>

          <div className="min-w-0 w-full">
            <CardRunway milestones={milestones} />
          </div>
        </div>

        {/* Mobile / tablet */}
        <div className="lg:hidden">
          <h2 className="text-[2rem] font-bold leading-[1.08] tracking-tight sm:text-4xl">
            From bold ideas to performance-driven partnerships
          </h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-[#6b7280]">
            The milestones that shaped Catertech — from one Dubai warehouse to a UAE-wide
            partner.
          </p>
          <BrandCtaWithIcon href={ctaHref} className="mt-8">
            {ctaLabel}
          </BrandCtaWithIcon>

          <div className="mt-12 flex flex-col gap-5">
            {milestones.map((milestone, index) => (
              <div key={`m-${milestone.year}`} className="flex gap-4">
                <div className="flex w-5 shrink-0 flex-col items-center">
                  <TimelineDot dimmed={index === milestones.length - 1} />
                  {index < milestones.length - 1 ? (
                    <div className="my-2 w-px flex-1 min-h-[40px] bg-[#e5e7eb]" />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <JourneyCard
                    milestone={milestone}
                    stickyIndex={index}
                    isLast={index === milestones.length - 1}
                    staticLayout
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
