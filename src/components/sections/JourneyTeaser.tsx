"use client";

import { useRef } from "react";
import Link from "next/link";
import Container from "@/components/Container";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const VH_PER_CHAPTER = 76;

const MILESTONES = [
  {
    year: "2005",
    chapter: "01",
    label: "The Founding",
    event:
      "Established in Dubai with a clear standard: reliable, premium catering equipment for the UAE's fast-growing hospitality sector.",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1100&q=82&fit=crop&crop=center",
    alt: "Elegant fine dining table setup",
  },
  {
    year: "2010",
    chapter: "02",
    label: "Events Division",
    event:
      "Expanded into event rentals with marquees, tables, linen and staging for the region's most demanding event teams.",
    image:
      "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=1100&q=82&fit=crop&crop=center",
    alt: "Grand banquet hall event setup",
  },
  {
    year: "2015",
    chapter: "03",
    label: "Kitchen Equipment",
    event:
      "Built a commercial kitchen equipment division for restaurants, hotels and institutional clients across every Emirate.",
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1100&q=82&fit=crop&crop=center",
    alt: "Professional commercial kitchen",
  },
  {
    year: "2020",
    chapter: "04",
    label: "Northern Expansion",
    event:
      "Opened a second warehouse and logistics centre in Ras Al Khaimah, improving reach and delivery speed across the North.",
    image:
      "https://images.unsplash.com/photo-1553413077-190dd305871c?w=1100&q=82&fit=crop&crop=center",
    alt: "Modern logistics warehouse",
  },
  {
    year: "2025",
    chapter: "05",
    label: "Full Event Management",
    event:
      "Now delivering end-to-end event support, from equipment and logistics to guest check-in, photography and digital badges.",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1100&q=82&fit=crop&crop=center",
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
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
  const markerRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const progressRef = useRef<HTMLDivElement>(null);
  const statCountRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useGSAP(
    () => {
      panelRefs.current.forEach((panel, index) => {
        if (!panel) return;
        gsap.set(panel, {
          autoAlpha: index === 0 ? 1 : 0,
          y: index === 0 ? 0 : 18,
          pointerEvents: index === 0 ? "auto" : "none",
        });
      });

      imageRefs.current.forEach((image, index) => {
        if (!image) return;
        gsap.set(image, {
          autoAlpha: index === 0 ? 1 : 0,
          scale: index === 0 ? 1 : 1.025,
        });
      });

      STATS.forEach((stat, index) => {
        const el = statCountRefs.current[index];
        if (!el) return;

        gsap.fromTo(
          el,
          { textContent: "0" },
          {
            textContent: stat.value,
            duration: 1.15,
            ease: "power2.out",
            snap: { textContent: 1 },
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 72%",
              once: true,
            },
          }
        );
      });

      function showChapter(index: number) {
        panelRefs.current.forEach((panel, panelIndex) => {
          if (!panel) return;
          gsap.to(panel, {
            autoAlpha: panelIndex === index ? 1 : 0,
            y: panelIndex === index ? 0 : panelIndex < index ? -14 : 18,
            pointerEvents: panelIndex === index ? "auto" : "none",
            duration: panelIndex === index ? 0.62 : 0.28,
            ease: "power3.out",
          });
        });

        imageRefs.current.forEach((image, imageIndex) => {
          if (!image) return;
          gsap.to(image, {
            autoAlpha: imageIndex === index ? 1 : 0,
            scale: imageIndex === index ? 1 : 1.025,
            duration: 0.72,
            ease: "power2.out",
          });
        });

        markerRefs.current.forEach((marker, markerIndex) => {
          if (!marker) return;
          gsap.to(marker, {
            backgroundColor: markerIndex <= index ? "#0a0a0a" : "rgba(10,10,10,0.18)",
            width: markerIndex === index ? 34 : 8,
            duration: 0.25,
            ease: "power2.out",
          });
        });

        gsap.to(progressRef.current, {
          scaleX: (index + 1) / MILESTONES.length,
          duration: 0.34,
          ease: "power2.out",
        });
      }

      MILESTONES.forEach((_, index) => {
        const step = 100 / MILESTONES.length;
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: `${index * step}% top`,
          end: `${(index + 1) * step}% top`,
          onEnter: () => showChapter(index),
          onEnterBack: () => showChapter(index),
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative bg-white text-[#0a0a0a]"
      style={{ height: `${MILESTONES.length * VH_PER_CHAPTER}vh` }}
    >
      <div className="sticky top-0 min-h-[100svh] overflow-hidden bg-white">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-black/10" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-black/10" />

        <Container className="relative min-h-[100svh]">
          <div className="grid min-h-[100svh] gap-6 py-7 lg:grid-cols-[0.78fr_1.22fr] lg:items-center lg:gap-12 lg:py-10">
            <div className="max-w-[31rem]">
              <div className="mb-6 flex items-center gap-4">
                <span className="h-px w-12 bg-black" />
                <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-black/48">
                  Company Journey
                </p>
              </div>

              <h2 className="font-serif text-[2.35rem] font-bold leading-[1.02] text-black sm:text-5xl lg:text-[4.25rem]">
                A story told through progress.
              </h2>
              <p className="mt-5 max-w-md text-sm leading-7 text-black/58 sm:text-base">
                Scroll through the chapters that shaped Catertech from a focused Dubai supplier into a trusted UAE event and kitchen partner.
              </p>

              <div className="mt-7 grid grid-cols-3 border-y border-black/10">
                {STATS.map((stat, index) => (
                  <div key={stat.label} className="py-4 pr-4">
                    <div className="font-serif text-2xl font-bold leading-none text-black sm:text-3xl">
                      <span ref={(el) => { statCountRefs.current[index] = el; }}>0</span>
                      {stat.suffix}
                    </div>
                    <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.22em] text-black/45">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              <Link
                href="/about/journey"
                className="group mt-7 inline-flex w-fit items-center gap-3 text-sm font-semibold text-black"
              >
                <span className="border-b border-black/25 pb-1 transition-colors duration-300 group-hover:border-black">
                  Read the full story
                </span>
                <span className="grid h-8 w-8 place-items-center rounded-full border border-black/15 transition duration-300 group-hover:translate-x-1 group-hover:border-black">
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </Link>
            </div>

            <div className="relative min-h-[390px] sm:min-h-[480px] lg:min-h-[560px]">
              <div className="absolute left-0 top-0 h-px w-full bg-black/10">
                <div ref={progressRef} className="h-full origin-left scale-x-[0.2] bg-black" />
              </div>

              <div className="grid h-full min-h-[390px] grid-rows-[190px_1fr] gap-6 sm:min-h-[480px] sm:grid-rows-[250px_1fr] lg:min-h-[560px] lg:grid-rows-[320px_1fr]">
                <div className="relative overflow-hidden border-y border-black/10">
                  {MILESTONES.map((milestone, index) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={milestone.year}
                      ref={(el) => { imageRefs.current[index] = el; }}
                      src={milestone.image}
                      alt={milestone.alt}
                      className="absolute inset-0 h-full w-full object-cover grayscale"
                      loading={index === 0 ? "eager" : "lazy"}
                    />
                  ))}
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.76),rgba(255,255,255,0.08)_42%,rgba(255,255,255,0.52)_100%)]" />
                </div>

                <div className="relative">
                  {MILESTONES.map((milestone, index) => (
                    <div
                      key={milestone.chapter}
                      ref={(el) => { panelRefs.current[index] = el; }}
                      className="absolute inset-x-0 top-0"
                    >
                      <div className="grid gap-5 sm:grid-cols-[9rem_1fr] sm:gap-8">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-black/42">
                            {milestone.chapter} / {String(MILESTONES.length).padStart(2, "0")}
                          </p>
                          <p className="mt-3 font-serif text-5xl font-bold leading-none text-black sm:text-6xl">
                            {milestone.year}
                          </p>
                        </div>
                        <div className="max-w-xl">
                          <h3 className="font-serif text-2xl font-bold leading-tight text-black sm:text-3xl">
                            {milestone.label}
                          </h3>
                          <p className="mt-4 text-sm leading-7 text-black/60 sm:text-[0.95rem]">
                            {milestone.event}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute bottom-0 left-0 flex items-center gap-2">
                {MILESTONES.map((milestone, index) => (
                  <span
                    key={milestone.year}
                    ref={(el) => { markerRefs.current[index] = el; }}
                    className="h-2 rounded-full"
                    style={{
                      width: index === 0 ? 34 : 8,
                      backgroundColor: index === 0 ? "#0a0a0a" : "rgba(10,10,10,0.18)",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
