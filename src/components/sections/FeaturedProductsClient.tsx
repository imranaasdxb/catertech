"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import WaterRiseCta from "@/components/ui/WaterRiseCta";
import type { ProductAttributeValue } from "@/lib/category-template";

const ALL_TAB = "all";

type HighlightFilter = "all" | "Popular" | "New";

export type CategoryRow = {
  id: string;
  name: string;
  subcategories: {
    id: string;
    name: string;
  }[];
};

export type ProductRow = {
  id: string;
  categoryId: string | null;
  subCategoryId: string | null;
  title: string;
  slug: string;
  description: string;
  image: string | null;
  tag: "Popular" | "New" | null;
  attributes: Record<string, ProductAttributeValue>;
  categoryName: string | null;
  subCategoryName: string | null;
};

type ProductCard = {
  id: string;
  slug: string;
  name: string;
  category: string;
  subCategoryName: string | null;
  description: string;
  attributes: Record<string, ProductAttributeValue>;
  image: string | null;
  tag: "Popular" | "New" | null;
};

function norm(s: string) {
  return s.toLowerCase().trim();
}

function formatAttributeValue(value: ProductAttributeValue) {
  if (typeof value === "string") return value.trim();
  return `${value.value}${value.unit ? ` ${value.unit}` : ""}`.trim();
}

/** All size/dimension attributes for card title context, in display order. */
const SIZE_ATTRIBUTE_KEYS = [
  "dimensions",
  "size",
  "length",
  "width",
  "height",
  "diameter",
] as const;

