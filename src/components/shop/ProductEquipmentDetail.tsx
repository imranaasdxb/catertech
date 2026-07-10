"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import {
  type ShopProductDetail,
  type ShopProductCard,
  getCollectionSiblings,
  getFamilyMeta,
} from "@/lib/shop-products";
import StorefrontProductCard, {
  getProductSizeSummary,
  type StorefrontProductCardData,
} from "@/components/shop/StorefrontProductCard";
import type { ProductTitleVariant } from "@/lib/storefront-product";
import { useCart } from "@/lib/cart-context";

type AccordionKey = "description";

/* ─── Star Rating ──────────────────────────────────────────────────── */
function StarRating({
  rating,
  size = "md",
}: {
  rating: number;
  size?: "sm" | "md" | "lg";
}) {
  const full = Math.floor(rating);
  const partial = rating - full >= 0.5;
  const px = size === "sm" ? 12 : size === "lg" ? 20 : 15;
  const stars = Array.from({ length: 5 }, (_, i) => {
    if (i < full) return "full";
    if (i === full && partial) return "half";
    return "empty";
  });
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} out of 5`}>
      {stars.map((type, i) => (
        <svg key={i} width={px} height={px} viewBox="0 0 24 24">
          {type === "full" ? (
            <path fill="#c21722" d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 5 2-7L2 9h7l3-7z" />
          ) : type === "half" ? (
            <>
              <defs>
                <linearGradient id={`h${i}`} x1="0" x2="1" y1="0" y2="0">
                  <stop offset="50%" stopColor="#c21722" />
                  <stop offset="50%" stopColor="#dee2e6" />
                </linearGradient>
              </defs>
              <path fill={`url(#h${i})`} d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 5 2-7L2 9h7l3-7z" />
            </>
          ) : (
            <path fill="#dee2e6" d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 5 2-7L2 9h7l3-7z" />
          )}
        </svg>
      ))}
    </span>
  );
}

/* ─── Trust Pill ───────────────────────────────────────────────────── */
function TrustItem({
  icon,
  label,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  sub: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sand/10 text-sand">
        {icon}
      </span>
      <div>
        <p className="text-[12px] font-semibold text-charcoal">{label}</p>
        <p className="text-[11px] text-muted leading-snug">{sub}</p>
      </div>
    </div>
  );
}

