"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const MILESTONES = [
  {
    year: "2005",
    title: "The Beginning",
    subtitle: "Founded in Dubai",
    desc: "Catertech was born in Dubai's thriving hospitality scene — a small team with a singular ambition: supply the finest catering equipment to the UAE's growing hotel and restaurant industry.",
    index: "01",
  },
  {
    year: "2007",
    title: "First Hotel Contract",
    subtitle: "Five-star confidence",
    desc: "A pivotal year. We secured our first major supply contract with a prestigious 5-star Dubai hotel group — the moment that validated our quality-first philosophy.",
    index: "02",
  },
  {
    year: "2010",
    title: "Events Division",
    subtitle: "Expanding our reach",
    desc: "We entered the event equipment rental market — tables, chairs, linen, staging. The UAE's events industry was exploding and Catertech was ready to grow with it.",
    index: "03",
  },
  {
    year: "2012",
    title: "500 Clients",
    subtitle: "A community milestone",
    desc: "Reaching 500 registered corporate clients was more than a number. It confirmed that trust, built through consistent delivery and personal service, is the most durable currency.",
    index: "04",
  },
  {
    year: "2015",
    title: "Kitchen Division",
    subtitle: "Into the professional kitchen",
    desc: "We launched our commercial kitchen equipment division, serving restaurants, institutional kitchens and hotel back-of-house operations across the UAE.",
    index: "05",
  },
  {
    year: "2017",
    title: "RAK Expansion",
    subtitle: "Growing the footprint",
    desc: "Our second warehouse and operations centre opened in Ras Al Khaimah — bringing us closer to clients across the Northern Emirates and expanding our logistics capacity.",
    index: "06",
  },
  {
    year: "2019",
    title: "1,000 Events",
    subtitle: "A thousand stories",
    desc: "We crossed the milestone of 1,000 events supplied across the UAE — from intimate corporate dinners to large-scale public gatherings. Every event a story. Every client a relationship.",
    index: "07",
  },
  {
    year: "2021",
    title: "Digital Shift",
    subtitle: "Technology meets tradition",
    desc: "We launched our online catalogue and digital RFQ system, making it effortless for corporate clients to browse, request and manage their equipment needs from anywhere.",
    index: "08",
  },
  {
    year: "2023",
    title: "Deseri Partnership",
    subtitle: "LED, AV & beyond",
    desc: "A strategic alliance with Deseri & Smart Electronics brought world-class LED wall, AV and lighting solutions under the Catertech umbrella — completing our event ecosystem.",
    index: "09",
  },
  {
    year: "2025",
    title: "Full Event Management",
    subtitle: "Turnkey, end-to-end",
    desc: "Today, Catertech offers full event management — from equipment and logistics to photography, guest check-in and digital badge generation. Twenty years, one mission.",
    index: "10",
  },
];

const CLOSING_STATS = [
  { value: "20+", label: "Years active" },
  { value: "1,000+", label: "Events served" },
  { value: "500+", label: "Corporate clients" },
  { value: "2", label: "Warehouse locations" },
];

