"use client";

import { ArcGalleryHero } from "@/components/ui/arc-gallery-hero-component";

const HERO_GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1555244162-803834f70033?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&auto=format&fit=crop&q=80",
];

export default function HeroSection() {
  return (
    <div className="pt-[var(--header-height)]">
      <ArcGalleryHero
        images={HERO_GALLERY_IMAGES}
        title={
          <h1 className="font-display text-ink">
            <span className="block text-[clamp(1.75rem,5vw,3.5rem)] leading-[1.08] tracking-tight">
              Catering equipment for
            </span>
            <span className="mt-1 block text-[clamp(1.75rem,5vw,3.5rem)] leading-[1.08] tracking-tight">
              service that feels effortless
            </span>
          </h1>
        }
        subtitle="Catertech supplies hotel, venue and F&B teams with commercial-grade buffetware, kitchen equipment and trade sourcing support across Dubai and the UAE."
        primaryCta={{ label: "Browse Equipment", href: "/shop" }}
        secondaryCta={{ label: "Request a Quote", href: "/trade/rfq" }}
      />
    </div>
  );
}
