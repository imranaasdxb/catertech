"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import Container from "@/components/Container";
import { useCart, type CartItem } from "@/lib/cart-context";
import {
  buildQuoteWhatsAppMessage,
  buildWhatsAppUrl,
  openWhatsAppChat,
} from "@/lib/whatsapp-quote";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Minus,
  PackageCheck,
  Phone,
  Plus,
  Send,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Trash2,
  User,
  X,
} from "lucide-react";

type QuoteModalVariant = "email" | "whatsapp";

type QuoteFormFields = {
  name: string;
  email: string;
  phone: string;
  address: string;
  message: string;
};

type ActiveQuoteModal = null | QuoteModalVariant;

const VAT_RATE = 0.05;

const purpleRadial =
  "radial-gradient(circle, rgba(180, 120, 220, 0.40) 0%, rgba(240, 225, 255, 0.18) 45%, transparent 70%)";

const inputClass =
  "w-full rounded-xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-[#9ca3af] hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20";

type CartLinePrice = {
  itemId: string;
  unitPrice: number | null;
  subtotal: number | null;
};

function parseAedPrice(value: string) {
  const cleaned = value
    .replace(/\bAED\b/gi, "")
    .replace(/\bper\s+day\b/gi, "")
    .replace(/\/\s*day\b/gi, "")
    .trim();
  const token = cleaned.match(/\d[\d,.]*/)?.[0];
  if (!token) return null;

  let normalized = token;
  if (token.includes(",") && token.includes(".")) {
    normalized = token.replace(/,/g, "");
  } else if (token.includes(",") && !token.includes(".")) {
    const parts = token.split(",");
    normalized =
      parts.length === 2 && parts[1].length === 2
        ? parts.join(".")
        : token.replace(/,/g, "");
  }

  const amount = Number(normalized);
  return Number.isFinite(amount) ? amount : null;
}

