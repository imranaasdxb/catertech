"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

export default function HeroSection() {
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = headlineRef.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    const timer = setTimeout(() => {
      el.style.transition = "opacity 0.9s ease, transform 0.9s ease";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative h-screen min-h-[600px] flex items-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #0D1220 0%, #1A1F2E 40%, #2C1F10 100%)",
        }}
      />
      {/* Subtle grain texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />

      {/* Gold accent line — left edge */}
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-linear-to-b from-transparent via-sand to-transparent opacity-60" />

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-[#0D1220]/80 to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 w-full">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-8">
            <span className="w-8 h-px bg-sand" />
            <span className="text-sand text-xs font-semibold tracking-[0.25em] uppercase">
              Dubai · UAE · Since 2005
            </span>
          </div>

          {/* Headline */}
          <h1
            ref={headlineRef}
            className="font-serif text-5xl md:text-6xl lg:text-7xl text-white leading-[1.08] mb-6"
          >
            Premium Catering
            <br />
            <span className="text-sand">& Event Equipment</span>
          </h1>

          {/* Sub */}
          <p className="text-white/55 text-lg md:text-xl font-light leading-relaxed mb-10 max-w-lg">
            Supplying hotels, event companies and F&amp;B businesses
            across Dubai and UAE with world-class equipment.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <Link
              href="/shop"
              className="bg-sand hover:bg-sand-dark text-white text-sm font-semibold tracking-widest uppercase px-8 py-4 transition-colors duration-200"
            >
              Browse Equipment
            </Link>
            <Link
              href="/trade/rfq"
              className="border border-white/40 hover:border-white text-white text-sm font-semibold tracking-widest uppercase px-8 py-4 transition-colors duration-200 hover:bg-white/5"
            >
              Request a Quote
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30">
        <span className="text-[10px] tracking-[0.2em] uppercase">Scroll</span>
        <div className="w-px h-8 bg-linear-to-b from-white/30 to-transparent animate-pulse" />
      </div>
    </section>
  );
}
