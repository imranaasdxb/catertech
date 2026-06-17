"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import WaterRiseCta from "@/components/ui/WaterRiseCta";
import { SHOP_PRODUCT_CARDS } from "@/lib/shop-products";
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

export type PresetRow = {
  id: string;
  categoryId: string;
  subCategoryId: string | null;
  title: string;
  sourceLabel: string;
  attributes: Record<string, ProductAttributeValue>;
  categoryName: string;
  subCategoryName: string | null;
};

type PresetCard = {
  id: string;
  name: string;
  category: string;
  subCategoryName: string | null;
  sourceLabel: string;
  attributes: Record<string, ProductAttributeValue>;
  image: string;
  tag: "Popular" | "New" | null;
};

function norm(s: string) {
  return s.toLowerCase().trim();
}

function formatAttributeValue(value: ProductAttributeValue) {
  if (typeof value === "string") return value;
  return `${value.value}${value.unit ? ` ${value.unit}` : ""}`.trim();
}

function formatPresetSubtitle(product: PresetCard) {
  const specs = Object.entries(product.attributes)
    .map(([key, value]) => {
      const formatted = formatAttributeValue(value);
      return formatted ? `${key.replace(/_/g, " ")}: ${formatted}` : "";
    })
    .filter(Boolean)
    .slice(0, 2);

  return [product.subCategoryName, ...specs].filter(Boolean).join(" · ");
}

const EQUIPMENT_PREVIEW_COUNT = 10;
const CARDS_PER_ROW = 4;
const ROW_COUNT = 2;
const PAGE_SIZE = CARDS_PER_ROW * ROW_COUNT;

