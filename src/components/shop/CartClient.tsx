"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";

/* ─── Quote Request Modal ──────────────────────────────────────────── */
type ModalState = "idle" | "open" | "sending" | "success";

function QuoteModal({
  onClose,
  items,
  onSuccess,
}: {
  onClose: () => void;
  items: ReturnType<typeof useCart>["items"];
  onSuccess: () => void;
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const validate = () => {
    const e: Partial<typeof form> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setSending(true);

    /* Simulate email send — replace with real API call when ready */
    console.log("📧 Quote Request:", {
      ...form,
      items: items.map((i) => ({
        name: i.name,
        category: i.category,
        price: i.price,
        qty: i.quantity,
      })),
    });

    await new Promise((res) => setTimeout(res, 1800));
    setSending(false);
    setSent(true);
    setTimeout(onSuccess, 2800);
  };

  const itemLines = items
    .map((i) => `${i.name} × ${i.quantity} (${i.price})`)
    .join("\n");

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal card */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-start justify-between px-7 pt-7 pb-5 border-b border-border">
          <div>
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-sand mb-1">
              Quote Request
            </p>
            <h2 className="font-serif text-2xl text-navy">Request a Quote</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-muted hover:text-charcoal hover:bg-offwhite transition-colors"
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="px-7 py-6 overflow-y-auto max-h-[70vh]">
          {sent ? (
            /* ── Success State ── */
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-5">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 className="font-serif text-2xl text-navy mb-2">Quote Request Sent!</h3>
              <p className="text-[14px] text-muted leading-relaxed">
                We&apos;ve received your enquiry for{" "}
                <strong className="text-charcoal">{items.length} item{items.length !== 1 ? "s" : ""}</strong>.
                <br />
                Our team will reply to{" "}
                <strong className="text-charcoal">{form.email}</strong> within 4 business hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Items summary */}
              <div className="bg-offwhite rounded-xl border border-border p-4">
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-sand mb-3">
                  Items in This Quote ({items.length})
                </p>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-charcoal font-medium truncate mr-3">
                        {item.name}
                        {item.quantity > 1 && (
                          <span className="text-muted font-normal ml-1">× {item.quantity}</span>
                        )}
                      </span>
                      <span className="text-muted shrink-0 text-xs">{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hidden items textarea (populated for reference) */}
              <input type="hidden" name="items" value={itemLines} readOnly />

              {/* Name */}
              <div>
                <label className="block text-[11px] font-bold tracking-[0.15em] uppercase text-charcoal mb-1.5">
                  Full Name <span className="text-sand">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, name: e.target.value }));
                    setErrors((er) => ({ ...er, name: undefined }));
                  }}
                  placeholder="Your full name"
                  className={`w-full border rounded-xl px-4 py-3 text-sm text-charcoal placeholder:text-muted/50 outline-none transition-colors focus:border-sand ${
                    errors.name ? "border-red-300 bg-red-50" : "border-border bg-white"
                  }`}
                />
                {errors.name && (
                  <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-[11px] font-bold tracking-[0.15em] uppercase text-charcoal mb-1.5">
                  Email Address <span className="text-sand">*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, email: e.target.value }));
                    setErrors((er) => ({ ...er, email: undefined }));
                  }}
                  placeholder="you@company.com"
                  className={`w-full border rounded-xl px-4 py-3 text-sm text-charcoal placeholder:text-muted/50 outline-none transition-colors focus:border-sand ${
                    errors.email
                      ? "border-red-300 bg-red-50"
                      : "border-border bg-white"
                  }`}
                />
                {errors.email && (
                  <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[11px] font-bold tracking-[0.15em] uppercase text-charcoal mb-1.5">
                  Phone Number{" "}
                  <span className="text-muted font-normal normal-case tracking-normal">
                    (optional)
                  </span>
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, phone: e.target.value }))
                  }
                  placeholder="+971 5X XXX XXXX"
                  className="w-full border border-border bg-white rounded-xl px-4 py-3 text-sm text-charcoal placeholder:text-muted/50 outline-none focus:border-sand transition-colors"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-[11px] font-bold tracking-[0.15em] uppercase text-charcoal mb-1.5">
                  Additional Requirements
                </label>
                <textarea
                  rows={3}
                  value={form.message}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, message: e.target.value }))
                  }
                  placeholder="Event date, venue, special requirements..."
                  className="w-full border border-border bg-white rounded-xl px-4 py-3 text-sm text-charcoal placeholder:text-muted/50 outline-none focus:border-sand transition-colors resize-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={sending}
                className="w-full inline-flex items-center justify-center gap-2 bg-navy hover:bg-charcoal disabled:opacity-60 text-white text-sm font-semibold tracking-wide rounded-xl py-4 transition-colors"
              >
                {sending ? (
                  <>
                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity="0.25" />
                      <path d="M21 12a9 9 0 00-9-9" />
                    </svg>
                    Sending your quote request…
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                    Send Quote Request
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-muted">
                We respond to every enquiry within 4 business hours.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Cart Client ──────────────────────────────────────────────────── */
export default function CartClient() {
  const { items, removeItem, updateQty, clearCart } = useCart();
  const [modalState, setModalState] = useState<ModalState>("idle");

  const handleQuoteSuccess = () => {
    clearCart();
    setModalState("idle");
  };

  return (
    <div className="min-h-screen bg-offwhite font-sans">
      {/* Hero */}
      <section className="bg-navy pt-36 pb-14">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-sand block mb-3">
            Your Selections
          </span>
          <h1 className="font-serif text-4xl md:text-5xl text-white tracking-tight">
            Quote Basket
          </h1>
          {items.length > 0 && (
            <p className="text-white/50 text-sm mt-2">
              {items.length} item{items.length !== 1 ? "s" : ""} — review and request a quote
            </p>
          )}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 md:px-8 py-14">
        {items.length === 0 ? (
          /* ── Empty State ── */
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-border">
            <svg
              className="text-border mb-6"
              width="56"
              height="56"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            <h2 className="font-serif text-2xl text-charcoal mb-2">
              Your basket is empty
            </h2>
            <p className="text-muted text-sm mb-8 text-center max-w-xs leading-relaxed">
              Add products from our shop or services from our services page to build your quote.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-navy hover:bg-charcoal text-white text-xs font-bold tracking-widest uppercase px-7 py-3.5 rounded-xl transition-colors"
              >
                Browse Products
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 border border-sand text-sand hover:bg-sand hover:text-white text-xs font-bold tracking-widest uppercase px-7 py-3.5 rounded-xl transition-colors"
              >
                View Services
              </Link>
            </div>
          </div>
        ) : (
          /* ── Items Grid ── */
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
            {/* Items list */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold text-charcoal text-sm tracking-wide">
                  {items.length} Item{items.length !== 1 ? "s" : ""} in Your Quote
                </h2>
                <button
                  onClick={clearCart}
                  className="text-[11px] text-muted hover:text-red-500 transition-colors"
                >
                  Clear All
                </button>
              </div>

              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-border p-4 sm:p-5 flex gap-4"
                >
                  {/* Image */}
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 bg-cream">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C4A265" strokeWidth="1">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-sand mb-0.5">
                          {item.category}
                        </p>
                        <h3 className="font-medium text-charcoal text-sm leading-snug truncate">
                          {item.name}
                        </h3>
                        <p className="text-sm font-bold text-navy mt-1 tabular-nums">
                          {item.price}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-muted hover:text-red-500 hover:bg-red-50 transition-colors"
                        aria-label={`Remove ${item.name}`}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>

                    {/* Qty stepper */}
                    <div className="flex items-center gap-0 mt-3 border border-border rounded-lg overflow-hidden w-fit bg-offwhite">
                      <button
                        onClick={() => updateQty(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-muted hover:text-charcoal hover:bg-cream transition-colors"
                        aria-label="Decrease"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M5 12h14" />
                        </svg>
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-charcoal tabular-nums select-none">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-muted hover:text-charcoal hover:bg-cream transition-colors"
                        aria-label="Increase"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Continue shopping */}
              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-sand transition-colors"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                  Continue Shopping
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-sand transition-colors"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                  Browse Services
                </Link>
              </div>
            </div>

            {/* Summary Panel */}
            <div className="lg:sticky lg:top-28">
              <div className="bg-white rounded-2xl border border-border p-6 shadow-[0_4px_24px_rgba(26,31,46,0.06)]">
                <h3 className="font-serif text-xl text-navy mb-5">Quote Summary</h3>

                <div className="space-y-3 mb-5">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <span className="text-muted truncate mr-3">
                        {item.name}
                        {item.quantity > 1 && (
                          <span className="ml-1 text-xs">× {item.quantity}</span>
                        )}
                      </span>
                      <span className="text-charcoal font-medium shrink-0 text-xs">
                        {item.price}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-charcoal">
                      Total
                    </span>
                    <span className="text-sm text-muted italic">
                      Price on quote
                    </span>
                  </div>
                  <p className="text-[11px] text-muted mt-1.5 leading-snug">
                    Prices confirmed in your personalised quote — typically sent within 4 hours.
                  </p>
                </div>

                <button
                  onClick={() => setModalState("open")}
                  className="w-full inline-flex items-center justify-center gap-2 bg-navy hover:bg-charcoal text-white text-sm font-semibold tracking-wide rounded-xl py-4 transition-colors mb-3"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                  Request a Quote
                </button>

                <Link
                  href="/trade/rfq"
                  className="w-full inline-flex items-center justify-center gap-2 border border-border text-muted hover:border-sand hover:text-sand text-xs font-medium rounded-xl py-3 transition-colors"
                >
                  Trade / Bulk Enquiry
                </Link>

                {/* Trust */}
                <div className="mt-5 pt-5 border-t border-border space-y-2.5">
                  {[
                    "Response within 4 business hours",
                    "No obligation — quotes are free",
                    "UAE delivery available",
                  ].map((t) => (
                    <div key={t} className="flex items-center gap-2 text-[11px] text-muted">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C4A265" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Quote Modal */}
      {modalState === "open" && (
        <QuoteModal
          items={items}
          onClose={() => setModalState("idle")}
          onSuccess={handleQuoteSuccess}
        />
      )}
    </div>
  );
}
