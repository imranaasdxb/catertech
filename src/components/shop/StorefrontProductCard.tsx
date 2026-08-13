"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import WaterRiseCta from "@/components/ui/WaterRiseCta";
import type { ProductAttributeValue } from "@/lib/category-template";
import { formatPricePerDayAed } from "@/lib/product-pricing";
import { cn } from "@/lib/utils";

export type StorefrontProductCardData = {
  id: string;
  slug: string;
  name: string;
  category: string;
  subCategoryName: string | null;
  description: string;
  pricePerDayAed?: string | null;
  attributes: Record<string, ProductAttributeValue>;
  image: string | null;
  images?: string[];
  tag: "Popular" | "New" | null;
};

const SIZE_ATTRIBUTE_KEYS = [
  "dimensions",
  "size",
  "length",
  "width",
  "height",
  "diameter",
] as const;

function formatAttributeValue(value: ProductAttributeValue) {
  if (typeof value === "string") return value.trim();
  return `${value.value}${value.unit ? ` ${value.unit}` : ""}`.trim();
}

export function getProductSizeSummary(
  attributes: Record<string, ProductAttributeValue>,
): string | null {
  const parts: string[] = [];
  for (const key of SIZE_ATTRIBUTE_KEYS) {
    const raw = attributes[key];
    if (raw == null || raw === "") continue;
    const formatted = formatAttributeValue(raw);
    if (formatted) parts.push(formatted);
  }
  return parts.length ? parts.join(" · ") : null;
}

