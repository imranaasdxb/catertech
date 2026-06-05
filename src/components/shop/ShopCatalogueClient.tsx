"use client";

import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import Link from "next/link";
import Container from "@/components/Container";
import ShopProductCard from "@/components/shop/ShopProductCard";
import {
  SHOP_PRODUCT_CARDS,
  getFeaturedSidebarEquipmentFilters,
} from "@/lib/shop-products";

const TABS = ["All", "Catering", "Events", "Kitchen"] as const;

type CatalogueTab = (typeof TABS)[number];

type HighlightFilter = "all" | "Popular" | "New";

type SortMode = "featured" | "name-asc" | "name-desc";

const EQUIPMENT_PREVIEW_COUNT = 12;

function norm(s: string) {
  return s.toLowerCase().trim();
}

function CatalogueFilterPanel(props: {
  search: string;
  setSearch: (v: string) => void;
  equipmentOptions: string[];
  visibleEquipmentOptions: string[];
  equipmentExpanded: boolean;
  setEquipmentExpanded: Dispatch<SetStateAction<boolean>>;
  hiddenEquipmentCount: number;
  selectedEquipment: Set<string>;
  toggleEquipment: (label: string) => void;
  activeTab: CatalogueTab;
  highlight: HighlightFilter;
  setHighlight: (v: HighlightFilter) => void;
  sort: SortMode;
  setSort: (v: SortMode) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}) {
  const {
    search,
    setSearch,
    equipmentOptions,
    visibleEquipmentOptions,
    equipmentExpanded,
    setEquipmentExpanded,
    hiddenEquipmentCount,
    selectedEquipment,
    toggleEquipment,
    activeTab,
    highlight,
    setHighlight,
    sort,
    setSort,
    clearFilters,
    hasActiveFilters,
  } = props;

  return (
    <div className="space-y-5">
      <div>
        <label htmlFor="catalogue-search" className="sr-only">
          Search catalogue
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
            </svg>
          </span>
          <input
            id="catalogue-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products, categories, equipment…"
            autoComplete="off"
            className="w-full rounded-xl border border-border bg-white pl-11 pr-4 py-3 text-sm text-charcoal shadow-[0_2px_12px_rgba(26,31,46,0.04)] placeholder:text-muted/80 outline-none focus:border-sand focus:ring-2 focus:ring-sand/20"
          />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-white p-4 md:p-5 shadow-[0_2px_12px_rgba(26,31,46,0.04)] space-y-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="catalogue-sort" className="text-[11px] font-semibold text-charcoal">
            Sort
          </label>
          <select
            id="catalogue-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortMode)}
            className="w-full rounded-lg border border-border bg-offwhite px-3 py-2.5 text-[13px] text-charcoal outline-none focus:border-sand focus:ring-2 focus:ring-sand/20"
          >
            <option value="featured">Featured order</option>
            <option value="name-asc">Name A–Z</option>
            <option value="name-desc">Name Z–A</option>
          </select>
        </div>

        <div className="h-px bg-border" />

        <h3 className="text-[15px] font-semibold text-charcoal tracking-tight">Filter by</h3>

        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-charcoal pb-2 mb-3 border-b border-charcoal/25">
            Type of equipment
          </p>
          {equipmentOptions.length === 0 ? (
            <p className="text-[13px] text-muted">No equipment filters for this tab.</p>
          ) : (
            <>
              <ul className="space-y-2.5">
                {visibleEquipmentOptions.map((opt) => {
                  const id = `cat-eq-${activeTab}-${opt.replace(/\s+/g, "-").slice(0, 40)}`;
                  return (
                    <li key={opt}>
                      <label htmlFor={id} className="flex items-start gap-2.5 cursor-pointer group text-left">
                        <input
                          id={id}
                          type="checkbox"
                          checked={selectedEquipment.has(opt)}
                          onChange={() => toggleEquipment(opt)}
                          className="mt-0.5 size-[15px] shrink-0 rounded border-border text-sand accent-sand focus:ring-sand/40 focus:ring-offset-0 cursor-pointer"
                        />
                        <span className="text-[13px] text-charcoal leading-snug group-hover:text-navy transition-colors">
                          {opt}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
              {hiddenEquipmentCount > 0 ? (
                <button
                  type="button"
                  onClick={() => setEquipmentExpanded((e) => !e)}
                  className="mt-4 text-[13px] font-semibold text-navy hover:text-sand underline underline-offset-2 transition-colors"
                >
                  {equipmentExpanded ? "Show less" : `See ${hiddenEquipmentCount} more`}
                </button>
              ) : null}
            </>
          )}
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
                onClick={() => setHighlight(val)}
                className={`rounded-full px-3 py-1.5 text-[11px] font-semibold tracking-wide border transition-colors ${
                  highlight === val
                    ? "border-sand bg-sand text-white"
                    : "border-border bg-offwhite text-muted hover:border-sand/40 hover:text-charcoal"
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
            className="text-[11px] font-semibold text-sand hover:text-sand-dark underline underline-offset-2"
          >
            Clear all filters
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default function ShopCatalogueClient() {
  const [activeTab, setActiveTab] = useState<CatalogueTab>("All");
  const [search, setSearch] = useState("");
  const [highlight, setHighlight] = useState<HighlightFilter>("all");
  const [sort, setSort] = useState<SortMode>("featured");
  const [selectedEquipment, setSelectedEquipment] = useState<Set<string>>(() => new Set());
  const [equipmentExpanded, setEquipmentExpanded] = useState(false);

  const catalogueIndex = useMemo(() => {
    const m = new Map<number, number>();
    SHOP_PRODUCT_CARDS.forEach((p, i) => m.set(p.id, i));
    return m;
  }, []);

  const equipmentOptions = useMemo(() => getFeaturedSidebarEquipmentFilters(activeTab), [activeTab]);

  useEffect(() => {
    setSelectedEquipment(new Set());
    setEquipmentExpanded(false);
  }, [activeTab]);

  const filtered = useMemo(() => {
    let list =
      activeTab === "All"
        ? [...SHOP_PRODUCT_CARDS]
        : SHOP_PRODUCT_CARDS.filter((p) => p.category === activeTab);

    if (highlight !== "all") {
      list = list.filter((p) => p.tag === highlight);
    }

    if (selectedEquipment.size > 0) {
      list = list.filter((p) => p.equipmentFilters.some((f) => selectedEquipment.has(f)));
    }

    const q = norm(search);
    if (q) {
      list = list.filter((p) => {
        const hay = [
          p.name,
          p.category,
          p.cardSubtitle ?? "",
          p.tag ?? "",
          p.familyId,
          p.price,
          ...p.equipmentFilters,
        ]
          .join(" ")
          .toLowerCase();
        return hay.includes(q);
      });
    }

    return list;
  }, [activeTab, highlight, search, selectedEquipment]);

  const sortedProducts = useMemo(() => {
    const list = [...filtered];
    if (sort === "name-asc") list.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "name-desc") list.sort((a, b) => b.name.localeCompare(a.name));
    else list.sort((a, b) => (catalogueIndex.get(a.id)! - catalogueIndex.get(b.id)!));
    return list;
  }, [filtered, sort, catalogueIndex]);

  function toggleEquipment(label: string) {
    setSelectedEquipment((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  }

  function clearFilters() {
    setSearch("");
    setHighlight("all");
    setActiveTab("All");
    setSort("featured");
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
    activeTab !== "All" ||
    selectedEquipment.size > 0;

  const filterPanelProps = {
    search,
    setSearch,
    equipmentOptions,
    visibleEquipmentOptions,
    equipmentExpanded,
    setEquipmentExpanded,
    hiddenEquipmentCount,
    selectedEquipment,
    toggleEquipment,
    activeTab,
    highlight,
    setHighlight,
    sort,
    setSort,
    clearFilters,
    hasActiveFilters,
  };

  return (
    <section className="bg-white py-12 md:py-16">
      <Container>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8 lg:mb-10">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-sand mb-2">Full catalogue</p>
            <h2 className="font-serif text-3xl md:text-4xl text-charcoal leading-tight">
              Browse every line we quote
            </h2>
            <p className="text-muted text-sm mt-3 leading-relaxed">
              Switch between catering hire, kitchen fabrication favourites and events scenic inventory. Combine tabs with equipment checkboxes to narrow thousands of RFQ combinations down to just what your venue needs.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="rounded-full border border-border bg-white px-4 py-2 text-charcoal font-medium shadow-[0_2px_12px_rgba(26,31,46,0.04)]">
              {sortedProducts.length} product{sortedProducts.length === 1 ? "" : "s"}
            </span>
            <Link
              href="/cart"
              className="rounded-full border border-sand bg-sand px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-sand-dark transition-colors"
            >
              Quote basket
            </Link>
          </div>
        </div>

        <div className="flex gap-1 mb-8 border-b border-border overflow-x-auto [scrollbar-width:thin] pb-px">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 px-5 py-2.5 text-xs font-semibold tracking-wider uppercase transition-all duration-200 relative ${
                activeTab === tab ? "text-charcoal" : "text-muted hover:text-charcoal"
              }`}
            >
              {tab}
              {activeTab === tab ? <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sand" /> : null}
            </button>
          ))}
        </div>

        <details className="group lg:hidden mb-6 rounded-xl border border-border bg-white shadow-[0_2px_12px_rgba(26,31,46,0.04)] overflow-hidden">
          <summary className="cursor-pointer list-none px-4 py-3.5 flex items-center justify-between gap-3 font-semibold text-charcoal text-sm [&::-webkit-details-marker]:hidden">
            <span className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" />
              </svg>
              Search & filters
            </span>
            <span className="text-muted text-xs font-normal group-open:hidden">Tap to expand</span>
            <span className="text-muted text-xs font-normal hidden group-open:inline">Tap to collapse</span>
          </summary>
          <div className="px-4 pb-4 pt-0 border-t border-border">
            <CatalogueFilterPanel {...filterPanelProps} />
          </div>
        </details>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          <aside className="hidden lg:block w-[252px] xl:w-[260px] shrink-0 lg:sticky lg:top-28">
            <CatalogueFilterPanel {...filterPanelProps} />
          </aside>

          <div className="flex-1 min-w-0 w-full">
            {sortedProducts.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-white px-6 py-16 text-center">
                <p className="font-serif text-xl text-charcoal mb-2">No matches yet</p>
                <p className="text-muted text-sm mb-6 max-w-md mx-auto">
                  Loosen equipment selections or jump back to All — our warehouse team can still source adjacent SKUs offline.
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs font-bold uppercase tracking-wider text-sand hover:text-sand-dark underline underline-offset-2"
                >
                  Reset catalogue filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4 lg:gap-6">
                {sortedProducts.map((product) => (
                  <ShopProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-[11px] text-muted mt-12 max-w-lg mx-auto leading-relaxed">
          Prefer a curated shortlist? Head home for featured picks — everything here opens the full PDP with variants and bundle-ready quoting.
        </p>
      </Container>
    </section>
  );
}
