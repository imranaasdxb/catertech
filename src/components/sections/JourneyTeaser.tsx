"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import Container from "@/components/Container";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import journeyDesktop from "@/assets/journeybg.png";
import journeyTablet from "@/assets/journeytablet.png";
import journeyMobile from "@/assets/journeymoobile.png";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* ── Brand tokens (matches HeroSection) ─────────────────────────── */
const PRIMARY    = "#1B2B4B";
const ACCENT     = "#C9A84C";
const BG         = "#F5F0E8";

const COLUMN_W      = 420;
const COLUMN_GAP    = 56;
const TRACK_PAD_X   = 40;

const PIN_VIEWPORT_CLASS =
  "relative flex min-h-[calc(100svh-11rem)] w-full items-center justify-center overflow-hidden py-8 sm:py-10";
const CARD_STACK_CLASS =
  "relative flex h-[min(480px,58vh)] flex-col sm:h-[min(500px,60vh)]";

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

const SECTION_BG_BASE = {
  backgroundRepeat: "no-repeat",
  backgroundAttachment: "fixed",
} as const;

/** One main section background — CSS only, never inside GSAP pin (no sticky) */
function JourneySectionBg() {
  return (
    <div className="pointer-events-none absolute -inset-px z-0" aria-hidden>
      {/* Mobile — full width, no side gaps */}
      <div
        className="absolute inset-0 bg-[#F5F0E8] md:hidden"
        style={{
          ...SECTION_BG_BASE,
          backgroundImage: `url(${journeyMobile.src})`,
          backgroundSize: "100% auto",
          backgroundPosition: "center top",
        }}
      />
      {/* Tablet — edge-to-edge fill */}
      <div
        className="absolute inset-0 bg-[#F5F0E8] hidden md:block lg:hidden"
        style={{
          ...SECTION_BG_BASE,
          backgroundImage: `url(${journeyTablet.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
        }}
      />
      {/* Desktop — full width + height, no thin edge gaps */}
      <div
        className="absolute inset-0 hidden lg:block"
        style={{
          ...SECTION_BG_BASE,
          backgroundImage: `url(${journeyDesktop.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
        }}
      />
    </div>
  );
}

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
  const to   = cumulative[segIndex + 1] ?? total;
  return from + (to - from) * segLocal;
}

/* ── Sub-components ──────────────────────────────────────────────── */
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
    <div className="flex h-full flex-col justify-center px-4 py-3">
      <p
        className="text-[2.4rem] font-extrabold leading-none tracking-tight sm:text-[2.75rem]"
        style={{ color: ACCENT }}
      >
        {year}
      </p>
      <h3
        className="mt-2 text-base font-bold leading-snug sm:text-lg"
        style={{ color: PRIMARY }}
      >
        {title}
      </h3>
      <p className="mt-2 max-w-[340px] text-[13px] leading-relaxed text-[#5a6478] sm:text-sm">
        {description}
      </p>
    </div>
  );
}

function MilestoneImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div
      className="relative h-full min-h-[180px] w-full overflow-hidden sm:min-h-[200px]"
      style={{ borderRadius: "0.5rem 0.5rem 0 0" }}
    >
      <Image src={src} alt={alt} fill className="object-cover" sizes="420px" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, transparent 50%, rgba(245,240,232,0.55) 100%)`,
        }}
        aria-hidden
      />
    </div>
  );
}

/* ── Main component ──────────────────────────────────────────────── */
export default function JourneyTeaser() {
  const sectionRef   = useRef<HTMLElement>(null);
  const pinStageRef  = useRef<HTMLDivElement>(null);
  const pinRef       = useRef<HTMLDivElement>(null);
  const trackRef     = useRef<HTMLDivElement>(null);
  const pathRef      = useRef<SVGPathElement>(null);
  const dotRefs      = useRef<(HTMLSpanElement | null)[]>([]);
  const pathMetricsRef = useRef({ total: 0, cumulative: [0] as number[] });

  useGSAP(
    () => {
      const pinStage = pinStageRef.current;
      const pin      = pinRef.current;
      const track    = trackRef.current;
      const pathEl   = pathRef.current;
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
              y: r.top  + r.height / 2 - trackRect.top,
            };
          })
          .filter((p): p is { x: number; y: number } => p !== null);

        const cumulative = getCumulativePathLengths(pathEl, points);
        const total = cumulative[cumulative.length - 1] ?? 0;
        pathMetricsRef.current = { total, cumulative };
        return total;
      };

      let scrollTrigger: ScrollTrigger | undefined;

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

        scrollTrigger = ScrollTrigger.create({
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
            const drawn    = visiblePathLength(self.progress, cumulative);
            gsap.set(pathEl, { strokeDashoffset: total - drawn });
            gsap.set(track,  { x: -distance * self.progress });
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
        scrollTrigger?.kill();
        window.removeEventListener("resize", onResize);
        ScrollTrigger.removeEventListener("refreshInit", syncPathMetrics);
      };
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="journey-teaser relative isolate w-full overflow-hidden bg-[#F5F0E8] lg:bg-transparent"
      style={{ color: PRIMARY }}
      aria-labelledby="journey-teaser-heading"
    >
      <JourneySectionBg />

      {/* ── Header ──────────────────────────────────────────────── */}
      <Container className="relative z-10 pt-14 pb-6 sm:pt-16 sm:pb-8">
        <div className="max-w-[1920px]">
          {/* gold accent dot */}
          <span
            className="mb-4 block size-2.5 rounded-full"
            style={{ backgroundColor: ACCENT }}
            aria-hidden
          />
          <h2
            id="journey-teaser-heading"
            className="max-w-3xl text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl lg:text-[2.65rem]"
            style={{ color: PRIMARY }}
          >
            Behind the years of{" "}
            <span style={{ color: ACCENT }}>CaterTech</span>
          </h2>
          <div className="mt-4 flex flex-wrap items-start justify-between gap-x-8 gap-y-3">
            <p className="max-w-xl flex-1 text-base leading-relaxed text-[#5a6478] sm:text-lg">
              Scroll through the milestones that shaped our equipment, events and kitchen
              capabilities across the UAE.
            </p>
            <Link
              href="/about/journey"
              className="group inline-flex shrink-0 items-center gap-2 pt-0.5 text-sm font-semibold transition-colors duration-300 ease-out sm:pt-1"
              style={{ color: PRIMARY }}
            >
              <span
                className="border-b pb-0.5 transition-[border-color,color] duration-300 ease-out group-hover:border-current"
                style={{ borderColor: "transparent" }}
              >
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

      {/* ── Pinned horizontal scroll stage ──────────────────────── */}
      <div ref={pinStageRef} className="journey-teaser__stage relative z-10 w-full">
        <div ref={pinRef} className={PIN_VIEWPORT_CLASS}>
          <div
            ref={trackRef}
            className="relative z-10 flex h-[min(480px,58vh)] items-center will-change-transform sm:h-[min(500px,60vh)]"
            style={{
              gap: COLUMN_GAP,
              paddingLeft: TRACK_PAD_X,
              paddingRight: TRACK_PAD_X,
              width: "max-content",
            }}
          >
            {/* ── Animated SVG spring path ─────────────────────── */}
            <svg
              className="pointer-events-none absolute inset-0 z-10 h-full w-full overflow-visible"
              aria-hidden
            >
              <defs>
                <marker
                  id="journey-arrow"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto"
                >
                  <path d="M 0 1 L 8 5 L 0 9 Z" fill={ACCENT} />
                </marker>
              </defs>
              <path
                ref={pathRef}
                fill="none"
                stroke={ACCENT}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                markerEnd="url(#journey-arrow)"
                opacity={0}
              />
            </svg>

            {/* ── Milestone cards ──────────────────────────────── */}
            {MILESTONES.map((milestone, index) => {
              const imageTop = index % 2 === 0;

              return (
                <div
                  key={milestone.year}
                  className="relative shrink-0"
                  style={{ width: COLUMN_W }}
                >
                  <div className={CARD_STACK_CLASS}>
                    {/* horizontal centre rule */}
                    <div
                      className="pointer-events-none absolute top-1/2 right-0 left-0 z-0 h-px -translate-y-1/2"
                      style={{ backgroundColor: `${PRIMARY}22` }}
                      aria-hidden
                    />

                    {/* milestone dot */}
                    <span
                      ref={(el) => { dotRefs.current[index] = el; }}
                      className="absolute top-1/2 left-1/2 z-20 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 shadow-sm"
                      style={{
                        backgroundColor: ACCENT,
                        borderColor: BG,
                        boxShadow: `0 0 0 3px ${ACCENT}55`,
                      }}
                      aria-hidden
                    />

                    {imageTop ? (
                      <>
                        {/* top half — image */}
                        <div className="flex min-h-0 flex-1 overflow-hidden rounded-t-xl pb-4">
                          <div
                            className="w-full overflow-hidden rounded-xl border shadow-[0_8px_24px_rgba(27,43,75,0.10)]"
                            style={{
                              borderColor: `${PRIMARY}18`,
                              backgroundColor: "#fff",
                            }}
                          >
                            <MilestoneImage src={milestone.image} alt={milestone.alt} />
                          </div>
                        </div>
                        {/* bottom half — text */}
                        <div className="flex min-h-0 flex-1 flex-col justify-start pt-4">
                          <div
                            className="rounded-xl border shadow-[0_8px_24px_rgba(27,43,75,0.08)]"
                            style={{
                              borderColor: `${PRIMARY}18`,
                              backgroundColor: "rgba(255,255,255,0.72)",
                              backdropFilter: "blur(4px)",
                            }}
                          >
                            <MilestoneText
                              year={milestone.year}
                              title={milestone.title}
                              description={milestone.description}
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* top half — text */}
                        <div className="flex min-h-0 flex-1 flex-col justify-end pb-4">
                          <div
                            className="rounded-xl border shadow-[0_8px_24px_rgba(27,43,75,0.08)]"
                            style={{
                              borderColor: `${PRIMARY}18`,
                              backgroundColor: "rgba(255,255,255,0.72)",
                              backdropFilter: "blur(4px)",
                            }}
                          >
                            <MilestoneText
                              year={milestone.year}
                              title={milestone.title}
                              description={milestone.description}
                            />
                          </div>
                        </div>
                        {/* bottom half — image */}
                        <div className="flex min-h-0 flex-1 overflow-hidden rounded-b-xl pt-4">
                          <div
                            className="w-full overflow-hidden rounded-xl border shadow-[0_8px_24px_rgba(27,43,75,0.10)]"
                            style={{
                              borderColor: `${PRIMARY}18`,
                              backgroundColor: "#fff",
                            }}
                          >
                            <MilestoneImage src={milestone.image} alt={milestone.alt} />
                          </div>
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