export default function StorefrontProductCard({
  product,
  lazyImage = false,
  shopCompact = false,
  className,
}: {
  product: StorefrontProductCardData;
  lazyImage?: boolean;
  shopCompact?: boolean;
  className?: string;
}) {
  const productHref = `/shop/${product.slug}`;
  const sizeSummary = getProductSizeSummary(product.attributes);
  const priceLabel = formatPricePerDayAed(product.pricePerDayAed);
  const hasDailyPrice = priceLabel !== "Quote";
  const priceValue = hasDailyPrice ? priceLabel.replace(/^AED\s+/, "").replace(/\s+\/ day$/, "") : "";
  const galleryImages = useMemo(() => {
    const images = (product.images?.length ? product.images : product.image ? [product.image] : [])
      .map((image) => image?.trim())
      .filter((image): image is string => Boolean(image));
    return [...new Set(images)];
  }, [product.image, product.images]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const hasImageSlider = galleryImages.length > 1;
  const cardTitleClass = `font-sans !font-normal tracking-normal text-[#1a1a1a] ${
    shopCompact ? "text-sm lg:text-lg xl:text-xl" : "text-lg sm:text-xl"
  }`;
  const cardDescClass = `font-sans !font-normal tracking-normal text-[#666666] ${
    shopCompact
      ? "text-[10px] leading-snug lg:text-[13px] lg:leading-[1.6]"
      : "text-[13px] leading-[1.6]"
  }`;

  useEffect(() => {
    setActiveImageIndex(0);
  }, [product.id, galleryImages.length]);

  useEffect(() => {
    if (!hasImageSlider) return;

    const interval = window.setInterval(() => {
      setActiveImageIndex((current) => (current + 1) % galleryImages.length);
    }, 2800);

    return () => window.clearInterval(interval);
  }, [galleryImages.length, hasImageSlider]);

  return (
    <article
      className={cn(
        "group flex h-full min-w-0 flex-col overflow-hidden bg-[#FEFEFE] transition-transform duration-300",
        shopCompact
          ? "rounded-xl hover:-translate-y-0.5 lg:rounded-2xl lg:hover:-translate-y-1"
          : "rounded-2xl hover:-translate-y-1",
        className,
      )}
    >
      <div className="relative aspect-square w-full shrink-0 bg-[#FEFEFE]">
        {galleryImages.length > 0 ? (
          <Link href={productHref} className="relative block h-full w-full">
            {galleryImages.map((image, index) => (
              <Image
                key={`${image}-${index}`}
                src={image}
                alt={product.name}
                fill
                loading={lazyImage || index > 0 ? "lazy" : undefined}
                unoptimized
                className={`object-contain object-center transition-all duration-700 group-hover:scale-[1.02] ${
                  index === activeImageIndex ? "opacity-100" : "opacity-0"
                } ${shopCompact ? "p-2 lg:p-4" : "p-4"}`}
                sizes={
                  shopCompact
                    ? "(max-width: 1024px) 45vw, 22vw"
                    : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 22vw"
                }
              />
            ))}
          </Link>
        ) : (
          <div className="h-full w-full animate-pulse bg-[#ececec]" aria-label="Image coming soon" />
        )}

        {hasImageSlider ? (
          <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full bg-white/85 px-2 py-1 shadow-sm">
            {galleryImages.map((image, index) => (
              <span
                key={`dot-${image}-${index}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === activeImageIndex ? "w-3 bg-[#1a1a1a]" : "w-1.5 bg-[#b8b8b8]"
                }`}
                aria-hidden
              />
            ))}
          </div>
        ) : null}

        {product.tag ? (
          <span
            className={`absolute z-10 rounded-full bg-[#1a1a1a] font-semibold leading-none text-white ${
              shopCompact
                ? "left-1.5 top-1.5 px-1.5 py-0.5 text-[9px] lg:left-3 lg:top-3 lg:px-2.5 lg:py-1 lg:text-[11px]"
                : "left-3 top-3 px-2.5 py-1 text-[11px]"
            }`}
          >
            {product.tag}
          </span>
        ) : null}
      </div>

      <div
        className={`flex min-w-0 flex-1 flex-col ${
          shopCompact
            ? "gap-1 px-2.5 pb-2.5 pt-1.5 lg:gap-1.5 lg:px-5 lg:pb-4 lg:pt-2"
            : "gap-1.5 px-5 pb-4 pt-2"
        }`}
      >
        <p
          className={`font-medium uppercase text-[#888888] ${
            shopCompact
              ? "text-[9px] tracking-wide lg:text-[11px] lg:tracking-widest"
              : "text-[11px] tracking-widest"
          }`}
        >
          {product.category || "Catering equipment"}
        </p>

        <div className="flex min-w-0 flex-col gap-0.5 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
          <Link href={productHref} className="min-w-0 flex-1">
            <h1 className={`line-clamp-1 sm:line-clamp-2 leading-tight ${cardTitleClass}`}>
              {product.name}
            </h1>
          </Link>
          {sizeSummary ? (
            <p
              className={`min-w-0 truncate font-sans font-normal leading-snug text-[#888888] sm:max-w-[46%] sm:shrink-0 sm:pt-0.5 sm:text-right ${
                shopCompact ? "text-[9px] lg:text-[11px]" : "text-[11px]"
              }`}
            >
              {sizeSummary}
            </p>
          ) : null}
        </div>

        <h2 className={`line-clamp-1 sm:line-clamp-2 ${cardDescClass}`}>
          {product.description || "Product details available on request."}
        </h2>

        <div className="mt-auto flex items-end justify-between gap-2 pt-1.5 lg:pt-2">
          <div className="min-w-0 text-left">
            {hasDailyPrice ? (
              <>
                <p
                  className={`font-sans font-bold leading-none text-[#1a1a1a] ${
                    shopCompact ? "text-sm lg:text-lg" : "text-lg"
                  }`}
                >
                  AED {priceValue}
                </p>
                <p
                  className={`mt-0.5 font-sans font-semibold uppercase tracking-wide text-[#888888] ${
                    shopCompact ? "text-[8px] lg:text-[10px]" : "text-[10px]"
                  }`}
                >
                  per day
                </p>
              </>
            ) : (
              <p
                className={`font-sans font-semibold leading-none text-[#888888] ${
                  shopCompact ? "text-xs lg:text-sm" : "text-sm"
                }`}
              >
                Quote
              </p>
            )}
          </div>
          <WaterRiseCta
            href={productHref}
            size="xs"
            className="ml-auto w-fit shrink-0 whitespace-nowrap px-2 py-0.5 [&_.btn-brand__content]:shrink-0 [&_.btn-brand__content]:whitespace-nowrap max-sm:[&_.btn-brand__content]:gap-0.5 max-sm:[&_.btn-brand__content]:text-[7px] max-sm:[&_.btn-brand__content]:tracking-normal max-sm:[&_.btn-brand__arrow]:size-4"
          >
            View &amp; quote
          </WaterRiseCta>
        </div>
      </div>
    </article>
  );
}