export default function JourneyPage() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<(HTMLDivElement | null)[]>([]);
  const bgYearsRef = useRef<(HTMLDivElement | null)[]>([]);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const chapterIndexRef = useRef<HTMLSpanElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const n = MILESTONES.length;

      // ── Hero entrance ────────────────────────────────────
      const heroItems = heroTextRef.current?.children
        ? Array.from(heroTextRef.current.children)
        : [];
      gsap.from(heroItems, {
        opacity: 0,
        y: 40,
        stagger: 0.15,
        duration: 1.1,
        ease: "power3.out",
        delay: 0.2,
      });

      // Hero scroll-out parallax
      gsap.to(heroTextRef.current, {
        y: -60,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.8,
        },
      });

      // ── Scroll hint fade ─────────────────────────────────
      gsap.to(scrollHintRef.current, {
        opacity: 0,
        scrollTrigger: {
          trigger: heroRef.current,
          start: "10% top",
          end: "25% top",
          scrub: true,
        },
      });

      // ── Set initial panel states ─────────────────────────
      panelsRef.current.forEach((panel, i) => {
        if (i === 0 || !panel) return;
        gsap.set(panel, { opacity: 0, y: 48 });
      });
      bgYearsRef.current.forEach((el, i) => {
        if (i === 0 || !el) return;
        gsap.set(el, { opacity: 0 });
      });

      // ── Chapter transition helper ────────────────────────
      function showChapter(index: number) {
        if (chapterIndexRef.current) {
          chapterIndexRef.current.textContent = MILESTONES[index].index;
        }

        panelsRef.current.forEach((panel, pi) => {
          if (!panel) return;
          if (pi === index) {
            gsap.to(panel, { opacity: 1, y: 0, duration: 0.75, ease: "power3.out" });
          } else {
            gsap.to(panel, {
              opacity: 0,
              y: pi < index ? -32 : 48,
              duration: 0.45,
              ease: "power2.in",
            });
          }
        });

        bgYearsRef.current.forEach((el, ei) => {
          if (!el) return;
          gsap.to(el, {
            opacity: ei === index ? 1 : 0,
            duration: 0.9,
            ease: "power2.inOut",
          });
        });
      }

      // ── ScrollTrigger per chapter ────────────────────────
      MILESTONES.forEach((_, i) => {
        const chapterPct = 100 / n;
        const start = `${i * chapterPct}% top`;
        const end = `${(i + 1) * chapterPct}% top`;

        ScrollTrigger.create({
          trigger: scrollContainerRef.current,
          start,
          end,
          onEnter: () => showChapter(i),
          onEnterBack: () => showChapter(i),
        });
      });

      // ── Scrubbed progress bar ────────────────────────────
      gsap.fromTo(
        progressBarRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: scrollContainerRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
          },
        }
      );

      // ── Closing section reveal ───────────────────────────
      gsap.from(closingRef.current?.querySelectorAll("[data-reveal]") ?? [], {
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: closingRef.current,
          start: "top 75%",
        },
      });
    },
    { scope: wrapperRef }
  );

  return (
    <div ref={wrapperRef}>
      {/* ══════════════════════════════════════════════════
          HERO — full-height, cinematic
      ══════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative h-screen bg-navy flex items-center justify-center overflow-hidden"
      >
        {/* Subtle grain texture overlay */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
          }}
        />

        {/* Gold accent lines — decorative corners */}
        <div aria-hidden className="absolute top-12 left-8 md:left-16 w-8 h-8 border-t border-l border-sand/30" />
        <div aria-hidden className="absolute bottom-12 right-8 md:right-16 w-8 h-8 border-b border-r border-sand/30" />

        <div ref={heroTextRef} className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <span className="text-[10px] font-semibold tracking-[0.35em] uppercase text-sand block mb-6">
            Our Story
          </span>
          <div className="w-10 h-px bg-sand/50 mx-auto mb-8" />
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white leading-none mb-6">
            Twenty&nbsp;Years<br />
            <em className="not-italic text-sand">in the Making</em>
          </h1>
          <p className="text-white/40 text-base md:text-lg leading-relaxed max-w-md mx-auto mt-6">
            From a small Dubai trading company to the UAE&rsquo;s most trusted catering and event partner.
          </p>
        </div>

        {/* Scroll indicator */}
        <div
          ref={scrollHintRef}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <span className="text-[9px] tracking-[0.3em] uppercase text-white/25 font-medium">Scroll</span>
          <div className="w-px h-10 bg-linear-to-b from-white/20 to-transparent relative overflow-hidden">
            <div
              className="absolute top-0 left-0 w-full bg-sand"
              style={{
                height: "40%",
                animation: "scrollDrop 2s ease-in-out infinite",
              }}
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          SCROLL NARRATIVE — pinned chapters
      ══════════════════════════════════════════════════ */}
      <div
        ref={scrollContainerRef}
        style={{ height: `${MILESTONES.length * 100}vh` }}
      >
        <div className="sticky top-0 h-screen bg-navy overflow-hidden">

          {/* Background ghost years — crossfade */}
          <div
            aria-hidden
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          >
            {MILESTONES.map((m, i) => (
              <div
                key={i}
                ref={(el) => { bgYearsRef.current[i] = el; }}
                className="absolute font-serif font-bold text-white/4 leading-none"
                style={{ fontSize: "clamp(8rem, 28vw, 28rem)" }}
              >
                {m.year}
              </div>
            ))}
          </div>

          {/* Horizontal gold rule — top */}
          <div className="absolute top-0 left-0 right-0 h-px bg-white/5" />

          {/* Left — progress line */}
          <div className="absolute left-6 md:left-12 top-1/4 bottom-1/4 w-px bg-white/8">
            <div
              ref={progressBarRef}
              className="absolute top-0 left-0 w-full bg-sand origin-top"
              style={{ height: "100%" }}
            />
          </div>

          {/* Left — year label alongside progress */}
          <div className="absolute left-10 md:left-16 top-1/2 -translate-y-1/2">
            <div
              className="font-serif text-[0.65rem] text-sand/40 tracking-widest uppercase"
              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
            >
              {MILESTONES[0].year} — {MILESTONES[MILESTONES.length - 1].year}
            </div>
          </div>

          {/* Top-right — chapter counter */}
          <div className="absolute top-8 md:top-10 right-6 md:right-12 flex items-center gap-2 font-mono text-xs text-white/20">
            <span ref={chapterIndexRef} className="text-sand/60">01</span>
            <span className="text-white/10">/</span>
            <span>{MILESTONES.length.toString().padStart(2, "0")}</span>
          </div>

          {/* Content panels */}
          <div className="relative h-full flex items-center justify-center px-8 md:px-24 lg:px-32">
            {MILESTONES.map((m, i) => (
              <div
                key={i}
                ref={(el) => { panelsRef.current[i] = el; }}
                className="absolute w-full max-w-2xl text-center"
              >
                {/* Year pill */}
                <div className="inline-flex items-center gap-3 mb-8">
                  <div className="w-6 h-px bg-sand/40" />
                  <span className="text-sand text-[11px] font-semibold tracking-[0.3em] uppercase">
                    {m.year}
                  </span>
                  <div className="w-6 h-px bg-sand/40" />
                </div>

                {/* Subtitle */}
                <p className="text-white/30 text-xs tracking-[0.2em] uppercase mb-4 font-medium">
                  {m.subtitle}
                </p>

                {/* Title */}
                <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-7">
                  {m.title}
                </h2>

                {/* Gold divider */}
                <div className="w-10 h-px bg-sand/50 mx-auto mb-7" />

                {/* Description */}
                <p className="text-white/50 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
                  {m.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom fade */}
          <div
            aria-hidden
            className="absolute bottom-0 left-0 right-0 h-20 bg-linear-to-t from-navy to-transparent pointer-events-none"
          />
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          CLOSING — stats + CTA
      ══════════════════════════════════════════════════ */}
      <section ref={closingRef} className="bg-offwhite py-32 md:py-40">
        <div className="max-w-6xl mx-auto px-5 md:px-8">

          {/* Section label */}
          <div className="text-center mb-20" data-reveal>
            <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-sand block mb-4">
              Where We Stand Today
            </span>
            <div className="w-8 h-px bg-sand mx-auto mb-7" />
            <h2 className="font-serif text-4xl md:text-5xl text-charcoal leading-tight max-w-xl mx-auto">
              Two decades, one unwavering standard.
            </h2>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border mb-20">
            {CLOSING_STATS.map((s, i) => (
              <div
                key={i}
                className="bg-offwhite px-8 py-10 text-center group hover:bg-cream transition-colors duration-300"
                data-reveal
              >
                <div className="font-serif text-4xl md:text-5xl text-charcoal font-bold mb-2 group-hover:text-sand transition-colors duration-300">
                  {s.value}
                </div>
                <p className="text-muted text-xs tracking-widest uppercase">{s.label}</p>
              </div>
            ))}
          </div>

          {/* CTA row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4" data-reveal>
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
        </div>
      </section>

      {/* Scroll animation keyframe */}
      <style>{`
        @keyframes scrollDrop {
          0% { transform: translateY(-100%); opacity: 0; }
          30% { opacity: 1; }
          70% { opacity: 1; }
          100% { transform: translateY(300%); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
