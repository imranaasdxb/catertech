"use client";

import Image from "next/image";
import WaterRiseCta from "@/components/ui/WaterRiseCta";
import { useEffect, useState, type ReactNode } from "react";

export type ArcGalleryHeroProps = {
  images: string[];
  title?: ReactNode;
  subtitle?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  startAngle?: number;
  endAngle?: number;
  radiusLg?: number;
  radiusMd?: number;
  radiusSm?: number;
  cardSizeLg?: number;
  cardSizeMd?: number;
  cardSizeSm?: number;
  className?: string;
};

/** Stable px strings so SSR and client hydration match. */
function px(value: number) {
  return `${Number(value.toFixed(2))}px`;
}

export function ArcGalleryHero({
  images,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  startAngle = 20,
  endAngle = 160,
  radiusLg = 480,
  radiusMd = 360,
  radiusSm = 260,
  cardSizeLg = 120,
  cardSizeMd = 100,
  cardSizeSm = 80,
  className = "",
}: ArcGalleryHeroProps) {
  const [dimensions, setDimensions] = useState({
    radius: radiusLg,
    cardSize: cardSizeLg,
  });
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setDimensions({ radius: radiusSm, cardSize: cardSizeSm });
      } else if (width < 1024) {
        setDimensions({ radius: radiusMd, cardSize: cardSizeMd });
      } else {
        setDimensions({ radius: radiusLg, cardSize: cardSizeLg });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [radiusLg, radiusMd, radiusSm, cardSizeLg, cardSizeMd, cardSizeSm]);

  const count = Math.max(images.length, 2);
  const step = (endAngle - startAngle) / (count - 1);

  return (
    <section
      className={`relative flex min-h-[calc(100dvh-var(--header-height))] flex-col overflow-hidden bg-white text-ink ${className}`}
    >
      <div
        className="relative mx-auto w-full"
        style={{
          height: px(dimensions.radius * 1.2),
        }}
      >
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
          {images.map((src, i) => {
            const angle = startAngle + step * i;
            const angleRad = (angle * Math.PI) / 180;
            const x = Math.cos(angleRad) * dimensions.radius;
            const y = Math.sin(angleRad) * dimensions.radius;
            const cardPx = px(dimensions.cardSize);

            return (
              <div
                key={`${src}-${i}`}
                className="absolute arc-fade-in-up"
                style={{
                  width: cardPx,
                  height: cardPx,
                  left: `calc(50% + ${Number(x.toFixed(2))}px)`,
                  bottom: px(y),
                  transform: "translate(-50%, 50%)",
                  animationDelay: `${i * 100}ms`,
                  animationFillMode: "forwards",
                  zIndex: count - i,
                }}
              >
                <div
                  className="h-full w-full overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-border transition-transform hover:scale-105"
                  style={{
                    transform: `rotate(${Number((angle / 4).toFixed(2))}deg)`,
                  }}
                >
                  <Image
                    src={src}
                    alt={`Catering equipment showcase ${i + 1}`}
                    width={400}
                    height={400}
                    className="block h-full w-full object-cover"
                    style={{ width: "auto", height: "auto" }}
                    draggable={false}
                    priority={i < 3}
                    sizes="120px"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="relative z-10 -mt-40 flex flex-1 items-center justify-center px-6 md:-mt-52 lg:-mt-64">
        <div
          className="max-w-2xl px-6 text-center"
        >
          {title ?? (
            <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Rediscover Your Memories with AI
            </h1>
          )}

          {subtitle ? (
            <p className="mt-4 text-base text-body-muted sm:text-lg">{subtitle}</p>
          ) : null}

          {(primaryCta || secondaryCta) && (
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              {primaryCta ? (
                <WaterRiseCta href={primaryCta.href} size="md">
                  {primaryCta.label}
                </WaterRiseCta>
              ) : null}
              {secondaryCta ? (
                <WaterRiseCta href={secondaryCta.href} size="md">
                  {secondaryCta.label}
                </WaterRiseCta>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
