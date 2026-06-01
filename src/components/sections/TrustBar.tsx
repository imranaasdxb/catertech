"use client";

import Container from "@/components/Container";
import { useEffect, useRef, useState } from "react";

const STATS = [
  { value: 20, suffix: "+", label: "Years in UAE" },
  { value: 1000, suffix: "+", label: "Events Served" },
  { value: 500, suffix: "+", label: "Corporate Clients" },
  { value: 2, suffix: " Cities", label: "Dubai & RAK" },
];

function useCountUp(target: number, isVisible: boolean, duration = 1800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isVisible, target, duration]);
  return count;
}

function StatItem({ value, suffix, label }: (typeof STATS)[0]) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const count = useCountUp(value, visible);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="flex flex-col items-center px-6 text-center">
      <span className="font-display mb-2 text-4xl leading-none font-bold text-ink md:text-5xl">
        {count}
        {suffix}
      </span>
      <span className="text-xs font-medium uppercase tracking-[0.15em] text-muted">
        {label}
      </span>
    </div>
  );
}

export default function TrustBar() {
  return (
    <section className="border-y border-border/70 bg-white py-14">
      <Container>
        <div className="grid grid-cols-2 gap-y-10 divide-x divide-border lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <StatItem key={i} {...stat} />
          ))}
        </div>
      </Container>
    </section>
  );
}
