"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Each chapter takes this many vh of scroll distance
const VH_PER_CHAPTER = 100;

const MILESTONES = [
  {
    year: "2005",
    chapter: "01",
    label: "The Founding",
    event:
      "Established in Dubai with a singular focus — supplying premium catering equipment to the UAE's growing hospitality sector. A small team, an unwavering standard.",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80&fit=crop&crop=center",
    alt: "Elegant fine dining table setup",
  },
  {
    year: "2010",
    chapter: "02",
    label: "Events Division",
    event:
      "We entered the event equipment rental market — marquees, tables, linen and staging. The UAE's events scene was booming and Catertech was ready.",
    image:
      "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=900&q=80&fit=crop&crop=center",
    alt: "Grand banquet hall event setup",
  },
  {
    year: "2015",
    chapter: "03",
    label: "Kitchen Equipment",
    event:
      "Launched our commercial kitchen equipment division, serving restaurants, hotel kitchens and institutional clients across every Emirate.",
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&q=80&fit=crop&crop=center",
    alt: "Professional commercial kitchen",
  },
  {
    year: "2020",
    chapter: "04",
    label: "Northern Expansion",
    event:
      "Opened our second warehouse and logistics centre in Ras Al Khaimah — extending our reach and delivery speed across the Northern Emirates.",
    image:
      "https://images.unsplash.com/photo-1553413077-190dd305871c?w=900&q=80&fit=crop&crop=center",
    alt: "Modern logistics warehouse",
  },
  {
    year: "2025",
    chapter: "05",
    label: "Full Event Management",
    event:
      "Today, Catertech delivers end-to-end event management — from equipment and logistics to photography, guest check-in and digital badge generation.",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&q=80&fit=crop&crop=center",
    alt: "Professional event with dramatic lighting",
  },
];

const STATS = [
  { value: 20, suffix: "+", label: "Years" },
  { value: 1000, suffix: "+", label: "Events" },
  { value: 500, suffix: "+", label: "Clients" },
];

