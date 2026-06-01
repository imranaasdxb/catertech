"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import Container from "@/components/Container";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const BRAND_PURPLE = "#322b81";
const BRAND_RED = "#c21722";
const BG = "#f3f2ef";
const COLUMN_W = 420;
const COLUMN_GAP = 56;
const TRACK_PAD_X = 40;
/** Vertical inset while pinned — keeps timeline centered with space top & bottom */
const PIN_VIEWPORT_CLASS =
  "relative flex min-h-[calc(100svh-11rem)] w-full items-center justify-center overflow-hidden py-8 sm:py-10";
const CARD_STACK_CLASS = "relative flex h-[min(480px,58vh)] flex-col sm:h-[min(500px,60vh)]";

const MILESTONES = [
  {
    year: "2002",
    title: "Where It All Began",
    description:
      "Catertech started from a small Dubai warehouse with a clear promise: dependable, hotel-grade catering supply for the UAE hospitality market.",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&h=640&fit=crop&q=80",
    alt: "Fine dining and hospitality table setup",
  },
  {
    year: "2005",
    title: "Founded in Dubai",
    description:
      "Formally established to serve hotels, restaurants and banqueting teams with premium catering equipment across a fast-growing city.",
    image:
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=900&h=640&fit=crop&q=80",
    alt: "Dubai hospitality district",
  },
  {
    year: "2010",
    title: "Events Division",
    description:
      "Event rentals joined the offer — tables, chairs, linen, staging and decor with disciplined delivery for corporate and wedding teams.",
    image:
      "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=900&h=640&fit=crop&q=80",
    alt: "Grand banquet and event setup",
  },
  {
    year: "2015",
    title: "Kitchen Equipment",
    description:
      "Commercial kitchen lines for restaurants, hotel back-of-house and institutional clients — ovens, refrigeration and prep systems.",
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&h=640&fit=crop&q=80",
    alt: "Professional commercial kitchen",
  },
  {
    year: "2020",
    title: "Northern Expansion",
    description:
      "A Ras Al Khaimah warehouse and logistics hub shortened lead times and extended reach across the Northern Emirates.",
    image:
      "https://images.unsplash.com/photo-1553413077-190dd305871c?w=900&h=640&fit=crop&q=80",
    alt: "Warehouse and logistics operations",
  },
  {
    year: "2024",
    title: "Full-Service Partner",
    description:
      "End-to-end support for 500+ clients — catering hire, kitchen supply, event management and digital quoting across the UAE.",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&h=640&fit=crop&q=80",
    alt: "Large-scale corporate event",
  },
];

function buildSpringPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const midX = (prev.x + curr.x) / 2;
    const wave = i % 2 === 0 ? -78 : 78;
    d += ` C ${midX} ${prev.y + wave}, ${midX} ${curr.y - wave}, ${curr.x} ${curr.y}`;
  }
  return d;
}

/** Cumulative path length at each milestone dot (for segment-by-segment draw on scroll) */
function getCumulativePathLengths(
  pathEl: SVGPathElement,
  points: { x: number; y: number }[],
): number[] {
  if (points.length === 0) return [0];

  const cumulative: number[] = [0];
  for (let i = 1; i < points.length; i++) {
    pathEl.setAttribute("d", buildSpringPath(points.slice(0, i + 1)));
    cumulative.push(pathEl.getTotalLength());
  }
  pathEl.setAttribute("d", buildSpringPath(points));
  return cumulative;
}

function visiblePathLength(
  scrollProgress: number,
  cumulative: number[],
): number {
  const total = cumulative[cumulative.length - 1] ?? 0;
  if (total <= 0 || cumulative.length < 2) return 0;

  const segmentCount = cumulative.length - 1;
  const travel = scrollProgress * segmentCount;
  const segIndex = Math.min(segmentCount - 1, Math.floor(travel));
  const segLocal = travel - segIndex;
  const from = cumulative[segIndex] ?? 0;
  const to = cumulative[segIndex + 1] ?? total;

  return from + (to - from) * segLocal;
}

function MilestoneText({
  year,
  title,
  description,
}: {
  year: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex h-full flex-col justify-center px-1">
      <p className="text-4xl font-bold tracking-tight text-[#1f2937] sm:text-[2.75rem]">{year}</p>
      <h3 className="mt-2 text-lg font-bold text-[#0a0a0a] sm:text-xl">{title}</h3>
      <p className="mt-3 max-w-[360px] text-sm leading-relaxed text-[#6b7280] sm:text-[15px]">
        {description}
      </p>
    </div>
  );
}

function MilestoneImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative h-full min-h-[200px] w-full overflow-hidden bg-[#e5e7eb] sm:min-h-[220px]">
      <Image src={src} alt={alt} fill className="object-cover" sizes="420px" />
    </div>
  );
}

