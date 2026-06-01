"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState, type CSSProperties } from "react";
import {
  type ShopProductDetail,
  type ShopProductCard,
  getCollectionSiblings,
  getCrossSellProducts,
  getFamilyMeta,
} from "@/lib/shop-products";
import { useCart } from "@/lib/cart-context";

type AccordionKey = "description" | "packaging" | "shipping";

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
  product,
}: {
  product: ShopProductDetail;
}) {
  const { addItem } = useCart();
  const [colorId, setColorId] = useState(product.colors[0]?.id ?? "");
  const [sizeId, setSizeId] = useState(product.sizes[0]?.id ?? "");
  const [qty, setQty] = useState(1);
  const [wishlist, setWishlist] = useState(false);
  const [activeThumb, setActiveThumb] = useState(0);
  const [openSection, setOpenSection] = useState<AccordionKey>("description");
  const [cartAdded, setCartAdded] = useState(false);

  const thumbSources = useMemo(() => {
    const extras = product.galleryImages ?? [];
    const merged = [product.image, ...extras];
    const seen = new Set<string>();
    const uniq: string[] = [];
    for (const u of merged) {
      if (!seen.has(u)) {
        seen.add(u);
        uniq.push(u);
      }
    }
    while (uniq.length < 4) uniq.push(product.image);
    return uniq.slice(0, 4);
  }, [product.image, product.galleryImages]);

  const mainSrc = thumbSources[activeThumb] ?? product.image;

  const collectionSiblings = useMemo(
    () => getCollectionSiblings(product.id, product.familyId),
    [product.id, product.familyId]
  );

  const crossSell = useMemo(() => {
    const sid = new Set(collectionSiblings.map((s) => s.id));
    return getCrossSellProducts(product.id, product.category, product.familyId)
      .filter((p) => !sid.has(p.id))
      .slice(0, 12);
  }, [product.id, product.category, product.familyId, collectionSiblings]);

  const collectionMeta = getFamilyMeta(product.familyId);

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
            <div className="relative aspect-4/3 rounded-2xl overflow-hidden border border-border shadow-[0_4px_32px_rgba(26,31,46,0.07)]">
              {mainSrc ? (
                <Image
                  src={mainSrc}
                  alt={product.name}
                  fill
                  className="object-cover"
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
            <div className="grid grid-cols-4 gap-2.5">
              {thumbSources.map((src, i) => (
                <button
                  key={`${src}-${i}`}
                  type="button"
                  onClick={() => setActiveThumb(i)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 ${
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
                      className="object-cover"
                      sizes="96px"
                    />
                  ) : (
                    <ImgPlaceholder label={`${i + 1}`} active={activeThumb === i} />
                  )}
                </button>
              ))}
            </div>

            {/* Share / Report row */}
            <div className="flex items-center justify-between pt-1 px-1">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted hover:text-sand transition-colors"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
                Share
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted hover:text-red-500 transition-colors"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
                  <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
                Report
              </button>
            </div>
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
                Pricing available on quote — request yours below
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
            <div className="flex gap-3 mb-4">
              {/* Qty */}
              <div className="flex items-center border border-border rounded-xl bg-white overflow-hidden shrink-0">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="w-10 h-12 flex items-center justify-center text-muted hover:text-sand hover:bg-cream transition-colors"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14" />
                  </svg>
                </button>
                <input
                  type="number"
                  min={1}
                  value={qty}
                  onChange={(e) => {
                    const v = parseInt(e.target.value, 10);
                    if (!isNaN(v) && v >= 1) setQty(v);
                  }}
                  className="w-12 text-center text-sm font-bold text-charcoal tabular-nums bg-transparent outline-none border-none [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  aria-label="Quantity"
                />
                <button
                  type="button"
                  onClick={() => setQty((q) => q + 1)}
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

            {/* Secondary CTA — bulk/trade */}
            <Link
              href="/trade/rfq"
              className="w-full inline-flex items-center justify-center gap-2 border border-sand text-sand hover:bg-sand hover:text-white text-sm font-semibold tracking-wider rounded-xl px-6 py-3.5 transition-all duration-200 mb-8"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
              Request a Bulk / Trade Quote
            </Link>

            {/* Trust trio */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white rounded-2xl border border-border p-5">
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
                This product — sizes & finishes
              </p>
              <p className="text-[13px] text-muted leading-snug max-w-3xl">
                Scrolls automatically — hover to pause. Tap a card to update the selectors above before you add to
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

        {/* ── Accordion — Description / Specs / Packaging / Shipping ── */}
        <div className="mt-16 rounded-2xl border border-border bg-white overflow-hidden shadow-[0_2px_16px_rgba(26,31,46,0.04)]">
          {(
            [
              ["description", "Product Description & Specs"],
              ["packaging", "Packaging"],
              ["shipping", "Shipping & Delivery"],
            ] as [AccordionKey, string][]
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
                    open ? "max-h-[900px]" : "max-h-0"
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
                              Dimensions
                            </p>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-[12px] text-muted">Height</span>
                                <span className="text-[12px] font-semibold text-charcoal text-right max-w-[60%]">
                                  {product.specs.height}
                                </span>
                              </div>
                              <div className="h-px bg-border" />
                              <div className="flex items-center justify-between">
                                <span className="text-[12px] text-muted">Width</span>
                                <span className="text-[12px] font-semibold text-charcoal text-right max-w-[60%]">
                                  {product.specs.width}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="rounded-xl border border-border bg-offwhite p-5">
                            <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-sand mb-4">
                              Materials
                            </p>
                            <div className="space-y-3">
                              <p className="text-[12px] text-charcoal font-medium">
                                {product.specs.materialLine1}
                              </p>
                              <div className="h-px bg-border" />
                              <p className="text-[12px] text-muted">
                                {product.specs.materialLine2}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {key === "packaging" && <p>{product.packaging}</p>}
                    {key === "shipping" && <p>{product.shipping}</p>}
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

        {crossSell.length > 0 ? (
          <section className="mt-12">
            <div className="mb-5 px-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-sand mb-1">
                More you may need
              </p>
              <p className="text-[13px] text-muted leading-snug max-w-3xl">
                Popular picks from the same department — open any tile to configure quantity and finishes.
              </p>
            </div>
            <ProductMarqueeTrack
              durationSec={Math.min(95, Math.max(32, crossSell.length * 9))}
            >
              <>
                {crossSell.map((p) => (
                  <RelatedTile key={`x1-${p.id}`} p={p} />
                ))}
                {crossSell.map((p) => (
                  <RelatedTile key={`x2-${p.id}`} p={p} />
                ))}
              </>
            </ProductMarqueeTrack>
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
