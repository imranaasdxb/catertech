"use client";

import Link from "next/link";
import { useState } from "react";
import type { ShopProductDetail } from "@/lib/shop-products";

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
            <path fill="#C4A265" d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 5 2-7L2 9h7l3-7z" />
          ) : type === "half" ? (
            <>
              <defs>
                <linearGradient id={`h${i}`} x1="0" x2="1" y1="0" y2="0">
                  <stop offset="50%" stopColor="#C4A265" />
                  <stop offset="50%" stopColor="#E5DDD0" />
                </linearGradient>
              </defs>
              <path fill={`url(#h${i})`} d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 5 2-7L2 9h7l3-7z" />
            </>
          ) : (
            <path fill="#E5DDD0" d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 5 2-7L2 9h7l3-7z" />
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
        stroke="#C4A265"
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

/* ─── Main Component ───────────────────────────────────────────────── */
export default function ProductEquipmentDetail({
  product,
}: {
  product: ShopProductDetail;
}) {
  const [colorId, setColorId] = useState(product.colors[0]?.id ?? "");
  const [qty, setQty] = useState(1);
  const [wishlist, setWishlist] = useState(false);
  const [activeThumb, setActiveThumb] = useState(0);
  const [openSection, setOpenSection] = useState<AccordionKey>("description");

  const selectedColor = product.colors.find((c) => c.id === colorId);

  const toggleSection = (key: AccordionKey) =>
    setOpenSection((prev) => (prev === key ? "description" : key));

  const thumbLabels = ["Main", "Alt 2", "Alt 3", "Alt 4"];

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
              <ImgPlaceholder label={product.name} active />

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
                  fill={wishlist ? "#C4A265" : "none"}
                  stroke={wishlist ? "#C4A265" : "#2C2826"}
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
              {thumbLabels.map((lbl, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveThumb(i)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                    activeThumb === i
                      ? "border-sand shadow-[0_0_0_1px_#C4A265]"
                      : "border-border hover:border-sand/40"
                  }`}
                >
                  <ImgPlaceholder label={lbl} active={activeThumb === i} />
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

            {/* Price */}
            <div className="flex flex-wrap items-end gap-3 mb-7">
              <span className="text-[2.1rem] font-bold text-navy tracking-tight tabular-nums leading-none">
                {product.price}
              </span>
              {product.compareAtPrice && (
                <span className="text-[1.05rem] text-muted line-through tabular-nums mb-0.5">
                  {product.compareAtPrice}
                </span>
              )}
              {product.discountPct != null && (
                <span className="mb-1 text-[10px] font-bold uppercase tracking-[0.15em] text-white bg-sand px-2.5 py-1 rounded-full">
                  Save {product.discountPct}%
                </span>
              )}
            </div>

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
                      className={`h-10 px-4 rounded-lg text-[11px] font-semibold tracking-wide border transition-all duration-200 ${
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
                  className="w-11 h-13 flex items-center justify-center text-muted hover:text-sand hover:bg-cream transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14" />
                  </svg>
                </button>
                <span className="w-10 text-center text-sm font-bold text-charcoal tabular-nums select-none">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty((q) => q + 1)}
                  aria-label="Increase quantity"
                  className="w-11 h-13 flex items-center justify-center text-muted hover:text-sand hover:bg-cream transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </button>
              </div>

              {/* Primary CTA */}
              <Link
                href="/cart"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-navy hover:bg-charcoal text-white text-sm font-semibold tracking-wider rounded-xl px-6 py-3.5 transition-colors duration-200 shadow-sm"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
                Add to Cart
              </Link>
            </div>

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
                    stroke={open ? "#C4A265" : "#2C2826"}
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
                      background: "linear-gradient(135deg, #C4A265 0%, #1A1F2E 100%)",
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
            {product.name}
          </p>
          <p className="text-base font-bold text-navy tabular-nums leading-tight mt-0.5">
            {product.price}
          </p>
        </div>
        <Link
          href="/trade/rfq"
          className="shrink-0 border border-sand text-sand text-[11px] font-bold tracking-wider uppercase px-4 py-2.5 rounded-xl transition-colors hover:bg-sand hover:text-white"
        >
          Quote
        </Link>
        <Link
          href="/cart"
          className="shrink-0 bg-navy hover:bg-charcoal text-white text-[11px] font-bold tracking-wider uppercase px-5 py-2.5 rounded-xl transition-colors"
        >
          Add to Cart
        </Link>
      </div>
    </div>
  );
}
