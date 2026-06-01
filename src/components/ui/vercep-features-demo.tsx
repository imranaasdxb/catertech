"use client";

import Link from "next/link";
import { Layers, Package, Sparkles, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Marquee } from "@/components/ui/marquee";

const marqueeData = [
  "What chafing dish capacity do I need for a 300-guest buffet?",
  "How do I plan equipment for a corporate gala?",
  "Can I rent tables and chairs for a single weekend?",
  "Which commercial oven suits a hotel kitchen upgrade?",
  "Do you deliver and collect across Dubai?",
  "What linen options work for outdoor weddings?",
  "How far in advance should I book event rentals?",
  "Can you manage on-site setup for large functions?",
  "Are your catering items food-grade certified?",
  "What refrigeration capacity do I need for banquets?",
  "Do you supply staging and AV for conferences?",
  "Can I mix purchase and rental in one order?",
];

const features = [
  {
    description:
      "From chafing dishes to banquet seating — one trade desk for procurement, rental and logistics across the UAE.",
    icon: Package,
    title: "Full-range supply",
    href: "/services/catering-equipment",
  },
  {
    description:
      "Hotel-grade equipment, pre-commissioned kitchen units and white-glove delivery so your service day runs smoothly.",
    icon: Sparkles,
    title: "Built for hospitality",
    href: "/services/kitchen-equipment",
  },
  {
    description:
      "Same-week delivery, venue setup and post-event collection handled by our in-house logistics team.",
    icon: Truck,
    title: "Logistics you can trust",
    href: "/services/event-rental",
  },
  {
    description:
      "End-to-end coordination — styling, equipment, on-site management and wrap-up for corporate and private events.",
    icon: Layers,
    title: "Events managed end-to-end",
    href: "/services/event-management",
  },
];

export default function VercepFeaturesDemo() {
  const third = Math.ceil(marqueeData.length / 3);
  const m1 = marqueeData.slice(0, third);
  const m2 = marqueeData.slice(third, third * 2);
  const m3 = marqueeData.slice(third * 2);

  return (
    <section className="relative bg-white pt-16 sm:pt-28">
      <div className="mx-auto max-w-full">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-center space-y-4 px-5 text-center md:px-10">
          <h2 className="max-w-3xl font-display text-4xl font-medium text-ink sm:text-5xl lg:text-6xl">
            Everything your venue needs, in one place
          </h2>
          <p className="max-w-xl text-base text-body-muted md:text-lg">
            Whether you are scaling a hotel kitchen, dressing a wedding venue or stocking a
            high-volume buffet, Catertech filters the complexity — so you get the right equipment,
            on time, across Dubai and the UAE.
          </p>

          <div className="relative mx-auto max-w-3xl overflow-hidden">
            <div className="absolute left-0 z-10 h-full w-20 bg-linear-to-r from-white" />
            <div className="absolute right-0 z-10 h-full w-20 bg-linear-to-l from-white" />

            <div className="-mx-6 flex w-screen flex-col md:-mx-10 lg:-mx-16">
              <Marquee className="[--duration:45s] [--gap:0.75rem]" repeat={4}>
                {m1.map((q) => (
                  <Badge
                    className="rounded-none border-border bg-surface-card px-3 py-1 text-body-muted"
                    key={q}
                    size="lg"
                    variant="outline"
                  >
                    {q}
                  </Badge>
                ))}
              </Marquee>

              <Marquee className="[--duration:50s] [--gap:0.75rem]" repeat={4} reverse>
                {m2.map((q) => (
                  <Badge
                    className="rounded-none border-border bg-surface-card px-3 py-1 text-body-muted"
                    key={q}
                    size="lg"
                    variant="outline"
                  >
                    {q}
                  </Badge>
                ))}
              </Marquee>

              <Marquee className="[--duration:42s] [--gap:0.75rem]" repeat={4}>
                {m3.map((q) => (
                  <Badge
                    className="rounded-none border-border bg-surface-card px-3 py-1 text-body-muted"
                    key={q}
                    size="lg"
                    variant="outline"
                  >
                    {q}
                  </Badge>
                ))}
              </Marquee>
            </div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 divide-dashed divide-border border-border border-t border-dashed sm:grid-cols-2 sm:divide-x lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                className="group flex flex-col gap-5 px-5 py-8 transition-colors hover:bg-surface-card/60 last:border-b-0 lg:border-b-0 lg:px-6 lg:py-10"
                href={feature.href}
                key={feature.title}
              >
                <Icon className="size-12 text-ink/70 transition-colors group-hover:text-ink" />

                <div className="flex flex-col gap-2 pt-10 lg:pt-20">
                  <h3 className="text-2xl font-medium tracking-tight text-ink sm:text-3xl">
                    {feature.title}
                  </h3>
                  <p className="leading-relaxed text-body-muted">{feature.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