function formatAedAmount(value: number) {
  return `AED ${value.toLocaleString("en-AE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function fieldIconClass(hasError: boolean) {
  return hasError ? "text-accent" : "text-body-muted";
}

function QuoteModal({
  variant,
  onClose,
  items,
  onSuccess,
}: {
  variant: QuoteModalVariant;
  onClose: () => void;
  items: CartItem[];
  onSuccess: () => void;
}) {
  const [form, setForm] = useState<QuoteFormFields>({
    name: "",
    email: "",
    phone: "",
    address: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<QuoteFormFields>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const isWhatsApp = variant === "whatsapp";
  const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);
  const itemLines = items.map((item) => `${item.name} x ${item.quantity}`).join("\n");

  const validate = () => {
    const nextErrors: Partial<QuoteFormFields> = {};
    if (!form.name.trim()) nextErrors.name = "Name is required";
    if (!form.email.trim()) nextErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Enter a valid email";
    }
    if (!form.phone.trim()) nextErrors.phone = "Phone is required";
    if (!form.address.trim()) nextErrors.address = "Address is required";
    return nextErrors;
  };

  const postQuote = async () => {
    return fetch("/api/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        message: form.message || undefined,
        source: variant,
        items: items.map((item) => ({
          name: item.name,
          category: item.category,
          qty: item.quantity,
          price: item.price || undefined,
        })),
      }),
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setSending(true);

    const trimmedForm = {
      customerName: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      message: form.message,
    };
    const quoteItems = items.map((item) => ({
      name: item.name,
      category: item.category,
      qty: item.quantity,
      price: item.price || undefined,
    }));

    const waText = isWhatsApp
      ? buildQuoteWhatsAppMessage({ ...trimmedForm, items: quoteItems })
      : null;
    const waUrl = waText ? buildWhatsAppUrl(waText) : null;

    if (isWhatsApp && waUrl) {
      openWhatsAppChat(waUrl);

      try {
        const res = await postQuote();
        if (!res.ok) {
          setErrors({
            email: "WhatsApp opened, but we could not save your request. Please try again or contact us directly.",
          });
          setSending(false);
          return;
        }

        setSending(false);
        setSent(true);
        setTimeout(onSuccess, 4000);
      } catch {
        setErrors({
          email: "WhatsApp opened, but we could not save your request. Please try again or contact us directly.",
        });
        setSending(false);
      }
      return;
    }

    try {
      const res = await postQuote();
      if (!res.ok) {
        setErrors({ email: "Could not submit. Please try again." });
        setSending(false);
        return;
      }

      setSending(false);
      setSent(true);
      setTimeout(onSuccess, 2800);
    } catch {
      setErrors({ email: "Network error. Please try again." });
      setSending(false);
    }
  };

  const renderField = (
    field: keyof QuoteFormFields,
    label: string,
    Icon: typeof User,
    type: string,
    placeholder: string,
  ) => (
    <div>
      <label className="mb-1.5 block text-sm text-body-muted">
        {label} <span className="text-accent">*</span>
      </label>
      <div className="relative">
        <Icon
          className={`pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 ${fieldIconClass(Boolean(errors[field]))}`}
          strokeWidth={1.8}
        />
        <input
          type={type}
          value={form[field]}
          onChange={(event) => {
            setForm((current) => ({ ...current, [field]: event.target.value }));
            setErrors((current) => ({ ...current, [field]: undefined }));
          }}
          placeholder={placeholder}
          className={`${inputClass} pl-10 ${errors[field] ? "border-accent bg-accent-soft/30" : ""}`}
        />
      </div>
      {errors[field] ? <p className="mt-1 text-xs text-accent">{errors[field]}</p> : null}
    </div>
  );

  const itemsSummary = (
    <div className="rounded-2xl border border-[#e5e7eb] bg-white/85 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Items in request</p>
        <span className="rounded-full bg-surface-card px-3 py-1 text-xs font-bold text-ink">
          {totalQty} unit{totalQty !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="mt-3 max-h-32 space-y-2 overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-3 text-sm">
            <span className="line-clamp-1 font-semibold text-ink">{item.name}</span>
            <span className="shrink-0 text-body-muted">x {item.quantity}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5"
      style={{ paddingTop: "max(0.75rem, var(--header-height))" }}
      role="dialog"
      aria-modal
    >
      <button className="absolute inset-0 bg-ink/55 backdrop-blur-sm" onClick={onClose} aria-label="Close quote dialog" />

      <div className="relative grid max-h-[min(88vh,calc(100dvh-var(--header-height)-1.5rem))] w-full max-w-5xl overflow-hidden rounded-3xl border border-white/70 bg-white shadow-[0_28px_90px_rgba(20,19,31,0.24)] md:grid-cols-[0.9fr_1.1fr]">
        <div className="relative hidden overflow-hidden bg-surface-card p-6 md:block">
          <div
            className="pointer-events-none absolute -left-24 -top-24 h-[340px] w-[340px] rounded-full"
            style={{ background: purpleRadial }}
            aria-hidden
          />
          <div className="relative z-10 flex h-full flex-col">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
              {isWhatsApp ? <MessageCircle className="h-5 w-5" /> : <ClipboardList className="h-5 w-5" />}
            </div>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-ink">
              {isWhatsApp ? "Send quote via WhatsApp" : "Request your formal quote"}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-body-muted">
              We will save your basket details, notify our team, and prepare a
              quotation based on the items, quantities, delivery address, and notes.
            </p>
            <div className="mt-5">{itemsSummary}</div>
          </div>
        </div>

        <div className="flex min-h-0 flex-col">
          <div className="flex shrink-0 items-start justify-between border-b border-[#e5e7eb] px-5 py-4 sm:px-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Quote Request</p>
              <h2 className="mt-1 text-xl font-bold tracking-tight text-ink">
                {isWhatsApp ? "WhatsApp details" : "Contact details"}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-body-muted transition-colors hover:bg-surface-card hover:text-ink"
              aria-label="Close"
            >
              <X className="h-5 w-5" strokeWidth={2} />
            </button>
          </div>

          <div className="min-h-0 overflow-y-auto px-5 py-4 sm:px-6 sm:py-5">
            {sent ? (
              <div className="py-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-green-100 bg-green-50 text-green-700">
                  <CheckCircle2 className="h-7 w-7" strokeWidth={2} />
                </div>
                <h3 className="mt-4 text-xl font-bold tracking-tight text-ink">
                  {isWhatsApp ? "WhatsApp opened" : "Quote request sent"}
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-body-muted">
                  {isWhatsApp
                    ? `Your request for ${items.length} item${items.length !== 1 ? "s" : ""} is saved and our team has been notified by email. Send the message in WhatsApp to complete your quote.`
                    : `Your request for ${items.length} item${items.length !== 1 ? "s" : ""} is saved. Our team will respond within 10 minutes.`}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div className="md:hidden">{itemsSummary}</div>

                <input type="hidden" name="items" value={itemLines} readOnly />

                {renderField("name", "Full Name", User, "text", "Your full name")}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {renderField("email", "Email Address", Mail, "email", "you@company.com")}
                  {renderField("phone", "Phone Number", Phone, "tel", "+971 5X XXX XXXX")}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm text-body-muted">
                    Delivery Address <span className="text-accent">*</span>
                  </label>
                  <div className="relative">
                    <MapPin
                      className={`pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 ${fieldIconClass(Boolean(errors.address))}`}
                      strokeWidth={1.8}
                    />
                    <textarea
                      rows={2}
                      value={form.address}
                      onChange={(event) => {
                        setForm((current) => ({ ...current, address: event.target.value }));
                        setErrors((current) => ({ ...current, address: undefined }));
                      }}
                      placeholder="Area, building, delivery address..."
                      className={`${inputClass} resize-none pl-10 ${errors.address ? "border-accent bg-accent-soft/30" : ""}`}
                    />
                  </div>
                  {errors.address ? <p className="mt-1 text-xs text-accent">{errors.address}</p> : null}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm text-body-muted">Additional Requirements</label>
                  <textarea
                    rows={2}
                    value={form.message}
                    onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
                    placeholder="Event date, venue, timing, or special requirements..."
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className={`inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                    isWhatsApp ? "bg-[#25D366] hover:bg-[#1ebe5d]" : "bg-primary hover:bg-primary-dark"
                  }`}
                >
                  {sending ? (
                    isWhatsApp ? "Saving your request..." : "Sending request..."
                  ) : isWhatsApp ? (
                    <>
                      <MessageCircle className="h-4 w-4" strokeWidth={2} />
                      Save and open WhatsApp
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" strokeWidth={2} />
                      Send Quote Request
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-body-muted">
                  Free quote. No obligation. Response within 10 minutes.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyBasket() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#e5e7eb] bg-white p-8 text-center shadow-[0_18px_60px_rgba(20,19,31,0.06)] md:p-12">
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-[320px] w-[320px] rounded-full opacity-80"
        style={{ background: purpleRadial }}
        aria-hidden
      />
      <div className="relative z-10 mx-auto max-w-xl">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-surface-card text-primary">
          <ShoppingBag className="h-9 w-9" strokeWidth={1.7} />
        </div>
        <h2 className="mt-6 text-3xl font-bold tracking-tight text-ink">Your quote basket is empty</h2>
        <p className="mt-3 text-sm leading-relaxed text-body-muted">
          Add products from the catalogue or services from the services page. Your
          selections will appear here as a clean quote-ready list.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/shop"
            className="btn-brand min-h-11 rounded-xl px-6 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.14em]"
          >
            <span className="btn-brand__content gap-2">
              Browse Products
              <span className="btn-brand__arrow h-8 w-8" aria-hidden>
                <ArrowRight className="size-4" strokeWidth={2} />
              </span>
            </span>
          </Link>
          <Link
            href="/services"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#e5e7eb] bg-white px-6 py-2.5 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:border-primary hover:text-primary"
          >
            View Services
          </Link>
        </div>
      </div>
    </div>
  );
}

function CartItemCard({
  item,
  index,
  linePrice,
  removeItem,
  updateQty,
}: {
  item: CartItem;
  index: number;
  linePrice: CartLinePrice;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
}) {
  return (
    <article className="group w-full overflow-hidden rounded-3xl border border-[#e5e7eb] bg-white shadow-[0_14px_45px_rgba(20,19,31,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_20px_55px_rgba(20,19,31,0.09)]">
      <div className="flex gap-4 p-5 sm:gap-6 sm:p-6">
        <div className="flex shrink-0 items-center gap-3 sm:gap-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-soft text-xs font-bold tabular-nums text-primary">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="relative h-24 w-24 overflow-hidden rounded-2xl border border-[#e5e7eb] bg-[#FEFEFE] sm:h-28 sm:w-28">
            {item.image ? (
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-contain object-center p-2"
                sizes="(max-width: 640px) 96px, 112px"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-primary">
                <PackageCheck className="h-8 w-8" strokeWidth={1.6} />
              </div>
            )}
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-primary-soft px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
                  {item.category}
                </span>
                <span className="rounded-full bg-accent-soft px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-accent">
                  {item.type}
                </span>
              </div>
              <h3 className="mt-2.5 text-lg font-bold leading-snug tracking-tight text-ink sm:text-xl">
                {item.name}
              </h3>
              <div className="mt-3 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-body-muted">Price</p>
                  <p className="mt-1 text-sm font-semibold tabular-nums text-ink">
                    {linePrice.unitPrice !== null ? formatAedAmount(linePrice.unitPrice) : item.price || "Quote"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-body-muted">Quantity</p>
                  <p className="mt-1 text-sm font-semibold tabular-nums text-ink">x {item.quantity}</p>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-body-muted">Subtotal</p>
                  <p className="mt-1 text-sm font-bold tabular-nums text-primary">
                    {linePrice.subtotal !== null ? formatAedAmount(linePrice.subtotal) : "Quote"}
                  </p>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeItem(item.id)}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-body-muted transition-colors hover:bg-accent-soft hover:text-accent"
              aria-label={`Remove ${item.name}`}
            >
              <Trash2 className="h-4 w-4" strokeWidth={1.9} />
            </button>
          </div>

          <div className="mt-auto flex flex-col gap-3 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="inline-flex w-fit items-center overflow-hidden rounded-full border border-[#e5e7eb] bg-surface-card">
              <button
                type="button"
                onClick={() => updateQty(item.id, item.quantity - 1)}
                className="flex h-10 w-10 items-center justify-center text-body-muted transition-colors hover:bg-white hover:text-ink"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" strokeWidth={2} />
              </button>
              <span className="w-10 text-center text-sm font-bold tabular-nums text-ink">{item.quantity}</span>
              <button
                type="button"
                onClick={() => updateQty(item.id, item.quantity + 1)}
                className="flex h-10 w-10 items-center justify-center text-body-muted transition-colors hover:bg-white hover:text-ink"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-body-muted">
                Line total
              </p>
              <p className="mt-1 text-base font-bold tabular-nums text-ink">
                {linePrice.subtotal !== null ? formatAedAmount(linePrice.subtotal) : "Quote"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function CartClient() {
  const { items, removeItem, updateQty, clearCart } = useCart();
  const [activeQuoteModal, setActiveQuoteModal] = useState<ActiveQuoteModal>(null);

  const totalQty = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const categories = useMemo(() => new Set(items.map((item) => item.category)).size, [items]);
  const pricing = useMemo(() => {
    const lines = items.map<CartLinePrice>((item) => {
      const unitPrice = parseAedPrice(item.price);
      return {
        itemId: item.id,
        unitPrice,
        subtotal: unitPrice !== null ? unitPrice * item.quantity : null,
      };
    });
    const subtotal = lines.reduce((sum, line) => sum + (line.subtotal ?? 0), 0);
    const vat = subtotal * VAT_RATE;
    return {
      lines,
      subtotal,
      vat,
      total: subtotal + vat,
      hasUnpricedItems: lines.some((line) => line.subtotal === null),
    };
  }, [items]);

  const handleQuoteSuccess = () => {
    clearCart();
    setActiveQuoteModal(null);
  };

  return (
    <main className="relative isolate min-h-screen bg-white pt-32 pb-20 md:pt-40 md:pb-28">
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full opacity-70 md:h-[540px] md:w-[540px]"
        style={{ background: purpleRadial }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-28 top-[38rem] h-[360px] w-[360px] rounded-full opacity-60"
        style={{ background: purpleRadial }}
        aria-hidden
      />

      <Container className="relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="min-w-0 text-[clamp(1.75rem,4vw,3rem)] font-bold leading-tight tracking-[-0.03em] text-ink">
            <span className="font-sans">Quote basket </span>
            <span
              className="font-normal italic"
              style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}
            >
              built for clarity
            </span>
          </h1>

          {items.length > 0 ? (
            <button
              type="button"
              onClick={clearCart}
              className="inline-flex shrink-0 min-h-11 items-center justify-center rounded-xl border border-[#e5e7eb] bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-body-muted transition-colors hover:border-accent hover:text-accent"
            >
              Clear basket
            </button>
          ) : null}
        </div>

        {items.length === 0 ? (
          <div className="mt-14">
            <EmptyBasket />
          </div>
        ) : (
          <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start">
            <div className="min-w-0 space-y-5">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  { label: "Items", value: items.length, icon: ShoppingBag },
                  { label: "Total units", value: totalQty, icon: PackageCheck },
                  { label: "Categories", value: categories, icon: Sparkles },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-2xl font-bold tracking-tight text-ink">{value}</p>
                        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-body-muted">
                          {label}
                        </p>
                      </div>
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                        <Icon className="h-5 w-5" strokeWidth={1.8} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                {items.map((item, index) => (
                  <CartItemCard
                    key={item.id}
                    item={item}
                    index={index}
                    linePrice={pricing.lines.find((line) => line.itemId === item.id) ?? {
                      itemId: item.id,
                      unitPrice: null,
                      subtotal: null,
                    }}
                    removeItem={removeItem}
                    updateQty={updateQty}
                  />
                ))}
              </div>

              <div className="flex flex-wrap gap-3 border-t border-[#e5e7eb] pt-5">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-body-muted transition-colors hover:text-primary"
                >
                  <ArrowLeft className="h-4 w-4" strokeWidth={2} />
                  Continue shopping
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-body-muted transition-colors hover:text-primary"
                >
                  <ArrowLeft className="h-4 w-4" strokeWidth={2} />
                  Browse services
                </Link>
              </div>
            </div>

            <aside className="w-full lg:sticky lg:top-[calc(var(--header-height)+1.25rem)] lg:z-20 lg:self-start">
              <div className="overflow-hidden rounded-3xl border border-[#e5e7eb] bg-white shadow-[0_18px_60px_rgba(20,19,31,0.08)]">
                <div className="relative overflow-hidden p-6">
                  <div
                    className="pointer-events-none absolute -right-24 -top-24 h-[260px] w-[260px] rounded-full opacity-90"
                    style={{ background: purpleRadial }}
                    aria-hidden
                  />
                  <div className="relative z-10">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Quote command center</p>
                    <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink">Ready to request?</h2>
                    <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-primary">
                      Lines in this basket
                    </p>
                    <div
                      className={`mt-3 space-y-3 ${
                        items.length > 4
                          ? "max-h-36 overflow-y-auto overscroll-contain pr-1 [scrollbar-width:thin] [scrollbar-color:rgba(50,43,129,0.35)_transparent]"
                          : ""
                      }`}
                    >
                      {items.map((item, index) => {
                        const linePrice = pricing.lines.find((line) => line.itemId === item.id);
                        return (
                          <div key={item.id} className="text-sm">
                            <div className="flex items-center gap-2">
                              <span className="shrink-0 font-bold tabular-nums text-primary">
                                {index + 1}.
                              </span>
                              <span className="line-clamp-1 min-w-0 font-medium text-ink">
                                {item.name}
                              </span>
                              <span className="h-px min-w-4 flex-1 border-t border-dashed border-body-muted/35" />
                              <span className="shrink-0 tabular-nums text-body-muted">
                                x {item.quantity}
                              </span>
                            </div>
                            <p className="mt-1 text-right font-semibold tabular-nums text-ink">
                              {linePrice?.subtotal !== null && linePrice?.subtotal !== undefined
                                ? formatAedAmount(linePrice.subtotal)
                                : "Quote"}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#e5e7eb] p-6">
              

                  

                  <div className="space-y-4 rounded-2xl border border-[#e5e7eb] bg-white p-4">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm font-bold text-body-muted">Subtotal</p>
                      <p className="text-sm font-bold tabular-nums text-ink">
                        {formatAedAmount(pricing.subtotal)}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-sm font-bold text-body-muted">Shipment</p>
                        <p className="text-sm font-bold text-body-muted">TBC</p>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-body-muted">
                        Setup/Delivery fees may apply. Our team will contact you shortly.
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm font-bold text-body-muted">VAT 5%</p>
                      <p className="text-sm font-bold tabular-nums text-ink">
                        {formatAedAmount(pricing.vat)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-4 border-t border-[#e5e7eb] pt-4">
                      <p className="text-base font-bold text-ink">Total</p>
                      <p className="text-base font-bold tabular-nums text-primary">
                        {formatAedAmount(pricing.total)}
                      </p>
                    </div>
                    {pricing.hasUnpricedItems ? (
                      <p className="text-xs leading-relaxed text-body-muted">
                        Items marked Quote are not included in this automatic total.
                      </p>
                    ) : null}
                  </div>
                  <div className="my-6 h-px bg-[#e5e7eb]" />

                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => setActiveQuoteModal("email")}
                      className="btn-brand min-h-12 w-full rounded-xl px-6 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.14em]"
                    >
                      <span className="btn-brand__content gap-2">
                        Request a Quote
                        <span className="btn-brand__arrow h-8 w-8" aria-hidden>
                          <ArrowRight className="size-4" strokeWidth={2} />
                        </span>
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveQuoteModal("whatsapp")}
                      className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1ebe5d]"
                    >
                      <MessageCircle className="h-4 w-4" strokeWidth={2} />
                      Ask on WhatsApp
                    </button>
                  </div>

                  <div className="mt-6 space-y-3 rounded-2xl bg-surface-card p-4">
                    {[
                      { icon: Clock3, text: "Response within 10 minutes" },
                      { icon: ShieldCheck, text: "Free quote with no obligation" },
                      { icon: PackageCheck, text: "UAE delivery and coordination available" },
                    ].map(({ icon: Icon, text }) => (
                      <div key={text} className="flex items-center gap-3 text-xs text-body-muted">
                        <Icon className="h-4 w-4 shrink-0 text-primary" strokeWidth={1.8} />
                        <span>{text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </Container>

      {activeQuoteModal ? (
        <QuoteModal
          variant={activeQuoteModal}
          items={items}
          onClose={() => setActiveQuoteModal(null)}
          onSuccess={handleQuoteSuccess}
        />
      ) : null}
    </main>
  );
}