export default function JourneyTeaser() {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imgElRefs = useRef<(HTMLImageElement | null)[]>([]);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const statCountRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const statsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const n = MILESTONES.length;

      // ── Initial states ────────────────────────────────────
      // Panel 0 is visible; further milestones sit to the right (off-stage)
      panelRefs.current.forEach((p, i) => {
        if (!p) return;
        gsap.set(p, {
          opacity: i === 0 ? 1 : 0,
          xPercent: i === 0 ? 0 : i > 0 ? 100 : 0,
          x: 0,
        });
      });
      imgElRefs.current.forEach((img, i) => {
        if (!img) return;
        gsap.set(img, { scale: i === 0 ? 1 : 1.07 });
      });

      // ── Stat counters (fire once on section enter) ─────────
      STATS.forEach((s, i) => {
        const el = statCountRefs.current[i];
        if (!el) return;
        gsap.fromTo(
          el,
          { textContent: "0" },
          {
            textContent: s.value,
            duration: 1.6,
            ease: "power2.out",
            snap: { textContent: 1 },
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
            },
          }
        );
      });

      // ── Chapter transition ─────────────────────────────────
      function showChapter(index: number) {
        // Right column: horizontal cross-fade — same vertical slot, slides on X axis
        panelRefs.current.forEach((p, pi) => {
          if (!p) return;
          if (pi === index) {
            gsap.to(p, {
              opacity: 1,
              xPercent: 0,
              x: 0,
              duration: 0.85,
              ease: "power3.out",
            });
          } else if (pi < index) {
            gsap.to(p, {
              opacity: 0,
              xPercent: -42,
              x: 0,
              duration: 0.5,
              ease: "power2.in",
            });
          } else {
            gsap.to(p, {
              opacity: 0,
              xPercent: 42,
              x: 0,
              duration: 0.5,
              ease: "power2.in",
            });
          }
        });

        // Image Ken Burns
        imgElRefs.current.forEach((img, ii) => {
          if (!img) return;
          gsap.to(img, {
            scale: ii === index ? 1 : 1.07,
            duration: 1.1,
            ease: "power2.out",
          });
        });

        // Progress dots
        dotRefs.current.forEach((dot, di) => {
          if (!dot) return;
          gsap.to(dot, {
            backgroundColor: di <= index ? "#C4A265" : "#E5DDD0",
            scale: di === index ? 1.7 : 1,
            duration: 0.3,
          });
        });
      }

      // ── ScrollTrigger per chapter ──────────────────────────
      // Section is n × VH_PER_CHAPTER tall.
      // Each chapter occupies (100/n)% of that total.
      MILESTONES.forEach((_, i) => {
        const pct = 100 / n; // e.g. 20 for 5 chapters
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: `${i * pct}% top`,
          end: `${(i + 1) * pct}% top`,
          onEnter: () => showChapter(i),
          onEnterBack: () => showChapter(i),
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    /**
     * The section is n × 100vh tall — this is what creates
     * the scroll distance for each chapter.
     * The inner sticky div stays pinned at the top and
     * GSAP swaps which right-side panel is visible.
     */
    <section
      ref={sectionRef}
      className="relative bg-offwhite"
      style={{ height: `${MILESTONES.length * VH_PER_CHAPTER}vh` }}
    >
      {/* ── Sticky frame — stays in viewport while section scrolls ── */}
      <div className="sticky top-0 h-screen overflow-hidden bg-offwhite">
        {/* Max-width wrapper — matches spacing of every other section */}
        <div className="max-w-7xl mx-auto px-5 md:px-8 h-full">
        <div className="h-full flex flex-col md:flex-row">

          {/* ════════════════════════════════════════════
              LEFT COLUMN — fixed content, always visible
          ════════════════════════════════════════════ */}
          <div className="md:w-[46%] shrink-0 flex flex-col justify-center pr-8 md:pr-14 py-10 border-r border-border h-[42vh] md:h-full">

            <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-sand block mb-3">
              Our Story
            </span>
            <div className="w-7 h-px bg-sand mb-6" />

            <h2 className="font-serif text-4xl md:text-[2.8rem] lg:text-[3.2rem] text-charcoal leading-[1.06] mb-5">
              Twenty&nbsp;Years<br />
              of Craft&nbsp;&amp;<br />
              <span className="text-sand">Excellence</span>
            </h2>

            <p className="text-muted text-[0.875rem] leading-relaxed mb-8 max-w-xs hidden md:block">
              From a modest Dubai trading company to the UAE&rsquo;s most trusted catering and event equipment partner.
            </p>

            {/* Animated stats */}
            <div ref={statsRef} className="grid grid-cols-3 gap-4 border-t border-border pt-6 mb-8">
              {STATS.map((s, i) => (
                <div key={i}>
                  <div className="font-serif text-2xl md:text-3xl text-charcoal font-bold tabular-nums leading-none mb-1">
                    <span ref={(el) => { statCountRefs.current[i] = el; }}>0</span>
                    {s.suffix}
                  </div>
                  <p className="text-[10px] text-muted tracking-widest uppercase">{s.label}</p>
                </div>
              ))}
            </div>

            <Link
              href="/about/journey"
              className="group inline-flex items-center gap-2.5 text-[0.8rem] font-medium text-charcoal self-start"
            >
              <span className="border-b border-charcoal/25 pb-0.5 group-hover:border-sand group-hover:text-sand transition-all duration-300">
                Read the full story
              </span>
              <svg
                className="w-3.5 h-3.5 text-sand group-hover:translate-x-1 transition-transform duration-300"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* ════════════════════════════════════════════
              RIGHT COLUMN — one milestone panel at a time
              Panels are absolutely stacked; GSAP controls
              which one is visible.
          ════════════════════════════════════════════ */}
          <div className="relative flex-1 overflow-hidden h-[58vh] md:h-full">

            {MILESTONES.map((m, i) => (
              <div
                key={i}
                ref={(el) => { panelRefs.current[i] = el; }}
                className="absolute inset-0 flex flex-col justify-center pl-8 md:pl-14 py-10"
              >
                {/* Ghost year — large background number */}
                <div
                  aria-hidden
                  className="absolute top-6 right-4 md:top-8 md:right-8 font-serif font-bold text-charcoal/3 leading-none select-none pointer-events-none"
                  style={{ fontSize: "clamp(5rem, 14vw, 11rem)" }}
                >
                  {m.year}
                </div>

                {/* Chapter indicator */}
                <span className="text-[9px] font-mono tracking-[0.25em] uppercase text-muted/40 block mb-4">
                  {m.chapter}&nbsp;/&nbsp;{String(MILESTONES.length).padStart(2, "0")}&ensp;·&ensp;{m.label}
                </span>

                {/* Year — prominent */}
                <div className="font-serif font-bold text-sand/30 leading-none tabular-nums mb-3"
                  style={{ fontSize: "clamp(3.5rem, 8vw, 6rem)" }}>
                  {m.year}
                </div>

                {/* Title */}
                <h3 className="font-serif text-xl md:text-2xl text-charcoal leading-tight mb-3">
                  {m.label}
                </h3>

                {/* Gold rule */}
                <div className="w-7 h-px bg-sand mb-4" />

                {/* Description */}
                <p className="text-muted text-[0.875rem] leading-relaxed mb-6 max-w-sm">
                  {m.event}
                </p>

                {/* Image */}
                <div className="overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    ref={(el) => { imgElRefs.current[i] = el; }}
                    src={m.image}
                    alt={m.alt}
                    className="w-full h-40 md:h-48 object-cover"
                    loading={i === 0 ? "eager" : "lazy"}
                  />
                </div>
              </div>
            ))}

            {/* Progress dots — bottom left of right panel */}
            <div className="absolute bottom-6 left-8 md:left-14 flex items-center gap-2.5 z-10">
              {MILESTONES.map((_, i) => (
                <span
                  key={i}
                  ref={(el) => { dotRefs.current[i] = el; }}
                  className="block w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: i === 0 ? "#C4A265" : "#E5DDD0" }}
                />
              ))}
            </div>

            {/* Scroll cue — suggests horizontal milestone advance */}
            <div className="absolute top-6 right-6 flex items-center gap-2 opacity-30">
              <span className="text-[8px] tracking-[0.25em] uppercase text-charcoal font-medium whitespace-nowrap">Scroll</span>
              <div className="h-px w-7 bg-charcoal/40 relative overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-sand"
                  style={{
                    width: "40%",
                    animation: "scrollSweep 2s ease-in-out infinite",
                  }}
                />
              </div>
            </div>

          </div>
        </div>
        </div>{/* end max-w-7xl */}
      </div>

      <style>{`
        @keyframes scrollSweep {
          0%   { transform: translateX(-100%); opacity: 0; }
          25%  { opacity: 1; }
          75%  { opacity: 1; }
          100% { transform: translateX(300%); opacity: 0; }
        }
      `}</style>
    </section>
  );
}
