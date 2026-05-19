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
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="flex flex-col items-center text-center px-6">
      <span className="font-serif text-4xl md:text-5xl font-medium text-sand leading-none mb-2">
        {count}{suffix}
      </span>
      <span className="text-white/50 text-xs tracking-[0.15em] uppercase font-medium">
        {label}
      </span>
    </div>
  );
}

export default function TrustBar() {
  return (
    <section className="bg-navy border-y border-white/5 py-14">
      <Container>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-0 divide-x divide-white/10">
          {STATS.map((stat, i) => (
            <StatItem key={i} {...stat} />
          ))}
        </div>
      </Container>
    </section>
  );
}
