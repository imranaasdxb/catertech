"use client";

import Image from "next/image";
import Container from "@/components/Container";
import { useReducedMotion } from "framer-motion";
import { Star } from "lucide-react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

const TESTIMONIALS = [
  {
    quote:
      "Catertech has been our go‑to supplier for all event equipment for the past eight years. Quality is consistent and the team delivers on time, every time.",
    name: "Ahmed Al Rashid",
    company: "Dubai World Trade Centre",
    role: "Events Director",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=320&h=320&fit=crop&crop=faces&q=85",
    imageAlt: "Portrait of Ahmed Al Rashid",
  },
  {
    quote:
      "We rely on Catertech for banquet equipment—the range is excellent, service is professional, and they truly understand hospitality operations.",
    name: "Sarah Mitchell",
    company: "Jumeirah Beach Hotel",
    role: "F&B Manager",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=320&h=320&fit=crop&crop=faces&q=85",
    imageAlt: "Portrait of Sarah Mitchell",
  },
  {
    quote:
      "From enquiry to delivery, the process is smooth. Catertech stands apart from other suppliers we have used across the Emirates.",
    name: "Khalid Mansouri",
    company: "Rotana Hotels",
    role: "Procurement Manager",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=320&h=320&fit=crop&crop=faces&q=85",
    imageAlt: "Portrait of Khalid Mansouri",
  },
  {
    quote:
      "Their logistics team respects venue timelines—we get clear communication, clean handovers, and equipment that arrives stage‑ready.",
    name: "Omar Hassan",
    company: "Madinat Arena",
    role: "Venue Operations Lead",
    image:
      "https://images.unsplash.com/photo-1566492031773-9277d6d5d6c3?w=320&h=320&fit=crop&crop=faces&q=85",
    imageAlt: "Portrait of Omar Hassan",
  },
  {
    quote:
      "Scale and flexibility matter for our gala programme. Catertech has scaled with us from intimate dinners to 1,500‑guest events without missing a beat.",
    name: "Elena Kostas",
    company: "Premium Catering Group Dubai",
    role: "Programme Director",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=320&h=320&fit=crop&crop=faces&q=85",
    imageAlt: "Portrait of Elena Kostas",
  },
];

const STEP_MS = 1500;
/** One full card visible; no peek of the next slide */
const PEEK_RATIO = 0;

/** Padding above carousel track so emphasized (-translate-y) cards are not clipped */
const CARD_TOP_INSET_PX = 14;

function TestimonialCard({
  item,
  ariaHidden,
  emphasized,
}: {
  item: (typeof TESTIMONIALS)[number];
  ariaHidden?: boolean;
  /** Active slide: clearer lift & shadow toward the viewer */
  emphasized?: boolean;
}) {
  return (
    <article
      aria-hidden={ariaHidden}
      className={`group relative flex min-h-50 gap-5 sm:gap-6 rounded-2xl border border-border/50 bg-white/90 p-5 sm:p-6 backdrop-blur-sm ring-1 transition-[box-shadow,border-color,transform] duration-500 md:min-h-54 ${
        emphasized
          ? "shadow-[0_10px_0_-4px_rgba(44,40,38,0.04),0_28px_48px_-22px_rgba(44,40,38,0.22)] ring-charcoal/4 border-border sm:-translate-y-1 relative z-1"
          : "shadow-[0_12px_40px_-28px_rgba(44,40,38,0.35)] ring-charcoal/2 hover:border-border hover:shadow-[0_20px_50px_-24px_rgba(44,40,38,0.28)]"
      }`}
    >
      <div className="relative shrink-0">
        <div className="relative size-19 sm:size-21 overflow-hidden rounded-xl">
          <Image
            src={item.image}
            alt={ariaHidden ? "" : item.imageAlt}
            width={176}
            height={176}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 76px, 84px"
          />
        </div>
        <div
          className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-md bg-sand text-[9px] font-bold text-white shadow-sm"
          aria-hidden
        >
          ✓
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="mb-2.5 flex gap-0.5" aria-hidden>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className="size-3.5 fill-sand/90 text-sand"
              strokeWidth={0}
            />
          ))}
        </div>
        <blockquote className="line-clamp-4 text-[0.9375rem] sm:text-[0.97rem] leading-relaxed text-charcoal/95">
          <span className="font-serif text-[1.05em] text-charcoal">“</span>
          <span className="font-sans">{item.quote}</span>
          <span className="font-serif text-[1.05em] text-charcoal">”</span>
        </blockquote>
        <footer className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-0.5 border-t border-border/40 pt-4">
          <p className="text-sm font-semibold text-charcoal">{item.name}</p>
          <span className="text-border text-xs" aria-hidden>
            ·
          </span>
          <span className="text-xs text-muted">{item.role}</span>
          <span className="w-full text-[11px] font-medium uppercase tracking-[0.14em] text-muted/80 sm:mt-0.5">
            {item.company}
          </span>
        </footer>
      </div>
    </article>
  );
}