export default function JourneyTeaser() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinStageRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const pathMetricsRef = useRef({ total: 0, cumulative: [0] as number[] });

  useGSAP(
    () => {
      const pinStage = pinStageRef.current;
      const pin = pinRef.current;
      const track = trackRef.current;
      const pathEl = pathRef.current;
      if (!pinStage || !pin || !track || !pathEl) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const getScrollDistance = () =>
        Math.max(0, track.scrollWidth - window.innerWidth + TRACK_PAD_X * 2);

      const syncPathMetrics = () => {
        const trackRect = track.getBoundingClientRect();
        const points = dotRefs.current
          .map((dot) => {
            if (!dot) return null;
            const r = dot.getBoundingClientRect();
            return {
              x: r.left + r.width / 2 - trackRect.left,
              y: r.top + r.height / 2 - trackRect.top,
            };
          })
          .filter((p): p is { x: number; y: number } => p !== null);

        const cumulative = getCumulativePathLengths(pathEl, points);
        const total = cumulative[cumulative.length - 1] ?? 0;
        pathMetricsRef.current = { total, cumulative };
        return total;
      };

      const setupScroll = () => {
        const pathLen = syncPathMetrics();
        if (!pathLen) return;

        gsap.set(pathEl, {
          strokeDasharray: pathLen,
          strokeDashoffset: pathLen,
          opacity: 1,
        });

        if (reduced) {
          gsap.set(track, { x: 0 });
          gsap.set(pathEl, { strokeDashoffset: 0 });
          track.classList.add("overflow-x-auto");
          pin.classList.remove("overflow-hidden");
          return;
        }

        ScrollTrigger.create({
          trigger: pinStage,
          start: "top 12%",
          end: () => `+=${getScrollDistance()}`,
          pin: pin,
          pinSpacing: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 0,
          onUpdate: (self) => {
            const { total, cumulative } = pathMetricsRef.current;
            const distance = getScrollDistance();
            const drawn = visiblePathLength(self.progress, cumulative);
            gsap.set(pathEl, {
              strokeDashoffset: total - drawn,
            });
            gsap.set(track, { x: -distance * self.progress });
          },
        });
      };

      requestAnimationFrame(() => {
        requestAnimationFrame(setupScroll);
      });

      const onResize = () => {
        syncPathMetrics();
        ScrollTrigger.refresh();
      };

      window.addEventListener("resize", onResize);
      ScrollTrigger.addEventListener("refreshInit", syncPathMetrics);

      return () => {
        window.removeEventListener("resize", onResize);
        ScrollTrigger.removeEventListener("refreshInit", syncPathMetrics);
      };
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="journey-teaser relative w-full text-[#0a0a0a]"
      style={{ backgroundColor: BG }}
      aria-labelledby="journey-teaser-heading"
    >
      <Container className="pt-14 pb-6 sm:pt-16 sm:pb-8">
        <div className="max-w-[1920px]">
          <span
            className="mb-4 block size-2.5 rounded-full"
            style={{ backgroundColor: BRAND_PURPLE }}
            aria-hidden
          />
          <h2
            id="journey-teaser-heading"
            className="max-w-3xl text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl lg:text-[2.65rem]"
          >
            Behind the years of{" "}
            <span style={{ color: BRAND_PURPLE }}>CaterTech</span>
          </h2>
          <div className="mt-4 flex flex-wrap items-start justify-between gap-x-8 gap-y-3">
            <p className="max-w-xl flex-1 text-base leading-relaxed text-[#6b7280] sm:text-lg">
              Scroll through the milestones that shaped our equipment, events and kitchen
              capabilities across the UAE.
            </p>
            <Link
              href="/about/journey"
              className="group inline-flex shrink-0 items-center gap-2 pt-0.5 text-sm font-semibold text-[#0a0a0a] transition-colors duration-300 ease-out hover:text-[#322b81] sm:pt-1"
            >
              <span className="border-b border-transparent pb-0.5 transition-[border-color,color] duration-300 ease-out group-hover:border-[#322b81]">
                Full company journey
              </span>
              <span
                className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-1"
                aria-hidden
              >
                →
              </span>
            </Link>
          </div>
        </div>
      </Container>

      <div ref={pinStageRef} className="journey-teaser__stage w-full">
        <div ref={pinRef} className={PIN_VIEWPORT_CLASS}>
          <div
            ref={trackRef}
            className="relative flex h-[min(480px,58vh)] items-center will-change-transform sm:h-[min(500px,60vh)]"
            style={{
              gap: COLUMN_GAP,
              paddingLeft: TRACK_PAD_X,
              paddingRight: TRACK_PAD_X,
              width: "max-content",
            }}
          >
          <svg
            className="pointer-events-none absolute inset-0 z-10 h-full w-full overflow-visible"
            aria-hidden
          >
            <defs>
              <marker
                id="journey-spring-arrow"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="7"
                markerHeight="7"
                orient="auto"
              >
                <path d="M 0 1 L 8 5 L 0 9 Z" fill={BRAND_RED} />
              </marker>
            </defs>
            <path
              ref={pathRef}
              fill="none"
              stroke={BRAND_RED}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              markerEnd="url(#journey-spring-arrow)"
              opacity={0}
            />
          </svg>

          {MILESTONES.map((milestone, index) => {
            const imageTop = index % 2 === 0;

            return (
              <div
                key={milestone.year}
                className="relative shrink-0"
                style={{ width: COLUMN_W }}
              >
                <div className={CARD_STACK_CLASS}>
                  <div
                    className="pointer-events-none absolute top-1/2 right-0 left-0 z-0 h-px -translate-y-1/2 bg-[#d1d5db]"
                    aria-hidden
                  />

                  <span
                    ref={(el) => {
                      dotRefs.current[index] = el;
                    }}
                    className="absolute top-1/2 left-1/2 z-20 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#9ca3af] shadow-sm"
                    aria-hidden
                  />

                  {imageTop ? (
                    <>
                      <div className="flex min-h-0 flex-1 flex-col justify-end pb-5">
                        <MilestoneImage src={milestone.image} alt={milestone.alt} />
                      </div>
                      <div className="flex min-h-0 flex-1 flex-col justify-start pt-5">
                        <MilestoneText
                          year={milestone.year}
                          title={milestone.title}
                          description={milestone.description}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex min-h-0 flex-1 flex-col justify-end pb-5">
                        <MilestoneText
                          year={milestone.year}
                          title={milestone.title}
                          description={milestone.description}
                        />
                      </div>
                      <div className="flex min-h-0 flex-1 flex-col justify-start pt-5">
                        <MilestoneImage src={milestone.image} alt={milestone.alt} />
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
          </div>
        </div>
      </div>
    </section>
  );
}
