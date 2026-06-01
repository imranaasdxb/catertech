"use client";

import Image from "next/image";
import { useState } from "react";
import Container from "@/components/Container";

export type JourneyMilestone = {
  year: string;
  step: number;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  imageFallback: string;
};

export const JOURNEY_MILESTONES: JourneyMilestone[] = [
  {
    year: "2002",
    step: 1,
    title: "Where It All Began",
    description:
      "Our founders saw a gap in the UAE hospitality market: dependable, hotel-grade catering supply was still hard to source. Catertech began with a small Dubai warehouse and a standard that refused shortcuts.",
    image: "/images/journey/2002.jpg",
    imageAlt: "Early hospitality supply operations in Dubai",
    imageFallback:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=82&fit=crop&crop=center",
  },
  {
    year: "2005",
    step: 2,
    title: "Founded in Dubai",
    description:
      "Catertech was formally established to supply premium catering equipment to hotels, restaurants and banqueting teams across a rapidly expanding city.",
    image: "/images/journey/2005.jpg",
    imageAlt: "Catertech founding year in Dubai",
    imageFallback:
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&q=82&fit=crop&crop=center",
  },
  {
    year: "2010",
    step: 3,
    title: "Events Division Launched",
    description:
      "As corporate events and weddings accelerated across the Emirates, we added event rentals: tables, chairs, linen, staging and decor delivered with disciplined timing.",
    image: "/images/journey/2010.jpg",
    imageAlt: "Event equipment rental and banquet setup",
    imageFallback:
      "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=1200&q=82&fit=crop&crop=center",
  },
  {
    year: "2015",
    step: 4,
    title: "Kitchen Equipment",
    description:
      "Our commercial kitchen division launched for restaurants, hotel back-of-house teams and institutional kitchens needing ovens, refrigeration and food-prep lines.",
    image: "/images/journey/2015.jpg",
    imageAlt: "Commercial kitchen equipment division",
    imageFallback:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=82&fit=crop&crop=center",
  },
  {
    year: "2020",
    step: 5,
    title: "Northern Emirates Expansion",
    description:
      "A second warehouse and logistics hub in Ras Al Khaimah shortened delivery times, strengthened stock access and extended our operating footprint.",
    image: "/images/journey/2020.jpg",
    imageAlt: "Warehouse and logistics expansion in RAK",
    imageFallback:
      "https://images.unsplash.com/photo-1553413077-190dd305871c?w=1200&q=82&fit=crop&crop=center",
  },
  {
    year: "2024",
    step: 6,
    title: "Full-Service Partner",
    description:
      "Today Catertech supports 500+ corporate clients with catering hire, kitchen supply, event management and digital quoting across Dubai, RAK and the wider UAE.",
    image: "/images/journey/2024.jpg",
    imageAlt: "Modern Catertech event and equipment services",
    imageFallback:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=82&fit=crop&crop=center",
  },
];

function JourneyImage({ milestone }: { milestone: JourneyMilestone }) {
  const [src, setSrc] = useState(milestone.image);

  return (
    <div className="relative h-[220px] overflow-hidden border-y border-black/10 sm:h-[280px] lg:h-[320px]">
      <Image
        src={src}
        alt={milestone.imageAlt}
        fill
        className="object-cover grayscale transition-transform duration-700 ease-out group-hover:scale-[1.025]"
        sizes="(max-width: 1024px) 100vw, 42vw"
        onError={() => setSrc(milestone.imageFallback)}
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.22),transparent_52%,rgba(255,255,255,0.28))]" />
    </div>
  );
}

function JourneyMoment({
  milestone,
  index,
}: {
  milestone: JourneyMilestone;
  index: number;
}) {
  const imageFirst = index % 2 === 1;

  return (
    <article className="group relative grid gap-6 py-8 sm:py-10 lg:grid-cols-[0.92fr_1fr] lg:gap-12 lg:py-12">
      <div className={`relative ${imageFirst ? "lg:order-1" : "lg:order-2"}`}>
        <JourneyImage milestone={milestone} />
      </div>

      <div className={`flex items-center ${imageFirst ? "lg:order-2" : "lg:order-1"}`}>
        <div className="relative w-full">
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-black/42">
            Chapter {String(milestone.step).padStart(2, "0")}
          </span>
          <div className="mt-4 flex items-end gap-5">
            <p className="font-serif text-5xl font-bold leading-none text-black sm:text-6xl">
              {milestone.year}
            </p>
            <span className="mb-3 h-px flex-1 bg-black/12" />
          </div>
          <h3 className="mt-5 max-w-xl font-serif text-3xl font-bold leading-[1.05] text-black sm:text-4xl">
            {milestone.title}
          </h3>
          <p className="mt-5 max-w-xl text-sm leading-7 text-black/60 sm:text-base">
            {milestone.description}
          </p>
        </div>
      </div>
    </article>
  );
}

type JourneySectionProps = {
  milestones?: JourneyMilestone[];
  className?: string;
};

export default function JourneySection({
  milestones = JOURNEY_MILESTONES,
  className = "",
}: JourneySectionProps) {
  return (
    <section
      className={`relative overflow-hidden bg-white py-14 text-black sm:py-16 lg:py-20 ${className}`.trim()}
      aria-labelledby="journey-section-heading"
    >
      <Container>
        <div className="mb-10 grid gap-6 border-b border-black/10 pb-10 lg:mb-12 lg:grid-cols-[0.9fr_1fr] lg:items-end">
          <div>
            <div className="mb-5 flex items-center gap-4">
              <span className="h-px w-12 bg-black" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-black/48">
                Company Journey
              </p>
            </div>
            <h2
              id="journey-section-heading"
              className="max-w-3xl font-serif text-4xl font-bold leading-[1.04] text-black sm:text-5xl lg:text-[3.8rem]"
            >
              From one warehouse to a UAE-wide partner.
            </h2>
          </div>

          <div className="max-w-xl lg:justify-self-end">
            <p className="text-sm leading-7 text-black/60 sm:text-base">
              A clean timeline of the moments that shaped Catertech's equipment, logistics and event capabilities.
            </p>
            <div className="mt-6 grid grid-cols-3 border-y border-black/10">
              {[
                ["22+", "Years"],
                ["500+", "Clients"],
                ["UAE", "Reach"],
              ].map(([value, label]) => (
                <div key={label} className="py-4 pr-4">
                  <div className="font-serif text-2xl font-bold text-black sm:text-3xl">
                    {value}
                  </div>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-black/45">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute left-0 top-0 hidden h-full w-px bg-black/10 lg:block" />
          <div className="divide-y divide-black/10 lg:pl-10">
            {milestones.map((milestone, index) => (
              <div key={`${milestone.year}-${milestone.title}`} className="relative">
                <span
                  aria-hidden
                  className="absolute -left-[46px] top-16 hidden h-3 w-3 rounded-full bg-black lg:block"
                />
                <JourneyMoment milestone={milestone} index={index} />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
