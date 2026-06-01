"use client";

import Image from "next/image";

const FOOTER_IMAGE =
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=640&h=480&q=80";

export default function FooterNewsletter() {
  return (
    <div className="relative w-full bg-black pt-16 pb-8 text-white">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div>
            <h3 className="mb-4 font-display text-2xl font-bold !text-white md:text-3xl">
              Stay ahead with Catertech
            </h3>
            <p className="mb-6 text-sm leading-relaxed text-white md:text-base">
              Join hospitality and event professionals who rely on Catertech for equipment
              updates, trade offers and industry insights across the UAE.
            </p>
            <form className="flex flex-col gap-4 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-lg border border-white/40 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/80 focus:border-white focus:ring-2 focus:ring-white/30"
              />
              <button
                type="submit"
                className="shrink-0 rounded-lg bg-white px-6 py-3 text-xs font-semibold uppercase tracking-widest text-black transition hover:bg-white/90"
              >
                Subscribe
              </button>
            </form>
          </div>

          <div className="hidden justify-end md:flex">
            <div className="relative">
              <div className="absolute inset-0 rotate-6 rounded-xl bg-white/10" />
              <Image
                src={FOOTER_IMAGE}
                alt="Catertech catering and event setup"
                width={320}
                height={240}
                className="relative h-56 w-80 rounded-xl object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