function getProductSizeSummary(
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

const EQUIPMENT_PREVIEW_COUNT = 10;
const CARDS_PER_ROW = 4;
const ROW_COUNT = 2;
const PAGE_SIZE = CARDS_PER_ROW * ROW_COUNT;

function ProductCardSkeleton({ shopCompact = false }: { shopCompact?: boolean }) {
  return (
    <article
      className={`flex h-full min-w-0 animate-pulse flex-col overflow-hidden bg-[#FEFEFE] ${
        shopCompact ? "rounded-xl lg:rounded-2xl" : "rounded-2xl"
      }`}
      aria-hidden
    >
      <div className="aspect-square w-full shrink-0 bg-[#ececec]" />
      <div
        className={`flex flex-1 flex-col ${
          shopCompact
            ? "gap-2 px-2.5 pb-2.5 pt-2 lg:px-5 lg:pb-4"
            : "gap-2.5 px-5 pb-4 pt-3"
        }`}
      >
        <div className="h-2.5 w-2/5 rounded-full bg-[#e2e2e2]" />
        <div className="h-5 w-4/5 rounded-md bg-[#dedede]" />
        <div className="space-y-1.5">
          <div className="h-3 w-full rounded-full bg-[#e7e7e7]" />
          <div className="h-3 w-3/4 rounded-full bg-[#e7e7e7]" />
        </div>
        <div className="mt-auto flex justify-end pt-2">
          <div className={`h-8 rounded-full bg-[#dedede] ${shopCompact ? "w-full lg:w-28" : "w-28"}`} />
        </div>
      </div>
    </article>
  );
}

function StorefrontProductCard({
  product,
  lazyImage = false,
  shopCompact = false,
}: {
  product: ProductCard;
  lazyImage?: boolean;
  shopCompact?: boolean;
}) {
  const productHref = `/shop/${product.slug}`;
  const sizeSummary = getProductSizeSummary(product.attributes);
  const cardTitleClass = `font-sans !font-normal tracking-normal text-[#1a1a1a] ${
    shopCompact ? "text-sm lg:text-lg xl:text-xl" : "text-lg sm:text-xl"
  }`;
  const cardDescClass = `font-sans !font-normal tracking-normal text-[#666666] ${
    shopCompact
      ? "text-[10px] leading-snug lg:text-[13px] lg:leading-[1.6]"
      : "text-[13px] leading-[1.6]"
  }`;

  return (
    <article
      className={`group flex h-full min-w-0 flex-col overflow-hidden bg-[#FEFEFE] transition-transform duration-300 ${
        shopCompact
          ? "rounded-xl hover:-translate-y-0.5 lg:rounded-2xl lg:hover:-translate-y-1"
          : "rounded-2xl hover:-translate-y-1"
      }`}
    >
      <div className="relative aspect-square w-full shrink-0 bg-[#FEFEFE]">
        {product.image ? (
          <Link href={productHref} className="relative block h-full w-full">
            <Image
              src={product.image}
              alt={product.name}
              fill
              loading={lazyImage ? "lazy" : undefined}
              unoptimized
              className={`object-contain object-center transition-transform duration-500 group-hover:scale-[1.02] ${
                shopCompact ? "p-2 lg:p-4" : "p-4"
              }`}
              sizes={
                shopCompact
                  ? "(max-width: 1024px) 45vw, 22vw"
                  : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 22vw"
              }
            />
          </Link>
        ) : (
          <div className="h-full w-full animate-pulse bg-[#ececec]" aria-label="Image coming soon" />
        )}

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

        <div className="flex min-w-0 items-start justify-between gap-2">
          <Link href={productHref} className="min-w-0 flex-1">
            <h1 className={`line-clamp-2 leading-tight ${cardTitleClass}`}>
              {product.name}
            </h1>
          </Link>
          {sizeSummary ? (
            <p
              className={`max-w-[46%] shrink-0 pt-0.5 text-right font-sans font-normal leading-snug text-[#888888] ${
                shopCompact ? "text-[9px] lg:text-[11px]" : "text-[11px]"
              }`}
            >
              {sizeSummary}
            </p>
          ) : null}
        </div>

        <h2 className={`line-clamp-2 ${cardDescClass}`}>
          {product.description || "Product details available on request."}
        </h2>

        <div
          className={`mt-auto flex pt-1 lg:pt-2 ${
            shopCompact ? "justify-stretch lg:justify-end" : "justify-end"
          }`}
        >
          <WaterRiseCta
            href={productHref}
            size="xs"
            className={shopCompact ? "w-full justify-center lg:w-fit" : "w-fit"}
          >
            View &amp; quote
          </WaterRiseCta>
        </div>
      </div>
    </article>
  );
}

function CarouselNavButton({
  direction,
  onClick,
  disabled,
  label,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  disabled: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-surface-card text-ink shadow-sm transition-all duration-200 hover:border-border hover:bg-white disabled:pointer-events-none disabled:opacity-35"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden
      >
        {direction === "prev" ? (
          <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    </button>
  );
}

export default function FeaturedProductsClient({
  categories,
  products,
  catalogError = "",
  compactTop = false,
}: {
  categories: CategoryRow[];
  products: ProductRow[];
  catalogError?: string;
  compactTop?: boolean;
}) {
  const [activeTab, setActiveTab] = useState(ALL_TAB);
  const [search, setSearch] = useState("");
  const [highlight, setHighlight] = useState<HighlightFilter>("all");
  const [selectedEquipment, setSelectedEquipment] = useState<Set<string>>(() => new Set());
  const [equipmentExpanded, setEquipmentExpanded] = useState(false);
  const [carouselStart, setCarouselStart] = useState(0);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const isShopCatalogue = compactTop;

  const activeCategory = useMemo(
    () => categories.find((category) => category.id === activeTab),
    [activeTab, categories]
  );

  const equipmentOptions = useMemo(
    () =>
      activeCategory
        ? activeCategory.subcategories.map((subcategory) => subcategory.name)
        : [
            ...new Set(
              categories.flatMap((category) =>
                category.subcategories.map((subcategory) => subcategory.name)
              )
            ),
          ].sort((a, b) => a.localeCompare(b)),
    [activeCategory, categories]
  );

  const productCards = useMemo<ProductCard[]>(
    () =>
      products.map((product) => ({
        id: product.id,
        slug: product.slug,
        name: product.title,
        category: product.categoryName ?? "",
        subCategoryName: product.subCategoryName,
        description: product.description,
        attributes: product.attributes,
        image: product.image,
        tag: product.tag,
      })),
    [products]
  );

  const filtered = useMemo(() => {
    let list =
      activeTab === ALL_TAB
        ? [...productCards]
        : productCards.filter((product) => {
            const category = categories.find((item) => item.id === activeTab);
            return category ? product.category === category.name : false;
          });

    if (highlight !== "all") {
      list = list.filter((p) => p.tag === highlight);
    }

    if (selectedEquipment.size > 0) {
      list = list.filter((p) => p.subCategoryName && selectedEquipment.has(p.subCategoryName));
    }

    const q = norm(search);
    if (q) {
      list = list.filter((p) => {
        const hay = [
          p.name,
          p.category,
          p.subCategoryName ?? "",
          p.tag ?? "",
          p.description,
          ...Object.values(p.attributes).map(formatAttributeValue),
        ]
          .join(" ")
          .toLowerCase();
        return hay.includes(q);
      });
    }

    return list;
  }, [activeTab, categories, highlight, productCards, search, selectedEquipment]);

  const displayed = filtered;

  const rowOne = displayed.slice(carouselStart, carouselStart + CARDS_PER_ROW);
  const rowTwo = displayed.slice(carouselStart + CARDS_PER_ROW, carouselStart + PAGE_SIZE);
  const maxCarouselStart = Math.max(0, displayed.length - CARDS_PER_ROW);
  const canGoPrev = carouselStart > 0;
  const canGoNext = carouselStart + PAGE_SIZE < displayed.length;

  const visibleProducts = displayed.slice(0, visibleCount);
  const canLoadMore = visibleCount < displayed.length;
  const canShowLess = visibleCount > PAGE_SIZE;

  function resetProductWindow() {
    if (isShopCatalogue) {
      setVisibleCount(PAGE_SIZE);
    } else {
      setCarouselStart(0);
    }
  }

  useEffect(() => {
    if (!isShopCatalogue) return;
    setVisibleCount(PAGE_SIZE);
  }, [activeTab, search, highlight, selectedEquipment, displayed.length, isShopCatalogue]);

  useEffect(() => {
    if (!isShopCatalogue) return;
    setCarouselStart(0);
  }, [activeTab, search, highlight, selectedEquipment, displayed.length, isShopCatalogue]);

  useEffect(() => {
    if (!isShopCatalogue) return;

    const node = loadMoreRef.current;
    if (!node || !canLoadMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((count) => Math.min(count + PAGE_SIZE, displayed.length));
        }
      },
      { rootMargin: "240px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [canLoadMore, displayed.length, isShopCatalogue, visibleCount]);

  function goPrevRow() {
    setCarouselStart((prev) => Math.max(0, prev - CARDS_PER_ROW));
  }

  function goNextRow() {
    setCarouselStart((prev) => Math.min(maxCarouselStart, prev + CARDS_PER_ROW));
  }

  function loadMore() {
    setVisibleCount((count) => Math.min(count + PAGE_SIZE, displayed.length));
  }

  function showLess() {
    setVisibleCount((count) => Math.max(PAGE_SIZE, count - PAGE_SIZE));
  }

  function toggleEquipment(label: string) {
    resetProductWindow();
    setSelectedEquipment((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  }

  function selectTab(tabId: string) {
    setActiveTab(tabId);
    setSelectedEquipment(new Set());
    setEquipmentExpanded(false);
    resetProductWindow();
  }

  function selectHighlight(nextHighlight: HighlightFilter) {
    setHighlight(nextHighlight);
    resetProductWindow();
  }

  function updateSearch(nextSearch: string) {
    setSearch(nextSearch);
    resetProductWindow();
  }

  function clearFilters() {
    setSearch("");
    setHighlight("all");
    setActiveTab(ALL_TAB);
    setSelectedEquipment(new Set());
    setEquipmentExpanded(false);
  }

  const hiddenEquipmentCount = Math.max(0, equipmentOptions.length - EQUIPMENT_PREVIEW_COUNT);
  const visibleEquipmentOptions = equipmentExpanded
    ? equipmentOptions
    : equipmentOptions.slice(0, EQUIPMENT_PREVIEW_COUNT);

  const hasActiveFilters =
    norm(search).length > 0 ||
    highlight !== "all" ||
    activeTab !== ALL_TAB ||
    selectedEquipment.size > 0;

  const tabs = [
    { id: ALL_TAB, name: "All" },
    ...categories.map((category) => ({ id: category.id, name: category.name })),
  ];

  function ShopPagination({
    className = "",
    layout = "row",
  }: {
    className?: string;
    layout?: "row" | "stack";
  }) {
    if (displayed.length === 0) return null;

    return (
      <div
        className={
          layout === "stack"
            ? `min-w-0 space-y-3 ${className}`
            : `flex min-w-0 flex-wrap items-center justify-end gap-2 sm:gap-2.5 ${className}`
        }
      >
        <p className="text-[11px] text-muted">
          Showing 1-{Math.min(visibleCount, displayed.length)} of {displayed.length}
        </p>
        <div className="flex items-center gap-1.5">
          <CarouselNavButton
            direction="prev"
            onClick={showLess}
            disabled={!canShowLess}
            label="Show fewer products"
          />
          <CarouselNavButton
            direction="next"
            onClick={loadMore}
            disabled={!canLoadMore}
            label="Load more products"
          />
        </div>
      </div>
    );
  }

  function FeaturedPagination() {
    if (displayed.length <= PAGE_SIZE) return null;

    return (
      <div className="flex items-center justify-end gap-2.5">
        <p className="text-[11px] text-muted">
          Showing {carouselStart + 1}-{Math.min(carouselStart + PAGE_SIZE, displayed.length)} of{" "}
          {displayed.length}
        </p>
        <div className="flex items-center gap-1.5">
          <CarouselNavButton
            direction="prev"
            onClick={goPrevRow}
            disabled={!canGoPrev}
            label="Previous products"
          />
          <CarouselNavButton
            direction="next"
            onClick={goNextRow}
            disabled={!canGoNext}
            label="Next products"
          />
        </div>
      </div>
    );
  }

  return (
    <section className={`bg-offwhite pb-24 ${compactTop ? "pt-0" : "pt-24"}`}>
      <Container>
        <div
          className={`min-w-0 ${isShopCatalogue ? "p-3 sm:p-5 md:p-8 lg:p-10" : "p-5 md:p-8 lg:p-10"}`}
        >
        <div className={`min-w-0 ${isShopCatalogue ? "mb-0" : "mb-6 md:mb-8"}`}>
          <SectionHeader
            eyebrow="Shop Our Range"
            title="Featured Equipment"
            subtitle="Open any item to choose size, finish and quantity - then add it to your quote basket."
            subtitleClassName={
              isShopCatalogue
                ? "max-w-xl text-sm leading-snug sm:text-base"
                : "max-w-none whitespace-nowrap text-[clamp(0.72rem,2.8vw,1.125rem)] leading-snug"
            }
          />
        </div>

        {isShopCatalogue ? <div className="h-5 md:h-6" aria-hidden /> : null}

        {isShopCatalogue ? (
          <div className="sticky top-[var(--header-height)] z-10 bg-offwhite">
            <div className="border-b border-border py-1 mb-4 lg:mb-6">
              <div className="flex min-w-0 items-end gap-2 sm:gap-3">
                <div className="flex min-w-0 flex-1 gap-0.5 overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-1">
                  {tabs.map((tab) => {
                    const active = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => selectTab(tab.id)}
                        className={`relative shrink-0 px-2.5 py-2 text-[10px] font-semibold uppercase tracking-wide transition-all duration-200 sm:px-3 sm:text-xs lg:px-5 lg:py-2.5 lg:tracking-wider ${
                          active ? "text-charcoal" : "text-muted hover:text-charcoal"
                        }`}
                      >
                        {tab.name}
                        {active ? (
                          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#322b81]" />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
        <div className="mb-6 min-w-0 border-b border-border md:mb-10">
          <div className="flex min-w-0 items-end gap-2 sm:gap-3">
          <div className="flex min-w-0 flex-1 gap-0.5 overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-1">
            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => selectTab(tab.id)}
                  className={`relative shrink-0 px-5 py-2.5 text-xs font-semibold tracking-wider uppercase transition-all duration-200 ${
                    active ? "text-charcoal" : "text-muted hover:text-charcoal"
                  }`}
                >
                  {tab.name}
                  {active ? (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#322b81]" />
                  ) : null}
                </button>
              );
            })}
          </div>
          <Link
            href="/shop"
            className="mb-2.5 flex shrink-0 items-center gap-2 text-sm font-medium tracking-wider text-ink/70 transition-colors hover:text-ink"
          >
            View All -&gt;
          </Link>
          </div>
        </div>
        )}

        <div
          className={`flex min-w-0 flex-col items-start gap-6 lg:flex-row lg:gap-8 ${
            isShopCatalogue ? "lg:items-start" : ""
          }`}
        >
          <aside
            className={`w-full shrink-0 space-y-5 lg:w-[252px] xl:w-[260px] ${
              isShopCatalogue
                ? "lg:sticky lg:top-[calc(var(--header-height)+3.25rem)] lg:z-10 lg:self-start lg:bg-offwhite"
                : "lg:sticky lg:top-28 lg:self-start"
            }`}
          >
            <div>
              <label htmlFor="featured-shop-search" className="sr-only">
                Search featured products
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="7" />
                    <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
                  </svg>
                </span>
                <input
                  id="featured-shop-search"
                  type="search"
                  value={search}
                  onChange={(e) => updateSearch(e.target.value)}
                  placeholder="Search product, category, size..."
                  autoComplete="off"
                  className="w-full rounded-xl border border-border bg-[#FEFEFE] pl-11 pr-4 py-3 text-sm text-charcoal shadow-[0_2px_12px_rgba(26,31,46,0.04)] placeholder:text-muted/80 outline-none focus:border-ink/20 focus:ring-2 focus:ring-ink/10"
                />
              </div>
            </div>

            <div className="rounded-xl border border-border/60 bg-[#FEFEFE] p-4 md:p-5 shadow-[0_2px_12px_rgba(26,31,46,0.04)] space-y-6">
              <h3 className="text-[15px] font-semibold text-charcoal tracking-tight">
                Filter by
              </h3>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-charcoal pb-2 mb-3 border-b border-charcoal/25">
                  {activeCategory ? `${activeCategory.name} types` : "Category types"}
                </p>
                {visibleEquipmentOptions.length ? (
                  <ul
                    className={
                      equipmentExpanded && hiddenEquipmentCount > 0
                        ? "max-h-[200px] space-y-2.5 overflow-y-auto pr-1 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-ink/20 [&::-webkit-scrollbar-track]:bg-transparent"
                        : "space-y-2.5"
                    }
                  >
                    {visibleEquipmentOptions.map((opt) => {
                      const id = `eq-${activeTab}-${opt.replace(/\s+/g, "-").slice(0, 48)}`;
                      return (
                        <li key={opt}>
                          <label
                            htmlFor={id}
                            className="flex items-start gap-2.5 cursor-pointer group text-left"
                          >
                            <input
                              id={id}
                              type="checkbox"
                              checked={selectedEquipment.has(opt)}
                              onChange={() => toggleEquipment(opt)}
                              className="mt-0.5 size-[15px] shrink-0 rounded border-border text-ink accent-ink focus:ring-ink/20 focus:ring-offset-0 cursor-pointer"
                            />
                            <span className="text-[13px] text-charcoal leading-snug group-hover:text-ink transition-colors">
                              {opt}
                            </span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-[13px] leading-relaxed text-muted">
                    No sub-category filters yet.
                  </p>
                )}
                {hiddenEquipmentCount > 0 ? (
                  <button
                    type="button"
                    onClick={() => setEquipmentExpanded((e) => !e)}
                    className="mt-4 text-[13px] font-semibold text-ink/70 hover:text-ink underline underline-offset-2 transition-colors"
                  >
                    {equipmentExpanded ? "Show less" : `See ${hiddenEquipmentCount} more`}
                  </button>
                ) : null}
              </div>

              <div className="h-px bg-border" />

              <div>
                <p className="text-[11px] font-semibold text-charcoal mb-2.5">Highlights</p>
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      ["all", "All items"],
                      ["Popular", "Popular"],
                      ["New", "New in"],
                    ] as const
                  ).map(([val, label]) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => selectHighlight(val)}
                      className={`rounded-full px-3 py-1.5 text-[11px] font-semibold tracking-wide border transition-colors ${
                        highlight === val
                          ? "border-[#322b81] bg-[#322b81] text-white"
                          : "border-border bg-[#f6f6f6] text-muted hover:border-border hover:text-charcoal"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {hasActiveFilters ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-[11px] font-semibold text-ink/70 hover:text-ink underline underline-offset-2"
                >
                  Clear all filters
                </button>
              ) : null}
            </div>

            {isShopCatalogue && displayed.length > PAGE_SIZE ? (
              <ShopPagination className="hidden lg:flex lg:flex-col" layout="stack" />
            ) : null}
          </aside>

          <div className="relative z-0 w-full min-w-0 flex-1">
            {catalogError || (productCards.length === 0 && !hasActiveFilters) ? (
              <div className="min-w-0 space-y-4" aria-busy="true" aria-label="Loading products">
                <p className="sr-only">{catalogError || "Products are loading."}</p>
                {isShopCatalogue ? (
                  <div className="grid min-w-0 grid-cols-2 gap-2.5 sm:gap-3.5 md:gap-4 lg:grid-cols-4 lg:gap-6">
                    {Array.from({ length: PAGE_SIZE }, (_, index) => (
                      <ProductCardSkeleton key={index} shopCompact />
                    ))}
                  </div>
                ) : (
                  [0, 1].map((rowIndex) => (
                    <div
                      key={rowIndex}
                      className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6"
                    >
                      {Array.from({ length: CARDS_PER_ROW }, (_, index) => (
                        <ProductCardSkeleton key={index} />
                      ))}
                    </div>
                  ))
                )}
              </div>
            ) : displayed.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-white/60 px-6 py-14 text-center">
                <p className="text-sm font-medium text-charcoal mb-1">No matches</p>
                <p className="text-xs text-muted mb-4">Try another search or reset filters.</p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs font-bold uppercase tracking-wider text-ink/70 hover:text-ink underline underline-offset-2"
                >
                  Clear filters
                </button>
              </div>
            ) : isShopCatalogue ? (
              <div className="min-w-0 space-y-4">
                <div className="grid min-w-0 grid-cols-2 gap-2.5 sm:gap-3.5 md:gap-4 lg:grid-cols-4 lg:gap-6">
                  {visibleProducts.map((product) => (
                    <StorefrontProductCard
                      key={product.id}
                      product={product}
                      lazyImage
                      shopCompact
                    />
                  ))}
                </div>

                {canLoadMore ? <div ref={loadMoreRef} className="h-1" aria-hidden /> : null}

                {displayed.length > PAGE_SIZE ? <ShopPagination className="lg:hidden" /> : null}
              </div>
            ) : (
              <div className="space-y-4">
                {[rowOne, rowTwo].map((rowProducts, rowIndex) => {
                  const slots = Array.from(
                    { length: CARDS_PER_ROW },
                    (_, i) => rowProducts[i] ?? null,
                  );
                  return (
                    <div
                      key={rowIndex}
                      className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6"
                    >
                      {slots.map((product, slotIndex) =>
                        product ? (
                          <StorefrontProductCard key={product.id} product={product} />
                        ) : (
                          <ProductCardSkeleton key={`empty-${rowIndex}-${slotIndex}`} />
                        ),
                      )}
                    </div>
                  );
                })}

                <FeaturedPagination />
              </div>
            )}
          </div>
        </div>

        {!compactTop ? (
          <div className="text-center mt-12">
            <WaterRiseCta href="/shop" size="lg">
              Browse Full Catalogue
            </WaterRiseCta>
          </div>
        ) : null}
        </div>
      </Container>
    </section>
  );
}
