"use client";

import Image from "next/image";
import Link from "next/link";
import { Layers, Package, Sparkles, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Marquee } from "@/components/ui/marquee";
import servicesBg from "@/assets/servicesbg.png";

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
    image:
      "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=85",
    title: "Full-range supply",
    href: "/services/catering-equipment",
  },
  {
    description:
      "Hotel-grade equipment, pre-commissioned kitchen units and white-glove delivery so your service day runs smoothly.",
    icon: Sparkles,
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=85",
    title: "Built for hospitality",
    href: "/services/kitchen-equipment",
  },
  {
    description:
      "Same-week delivery, venue setup and post-event collection handled by our in-house logistics team.",
    icon: Truck,
    image:
      "https://images.unsplash.com/photo-1519003722824-eedb742276e?auto=format&fit=crop&w=800&q=85",
    title: "Logistics you can trust",
    href: "/services/event-rental",
  },
  {
    description:
      "End-to-end coordination — styling, equipment, on-site management and wrap-up for corporate and private events.",
    icon: Layers,
    image:
      "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=800&q=85",
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
    <section className="relative overflow-hidden bg-[#FBF5EC] pt-16 pb-16 sm:pt-28 sm:pb-28">
      <div className="pointer-events-none absolute inset-0 min-h-full w-full">
        <Image
          src={servicesBg}
          alt=""
          fill
          priority={false}
          sizes="100vw"
          className="h-full w-full object-contain object-top lg:object-cover lg:object-center"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-full">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-center space-y-4 px-5 text-center md:px-10">
          <h2 className="max-w-3xl font-display text-4xl font-medium text-ink sm:text-5xl lg:text-6xl">
            Everything your venue needs, in one place
          </h2>
          <p className="max-w-xl text-base text-body-muted md:text-lg">
            Whether you are scaling a hotel kitchen, dressing a wedding venue or stocking a
            high-volume buffet, Catertech filters the complexity — so you get the right equipment,
            on time, across Dubai and the UAE.
          </p>

          <div className="relative mx-auto max-w-4xl overflow-hidden">
            {/* <div
              className="pointer-events-none absolute top-0 left-0 z-10 h-full w-32 sm:w-40"
              style={{
                background:
                  "linear-gradient(90deg, #F6EADC 0%, #F6ECDF 18%, rgba(246, 236, 223, 0.55) 42%, rgba(246, 236, 223, 0.2) 68%, transparent 100%)",
              }}
            /> */}
           
            <div className="absolute right-0 z-10 h-full w-20 bg-linear-to-l from-[#FBF5EC]/90" />

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

        <div className="mt-10 lg:px-8 xl:px-10">
          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-px-5 px-5 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                className="service-feature-card group flex w-[82vw] max-w-[360px] shrink-0 snap-start cursor-pointer flex-col overflow-hidden rounded-xl border-2 border-dashed border-accent/75 bg-white/55 backdrop-blur-[2px] transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:bg-white/80 hover:shadow-[0_14px_40px_rgba(27,43,75,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 sm:w-[76vw] sm:max-w-[380px] lg:w-auto lg:max-w-none lg:shrink"
                href={feature.href}
                key={feature.title}
              >
                <div className="flex flex-1 flex-col items-center gap-2.5 px-5 py-6 text-center lg:px-6 lg:py-7">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-[#FBF5EC]/90 shadow-[0_6px_18px_rgba(201,168,76,0.14)] lg:size-14">
                    <Icon className="size-5 text-accent-dark transition-colors duration-300 group-hover:text-primary lg:size-6" />
                  </div>

                  <h3 className="font-display text-xl font-medium tracking-tight text-ink transition-colors duration-300 group-hover:text-primary lg:text-2xl">
                    {feature.title}
                  </h3>
                  <p className="line-clamp-3 text-sm leading-relaxed text-body-muted lg:text-[15px]">
                    {feature.description}
                  </p>
                </div>

                <div className="relative h-28 w-full shrink-0 lg:h-32">
                  <Image
                    src={feature.image}
                    alt=""
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background: `
                        radial-gradient(ellipse 130% 92% at 50% -6%, rgba(251, 245, 236, 0.98) 0%, rgba(251, 245, 236, 0.7) 26%, rgba(251, 245, 236, 0.32) 46%, rgba(251, 245, 236, 0.06) 62%, transparent 78%),
                        radial-gradient(ellipse 85% 60% at 50% 8%, rgba(27, 43, 75, 0.07) 0%, transparent 72%)
                      `,
                    }}
                  />
                </div>
              </Link>
            );
          })}
          <div aria-hidden className="w-3 shrink-0 lg:hidden" />
          </div>
        </div>
      </div>
    </section>
  );
}
