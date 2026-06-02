"use client";

import uaeMapImage from "@/assets/uaemap.png";
import Container from "@/components/Container";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const BRAND_PURPLE = "#322b81";
const BRAND_RED = "#c21722";

type StatItem = {
  value: number;
  suffix: string;
  label: string;
  sub?: string;
  highlight?: boolean;
};

const STATS: StatItem[] = [
  { value: 20, suffix: "+", label: "Years in the UAE", highlight: true },
  { value: 1000, suffix: "+", label: "Events delivered" },
  { value: 500, suffix: "+", label: "Corporate clients" },
  { value: 2, suffix: "", label: "Hub cities", sub: "Dubai & RAK" },
];

const GLASS_CARD =
  "flex min-h-[152px] w-full max-w-none flex-col items-center justify-center rounded-md border border-white/50 bg-white/30 px-4 py-6 text-center shadow-[0_8px_32px_rgba(15,15,15,0.07)] backdrop-blur-md sm:min-h-[168px] sm:px-5 sm:py-7 md:min-h-[176px] md:px-6 md:py-7 lg:min-h-[188px] lg:w-[280px] lg:shrink-0 lg:px-7 lg:py-8 xl:w-[300px] 2xl:w-[312px]";

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
  index,
}: StatItem & { index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const count = useCountUp(value, visible);

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
    suffix === "" ? String(count) : `${count.toLocaleString()}${suffix}`;

  return (
    <div
      ref={ref}
      className="flex w-full flex-col items-center gap-1 text-center"
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <p
        className="text-[1.65rem] font-bold tabular-nums leading-none tracking-tight sm:text-[2.25rem] md:text-[2.75rem] lg:text-[3.25rem] xl:text-[3.5rem]"
        style={{ color: highlight ? BRAND_PURPLE : "#0a0a0a" }}
      >
        {display}
      </p>
      <p className="mt-1 text-xs font-medium leading-snug text-[#0a0a0a] sm:text-sm">{label}</p>
      <p
        className={`text-xs leading-snug text-[#6b7280] ${sub ? "mt-0.5" : "invisible mt-0.5 min-h-4"}`}
      >
        {sub ?? "\u00a0"}
      </p>
    </div>
  );
}

export default function TrustBar() {
  return (
    <section
      className="relative isolate min-h-[520px] w-full overflow-hidden bg-[#eceae6] py-14 sm:min-h-[560px] sm:py-20 md:min-h-[580px] md:py-24 lg:min-h-[600px] lg:py-32"
      aria-label="Company highlights"
    >
      <Image
        src={uaeMapImage}
        alt=""
        fill
        className="-z-10 object-contain object-center lg:object-cover lg:object-center"
        sizes="100vw"
        priority={false}
      />

      <Container className="relative z-10 w-full">
        <p
          className="w-full text-left text-[11px] font-semibold uppercase tracking-[0.24em]"
          style={{ color: BRAND_RED }}
        >
          Trusted across the Emirates
        </p>
        <h2 className="mt-3 w-full text-left text-lg font-bold leading-snug tracking-tight text-[#0a0a0a] sm:text-xl sm:leading-tight md:text-2xl lg:text-[1.85rem] lg:whitespace-nowrap xl:text-3xl">
          Numbers that reflect how long venues rely on us.
        </h2>

        <div className="mt-8 grid w-full grid-cols-1 gap-4 min-[420px]:grid-cols-2 sm:mt-10 sm:gap-5 md:gap-6 lg:mt-12 lg:flex lg:flex-nowrap lg:items-stretch lg:justify-between lg:gap-8">
          {STATS.map((stat, index) => (
            <div key={stat.label} className={GLASS_CARD}>
              <StatBlock {...stat} index={index} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