function PresetProductCard({ product }: { product: PresetCard }) {
  const subtitle = formatPresetSubtitle(product);
  const productHref = `/shop/preset/${product.id}`;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-[#f5f2ee] transition-transform duration-300 hover:-translate-y-1">
      <div className="relative aspect-square w-full shrink-0 bg-[#f5f2ee]">
        <Link href={productHref} className="relative block h-full w-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain object-center p-4 transition-transform duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 22vw"
          />
        </Link>

        {product.tag ? (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-[#1a1a1a] px-2.5 py-1 text-[11px] font-semibold leading-none text-white">
            {product.tag}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 px-5 pb-4 pt-2">
        <p className="text-[11px] font-medium uppercase tracking-widest text-[#888888]">
          {product.category}
        </p>

        <Link href={productHref} className="block">
          <h3 className="line-clamp-2 text-lg font-bold leading-tight text-[#1a1a1a] sm:text-xl">
            {product.name}
          </h3>
        </Link>

        <p className="line-clamp-2 text-[13px] leading-[1.6] text-[#666666]">
          {subtitle || product.sourceLabel || "\u00A0"}
        </p>

        <div className="mt-auto flex justify-end pt-2">
          <WaterRiseCta href={productHref} size="xs" className="w-fit">
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
  presets,
  catalogError = "",
}: {
  categories: CategoryRow[];
  presets: PresetRow[];
  catalogError?: string;
}) {
  const [activeTab, setActiveTab] = useState(ALL_TAB);
  const [search, setSearch] = useState("");
  const [highlight, setHighlight] = useState<HighlightFilter>("all");
  const [selectedEquipment, setSelectedEquipment] = useState<Set<string>>(() => new Set());
  const [equipmentExpanded, setEquipmentExpanded] = useState(false);
  const [carouselStart, setCarouselStart] = useState(0);

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

  const presetCards = useMemo<PresetCard[]>(() => {
    return presets.map((preset, index) => {
      const fallback = SHOP_PRODUCT_CARDS[index % SHOP_PRODUCT_CARDS.length];
      return {
        id: preset.id,
        name: preset.title,
        category: preset.categoryName,
        subCategoryName: preset.subCategoryName,
        sourceLabel: preset.sourceLabel,
        attributes: preset.attributes,
        image: fallback.image,
        tag: index % 17 === 0 ? "New" : index % 11 === 0 ? "Popular" : null,
      };
    });
  }, [presets]);

  const filtered = useMemo(() => {
    let list =
      activeTab === ALL_TAB
        ? [...presetCards]
        : presetCards.filter((product) => {
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
          p.sourceLabel,
          ...Object.values(p.attributes).map(formatAttributeValue),
        ]
          .join(" ")
          .toLowerCase();
        return hay.includes(q);
      });
    }

    return list;
  }, [activeTab, categories, highlight, presetCards, search, selectedEquipment]);

  const displayed = filtered;

  const rowOne = displayed.slice(carouselStart, carouselStart + CARDS_PER_ROW);
  const rowTwo = displayed.slice(carouselStart + CARDS_PER_ROW, carouselStart + PAGE_SIZE);
  const maxCarouselStart = Math.max(0, displayed.length - CARDS_PER_ROW);
  const canGoPrev = carouselStart > 0;
  const canGoNext = carouselStart + PAGE_SIZE < displayed.length;

  function goPrevRow() {
    setCarouselStart((prev) => Math.max(0, prev - CARDS_PER_ROW));
  }

  function goNextRow() {
    setCarouselStart((prev) => Math.min(maxCarouselStart, prev + CARDS_PER_ROW));
  }

  function toggleEquipment(label: string) {
    setCarouselStart(0);
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
    setCarouselStart(0);
  }

  function selectHighlight(nextHighlight: HighlightFilter) {
    setHighlight(nextHighlight);
    setCarouselStart(0);
  }

  function updateSearch(nextSearch: string) {
    setSearch(nextSearch);
    setCarouselStart(0);
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

  return (
    <section className="bg-white py-24">
      <Container>
        <div className=" p-5 md:p-8 lg:p-10">
        <div className="mb-6 md:mb-8">
          <SectionHeader
            eyebrow="Shop Our Range"
            title="Featured Equipment"
            subtitle="Open any item to choose size, finish and quantity - then add it to your quote basket."
            subtitleClassName="max-w-none whitespace-nowrap text-[clamp(0.72rem,2.8vw,1.125rem)] leading-snug"
          />
        </div>

        <div className="mb-8 flex items-end justify-between gap-4 border-b border-border md:mb-10">
          <div className="flex min-w-0 flex-1 gap-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          <aside className="w-full lg:w-[252px] xl:w-[260px] shrink-0 space-y-5 lg:sticky lg:top-28">
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
                  placeholder="Search preset title, category, size..."
                  autoComplete="off"
                  className="w-full rounded-xl border border-border bg-surface-card pl-11 pr-4 py-3 text-sm text-charcoal shadow-[0_2px_12px_rgba(26,31,46,0.04)] placeholder:text-muted/80 outline-none focus:border-ink/20 focus:ring-2 focus:ring-ink/10"
                />
              </div>
            </div>

            <div className="rounded-xl border border-border/60 bg-surface-card p-4 md:p-5 shadow-[0_2px_12px_rgba(26,31,46,0.04)] space-y-6">
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
          </aside>

          <div className="flex-1 min-w-0 w-full">
            {catalogError ? (
              <div className="rounded-xl border border-dashed border-border bg-white/60 px-6 py-14 text-center">
                <p className="text-sm font-medium text-charcoal mb-1">{catalogError}</p>
                <p className="text-xs text-muted">Please refresh the page and try again.</p>
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
            ) : (
              <div className="space-y-4">
                {[rowOne, rowTwo].map((rowProducts, rowIndex) => {
                  const slots = Array.from(
                    { length: CARDS_PER_ROW },
                    (_, i) => rowProducts[i] ?? null
                  );
                  return (
                    <div
                      key={rowIndex}
                      className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6"
                    >
                      {slots.map((product, slotIndex) =>
                        product ? (
                          <PresetProductCard key={product.id} product={product} />
                        ) : (
                          <div
                            key={`empty-${rowIndex}-${slotIndex}`}
                            className="hidden rounded-xl border border-dashed border-border/60 bg-offwhite/50 lg:block"
                            aria-hidden
                          />
                        )
                      )}
                    </div>
                  );
                })}

                {displayed.length > PAGE_SIZE ? (
                  <div className="flex items-center justify-end gap-2.5">
                    <p className="text-[11px] text-muted">
                      Showing {carouselStart + 1}-
                      {Math.min(carouselStart + PAGE_SIZE, displayed.length)} of {displayed.length}
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
                ) : null}
              </div>
            )}
          </div>
        </div>

        <div className="text-center mt-12">
          <WaterRiseCta href="/shop" size="lg">
            Browse Full Catalogue
          </WaterRiseCta>
        </div>
        </div>
      </Container>
    </section>
  );
}