export default function TestimonialsSection() {
  const reduceMotion = useReducedMotion();
  const prefersReducedMotion = Boolean(reduceMotion);

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [stepPx, setStepPx] = useState(0);
  const [viewportCap, setViewportCap] = useState(560);
  /** Disable transform transition when snapping from last slide back to first */
  const [instantJump, setInstantJump] = useState(false);
  const n = TESTIMONIALS.length;

  const measureStep = useCallback(() => {
    const a = slotRefs.current[0];
    const b = slotRefs.current[1];
    if (a && b) {
      setStepPx(Math.round(b.offsetTop - a.offsetTop));
      return;
    }
    if (a) {
      setStepPx(Math.round(a.offsetHeight + 20));
    }
  }, []);

  const updateLayout = useCallback(() => {
    setViewportCap(Math.round(window.innerHeight * 0.55));
    measureStep();
  }, [measureStep]);

  useLayoutEffect(() => {
    updateLayout();
    const nodes = slotRefs.current.filter(Boolean) as HTMLElement[];
    const ro = new ResizeObserver(updateLayout);
    nodes.forEach((el) => ro.observe(el));
    window.addEventListener("resize", updateLayout);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateLayout);
    };
  }, [updateLayout]);

  useEffect(() => {
    if (prefersReducedMotion || paused || stepPx <= 0) return;
    const t = window.setInterval(() => {
      setActive((prev) => {
        if (prev >= n - 1) {
          setInstantJump(true);
          return 0;
        }
        return prev + 1;
      });
    }, STEP_MS);
    return () => window.clearInterval(t);
  }, [prefersReducedMotion, paused, n, stepPx]);

  useEffect(() => {
    if (!instantJump) return;
    const id = requestAnimationFrame(() => setInstantJump(false));
    return () => cancelAnimationFrame(id);
  }, [instantJump]);

  const translateY =
    stepPx > 0 ? -(active % n) * stepPx : 0;
  const viewportH =
    stepPx <= 0
      ? 400
      : PEEK_RATIO > 0
        ? Math.min(
            Math.round(stepPx * (1 + PEEK_RATIO)),
            viewportCap,
          )
        : Math.round(stepPx * (1 + PEEK_RATIO));

  return (
    <section className="bg-offwhite border-t border-border/40">
      <Container className="py-24 md:py-32 lg:py-36">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
          <header className="lg:col-span-4 xl:col-span-3 flex flex-col gap-7 lg:pr-6 lg:sticky lg:top-28">
            <div className="space-y-5">
              <p className="text-[10px] font-semibold tracking-[0.24em] uppercase text-muted">
                Client testimonials
              </p>
              <h2 className="font-serif text-3xl md:text-[2rem] xl:text-[2.25rem] text-charcoal leading-[1.12] tracking-[-0.02em]">
                Stories from the teams we support
              </h2>
              <p className="text-sm md:text-[0.9375rem] text-muted leading-relaxed max-w-88">
                Venues and operators across Dubai and the Northern Emirates hear
                directly from partners on how we show up on site.
              </p>
            </div>
            {/* {!prefersReducedMotion && (
              <p className="text-[11px] tracking-[0.12em] uppercase text-muted/90">
                One story at a time · hover to pause
              </p>
            )} */}
          </header>

          <div
            className="relative lg:col-span-8 xl:col-span-9"
            role="region"
            aria-live={prefersReducedMotion ? undefined : "polite"}
            aria-label={
              prefersReducedMotion
                ? "Client testimonials list"
                : "Client testimonials carousel; hover to pause"
            }
          >
            <div className="relative mx-auto max-w-2xl md:max-w-none">
              {/* Progress dots */}
              <div
                className="mb-4 flex items-center gap-2 sm:justify-end"
                role="tablist"
                aria-label="Select testimonial"
              >
                {TESTIMONIALS.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setInstantJump(false);
                      setActive(i);
                    }}
                    className={`h-1.5 rounded-full transition-all duration-300 focus-visible:ring-2 focus-visible:ring-sand focus-visible:ring-offset-2 focus-visible:ring-offset-offwhite ${
                      i === active
                        ? "w-6 bg-sand"
                        : "w-1.5 bg-border hover:bg-sand/50"
                    }`}
                    aria-label={`Show testimonial ${i + 1}`}
                    role="tab"
                    aria-selected={i === active}
                  />
                ))}
              </div>

              {prefersReducedMotion ? (
                <div className="space-y-5 overflow-y-auto [scrollbar-width:thin] pb-2 pr-1 sm:max-h-[min(80vh,620px)]">
                  {TESTIMONIALS.map((item, i) => (
                    <TestimonialCard key={item.name} item={item} ariaHidden={false} />
                  ))}
                </div>
              ) : (
                <div
                  className="relative overflow-hidden rounded-xl shadow-[inset_0_1px_0_0_rgba(44,40,38,0.04)] ring-1 ring-border/30"
                  style={
                    {
                      height: viewportH + CARD_TOP_INSET_PX,
                    } as CSSProperties
                  }
                  onMouseEnter={() => setPaused(true)}
                  onMouseLeave={() => setPaused(false)}
                >
                  <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-12 rounded-t-[inherit] bg-linear-to-b from-offwhite via-offwhite/55 to-transparent" />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-10 rounded-b-[inherit] bg-linear-to-t from-offwhite via-offwhite/60 to-transparent" />

                  {/* Soft halo so the slide reads as grounded against the viewport top */}
                  <div
                    className="pointer-events-none absolute inset-x-[10%] top-4 z-4 h-14 rounded-[100%] bg-charcoal/[0.052] blur-2xl"
                    aria-hidden
                  />

                  <div
                    className="absolute inset-x-0 bottom-0 overflow-hidden rounded-b-[inherit]"
                    style={{
                      top: CARD_TOP_INSET_PX,
                      WebkitMaskImage:
                        "linear-gradient(to bottom, black 0%, black 92%, transparent 100%)",
                      maskImage:
                        "linear-gradient(to bottom, black 0%, black 92%, transparent 100%)",
                    }}
                  >
                    <div
                      className="flex flex-col gap-5 will-change-transform motion-reduce:transform-none"
                      style={{
                        transform: `translate3d(0, ${translateY}px, 0)`,
                        transition:
                          prefersReducedMotion ||
                          stepPx <= 0 ||
                          instantJump
                            ? undefined
                            : "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
                      }}
                    >
                      {TESTIMONIALS.map((item, i) => (
                        <div
                          key={item.name}
                          ref={(el) => {
                            slotRefs.current[i] = el;
                          }}
                          data-testimonial-slot
                        >
                          <TestimonialCard
                            item={item}
                            ariaHidden={i !== active}
                            emphasized={i === active}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div
              className="pointer-events-none absolute -left-4 top-24 hidden h-48 w-px bg-linear-to-b from-transparent via-sand/35 to-transparent md:block lg:-left-5"
              aria-hidden
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
