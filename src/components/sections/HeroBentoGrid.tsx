"use client";

import { cn } from "@/lib/utils";

const VIDEO_CARD =
  "group relative overflow-hidden border border-black/8 bg-white shadow-[0_10px_34px_rgba(27,43,75,0.16)] rounded-[22px] sm:rounded-[26px] transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_22px_52px_rgba(27,43,75,0.26)]";

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
      className={cn(
        "absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.04]",
        className,
      )}
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
        "w-full max-w-[520px] sm:max-w-[560px] md:max-w-[600px] lg:max-w-[480px] xl:max-w-[640px] 2xl:max-w-[680px]",
        className,
      )}
    >
      <div className="relative">
        {/* Decorative depth */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-3 -top-5 -z-10 hidden h-[58%] w-[64%] rounded-[28px] bg-white/35 backdrop-blur-sm sm:block"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-4 bottom-2 -z-10 hidden h-[46%] w-[46%] rounded-[26px] bg-[#1b2b4b]/[0.04] sm:block"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-8 top-6 -z-10 hidden size-44 rounded-full border border-[#c9a84c]/30 lg:block xl:size-56"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-6 left-6 -z-10 hidden size-28 rounded-full border border-[#c9a84c]/20 lg:block xl:size-36"
        />

        {/* Top — plate video (in front of kitchen) */}
        <div
          className={cn(
            VIDEO_CARD,
            "relative z-10 ml-auto w-[80%] sm:w-[78%]",
            "min-h-[148px] sm:min-h-[172px] md:min-h-[188px] lg:min-h-[166px] xl:min-h-[224px] 2xl:min-h-[240px]",
          )}
        >
          <BentoVideo
            videoSrc="/videos/plate.mp4"
            alt="Premium plateware and catering presentation"
          />
        </div>

        {/* Bottom row — kitchen behind top card, chairs in front (narrower) */}
        <div className="relative -mt-16 h-[120px] sm:-mt-[4.5rem] sm:h-[138px] lg:-mt-[4.25rem] lg:h-[138px] xl:-mt-24 xl:h-[180px] 2xl:h-[192px]">
          <div
            className={cn(
              VIDEO_CARD,
              "absolute inset-y-0 left-0 z-0 w-[48%] sm:w-[46%]",
            )}
          >
            <BentoVideo
              videoSrc="/videos/kitchen.mp4"
              alt="Commercial kitchen equipment in action"
            />
          </div>

          <div
            className={cn(
              VIDEO_CARD,
              "absolute inset-y-0 right-0 z-20 w-[40%] sm:w-[38%]",
            )}
          >
            <BentoVideo
              videoSrc="/videos/chairs.mp4"
              alt="Event seating and venue styling"
            />
          </div>
        </div>      </div>
    </div>
  );
}
