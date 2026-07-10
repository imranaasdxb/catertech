"use client";

import uaeMapDesktop from "@/assets/uaemapcenter.png";
import uaeMapTablet from "@/assets/tabletmap.png";
import uaeMapMobile from "@/assets/uaemapmobile.png";
import Container from "@/components/Container";
import Image from "next/image";
import { formatInteger } from "@/lib/format-datetime";
import { useEffect, useRef, useState } from "react";

type StatItem = {
  value: number;
  suffix: string;
  label: string;
  sub?: string;
  highlight?: boolean;
  displayText?: string;
};

const STATS: StatItem[] = [
  {
    value: 21,
    suffix: "+",
    label: "Years in the UAE",
    sub: "Serving all emirates",
    highlight: true,
  },
  {
    value: 4000,
    suffix: "+",
    label: "Events delivered",
    sub: "UAE · Qatar · Oman",
  },
  {
    value: 500,
    suffix: "+",
    label: "Corporate clients",
    sub: "Hotels, venues & F&B",
  },
  {
    displayText: "UAE",
    value: 0,
    suffix: "",
    label: "Hub cities nationwide",
    sub: "Dubai & RAK · GCC events",
  },
];

const GLASS_CARD =
  "relative flex aspect-[6/5] min-h-0 w-full max-w-none flex-col items-center justify-center overflow-hidden rounded-xl border border-white/80 bg-white/62 px-2.5 py-2.5 text-center shadow-[0_10px_40px_rgba(27,43,75,0.12),inset_0_1px_1px_rgba(255,255,255,0.9)] sm:aspect-auto sm:min-h-[168px] sm:px-5 sm:py-7 md:min-h-[176px] md:px-6 md:py-7 lg:min-h-[188px] lg:w-[280px] lg:shrink-0 lg:px-7 lg:py-8 xl:w-[300px] 2xl:w-[312px]";

function useCountUp(target: number, isVisible: boolean, duration = 1400) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    let current = 0;
    const step = Math.max(1, target / (duration / 16));
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isVisible, target, duration]);

  return count;
}

function StatBlock({
  value,
  suffix,
  label,
  sub,
  highlight,
  displayText,
  index,
}: StatItem & { index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const count = useCountUp(value, visible && !displayText);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const display =
    displayText ??
    (suffix === "" ? String(count) : `${formatInteger(count)}${suffix}`);

  return (
    <div
      ref={ref}
      className="flex w-full flex-col items-center gap-1 text-center"
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <p
        className={`font-bold leading-none tracking-tight ${
          displayText
            ? "text-[1.85rem] tracking-[0.14em] sm:text-[2.5rem] md:text-[3rem] lg:text-[3.25rem] xl:text-[3.5rem]"
            : "max-sm:text-[1.35rem] text-[1.65rem] tabular-nums sm:text-[2.25rem] md:text-[2.75rem] lg:text-[3.25rem] xl:text-[3.5rem]"
        } ${highlight || displayText ? "text-primary" : "text-ink"}`}
      >
        {display}
      </p>
      <p className="mt-0.5 text-[11px] font-medium leading-snug text-ink max-sm:text-[10px] sm:mt-1 sm:text-xs md:text-sm">
        {label}
      </p>
      <p className="mt-1 max-w-[14rem] text-[11px] font-semibold leading-snug text-primary max-sm:text-[11px] sm:text-xs md:text-sm">
        {sub ?? "\u00a0"}
      </p>
    </div>
  );
}

export default function TrustBar() {
  return (
    <section
      className="relative isolate w-full overflow-hidden bg-[#FDF6ED] max-sm:min-h-[calc(100vw*1774/887)] max-sm:py-0 sm:min-h-[520px] sm:py-14 md:min-h-[540px] md:py-16 lg:min-h-[660px]"
      aria-label="Company highlights"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 w-full aspect-[1/2] md:hidden">
        <Image
          src={uaeMapMobile}
          alt=""
          fill
          className="object-contain object-top"
          sizes="100vw"
          priority={false}
        />
      </div>
      <Image
        src={uaeMapTablet}
        alt=""
        fill
        className="-z-10 hidden object-contain object-center md:block lg:hidden"
        sizes="100vw"
        priority={false}
      />
      <Image
        src={uaeMapDesktop}
        alt=""
        fill
        className="-z-10 hidden object-cover object-center lg:block"
        sizes="100vw"
        priority={false}
      />

      <Container className="relative z-10 flex w-full flex-col max-sm:min-h-[calc(100vw*1774/887)] max-sm:pt-10 max-sm:pb-0 sm:block sm:min-h-0 md:block">
        <p className="w-full text-left text-[11px] font-semibold uppercase tracking-[0.24em] text-accent-dark">
          Trusted across the UAE &amp; GCC
        </p>
        <h2 className="mt-3 w-full text-left font-display text-lg font-medium leading-snug tracking-tight text-ink sm:text-xl sm:leading-tight md:text-2xl lg:text-[1.85rem] xl:text-3xl">
          Built on years of trust, measured in results
        </h2>

        <div className="mt-8 grid w-full grid-cols-2 gap-2 max-sm:mt-auto max-sm:mb-20 sm:mt-10 sm:gap-5 md:gap-6 lg:mt-20 lg:flex lg:flex-nowrap lg:items-stretch lg:justify-between lg:gap-8">
          {STATS.map((stat, index) => (
            <div key={stat.displayText ?? stat.label} className={GLASS_CARD}>
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/60 via-white/25 to-white/10"
              />
              <div className="relative z-10 w-full">
                <StatBlock {...stat} index={index} />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