/* ─── Image Placeholder ────────────────────────────────────────────── */
function ImgPlaceholder({ label, active }: { label?: string; active?: boolean }) {
  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center gap-3 transition-colors duration-200 ${
        active ? "bg-cream" : "bg-cream/60"
      }`}
    >
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#c21722"
        strokeWidth="0.8"
        className="opacity-60"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
      {label && (
        <span className="text-[9px] font-bold tracking-[0.25em] uppercase text-sand/70">
          {label}
        </span>
      )}
    </div>
  );
}

function ProductMarqueeTrack({
  durationSec,
  children,
}: {
  durationSec: number;
  children: React.ReactNode;
}) {
  const style = {
    "--shop-pdp-marquee-duration": `${durationSec}s`,
  } as CSSProperties;

  return (
    <div className="shop-pdp-marquee-outer -mx-5 md:-mx-8">
      <div className="shop-pdp-marquee px-5 md:px-8 py-1 items-stretch" style={style}>
        {children}
      </div>
    </div>
  );
}

function VariantPickCard({
  kind,
  image,
  label,
  selected,
  onSelect,
}: {
  kind: "size" | "color";
  image: string;
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        "shrink-0 w-[118px] sm:w-[132px] text-left rounded-lg border overflow-hidden bg-white transition-all duration-200",
        selected
          ? "border-sand ring-2 ring-sand/35 shadow-[0_8px_28px_rgba(196,162,101,0.18)]"
          : "border-border hover:border-sand/45 hover:shadow-md",
      ].join(" ")}
    >
      <div className="relative aspect-4/3 bg-cream">
        <Image
          src={image}
          alt=""
          fill
          className="object-cover"
          sizes="132px"
        />
        <span className="absolute top-2 left-2 text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-navy/88 text-white shadow-sm">
          {kind === "size" ? "Size" : "Finish"}
        </span>
      </div>
      <div className="p-2">
        <p className="text-[10px] font-semibold text-charcoal leading-snug line-clamp-3">{label}</p>
        <p className="text-[8px] text-muted mt-0.5">Tap to select</p>
      </div>
    </button>
  );
}

function similarProductsPageSize(width: number) {
  if (width < 640) return 2;
  if (width < 768) return 3;
  if (width < 1280) return 4;
  return 5;
}

function SimilarProductsCarousel({
  products,
}: {
  products: StorefrontProductCardData[];
}) {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(4);

  useEffect(() => {
    const update = () => setPageSize(similarProductsPageSize(window.innerWidth));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    setPage(0);
  }, [products, pageSize]);

  const totalPages = Math.max(1, Math.ceil(products.length / pageSize));
  const safePage = Math.min(page, totalPages - 1);
  const visible = products.slice(safePage * pageSize, safePage * pageSize + pageSize);

  return (
    <div>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:gap-4 xl:grid-cols-5">
        {visible.map((p) => (
          <div key={p.id} className="min-w-0">
            <StorefrontProductCard product={p} shopCompact lazyImage />
          </div>
        ))}
      </div>
      {totalPages > 1 ? (
        <div className="mt-4 flex justify-end gap-2 px-5 md:px-8">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={safePage === 0}
            aria-label="Previous similar products"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-charcoal transition-colors hover:border-sand hover:text-sand disabled:cursor-not-allowed disabled:opacity-40"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={safePage >= totalPages - 1}
            aria-label="Next similar products"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-charcoal transition-colors hover:border-sand hover:text-sand disabled:cursor-not-allowed disabled:opacity-40"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      ) : null}
    </div>
  );
}

function getVariantTileLabel(variant: ProductTitleVariant) {
  const sizeSummary = getProductSizeSummary(variant.card.attributes);
  const colorRaw = variant.card.attributes.color;
  const color =
    typeof colorRaw === "string"
      ? colorRaw.trim()
      : colorRaw && typeof colorRaw === "object" && "value" in colorRaw
        ? String(colorRaw.value).trim()
        : "";
  const materialRaw = variant.card.attributes.material;
  const material =
    typeof materialRaw === "string"
      ? materialRaw.trim()
      : materialRaw && typeof materialRaw === "object" && "value" in materialRaw
        ? String(materialRaw.value).trim()
        : "";

  const parts = [sizeSummary, color, material].filter(Boolean);
  if (parts.length) return parts.join(" · ");
  return variant.card.name;
}

function ProductTitleVariantTile({
  variant,
  selected,
  onSelect,
}: {
  variant: ProductTitleVariant;
  selected: boolean;
  onSelect: () => void;
}) {
  const label = getVariantTileLabel(variant);

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={`View ${variant.card.name}`}
      className={[
        "shrink-0 w-[92px] sm:w-[108px] text-left rounded-xl border overflow-hidden bg-white transition-all duration-200",
        selected
          ? "border-sand ring-2 ring-sand/35 shadow-[0_8px_24px_rgba(196,162,101,0.16)]"
          : "border-border hover:border-sand/45 hover:shadow-md",
      ].join(" ")}
    >
      <div className="relative aspect-square bg-[#FEFEFE]">
        {variant.card.image ? (
          <Image
            src={variant.card.image}
            alt=""
            fill
            className="object-contain object-center p-1.5"
            sizes="108px"
          />
        ) : (
          <ImgPlaceholder label={label} active={selected} />
        )}
      </div>
      <div className="px-2 py-1.5">
        <p className="text-[9px] sm:text-[10px] font-semibold text-charcoal leading-snug line-clamp-2">
          {label}
        </p>
      </div>
    </button>
  );
}

function RelatedTile({ p }: { p: ShopProductCard }) {
  return (
    <Link
      href={`/shop/${p.id}`}
      className="group shrink-0 w-[118px] sm:w-[132px] snap-start bg-white rounded-lg border border-border hover:border-sand/50 hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col"
    >
      <div className="relative aspect-square bg-cream overflow-hidden w-full">
        <Image
          src={p.image}
          alt={p.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="132px"
        />
        {p.tag ? (
          <span className="absolute top-1.5 left-1.5 bg-sand text-white text-[7px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded-full max-w-[calc(100%-12px)] truncate">
            {p.tag}
          </span>
        ) : null}
      </div>
      <div className="p-2 flex flex-col flex-1 min-h-0">
        <p className="text-[7px] text-muted tracking-widest uppercase mb-0.5 truncate">{p.category}</p>
        <h4 className="text-[10px] font-semibold text-charcoal leading-snug group-hover:text-sand transition-colors line-clamp-2 min-h-10">
          {p.name}
        </h4>
        {p.cardSubtitle ? (
          <p className="text-[9px] text-muted mt-0.5 line-clamp-2 leading-snug">{p.cardSubtitle}</p>
        ) : null}
        <p className="text-[9px] text-sand font-semibold mt-auto pt-1.5 flex items-center gap-0.5">
          Details
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </p>
      </div>
    </Link>
  );
}

/* ─── Main Component ───────────────────────────────────────────────── */
export default function ProductEquipmentDetail({
  product: initialProduct,
  productSlug = "",
  titleVariants = [],
  similarProducts = [],
  categorySlug = null,
}: {
  product: ShopProductDetail;
  productSlug?: string;
  titleVariants?: ProductTitleVariant[];
  similarProducts?: StorefrontProductCardData[];
  categorySlug?: string | null;
}) {
  const { addItem } = useCart();
  const [activeSlug, setActiveSlug] = useState(productSlug || initialProduct.slug || "");
  const product = useMemo(() => {
    const match = titleVariants.find((variant) => variant.slug === activeSlug);
    return match?.detail ?? initialProduct;
  }, [activeSlug, titleVariants, initialProduct]);
  const [colorId, setColorId] = useState(product.colors[0]?.id ?? "");
  const [sizeId, setSizeId] = useState(product.sizes[0]?.id ?? "");
  const [qty, setQty] = useState(1);
  const [qtyInput, setQtyInput] = useState("1");
  const [wishlist, setWishlist] = useState(false);
  const [activeThumb, setActiveThumb] = useState(0);
  const [openSection, setOpenSection] = useState<AccordionKey>("description");
  const [cartAdded, setCartAdded] = useState(false);

  useEffect(() => {
    setActiveSlug(productSlug || initialProduct.slug || "");
  }, [productSlug, initialProduct.slug]);

  useEffect(() => {
    setColorId(product.colors[0]?.id ?? "");
    setSizeId(product.sizes[0]?.id ?? "");
    setActiveThumb(0);
    setQty(1);
    setQtyInput("1");
    setCartAdded(false);
    if (typeof document !== "undefined") {
      document.title = `${product.name} | Catertech Shop`;
    }
  }, [product]);

  const selectTitleVariant = (slug: string) => {
    if (slug === activeSlug) return;
    setActiveSlug(slug);
    window.history.replaceState(null, "", `/shop/${slug}`);
  };

  const thumbSources = useMemo(() => {
    const extras = product.galleryImages ?? [];
    const merged = [product.image, ...extras];
    const seen = new Set<string>();
    const uniq: string[] = [];
    for (const u of merged) {
      if (u && !seen.has(u)) {
        seen.add(u);
        uniq.push(u);
      }
    }
    return uniq.length ? uniq : [""];
  }, [product.image, product.galleryImages]);

  const mainSrc = thumbSources[activeThumb] ?? product.image;

  const collectionSiblings = useMemo(
    () => getCollectionSiblings(product.id, product.familyId),
    [product.id, product.familyId]
  );

  const collectionMeta = getFamilyMeta(product.familyId);

  const isChairsProduct = useMemo(() => {
    const haystack = [
      product.category,
      product.name,
      product.cardSubtitle ?? "",
      ...product.equipmentFilters,
    ]
      .join(" ")
      .toLowerCase();
    return /chair|seating/.test(haystack);
  }, [product.category, product.name, product.cardSubtitle, product.equipmentFilters]);

  const CHAIR_RENTAL_STOCK = 11_000;

  const syncQty = (next: number) => {
    const safe = Math.max(1, Math.floor(next));
    setQty(safe);
    setQtyInput(String(safe));
  };

  const selectedColor = product.colors.find((c) => c.id === colorId);

  const handleAddToCart = () => {
    const sizeLabel = product.sizes.find((s) => s.id === sizeId)?.label;
    const variantParts = [selectedColor?.label, sizeLabel].filter(Boolean);
    const displayName =
      variantParts.length > 0 ? `${product.name} (${variantParts.join(" · ")})` : product.name;
    const cartId = `product-${product.id}-${sizeId}-${colorId}`;
    for (let i = 0; i < qty; i++) {
      addItem({
        id: cartId,
        name: displayName,
        category: product.category,
        price: product.price,
        image: product.image ?? "",
        type: "product",
      });
    }
    setCartAdded(true);
    setTimeout(() => setCartAdded(false), 2500);
  };

  const variantPickCards = useMemo(() => {
    type Row = { kind: "size" | "color"; id: string; label: string; image: string };
    const imgs = thumbSources;
    const rows: Row[] = [];
    product.sizes.forEach((s, i) => {
      rows.push({
        kind: "size",
        id: s.id,
        label: s.label,
        image: imgs[i % imgs.length],
      });
    });
    product.colors.forEach((c, i) => {
      rows.push({
        kind: "color",
        id: c.id,
        label: c.label,
        image: imgs[(i + 1) % imgs.length],
      });
    });
    return rows;
  }, [product.sizes, product.colors, thumbSources]);

  const toggleSection = (key: AccordionKey) =>
    setOpenSection((prev) => (prev === key ? "description" : key));

  return (
    <div className="min-h-screen bg-offwhite font-sans antialiased">
      {/* ── Breadcrumb ──────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-5 md:px-8 pt-24 md:pt-28 pb-5">
        <div className="flex items-center justify-between">
          <nav className="flex items-center gap-1.5 text-[11px] tracking-wide text-muted flex-wrap">
            <Link href="/" className="hover:text-sand transition-colors">Home</Link>
            <span className="text-border">/</span>
            <Link href="/shop" className="hover:text-sand transition-colors">Shop</Link>
            <span className="text-border">/</span>
            <Link href="/shop" className="hover:text-sand transition-colors capitalize">
              {product.category}
            </Link>
            <span className="text-border">/</span>
            <span className="text-charcoal font-medium truncate max-w-[160px] sm:max-w-xs">
              {product.name}
            </span>
          </nav>
          <Link
            href="/shop"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-sand transition-colors shrink-0"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Back to Shop
          </Link>
        </div>
      </div>

      {/* ── Main Grid ───────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-5 md:px-8 pb-28 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_460px] xl:grid-cols-[1fr_500px] gap-8 xl:gap-16 items-start">

          {/* LEFT — Gallery */}
          <div className="lg:sticky lg:top-28 lg:self-start space-y-3">
            {/* Main image */}
            <div className="relative aspect-4/3 rounded-2xl overflow-hidden border border-border bg-[#FEFEFE] shadow-[0_4px_32px_rgba(26,31,46,0.07)]">
              {mainSrc ? (
                <Image
                  src={mainSrc}
                  alt={product.name}
                  fill
                  unoptimized
                  className="object-contain object-center p-4 sm:p-6 md:p-8"
                  priority
                  sizes="(max-width: 1024px) 100vw, 55vw"
                />
              ) : (
                <ImgPlaceholder label={product.name} active />
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                {product.tag && (
                  <span className="bg-sand text-white text-[10px] font-bold tracking-[0.18em] uppercase px-3 py-1.5 rounded-full shadow">
                    {product.tag}
                  </span>
                )}
                {product.discountPct != null && (
                  <span className="bg-charcoal text-white text-[10px] font-bold tracking-[0.18em] uppercase px-3 py-1.5 rounded-full shadow">
                    −{product.discountPct}%
                  </span>
                )}
              </div>

              {/* Wishlist */}
              <button
                type="button"
                onClick={() => setWishlist((w) => !w)}
                aria-pressed={wishlist}
                aria-label={wishlist ? "Remove from wishlist" : "Save to wishlist"}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm border border-white/60 hover:scale-110 active:scale-95 transition-transform"
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill={wishlist ? "#c21722" : "none"}
                  stroke={wishlist ? "#c21722" : "#14131f"}
                  strokeWidth="1.75"
                >
                  <path d="M12 21s-8-5.33-8-11a5 5 0 019-3 5 5 0 019 3c0 5.67-8 11-8 11z" />
                </svg>
              </button>

              {/* Zoom hint */}
              <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1.5 bg-white/85 backdrop-blur-sm rounded-full text-[10px] font-semibold text-charcoal tracking-wider border border-white/60 shadow-sm">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35M11 8v6M8 11h6" />
                </svg>
                ZOOM
              </div>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-5">
              {thumbSources.map((src, i) => (
                <button
                  key={`${src}-${i}`}
                  type="button"
                  onClick={() => setActiveThumb(i)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 bg-[#FEFEFE] transition-all duration-200 ${
                    activeThumb === i
                      ? "border-sand shadow-[0_0_0_1px_#c21722]"
                      : "border-border hover:border-sand/40"
                  }`}
                >
                  {src ? (
                    <Image
                      src={src}
                      alt={`${product.name} view ${i + 1}`}
                      fill
                      className="object-contain object-center p-1.5"
                      sizes="96px"
                    />
                  ) : (
                    <ImgPlaceholder label={`${i + 1}`} active={activeThumb === i} />
                  )}
                </button>
              ))}
            </div>

            {titleVariants.length >= 2 ? (
              <div className="pt-1">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-sand">
                  Other sizes &amp; variants
                </p>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                  {titleVariants.map((variant) => (
                    <ProductTitleVariantTile
                      key={variant.slug}
                      variant={variant}
                      selected={variant.slug === activeSlug}
                      onSelect={() => selectTitleVariant(variant.slug)}
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {/* RIGHT — Purchase Panel */}
          <div className="flex flex-col">
            {/* Category & tag */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-sand">
                {product.category}
              </span>
              {product.tag && (
                <>
                  <span className="h-3 w-px bg-border" />
                  <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-muted">
                    {product.tag}
                  </span>
                </>
              )}
            </div>

            {/* Title */}
            <h1 className="font-serif text-[1.9rem] sm:text-[2.25rem] leading-[1.1] tracking-[-0.02em] text-navy mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex flex-wrap items-center gap-2.5 mb-5">
              <StarRating rating={product.rating} />
              <span className="text-sm font-bold text-charcoal tabular-nums">
                {product.rating.toFixed(1)}
              </span>
              <span className="h-4 w-px bg-border" />
              <a
                href="#reviews"
                className="text-[12px] text-muted hover:text-sand underline underline-offset-4 decoration-border transition-colors"
              >
                {product.reviewCountLabel}
              </a>
            </div>

            {/* Short description */}
            <p className="text-[14px] leading-[1.8] text-muted pb-6 border-b border-border mb-6">
              {product.shortDescription}
            </p>

            {/* Enquiry note (replaces price) */}
            <div className="flex items-center gap-2.5 bg-sand/10 border border-sand/30 rounded-xl px-4 py-3 mb-7">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#c21722" strokeWidth="2">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
              <span className="text-[12px] text-sand font-semibold tracking-wide">
                Pricing available on quote. Request yours below
              </span>
            </div>

            {/* Size selector */}
            {product.sizes.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-charcoal">
                    Size
                  </p>
                  <p className="text-[12px] text-muted font-medium">
                    {product.sizes.find((s) => s.id === sizeId)?.label}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSizeId(s.id)}
                      className={`h-9 px-3.5 rounded-lg text-[11px] font-semibold tracking-wide border transition-all duration-200 ${
                        sizeId === s.id
                          ? "border-sand bg-sand/10 text-sand shadow-sm"
                          : "border-border bg-white text-muted hover:border-sand/50 hover:text-charcoal"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Finish / Color selector */}
            {product.colors.length > 0 && (
              <div className="mb-7">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-charcoal">
                    Finish
                  </p>
                  <p className="text-[12px] text-muted font-medium">{selectedColor?.label}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setColorId(c.id)}
                      className={`h-9 px-3.5 rounded-lg text-[11px] font-semibold tracking-wide border transition-all duration-200 ${
                        colorId === c.id
                          ? "border-sand bg-sand/10 text-sand shadow-sm"
                          : "border-border bg-white text-muted hover:border-sand/50 hover:text-charcoal"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Add to Cart */}
            <div className="flex gap-3 mb-2">
              {/* Qty */}
              <div className="flex items-center border border-border rounded-xl bg-white overflow-hidden shrink-0">
                <button
                  type="button"
                  onClick={() => syncQty(qty - 1)}
                  aria-label="Decrease quantity"
                  className="w-10 h-12 flex items-center justify-center text-muted hover:text-sand hover:bg-cream transition-colors"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14" />
                  </svg>
                </button>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={qtyInput}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, "");
                    setQtyInput(raw);
                    if (raw !== "") {
                      const parsed = parseInt(raw, 10);
                      if (!Number.isNaN(parsed) && parsed >= 1) setQty(parsed);
                    }
                  }}
                  onBlur={() => {
                    const parsed = parseInt(qtyInput, 10);
                    syncQty(Number.isNaN(parsed) || parsed < 1 ? 1 : parsed);
                  }}
                  className="h-10 w-14 rounded-md border border-border bg-offwhite px-1 text-center text-sm font-bold text-charcoal tabular-nums outline-none focus:border-sand focus:ring-2 focus:ring-sand/20 [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  aria-label="Quantity"
                />
                <button
                  type="button"
                  onClick={() => syncQty(qty + 1)}
                  aria-label="Increase quantity"
                  className="w-10 h-12 flex items-center justify-center text-muted hover:text-sand hover:bg-cream transition-colors"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </button>
              </div>

              {/* Primary CTA */}
              <button
                type="button"
                onClick={handleAddToCart}
                className={`flex-1 inline-flex items-center justify-center gap-2 text-sm font-semibold tracking-wider rounded-xl px-6 py-3.5 transition-colors duration-200 shadow-sm ${
                  cartAdded
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-navy hover:bg-charcoal text-white"
                }`}
              >
                {cartAdded ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Added to Quote!
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <path d="M16 10a4 4 0 01-8 0" />
                    </svg>
                    Add to Quote
                  </>
                )}
              </button>
            </div>

            {isChairsProduct ? (
              <p className="mb-4 rounded-xl border border-sand/25 bg-sand/8 px-4 py-3 text-[12px] leading-relaxed text-muted">
                <span className="font-semibold text-charcoal">
                  {CHAIR_RENTAL_STOCK.toLocaleString()} chairs
                </span>{" "}
                available for rent. Type your required quantity in the box above or use + / −.
              </p>
            ) : null}

            {cartAdded && (
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-2.5 mb-4">
                <span className="text-[12px] text-green-700 font-medium">
                  {qty > 1 ? `${qty} × ` : ""}{product.name} added to your quote basket
                </span>
                <Link
                  href="/cart"
                  className="text-[11px] font-bold text-green-700 hover:text-green-800 underline underline-offset-2"
                >
                  View Basket →
                </Link>
              </div>
            )}

            {/* Trust trio */}
            <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white rounded-2xl border border-border p-5">
              <TrustItem
                icon={
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <rect x="1" y="3" width="15" height="13" rx="1" />
                    <path d="M16 8h4l3 5v3h-7V8z" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                }
                label="UAE Delivery"
                sub="Dubai & across UAE"
              />
              <TrustItem
                icon={
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                }
                label="Secure Checkout"
                sub="Encrypted & safe"
              />
              <TrustItem
                icon={
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                }
                label="Quality Assured"
                sub="Vetted since 2005"
              />
            </div>
          </div>
        </div>

        {variantPickCards.length > 0 ? (
          <section
            className="mt-10 md:mt-12 pt-10 border-t border-border/90"
            aria-label="Sizes and finishes for this product"
          >
            <div className="mb-4 px-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-sand mb-1">
                This product: sizes & finishes
              </p>
              <p className="text-[13px] text-muted leading-snug max-w-3xl">
                Scrolls automatically. Hover to pause. Tap a card to update the selectors above before you add to
                quote.
              </p>
            </div>
            <ProductMarqueeTrack
              durationSec={Math.min(85, Math.max(28, variantPickCards.length * 11))}
            >
              <>
                {variantPickCards.map((v) => (
                  <VariantPickCard
                    key={`v1-${v.kind}-${v.id}`}
                    kind={v.kind}
                    image={v.image}
                    label={v.label}
                    selected={
                      v.kind === "size" ? sizeId === v.id : colorId === v.id
                    }
                    onSelect={() =>
                      v.kind === "size" ? setSizeId(v.id) : setColorId(v.id)
                    }
                  />
                ))}
                {variantPickCards.map((v) => (
                  <VariantPickCard
                    key={`v2-${v.kind}-${v.id}`}
                    kind={v.kind}
                    image={v.image}
                    label={v.label}
                    selected={
                      v.kind === "size" ? sizeId === v.id : colorId === v.id
                    }
                    onSelect={() =>
                      v.kind === "size" ? setSizeId(v.id) : setColorId(v.id)
                    }
                  />
                ))}
              </>
            </ProductMarqueeTrack>
          </section>
        ) : null}

        {/* ── Description & specs ── */}
        <div className="mt-16 rounded-2xl border border-border bg-white overflow-hidden shadow-[0_2px_16px_rgba(26,31,46,0.04)]">
          {(
            [["description", "Product Description & Specs"]] as [AccordionKey, string][]
          ).map(([key, label], idx, arr) => {
            const open = openSection === key;
            return (
              <div key={key} className={idx < arr.length - 1 ? "border-b border-border" : ""}>
                <button
                  type="button"
                  onClick={() => toggleSection(key)}
                  className="w-full flex items-center justify-between px-6 md:px-8 py-5 text-left group"
                >
                  <span
                    className={`text-[13px] font-semibold tracking-wide transition-colors ${
                      open ? "text-sand" : "text-charcoal group-hover:text-sand"
                    }`}
                  >
                    {label}
                  </span>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={open ? "#c21722" : "#14131f"}
                    strokeWidth="2"
                    className={`shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    open ? "max-h-[1400px]" : "max-h-0"
                  }`}
                >
                  <div className="px-6 md:px-8 pb-8 text-[14px] leading-[1.8] text-muted">
                    {key === "description" && (
                      <div className="space-y-7">
                        <p>{product.longDescription}</p>
                        {/* Specs cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="rounded-xl border border-border bg-offwhite p-5">
                            <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-sand mb-4">
                              Dimensions & Capacity
                            </p>
                            <div className="space-y-3">
                              {(product.specs.dimensionRows ?? [
                                { label: "Height", value: product.specs.height },
                                { label: "Width", value: product.specs.width },
                              ]).map((row, index, rows) => (
                                <div key={`${row.label}-${row.value}`}>
                                  <div className="flex items-start justify-between gap-4">
                                    <span className="text-[12px] text-muted">{row.label}</span>
                                    <span className="text-[12px] font-semibold text-charcoal text-right max-w-[64%] leading-snug">
                                      {row.value}
                                    </span>
                                  </div>
                                  {index < rows.length - 1 ? <div className="mt-3 h-px bg-border" /> : null}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="rounded-xl border border-border bg-offwhite p-5">
                            <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-sand mb-4">
                              Product Details
                            </p>
                            <div className="space-y-3">
                              {(product.specs.detailRows ?? [
                                { label: "Material", value: product.specs.materialLine1 },
                                { label: "Specification", value: product.specs.materialLine2 },
                              ]).map((row, index, rows) => (
                                <div key={`${row.label}-${row.value}`}>
                                  <div className="flex items-start justify-between gap-4">
                                    <span className="text-[12px] text-muted">{row.label}</span>
                                    <span className="text-[12px] font-semibold text-charcoal text-right max-w-[64%] leading-snug">
                                      {row.value}
                                    </span>
                                  </div>
                                  {index < rows.length - 1 ? <div className="mt-3 h-px bg-border" /> : null}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Reviews ─────────────────────────────────────────────────── */}
        <section id="reviews" className="mt-20">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-10">
            <div>
              <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-sand mb-2">
                Verified Reviews
              </p>
              <h2 className="font-serif text-2xl md:text-3xl text-navy tracking-tight">
                What Our Clients Say
              </h2>
            </div>
            <div className="flex items-center gap-5">
              <div className="text-right">
                <div className="text-4xl font-bold text-navy tabular-nums leading-none mb-1">
                  {product.rating.toFixed(1)}
                </div>
                <StarRating rating={product.rating} />
                <p className="text-[11px] text-muted mt-1">{product.reviewCountLabel}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {product.reviews.map((r, i) => (
              <article
                key={`${r.name}-${i}`}
                className="group bg-white rounded-2xl border border-border p-6 hover:border-sand/30 hover:shadow-[0_4px_24px_rgba(196,162,101,0.1)] transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  {/* Avatar */}
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                    style={{
                      background: "linear-gradient(135deg, #c21722 0%, #322b81 100%)",
                    }}
                  >
                    {r.initial}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm text-charcoal truncate">{r.name}</p>
                    <p className="text-[11px] text-muted mt-0.5">{r.date}</p>
                  </div>
                  <StarRating rating={Math.min(5, r.rating)} size="sm" />
                </div>
                <p className="text-[13px] leading-relaxed text-muted">
                  &ldquo;{r.text}&rdquo;
                </p>
              </article>
            ))}
          </div>
        </section>

        {collectionSiblings.length > 0 ? (
          <section className="mt-16 pt-12 border-t border-border">
            <div className="mb-5 px-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-sand mb-1">
                {collectionMeta.title}
              </p>
              <p className="text-[13px] text-muted leading-snug max-w-3xl">{collectionMeta.blurb}</p>
            </div>
            <ProductMarqueeTrack
              durationSec={Math.min(90, Math.max(30, collectionSiblings.length * 14))}
            >
              <>
                {collectionSiblings.map((p) => (
                  <RelatedTile key={`c1-${p.id}`} p={p} />
                ))}
                {collectionSiblings.map((p) => (
                  <RelatedTile key={`c2-${p.id}`} p={p} />
                ))}
              </>
            </ProductMarqueeTrack>
          </section>
        ) : null}

        {similarProducts.length > 0 ? (
          <section className="mt-12 -mx-5 md:-mx-8">
            <div className="mb-5 flex flex-col gap-3 px-5 md:px-8 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-sand">
                More you may need
              </p>
              {categorySlug ? (
                <Link
                  href={`/shop?category=${categorySlug}`}
                  className="inline-flex shrink-0 items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-sand transition-colors hover:text-navy"
                >
                  View all in {product.category}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              ) : null}
            </div>
            <SimilarProductsCarousel products={similarProducts} />
          </section>
        ) : null}

        {/* ── Back to Shop CTA ─────────────────────────────────────── */}
        <div className="mt-20 pt-14 border-t border-border text-center">
          <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-sand mb-3">
            Keep Exploring
          </p>
          <h3 className="font-serif text-2xl text-navy mb-7">
            Browse Our Full Equipment Range
          </h3>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2.5 border border-sand text-sand hover:bg-sand hover:text-white text-sm font-semibold tracking-widest uppercase px-10 py-4 rounded-full transition-all duration-200"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            View All Products
          </Link>
        </div>
      </div>

      {/* ── Mobile Sticky Bar ───────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 backdrop-blur-md border-t border-border px-4 py-3 flex items-center gap-3 shadow-[0_-4px_20px_rgba(26,31,46,0.09)]">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-medium text-muted truncate leading-tight">
            {product.category}
          </p>
          <p className="text-sm font-bold text-navy leading-tight mt-0.5 truncate">
            {product.name}
          </p>
        </div>
        <Link
          href="/trade/rfq"
          className="shrink-0 border border-sand text-sand text-[11px] font-bold tracking-wider uppercase px-4 py-2.5 rounded-xl transition-colors hover:bg-sand hover:text-white"
        >
          Quote
        </Link>
        <button
          type="button"
          onClick={handleAddToCart}
          className={`shrink-0 text-[11px] font-bold tracking-wider uppercase px-5 py-2.5 rounded-xl transition-colors ${
            cartAdded
              ? "bg-green-600 text-white"
              : "bg-navy hover:bg-charcoal text-white"
          }`}
        >
          {cartAdded ? "Added ✓" : "Add to Quote"}
        </button>
      </div>
    </div>
  );
}
