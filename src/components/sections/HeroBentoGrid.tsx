"use client";

import { cn } from "@/lib/utils";

const ROW_HEIGHT =
  "min-h-[100px] sm:min-h-[112px] md:min-h-[124px] lg:min-h-[148px] xl:min-h-[164px] 2xl:min-h-[176px]";

const CARD_BASE =
  "relative overflow-hidden rounded-2xl border border-black/8 bg-white shadow-[0_4px_18px_rgba(27,43,75,0.1)]";

function BentoVideo({
  videoSrc,
  alt,
  className,
}: {
  videoSrc: string;
  alt: string;
  className?: string;
}) {
  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      className={cn("absolute inset-0 h-full w-full", className)}
      aria-label={alt}
    >
      <source src={videoSrc} type="video/mp4" />
    </video>
  );
}

type HeroBentoGridProps = {
  className?: string;
};

export default function HeroBentoGrid({ className }: HeroBentoGridProps) {
  return (
    <div
      className={cn(
        "w-full max-w-[520px] sm:max-w-[560px] md:max-w-[600px] lg:max-w-[580px] xl:max-w-[640px] 2xl:max-w-[680px]",
        className,
      )}
    >
      <div className="flex flex-col gap-3 sm:gap-3.5 lg:gap-4">
        {/* Top — full width, unchanged */}
        <div
          className={cn(
            CARD_BASE,
            "min-h-[120px] sm:min-h-[136px] md:min-h-[148px] lg:min-h-[192px] xl:min-h-[212px] 2xl:min-h-[228px]",
          )}
        >
          <BentoVideo
            videoSrc="/videos/plate.mp4"
            alt="Premium plateware and catering presentation"
            className="object-cover object-center"
          />
        </div>

        {/* Bottom row — kitchen left, chairs right (no overlap) */}
        <div
          className={cn(
            "grid w-full grid-cols-[minmax(0,1fr)_minmax(0,1.18fr)] gap-3 sm:gap-3.5 lg:gap-4",
            ROW_HEIGHT,
          )}
        >
          <div className={cn(CARD_BASE, "h-full min-h-0")}>
            <BentoVideo
              videoSrc="/videos/kitchen.mp4"
              alt="Commercial kitchen equipment in action"
              className="object-cover object-center"
            />
          </div>

          <div className={cn(CARD_BASE, "h-full min-h-0")}>
            <BentoVideo
              videoSrc="/videos/chairs.mp4"
              alt="Event seating and venue styling"
              className="object-cover object-center"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
