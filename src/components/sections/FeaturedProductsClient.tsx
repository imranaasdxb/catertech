"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FEATURED_PRODUCTS_SECTION_ID } from "@/lib/connect-us-sections";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/layout/PageContainer";
import StorefrontProductCard from "@/components/shop/StorefrontProductCard";
import SectionHeader from "@/components/ui/SectionHeader";
import BrandCta from "@/components/ui/BrandCta";
import { productMatchesCategory, resolveCategoryForProduct } from "@/lib/product-category-match";
import { slugify } from "@/lib/slug";
import type { ProductAttributeValue } from "@/lib/category-template";

const ALL_TAB = "all";

type HighlightFilter = "all" | "Popular" | "New";
type SortOrder = "default" | "a-z";

export type CategoryRow = {
  id: string;
  name: string;
  slug: string;
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
  pricePerDayAed: string | null;
  image: string | null;
  images?: string[];
  tag: "Popular" | "New" | null;
  attributes: Record<string, ProductAttributeValue>;
  categoryName: string | null;
  categorySlug?: string | null;
  subCategoryName: string | null;
};

type ProductCard = {
  id: string;
  slug: string;
  name: string;
  category: string;
  categoryId: string | null;
  categorySlug: string | null;
  subCategoryName: string | null;
  description: string;
  pricePerDayAed: string | null;
  attributes: Record<string, ProductAttributeValue>;
  image: string | null;
  images?: string[];
  tag: "Popular" | "New" | null;
};

function norm(s: string) {
  return s.toLowerCase().trim();
}

function formatAttributeValue(value: ProductAttributeValue) {
  if (typeof value === "string") return value.trim();
  return `${value.value}${value.unit ? ` ${value.unit}` : ""}`.trim();
}

const PRODUCT_TYPE_GROUPS = [
  { key: "bar-counter", pattern: /\bbar\s+counters?\b/ },
  { key: "hot-cabinet", pattern: /\bhot\s+cabinet\b|\bhot\s+cupboard\b/ },
  { key: "chiller", pattern: /\bchill?er\b|\bchilling\b|\brefrigerator\b|\bfridge\b/ },
  { key: "cooler", pattern: /\bcooler\b|\bcooling\b|\bice\s+box\b/ },
  { key: "chair", pattern: /\bchairs?\b|\bseating\b|\bstool\b|\bsofa\b/ },
  { key: "table", pattern: /\btables?\b|\bcocktail\b|\bdining\b|\bcounter\s+table\b/ },
  { key: "glass", pattern: /\bglass(?:es)?\b|\btumbler\b|\bgoblet\b/ },
  { key: "plate", pattern: /\bplates?\b|\bplatter\b|\bdish(?:es)?\b/ },
  { key: "fan", pattern: /\bfans?\b|\bair\s+cooler\b/ },
  { key: "cabinet", pattern: /\bcabinet\b|\bcupboard\b/ },
  { key: "warmer", pattern: /\bwarmer\b|\bchafer\b|\bchafing\b|\bbanquet\b/ },
  { key: "trolley", pattern: /\btrolleys?\b|\bcarts?\b/ },
  { key: "dispenser", pattern: /\bdispenser\b|\burn\b|\bkettle\b/ },
  { key: "oven", pattern: /\boven\b|\bgrill\b|\bfryer\b|\bpan\b/ },
  { key: "freezer", pattern: /\bfreezer\b/ },
  { key: "sink", pattern: /\bsinks?\b|\bwash\b/ },
  { key: "cutlery", pattern: /\bcutlery\b|\bspoon\b|\bfork\b|\bknife\b|\bknives\b/ },
  { key: "tray", pattern: /\btrays?\b/ },
];

