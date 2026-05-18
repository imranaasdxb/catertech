"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import SectionHeader from "@/components/ui/SectionHeader";
import {
  SHOP_PRODUCT_CARDS,
  getFeaturedSidebarEquipmentFilters,
} from "@/lib/shop-products";

const TABS = ["All", "Catering", "Events", "Kitchen"] as const;

type HighlightFilter = "all" | "Popular" | "New";

const EQUIPMENT_PREVIEW_COUNT = 10;

function norm(s: string) {
  return s.toLowerCase().trim();
}

export default function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("All");
  const [search, setSearch] = useState("");
  const [highlight, setHighlight] = useState<HighlightFilter>("all");
  const [selectedEquipment, setSelectedEquipment] = useState<Set<string>>(() => new Set());
  const [equipmentExpanded, setEquipmentExpanded] = useState(false);

  const equipmentOptions = useMemo(
    () => getFeaturedSidebarEquipmentFilters(activeTab),
    [activeTab]
  );

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
      list = list.filter((p) =>
        p.equipmentFilters.some((f) => selectedEquipment.has(f))
      );
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
          ...p.equipmentFilters,
        ]
          .join(" ")
          .toLowerCase();
        return hay.includes(q);
      });
    }

    return list;
  }, [activeTab, highlight, search, selectedEquipment]);

  const displayed = filtered.slice(0, 16);

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

  return (
    <section className="bg-cream py-24">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <SectionHeader
            eyebrow="Shop Our Range"
            title="Featured Equipment"
            subtitle="Open any item to choose size, finish and quantity — then add it to your quote basket."
          />
          <Link
            href="/shop"
            className="text-sand text-sm font-medium tracking-wider hover:text-sand-dark transition-colors shrink-0 flex items-center gap-2"
          >
            View All →
          </Link>
        </div>

        <div className="flex gap-1 mb-8 md:mb-10 border-b border-border overflow-x-auto [scrollbar-width:thin]">
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
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sand" />
              )}
            </button>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
          <aside className="w-full lg:w-[280px] shrink-0 space-y-5 lg:sticky lg:top-28">
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
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name, category, equipment…"
                  autoComplete="off"
                  className="w-full rounded-xl border border-border bg-white pl-11 pr-4 py-3 text-sm text-charcoal shadow-[0_2px_12px_rgba(26,31,46,0.04)] placeholder:text-muted/80 outline-none focus:border-sand focus:ring-2 focus:ring-sand/20"
                />
              </div>
            </div>

            <div className="rounded-xl border border-border bg-white p-4 md:p-5 shadow-[0_2px_12px_rgba(26,31,46,0.04)] space-y-6">
              <h3 className="text-[15px] font-semibold text-charcoal tracking-tight">
                Filter by
              </h3>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-charcoal pb-2 mb-3 border-b border-charcoal/25">
                  Type of equipment
                </p>
                <ul className="space-y-2.5">
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
          </aside>

          <div className="flex-1 min-w-0 w-full">
            {displayed.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-white/60 px-6 py-14 text-center">
                <p className="text-sm font-medium text-charcoal mb-1">No matches</p>
                <p className="text-xs text-muted mb-4">Try another search or reset filters.</p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs font-bold uppercase tracking-wider text-sand hover:text-sand-dark underline underline-offset-2"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-4 lg:gap-5">
                {displayed.map((product) => (
                  <div
                    key={product.id}
                    className="group relative bg-white border border-border hover:border-sand/40 transition-all duration-300 hover:shadow-md rounded-lg overflow-hidden flex flex-col"
                  >
                    <Link href={`/shop/${product.id}`} className="flex flex-col flex-1 min-h-0">
                      <div className="relative aspect-5/6 overflow-hidden bg-cream shrink-0">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 1024px) 45vw, 220px"
                        />
                        {product.tag ? (
                          <span className="absolute top-2 left-2 bg-sand text-white text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 z-10 rounded-full">
                            {product.tag}
                          </span>
                        ) : null}
                      </div>

                      <div className="px-3 pt-3 pb-10 flex flex-col flex-1">
                        <p className="text-[9px] text-muted tracking-widest uppercase mb-1 truncate">
                          {product.category}
                        </p>
                        <h4 className="text-[13px] font-medium text-charcoal leading-snug group-hover:text-sand transition-colors line-clamp-2">
                          {product.name}
                        </h4>
                        {product.cardSubtitle ? (
                          <p className="text-[10px] text-muted mt-1 leading-snug line-clamp-2">
                            {product.cardSubtitle}
                          </p>
                        ) : null}
                      </div>
                    </Link>

                    <Link
                      href={`/shop/${product.id}`}
                      className="absolute bottom-2.5 right-2.5 z-10 inline-flex items-center gap-1 text-[9px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full transition-all duration-200 shadow-sm bg-white border border-navy/20 text-navy hover:bg-navy hover:text-white"
                    >
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                      View & quote
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="text-center mt-12">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 border border-sand text-sand text-sm font-semibold tracking-widest uppercase px-8 py-3.5 hover:bg-sand hover:text-white transition-all duration-200"
          >
            Browse Full Catalogue
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
