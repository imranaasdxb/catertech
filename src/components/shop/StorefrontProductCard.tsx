"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { ProductAttributeValue } from "@/lib/category-template";
import { imageKitUrl } from "@/lib/imagekit-optimizer";
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

function DirhamIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1500 1500"
      aria-hidden
      className={className}
      fill="currentColor"
    >
      <path d="M474.94,1272.7H263.1a39.35,39.35,0,0,1-5-.1c-2.06-.28-3.18-1.34-1.43-3.29,30.93-34.3,40.49-76.77,46.14-120.72a396.09,396.09,0,0,0,2.84-49.77c.1-61.34,0-122.67.21-184,0-6.25-1.5-8.13-7.89-8-17.58.45-35.19.13-52.78.13-40.31,0-67-21-84.8-55.34-12-23.24-12-48.5-11.7-73.76,0-1.12-.22-2.59,1.23-3,1.65-.48,2.5,1,3.48,2,9,8.43,18.42,16.22,30.17,20.64a70.72,70.72,0,0,0,25,4.81c30,0,59.92-.12,89.87.13,5.54.05,7.4-1.3,7.34-7.13q-.42-44.92,0-89.86c.05-5.83-1.42-7.8-7.51-7.67-18.29.38-36.61.14-54.91.13-32.64,0-57-15.23-75-41.5-13.39-19.53-19.37-41.47-19.5-65.07,0-6.42-.17-12.84,0-19.25,0-2.16-1.54-5.44,1.28-6.25,2.06-.59,3.81,2.23,5.45,3.85,15.48,15.3,33.68,23.77,55.86,23.51,29.24-.34,58.49-.18,87.73,0,4.83,0,6.59-1.14,6.57-6.33-.31-65.37.28-130.75-.76-196.11-.71-44.65-8.34-88.23-28-129C271.89,251,265.14,241.34,257.92,232c-.82-1.07-2.76-1.71-2.19-3.26.71-1.91,2.76-1.4,4.39-1.4h8.56c127.91,0,255.82-.3,383.72.28,68.37.31,135.65,9.48,201.41,28.89,68,20.08,130,51.63,183.75,98.14,40.35,34.89,72.29,76.62,97,123.88a480.21,480.21,0,0,1,40.62,108.14c1.17,4.76,3.1,6.55,8.17,6.49,24-.24,48-.09,72,0,40.69.09,67.08,21.68,84.58,56.46,11.39,22.63,11.7,47.07,11.47,71.58,0,1.38.23,3.14-1.37,3.73-1.83.67-3-.82-4.16-2-8.21-8.33-17.39-15.22-28.3-19.73a67.66,67.66,0,0,0-25.65-5.26c-30.67-.12-61.34.08-92-.15-5.55,0-7.34,1.23-7,7.14a652.48,652.48,0,0,1,.07,89.75c-.48,6.85,1.8,7.87,7.79,7.75,17.11-.35,34.27.58,51.34-.24,46.19-2.24,80.8,30.71,93.43,70.73,6,19.15,5.81,38.77,5.64,58.45,0,1.13.51,2.59-1,3-1.92.54-3-1.18-4.15-2.25-8.74-8.43-18-16-29.58-20.36a66.74,66.74,0,0,0-23.55-4.75c-35.9-.07-71.8.06-107.7-.16-5.61,0-8,1.26-9.52,7.3-15.24,62.19-40.35,119.89-79.14,171.26s-87.42,91.1-144.44,120.61c-69.73,36.08-144.55,54.11-222.2,62.14-35,3.62-70.11,4.73-105.28,4.68q-74.9-.09-149.78,0ZM730.42,593.1V593q130.47,0,260.94.14c6.18,0,7.71-1.5,6.56-7.56-10.22-53.87-25.85-105.75-54.15-153.27-29.61-49.73-70.07-87.68-122-113.16C768.42,293,711.22,282.73,652.46,280.59c-60.56-2.22-121.18-.39-181.78-1-6.71-.07-8.21,1.89-8.19,8.33q.3,148.64,0,297.28c0,7,2.24,8.05,8.43,8Q600.66,592.95,730.42,593.1Zm.2,313.92V907q-130.15,0-260.3-.16c-6.38,0-7.83,1.7-7.82,7.93.21,95.32.12,190.63.22,286,0,6.31-2.84,14.49,1.35,18.46s12.26,1.26,18.6,1.17c60.34-.9,120.73,2.48,181-2.27,52-4.1,102.31-14.82,149.78-37,50.4-23.59,91.3-58.27,122.21-104.71,33-49.6,50.79-104.94,62.06-162.82,1.1-5.67-.69-6.6-6.1-6.59Q861.13,907.16,730.62,907Zm5.48-104.68v-.21c88.65,0,177.3-.09,265.95.19,6.38,0,8.23-1.78,8.36-7.71q1-44.91,0-89.8c-.13-5.47-1.76-7.17-7.47-7.16q-265.95.27-531.9,0c-7.12,0-8.6,2.25-8.52,8.88.34,28.75.17,57.51.16,86.26,0,9.54-.05,9.53,9.66,9.53Z" />
    </svg>
  );
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
  const router = useRouter();
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
  const [quoteOpening, setQuoteOpening] = useState(false);
  const hasImageSlider = galleryImages.length > 1;
  const imageWidth = shopCompact ? 520 : 720;
  const cardTitleClass = `font-sans !font-normal tracking-normal text-[#1a1a1a] ${
    shopCompact
      ? "text-sm lg:text-lg xl:text-xl [@media(max-width:366px)_and_(max-height:568px)]:text-[10px] [@media(min-width:900px)_and_(max-width:1100px)_and_(max-height:820px)]:text-xs"
      : "text-lg sm:text-xl"
  }`;
  const cardDescClass = `font-sans !font-normal tracking-normal text-[#666666] ${
    shopCompact
      ? "text-[10px] leading-snug lg:text-[13px] lg:leading-[1.6] [@media(max-width:366px)_and_(max-height:568px)]:text-[8px] [@media(max-width:366px)_and_(max-height:568px)]:leading-tight [@media(min-width:900px)_and_(max-width:1100px)_and_(max-height:820px)]:text-[10px] [@media(min-width:900px)_and_(max-width:1100px)_and_(max-height:820px)]:leading-snug"
      : "text-[13px] leading-[1.6]"
  }`;

  useEffect(() => {
    setActiveImageIndex(0);
    setQuoteOpening(false);
  }, [product.id, galleryImages.length]);

  const prefetchProduct = useCallback(() => {
    try {
      router.prefetch(productHref);
    } catch {
      // Navigation still works if prefetch is unavailable.
    }
  }, [productHref, router]);

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
          <Link href={productHref} scroll className="relative block h-full w-full">
            {galleryImages.map((image, index) => (
              <Image
                key={`${image}-${index}`}
                src={imageKitUrl(image, { width: imageWidth })}
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
            ? "gap-1.5 px-2.5 pb-2.5 pt-1.5 lg:px-5 lg:pb-4 lg:pt-2"
            : "gap-1.5 px-5 pb-4 pt-2"
        }`}
      >
        <p
          className={`font-medium uppercase text-[#888888] ${
            shopCompact
              ? "text-[9px] tracking-wide lg:text-[11px] lg:tracking-widest [@media(max-width:366px)_and_(max-height:568px)]:text-[7px] [@media(max-width:366px)_and_(max-height:568px)]:tracking-normal [@media(min-width:900px)_and_(max-width:1100px)_and_(max-height:820px)]:text-[8px] [@media(min-width:900px)_and_(max-width:1100px)_and_(max-height:820px)]:tracking-wide"
              : "text-[11px] tracking-widest"
          }`}
        >
          {product.category || "Catering equipment"}
        </p>

        <div className="grid min-w-0 gap-0.5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start sm:gap-2">
          <Link href={productHref} scroll className="min-w-0 flex-1">
            <h1 className={`truncate leading-tight ${cardTitleClass}`}>
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

        <h2 className={`truncate ${cardDescClass}`}>
          {product.description || "Product details available on request."}
        </h2>

        <div className="mt-auto flex min-w-0 flex-row items-center justify-between gap-1.5 pt-2 sm:gap-2 [@media(max-width:366px)_and_(max-height:568px)]:flex-col [@media(max-width:366px)_and_(max-height:568px)]:items-start [@media(max-width:366px)_and_(max-height:568px)]:gap-1 [@media(min-width:900px)_and_(max-width:1100px)_and_(max-height:820px)]:flex-col [@media(min-width:900px)_and_(max-width:1100px)_and_(max-height:820px)]:items-start [@media(min-width:900px)_and_(max-width:1100px)_and_(max-height:820px)]:gap-1.5">
          <div className="min-w-0 flex-1 text-left">
            {hasDailyPrice ? (
              <p
                className={`flex min-w-0 items-baseline gap-1 whitespace-nowrap font-sans font-bold leading-none text-[#1a1a1a] ${
                  shopCompact ? "text-[10px] min-[390px]:text-[11px] md:text-[11px] xl:text-lg [@media(min-width:900px)_and_(max-width:1100px)_and_(max-height:820px)]:text-[10px]" : "text-[11px] sm:text-sm xl:text-lg"
                }`}
              >
                <DirhamIcon className="h-[0.8em] w-[0.8em] shrink-0 translate-y-[0.06em]" />
                <span>{priceValue}</span>
                <span
                  className={`font-semibold text-[#888888] ${
                    shopCompact ? "text-[7px] min-[390px]:text-[8px] xl:text-[10px]" : "text-[8px] sm:text-[10px]"
                  }`}
                >
                  /day
                </span>
              </p>
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
          <Link
            href={productHref}
            scroll
            aria-busy={quoteOpening}
            onFocus={prefetchProduct}
            onMouseEnter={prefetchProduct}
            onPointerDown={prefetchProduct}
            onTouchStart={prefetchProduct}
            onClick={(event) => {
              if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
              setQuoteOpening(true);
            }}
            className={`btn-brand w-fit shrink-0 self-center whitespace-nowrap rounded-md px-2 py-0.5 font-semibold uppercase transition-[transform,filter] duration-150 sm:ml-auto sm:self-auto active:scale-95 ${
              quoteOpening ? "scale-95 border-transparent bg-primary text-white brightness-95" : ""
            } [@media(max-width:366px)_and_(max-height:568px)]:self-start [@media(min-width:900px)_and_(max-width:1100px)_and_(max-height:820px)]:self-start`}
          >
            <span className="btn-brand__content shrink-0 gap-1 whitespace-nowrap text-[8px] tracking-wide max-sm:gap-0.5 max-sm:text-[7px] max-sm:tracking-normal max-[360px]:text-[6.5px]">
              Quote
              <span className="btn-brand__arrow h-[18px] w-[18px] max-sm:size-4 max-[360px]:h-3.5 max-[360px]:w-3.5" aria-hidden>
                <svg
                  width="9"
                  height="9"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  className="size-2.5"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}