function productSimilarityKey(title: string) {
  return title
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\b(?:with|without|cloth|cover|covered|uncovered|white|black|blue|red|golden|gold|silver|green|grey|gray|ivory|beige|brown|clear|transparent|chrome|brass|copper|rose)\b/g, " ")
    .replace(/\b\d+(?:\.\d+)?\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function productTypeGroupKey(product: ProductCard) {
  const searchable = `${product.name} ${product.subCategoryName ?? ""} ${product.category}`.toLowerCase();
  const index = PRODUCT_TYPE_GROUPS.findIndex((group) => group.pattern.test(searchable));
  return index >= 0 ? `${String(index).padStart(2, "0")}-${PRODUCT_TYPE_GROUPS[index].key}` : `99-${productSimilarityKey(product.name)}`;
}

function orderSimilarProductsTogether(products: ProductCard[]) {
  return [...products].sort((a, b) => {
    const leftGroup = productTypeGroupKey(a);
    const rightGroup = productTypeGroupKey(b);
    const groupCompare = leftGroup.localeCompare(rightGroup, undefined, { sensitivity: "base" });
    if (groupCompare !== 0) return groupCompare;

    const similarityCompare = productSimilarityKey(a.name).localeCompare(
      productSimilarityKey(b.name),
      undefined,
      { sensitivity: "base" },
    );
    if (similarityCompare !== 0) return similarityCompare;

    return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
  });
}

const EQUIPMENT_PREVIEW_COUNT = 10;
const CARDS_PER_ROW = 4;
const ROW_COUNT = 2;
const PAGE_SIZE = CARDS_PER_ROW * ROW_COUNT;
const SHOP_INITIAL_ROWS = 3;
const SHOP_LOAD_MORE_ROWS = 2;
const SHOP_INITIAL_VISIBLE = CARDS_PER_ROW * SHOP_INITIAL_ROWS;
const SHOP_LOAD_MORE_STEP = CARDS_PER_ROW * SHOP_LOAD_MORE_ROWS;

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

function CategoryTabStrip({
  tabs,
  activeTab,
  onSelect,
  size = "shop",
}: {
  tabs: { id: string; name: string }[];
  activeTab: string;
  onSelect: (tabId: string) => void;
  size?: "shop" | "featured";
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ active: false, startX: 0, scrollLeft: 0 });
  const [scrollEdges, setScrollEdges] = useState({ left: false, right: false });
  const [canScroll, setCanScroll] = useState(false);

  const updateScrollEdges = useCallback(() => {
    const node = scrollRef.current;
    if (!node) return;
    const { scrollLeft, scrollWidth, clientWidth } = node;
    const overflow = scrollWidth > clientWidth + 2;
    setCanScroll(overflow);
    setScrollEdges({
      left: scrollLeft > 6,
      right: scrollLeft + clientWidth < scrollWidth - 6,
    });
  }, []);

  useEffect(() => {
    updateScrollEdges();
    const node = scrollRef.current;
    if (!node) return;

    node.addEventListener("scroll", updateScrollEdges, { passive: true });
    const observer = new ResizeObserver(updateScrollEdges);
    observer.observe(node);

    return () => {
      node.removeEventListener("scroll", updateScrollEdges);
      observer.disconnect();
    };
  }, [tabs, updateScrollEdges]);

  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;
    const activeButton = node.querySelector<HTMLButtonElement>(`[data-tab-id="${activeTab}"]`);
    activeButton?.scrollIntoView({ behavior: "smooth", inline: "nearest", block: "nearest" });
  }, [activeTab, tabs]);

  const scrollTabs = useCallback((direction: "left" | "right") => {
    const node = scrollRef.current;
    if (!node) return;
    const amount = Math.max(180, Math.round(node.clientWidth * 0.72));
    node.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }, []);

  const handleWheel = useCallback((event: React.WheelEvent<HTMLDivElement>) => {
    const node = scrollRef.current;
    if (!node || node.scrollWidth <= node.clientWidth + 2) return;

    const delta =
      Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    if (delta === 0) return;

    event.preventDefault();
    node.scrollLeft += delta;
  }, []);

  const handlePointerDown = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const node = scrollRef.current;
    if (!node || node.scrollWidth <= node.clientWidth + 2) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if ((event.target as HTMLElement).closest("button")) return;

    dragRef.current = {
      active: true,
      startX: event.clientX,
      scrollLeft: node.scrollLeft,
    };
    node.setPointerCapture(event.pointerId);
  }, []);

  const handlePointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;
    const node = scrollRef.current;
    if (!node) return;

    node.scrollLeft = dragRef.current.scrollLeft - (event.clientX - dragRef.current.startX);
  }, []);

  const endDrag = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    scrollRef.current?.releasePointerCapture(event.pointerId);
  }, []);

  const buttonClass =
    size === "featured"
      ? "relative shrink-0 cursor-pointer px-5 py-2.5 text-xs font-semibold tracking-wider uppercase transition-all duration-200"
      : "relative shrink-0 cursor-pointer px-2.5 py-2 text-[10px] font-semibold uppercase tracking-wide transition-all duration-200 sm:px-3 sm:text-xs lg:px-5 lg:py-2.5 lg:tracking-wider";

  const navButtonClass =
    "inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-white text-charcoal shadow-sm transition-colors hover:border-ink/20 hover:bg-offwhite disabled:cursor-not-allowed disabled:opacity-35";

  return (
    <div className="flex min-w-0 flex-1 items-end gap-1 sm:gap-2">
      <div className="relative min-w-0 flex-1">
        {scrollEdges.left ? (
          <span
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-offwhite via-offwhite/80 to-transparent"
            aria-hidden
          />
        ) : null}
        {scrollEdges.right ? (
          <span
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-offwhite via-offwhite/80 to-transparent"
            aria-hidden
          />
        ) : null}
        <div
          ref={scrollRef}
          onWheel={handleWheel}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className={`flex min-w-0 gap-0.5 overflow-x-auto overscroll-x-contain scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-1 ${
            canScroll ? "cursor-grab touch-pan-x active:cursor-grabbing" : ""
          }`}
        >
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                data-tab-id={tab.id}
                onClick={() => onSelect(tab.id)}
                className={`${buttonClass} ${
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

      {canScroll ? (
        <div className="flex shrink-0 items-center gap-0.5 pb-1">
          <button
            type="button"
            aria-label="Scroll categories back"
            disabled={!scrollEdges.left}
            onClick={() => scrollTabs("left")}
            className={navButtonClass}
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={2.25} aria-hidden />
          </button>
          <button
            type="button"
            aria-label="Scroll categories forward"
            disabled={!scrollEdges.right}
            onClick={() => scrollTabs("right")}
            className={navButtonClass}
          >
            <ChevronRight className="h-4 w-4" strokeWidth={2.25} aria-hidden />
          </button>
        </div>
      ) : null}
    </div>
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
  const [sortOrder, setSortOrder] = useState<SortOrder>("default");
  const [selectedEquipment, setSelectedEquipment] = useState<Set<string>>(() => new Set());
  const [equipmentExpanded, setEquipmentExpanded] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(SHOP_INITIAL_VISIBLE);
  const [loadingMore, setLoadingMore] = useState(false);
  const productGridRef = useRef<HTMLDivElement>(null);
  const skipFilterScrollRef = useRef(true);
  const isShopCatalogue = compactTop;
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  useEffect(() => {
    if (!categoryParam || categories.length === 0) return;

    const normalized = categoryParam.toLowerCase();
    const match = categories.find(
      (category) =>
        category.slug.toLowerCase() === normalized || slugify(category.name) === normalized,
    );

    if (match) {
      setActiveTab(match.id);
      setSelectedEquipment(new Set());
      setEquipmentExpanded(false);
      setVisibleCount(SHOP_INITIAL_VISIBLE);
      setLoadingMore(false);
    }
  }, [categories, categoryParam]);

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
      products.map((product) => {
        const resolved = resolveCategoryForProduct(
          {
            categoryId: product.categoryId,
            categorySlug: product.categorySlug ?? null,
            category: product.categoryName ?? "",
          },
          categories,
        );

        return {
          id: product.id,
          slug: product.slug,
          name: product.title,
          category: product.categoryName ?? resolved?.name ?? "",
          categoryId: resolved?.id ?? product.categoryId,
          categorySlug: resolved?.slug ?? product.categorySlug ?? null,
          subCategoryName: product.subCategoryName,
          description: product.description,
          pricePerDayAed: product.pricePerDayAed,
          attributes: product.attributes,
          image: product.image,
          images: product.images,
          tag: product.tag,
        };
      }),
    [categories, products]
  );

  const filtered = useMemo(() => {
    let list =
      activeTab === ALL_TAB
        ? isShopCatalogue
          ? [...productCards]
          : productCards.filter((product) => product.tag === "Popular" || product.tag === "New")
        : productCards.filter((product) => {
            const category = categories.find((item) => item.id === activeTab);
            if (!category) return false;
            return productMatchesCategory(product, category);
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
  }, [activeTab, categories, highlight, isShopCatalogue, productCards, search, selectedEquipment]);

  const displayed = useMemo(() => {
    if (sortOrder !== "a-z") return orderSimilarProductsTogether(filtered);
    return [...filtered].sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
    );
  }, [filtered, sortOrder]);

  const equipmentFilterKey = useMemo(
    () => [...selectedEquipment].sort().join("\0"),
    [selectedEquipment],
  );

  const homepageGridProducts = displayed.slice(0, PAGE_SIZE);
  const homepageRowOne = homepageGridProducts.slice(0, CARDS_PER_ROW);
  const homepageRowTwo = homepageGridProducts.slice(CARDS_PER_ROW, PAGE_SIZE);

  const visibleProducts = displayed.slice(0, visibleCount);
  const canLoadMore = visibleCount < displayed.length;
  const loadingSkeletonCount = loadingMore
    ? Math.min(SHOP_LOAD_MORE_STEP, displayed.length - visibleCount)
    : 0;

  function scrollToProductGridStart() {
    if (!isShopCatalogue || !productGridRef.current) return;

    const node = productGridRef.current;
    const scrollMarginTop = Number.parseFloat(getComputedStyle(node).scrollMarginTop) || 0;
    const top = node.getBoundingClientRect().top + window.scrollY - scrollMarginTop;

    window.scrollTo({
      top: Math.max(0, top),
      behavior: "smooth",
    });
  }

  function resetProductWindow() {
    setVisibleCount(isShopCatalogue ? SHOP_INITIAL_VISIBLE : PAGE_SIZE);
    setLoadingMore(false);
  }

  useEffect(() => {
    if (!isShopCatalogue) return;
    setVisibleCount(SHOP_INITIAL_VISIBLE);
    setLoadingMore(false);
  }, [activeTab, search, highlight, equipmentFilterKey, sortOrder, isShopCatalogue]);

  useEffect(() => {
    if (!isShopCatalogue) return;
    if (skipFilterScrollRef.current) {
      skipFilterScrollRef.current = false;
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        scrollToProductGridStart();
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [activeTab, highlight, equipmentFilterKey, sortOrder, isShopCatalogue]);

  function loadMore() {
    if (!canLoadMore || loadingMore) return;
    setLoadingMore(true);
    window.setTimeout(() => {
      setVisibleCount((count) => Math.min(count + SHOP_LOAD_MORE_STEP, displayed.length));
      setLoadingMore(false);
    }, 320);
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

  function toggleSortOrder() {
    setSortOrder((current) => (current === "a-z" ? "default" : "a-z"));
    resetProductWindow();
  }

  function updateSearch(nextSearch: string) {
    setSearch(nextSearch);
    resetProductWindow();
  }

  function clearFilters() {
    setSearch("");
    setHighlight("all");
    setSortOrder("default");
    setActiveTab(ALL_TAB);
    setSelectedEquipment(new Set());
    setEquipmentExpanded(false);
    resetProductWindow();
  }

  const hiddenEquipmentCount = Math.max(0, equipmentOptions.length - EQUIPMENT_PREVIEW_COUNT);
  const visibleEquipmentOptions = equipmentExpanded
    ? equipmentOptions
    : equipmentOptions.slice(0, EQUIPMENT_PREVIEW_COUNT);

  const hasActiveFilters =
    norm(search).length > 0 ||
    highlight !== "all" ||
    sortOrder !== "default" ||
    activeTab !== ALL_TAB ||
    selectedEquipment.size > 0;

  const mobileFilterCount =
    (highlight !== "all" ? 1 : 0) + (sortOrder === "a-z" ? 1 : 0) + selectedEquipment.size;

  useEffect(() => {
    if (!mobileFiltersOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileFiltersOpen]);

  function closeMobileFilters() {
    setMobileFiltersOpen(false);
  }

  function clearFiltersAndCloseMobile() {
    clearFilters();
    closeMobileFilters();
  }

  const tabs = [
    { id: ALL_TAB, name: "All" },
    ...categories.map((category) => ({ id: category.id, name: category.name })),
  ];

  function ShopProductCount({ className = "" }: { className?: string }) {
    if (displayed.length <= SHOP_INITIAL_VISIBLE && !loadingMore) return null;

    return (
      <p className={`text-[11px] text-muted ${className}`}>
        Showing {Math.min(visibleCount, displayed.length)} of {displayed.length}
      </p>
    );
  }

  function ShopLoadMoreButton() {
    if (displayed.length <= SHOP_INITIAL_VISIBLE && !loadingMore) return null;
    if (!canLoadMore && !loadingMore) return null;

    return (
      <div className="flex justify-center pt-2">
        <button
          type="button"
          onClick={loadMore}
          disabled={loadingMore}
          className="inline-flex min-h-10 items-center justify-center rounded-full border border-border bg-surface-card px-6 text-sm font-semibold text-charcoal shadow-sm transition-colors hover:border-ink/20 hover:bg-white disabled:cursor-wait disabled:opacity-70"
        >
          {loadingMore ? "Loading…" : "Load more"}
        </button>
      </div>
    );
  }

  function ShopCategoryTabs({ className = "" }: { className?: string }) {
    return (
      <div className={`sticky top-[var(--header-height)] z-20 bg-offwhite ${className}`}>
        <div className="border-b border-border py-1 mb-4 lg:mb-6">
          <div className="flex min-w-0 items-end gap-2 sm:gap-3">
            <CategoryTabStrip tabs={tabs} activeTab={activeTab} onSelect={selectTab} size="shop" />
          </div>
        </div>
      </div>
    );
  }

  function FeaturedViewMore() {
    if (activeTab === ALL_TAB || !activeCategory) return null;

    const categoryHref = `/shop?category=${encodeURIComponent(activeCategory.slug)}`;
    const hasMoreThanGrid = displayed.length > PAGE_SIZE;

    return (
      <div className="flex justify-end pt-1">
        <Link
          href={categoryHref}
          className="inline-flex min-h-10 items-center justify-center rounded-full border border-border bg-surface-card px-5 text-sm font-semibold text-charcoal shadow-sm transition-colors hover:border-ink/20 hover:bg-white"
        >
          {hasMoreThanGrid ? `View more in ${activeCategory.name}` : `Browse ${activeCategory.name}`}
        </Link>
      </div>
    );
  }

  function renderFilterPanel({
    showHeading = true,
    showClearAction = true,
    equipmentScrollClass = "max-h-[200px]",
  }: {
    showHeading?: boolean;
    showClearAction?: boolean;
    equipmentScrollClass?: string;
  } = {}) {
    return (
      <div className="space-y-6">
        {showHeading ? (
          <h3 className="text-[15px] font-semibold text-charcoal tracking-tight">Filter by</h3>
        ) : null}

        <div>
          <div className="mb-3 flex items-center justify-between gap-2 border-b border-charcoal/25 pb-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-charcoal">
              {activeCategory ? `${activeCategory.name} types` : "Category types"}
            </p>
            {isShopCatalogue ? (
              <button
                type="button"
                onClick={toggleSortOrder}
                aria-pressed={sortOrder === "a-z"}
                className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] transition-colors ${
                  sortOrder === "a-z"
                    ? "border-[#322b81] bg-[#322b81] text-white"
                    : "border-border bg-[#f6f6f6] text-muted hover:border-border hover:text-charcoal"
                }`}
              >
                A–Z
              </button>
            ) : null}
          </div>
          {visibleEquipmentOptions.length ? (
            <ul
              className={
                equipmentExpanded && hiddenEquipmentCount > 0
                  ? `${equipmentScrollClass} space-y-2.5 overflow-y-auto pr-1 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-ink/20 [&::-webkit-scrollbar-track]:bg-transparent`
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
            <p className="text-[13px] leading-relaxed text-muted">No sub-category filters yet.</p>
          )}
          {hiddenEquipmentCount > 0 ? (
            <button
              type="button"
              onClick={() => setEquipmentExpanded((expanded) => !expanded)}
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

        {showClearAction && hasActiveFilters ? (
          <button
            type="button"
            onClick={clearFilters}
            className="text-[11px] font-semibold text-ink/70 hover:text-ink underline underline-offset-2"
          >
            Clear all filters
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <section
      id={FEATURED_PRODUCTS_SECTION_ID}
      className={`bg-offwhite pb-24 ${compactTop ? "pt-0" : "pt-24"}`}
    >
      <Container>
        <div
          className={`min-w-0 ${isShopCatalogue ? "p-3 sm:p-5 md:p-8 lg:p-10" : "p-5 md:p-8 lg:p-10"}`}
        >
        <div className={`min-w-0 ${isShopCatalogue ? "mb-0" : "mb-6 md:mb-8"}`}>
          <SectionHeader
            eyebrow="Shop Our Range"
            title="Featured Equipment"
            subtitle="Open any item to choose size, finish and quantity  then add it to your quote basket."
            subtitleClassName="max-w-xl text-sm leading-snug sm:text-base"
          />
        </div>

        {isShopCatalogue ? <div className="h-5 md:h-6" aria-hidden /> : null}

        {isShopCatalogue ? (
          <ShopCategoryTabs className="mb-0 lg:hidden" />
        ) : null}

        {!isShopCatalogue ? (
        <div className="mb-6 min-w-0 border-b border-border md:mb-10">
          <div className="flex min-w-0 items-end gap-2 sm:gap-3">
          <CategoryTabStrip tabs={tabs} activeTab={activeTab} onSelect={selectTab} size="featured" />
          <div className="relative shrink-0 before:pointer-events-none before:absolute before:-left-5 before:top-0 before:h-full before:w-6 before:bg-gradient-to-r before:from-transparent before:to-offwhite sm:before:-left-6 sm:before:w-8">
            <Link
              href="/shop"
              className="relative z-10 mb-2.5 flex items-center gap-2 bg-offwhite pl-2 text-sm font-medium tracking-wider text-ink/70 transition-colors hover:text-ink sm:pl-3"
            >
              View All -&gt;
            </Link>
          </div>
          </div>
        </div>
        ) : null}

        <div
          className={`flex min-w-0 flex-col items-start gap-6 lg:flex-row lg:gap-8 ${
            isShopCatalogue ? "lg:items-start" : ""
          }`}
        >
          <aside
            className={`w-full shrink-0 space-y-3 lg:w-[252px] lg:space-y-5 xl:w-[260px] ${
              isShopCatalogue
                ? "lg:sticky lg:top-[calc(var(--header-height)+0.75rem)] lg:z-10 lg:self-start lg:bg-offwhite"
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

            <div className="flex items-center gap-2 lg:hidden">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-[#FEFEFE] px-4 py-2.5 text-sm font-semibold text-charcoal shadow-[0_2px_12px_rgba(26,31,46,0.04)] transition-colors hover:border-ink/20"
                aria-expanded={mobileFiltersOpen}
                aria-controls="featured-mobile-filters"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" />
                </svg>
                Filters
                {mobileFilterCount > 0 ? (
                  <span className="inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-[#322b81] px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
                    {mobileFilterCount}
                  </span>
                ) : null}
              </button>
              {hasActiveFilters ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="shrink-0 rounded-xl border border-border bg-[#FEFEFE] px-3 py-2.5 text-xs font-semibold text-ink/70 transition-colors hover:border-ink/20 hover:text-ink"
                >
                  Clear
                </button>
              ) : null}
            </div>

            <div className="hidden lg:block rounded-xl border border-border/60 bg-[#FEFEFE] p-4 md:p-5 shadow-[0_2px_12px_rgba(26,31,46,0.04)]">
              {renderFilterPanel()}
            </div>

            {mobileFiltersOpen ? (
              <div className="lg:hidden">
                <button
                  type="button"
                  aria-label="Close filters"
                  className="fixed inset-0 z-[60] bg-black/45"
                  onClick={closeMobileFilters}
                />
                <div
                  id="featured-mobile-filters"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="featured-mobile-filters-title"
                  className="fixed inset-x-0 bottom-0 z-[70] flex max-h-[min(88vh,720px)] flex-col rounded-t-2xl border-t border-border bg-[#FEFEFE] shadow-[0_-10px_40px_rgba(26,31,46,0.14)]"
                >
                  <div className="flex items-center justify-between border-b border-border px-4 py-3.5">
                    <h3 id="featured-mobile-filters-title" className="text-base font-semibold text-charcoal">
                      Filters
                    </h3>
                    <button
                      type="button"
                      onClick={closeMobileFilters}
                      aria-label="Close filters"
                      className="inline-flex size-9 items-center justify-center rounded-full text-charcoal transition-colors hover:bg-black/5"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                        <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto px-4 py-4">
                    {renderFilterPanel({
                      showHeading: false,
                      showClearAction: false,
                      equipmentScrollClass: "max-h-[min(42vh,320px)]",
                    })}
                  </div>

                  <div className="flex gap-2 border-t border-border bg-[#FEFEFE] p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                    {hasActiveFilters ? (
                      <button
                        type="button"
                        onClick={clearFiltersAndCloseMobile}
                        className="min-h-11 flex-1 rounded-xl border border-border bg-white px-4 text-sm font-semibold text-charcoal transition-colors hover:border-ink/20"
                      >
                        Clear all
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={closeMobileFilters}
                      className="min-h-11 flex-1 rounded-xl bg-[#322b81] px-4 text-sm font-semibold text-white transition-opacity hover:opacity-95"
                    >
                      Show {displayed.length} {displayed.length === 1 ? "item" : "items"}
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

            {isShopCatalogue && displayed.length > SHOP_INITIAL_VISIBLE ? (
              <ShopProductCount className="hidden text-right lg:block" />
            ) : null}
          </aside>

          <div className="relative z-0 w-full min-w-0 flex-1">
            {isShopCatalogue ? (
              <ShopCategoryTabs className="hidden lg:block" />
            ) : null}
            <div
              ref={isShopCatalogue ? productGridRef : undefined}
              className={
                isShopCatalogue
                  ? "scroll-mt-[calc(var(--header-height)+3.25rem)]"
                  : undefined
              }
            >
            {catalogError || (productCards.length === 0 && !hasActiveFilters) ? (
              <div className="min-w-0 space-y-4" aria-busy="true" aria-label="Loading products">
                <p className="sr-only">{catalogError || "Products are loading."}</p>
                {isShopCatalogue ? (
                  <div className="grid min-w-0 grid-cols-2 gap-2.5 sm:gap-3.5 md:gap-4 lg:grid-cols-4 lg:gap-6">
                    {Array.from({ length: SHOP_INITIAL_VISIBLE }, (_, index) => (
                      <ProductCardSkeleton key={index} shopCompact />
                    ))}
                  </div>
                ) : (
                  [0, 1].map((rowIndex) => (
                    <div
                      key={rowIndex}
                      className="grid min-w-0 grid-cols-2 gap-2.5 sm:gap-3.5 md:gap-4 lg:grid-cols-4 lg:gap-6"
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
                <div
                  key={`${activeTab}-${equipmentFilterKey}-${highlight}-${search}-${sortOrder}`}
                  className="grid min-w-0 grid-cols-2 gap-2.5 sm:gap-3.5 md:gap-4 lg:grid-cols-4 lg:gap-6"
                >
                  {visibleProducts.map((product) => (
                    <StorefrontProductCard
                      key={product.id}
                      product={product}
                      lazyImage
                      shopCompact
                    />
                  ))}
                  {loadingMore
                    ? Array.from({ length: loadingSkeletonCount }, (_, index) => (
                        <ProductCardSkeleton key={`loading-${index}`} shopCompact />
                      ))
                    : null}
                </div>

                <ShopLoadMoreButton />
              </div>
            ) : (
              <div className="space-y-4">
                {[homepageRowOne, homepageRowTwo].map((rowProducts, rowIndex) => {
                  const slots = Array.from(
                    { length: CARDS_PER_ROW },
                    (_, i) => rowProducts[i] ?? null,
                  );
                  return (
                    <div
                      key={rowIndex}
                      className="grid min-w-0 grid-cols-2 gap-2.5 sm:gap-3.5 md:gap-4 lg:grid-cols-4 lg:gap-6"
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

                <FeaturedViewMore />
              </div>
            )}
            </div>
          </div>
        </div>

        {!compactTop ? (
          <div className="text-center mt-12">
            <BrandCta href="/shop" size="lg" className="whitespace-nowrap max-sm:px-5">
              Browse Full Catalogue
            </BrandCta>
          </div>
        ) : null}
        </div>
      </Container>
    </section>
  );
}
