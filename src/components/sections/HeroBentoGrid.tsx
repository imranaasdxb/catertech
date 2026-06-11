"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

const BENTO_CARDS = [
  {
    key: "main",
    className: "col-span-2 min-h-[88px] sm:min-h-[100px]",
    poster:
      "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=85",
    videoSrc: "",
    alt: "Commercial catering equipment showcase",
  },
  {
    key: "left",
    className: "min-h-[72px] sm:min-h-[80px]",
    poster:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=600&q=85",
    videoSrc: "",
    alt: "Professional kitchen setup",
  },
  {
    key: "right",
    className: "min-h-[72px] sm:min-h-[80px]",
    poster:
      "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=600&q=85",
    videoSrc: "",
    alt: "Event and banquet styling",
  },
] as const;

function BentoMedia({
  poster,
  videoSrc,
  alt,
}: {
  poster: string;
  videoSrc: string;
  alt: string;
}) {
  if (videoSrc) {
    return (
      <video
        autoPlay
        muted
        loop
        playsInline
        poster={poster}
        className="absolute inset-0 h-full w-full object-cover"
        aria-label={alt}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
    );
  }

  return (
    <Image
      src={poster}
      alt={alt}
      fill
      className="object-cover"
      sizes="(max-width: 768px) 45vw, 220px"
    />
  );
}

type HeroBentoGridProps = {
  className?: string;
};

export default function HeroBentoGrid({ className }: HeroBentoGridProps) {
  return (
    <div
      className={cn(
        "grid w-full max-w-[360px] grid-cols-2 gap-2 sm:max-w-[400px] sm:gap-2.5 md:max-w-none md:gap-3",
        className,
      )}
    >
      {BENTO_CARDS.map((card) => (
        <div
          key={card.key}
          className={cn(
            "relative overflow-hidden rounded-xl border border-primary/10 bg-white/80 shadow-[0_10px_28px_rgba(27,43,75,0.1)]",
            card.className,
          )}
        >
          <BentoMedia poster={card.poster} videoSrc={card.videoSrc} alt={card.alt} />
          <div
            className="pointer-events-none absolute inset-0 bg-linear-to-t from-primary/25 via-transparent to-transparent"
            aria-hidden
          />
        </div>
      ))}
    </div>
  );
}
