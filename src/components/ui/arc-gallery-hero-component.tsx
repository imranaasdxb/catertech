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
  cardWidthLg?: number;
  cardHeightLg?: number;
  cardWidthMd?: number;
  cardHeightMd?: number;
  cardWidthSm?: number;
  cardHeightSm?: number;
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
  startAngle =20 ,
  endAngle = 160,
  radiusLg = 560,
  radiusMd = 460,
  radiusSm = 360,
  cardWidthLg = 168,
  cardHeightLg = 188,
  cardWidthMd = 164,
  cardHeightMd = 162,
  cardWidthSm = 118,
  cardHeightSm = 132,
  className = "",
}: ArcGalleryHeroProps) {
  const [dimensions, setDimensions] = useState({
    radius: radiusLg,
    cardWidth: cardWidthLg,
    cardHeight: cardHeightLg,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setDimensions({
          radius: radiusSm,
          cardWidth: cardWidthSm,
          cardHeight: cardHeightSm,
        });
      } else if (width < 1024) {
        setDimensions({
          radius: radiusMd,
          cardWidth: cardWidthMd,
          cardHeight: cardHeightMd,
        });
      } else {
        setDimensions({
          radius: radiusLg,
          cardWidth: cardWidthLg,
          cardHeight: cardHeightLg,
        });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [
    radiusLg,
    radiusMd,
    radiusSm,
    cardWidthLg,
    cardHeightLg,
    cardWidthMd,
    cardHeightMd,
    cardWidthSm,
    cardHeightSm,
  ]);

  const count = Math.max(images.length, 2);
  const step = (endAngle - startAngle) / (count - 1);

  return (
    <section
      className={`relative flex min-h-[calc(100dvh-var(--header-height))] flex-col overflow-hidden bg-white text-ink ${className}`}
    >
      {/* Soft fog glow at bottom — not a full-width band */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[70%]"
        style={{
          background: [
            "radial-gradient(ellipse 90% 55% at 50% 100%, rgba(195, 160, 255, 0.32) 0%, transparent 68%)",
            "radial-gradient(ellipse 45% 35% at 22% 92%, rgba(195, 160, 255, 0.14) 0%, transparent 70%)",
            "radial-gradient(ellipse 45% 35% at 78% 88%, rgba(245, 238, 255, 0.2) 0%, transparent 72%)",
          ].join(", "),
        }}
        aria-hidden
      />

      <div
        className="relative z-[1] mx-auto w-full"
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

            return (
              <div
                key={`${src}-${i}`}
                className="absolute arc-fade-in-up"
                style={{
                  width: px(dimensions.cardWidth),
                  height: px(dimensions.cardHeight),
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
                    transform: `rotate(${Number((angle / 4).toFixed(4))}deg)`,
                  }}
                >
                  <Image
                    src={src}
                    alt={`Catering equipment showcase ${i + 1}`}
                    width={400}
                    height={480}
                    className="block h-full w-full object-cover"
                    draggable={false}
                    priority={i < 3}
                    sizes="(max-width: 640px) 118px, (max-width: 1024px) 144px, 168px"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="relative z-10 -mt-40 flex flex-1 items-center justify-center px-6 md:-mt-52 lg:-mt-64">
        <div className="max-w-2xl px-6 text-center">
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
