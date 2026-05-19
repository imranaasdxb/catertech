"use client";

import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { SERVICES_LIST } from "@/lib/services";

const STATS = [
  { value: "20+", label: "Years in UAE" },
  { value: "500+", label: "Happy Clients" },
  { value: "1,000+", label: "Events Delivered" },
  { value: "4 hrs", label: "Quote Response" },
];

const PROCESS = [
  {
    step: "01",
    title: "Enquire",
    desc: "Add items to your quote basket or call us with your requirements.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    ),
  },
  {
    step: "02",
    title: "Receive Quote",
    desc: "We send you a detailed quote within 4 business hours.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    step: "03",
    title: "Confirm",
    desc: "Approve the quote and confirm delivery date and address.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
  },
  {
    step: "04",
    title: "Delivered",
    desc: "We deliver, set up if required, and collect after your event.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="1" y="3" width="15" height="13" rx="1" />
        <path d="M16 8h4l3 5v3h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
];

export default function ServicesPage() {
  const { addItem } = useCart();
  const [addedIds, setAddedIds] = useState<string[]>([]);

  const handleAddToQuote = (cartId: string, title: string, image: string) => {
    addItem({
      id: cartId,
      name: title,
      category: "Services",
      price: "Quote Required",
      image,
      type: "service",
    });
    setAddedIds((prev) => [...prev, cartId]);
    setTimeout(
      () => setAddedIds((prev) => prev.filter((id) => id !== cartId)),
      2500
    );
  };

  return (
    <div className="min-h-screen bg-offwhite font-sans">
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative min-h-[520px] flex items-end pb-20 pt-40 overflow-hidden bg-navy">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1600&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-navy/80 via-navy/60 to-navy" />

        <Container className="relative w-full">
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-sand block mb-3">
            Our Services
          </span>
          <div className="w-10 h-0.5 bg-sand mb-6" />
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-white leading-[1.08] tracking-[-0.02em] max-w-3xl mb-6">
            Complete Equipment Solutions for UAE Events &amp; Hospitality
          </h1>
          <p className="text-white/55 text-base max-w-xl leading-relaxed mb-10">
            From a single chafing dish to full event production — Catertech has supplied hotels,
            venues and event companies across the UAE since 2005.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-sand hover:bg-sand-dark text-white text-xs font-bold tracking-widest uppercase px-7 py-3.5 transition-colors"
            >
              Browse Shop
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/cart"
              className="inline-flex items-center gap-2 border border-white/30 text-white hover:border-sand hover:text-sand text-xs font-bold tracking-widest uppercase px-7 py-3.5 transition-colors"
            >
              View My Quote Basket
            </Link>
          </div>
        </Container>
      </section>

      {/* ── Stats Bar ─────────────────────────────────────────────── */}
      <div className="bg-sand">
        <Container className="py-5 grid grid-cols-2 md:grid-cols-4 gap-5">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-serif text-2xl font-bold text-white">{s.value}</p>
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/70 mt-0.5">
                {s.label}
              </p>
            </div>
          ))}
        </Container>
      </div>

      {/* ── Services Grid ─────────────────────────────────────────── */}
      <section className="py-24">
        <Container>
          <div className="text-center mb-14">
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-sand block mb-3">
              What We Offer
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-navy tracking-tight">
              Four Ways We Can Help You
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {SERVICES_LIST.map((service, i) => {
              const added = addedIds.includes(service.cartId);
              return (
                <div
                  key={service.slug}
                  className="group bg-white rounded-2xl border border-border overflow-hidden hover:border-sand/40 hover:shadow-[0_8px_40px_rgba(196,162,101,0.12)] transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative h-56 sm:h-64 overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-navy/70 via-navy/20 to-transparent" />
                    <span className="absolute top-4 left-4 text-[10px] font-bold tracking-[0.25em] uppercase text-white/60 bg-navy/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      0{i + 1}
                    </span>
                    <div className="absolute bottom-4 left-4">
                      <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-sand/90 mb-1">
                        {service.tagline}
                      </p>
                      <h2 className="font-serif text-2xl text-white">
                        {service.title}
                      </h2>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 md:p-8">
                    <p className="text-[14px] leading-relaxed text-muted mb-5">
                      {service.description}
                    </p>

                    {/* Includes pills */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {service.includes.map((item) => (
                        <span
                          key={item}
                          className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted bg-offwhite border border-border rounded-full px-3 py-1"
                        >
                          <span className="w-1 h-1 rounded-full bg-sand shrink-0" />
                          {item}
                        </span>
                      ))}
                    </div>

                    {/* CTAs */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          handleAddToQuote(
                            service.cartId,
                            service.title,
                            service.image
                          )
                        }
                        className={`flex-1 inline-flex items-center justify-center gap-2 text-sm font-semibold tracking-wide rounded-xl py-3 transition-all duration-200 ${
                          added
                            ? "bg-green-50 border border-green-200 text-green-700"
                            : "bg-navy hover:bg-charcoal text-white"
                        }`}
                      >
                        {added ? (
                          <>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Added to Quote
                          </>
                        ) : (
                          <>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                              <line x1="3" y1="6" x2="21" y2="6" />
                              <path d="M16 10a4 4 0 01-8 0" />
                            </svg>
                            Add to Quote
                          </>
                        )}
                      </button>
                      <Link
                        href={`/services/${service.slug}`}
                        className="px-5 py-3 border border-border text-sm font-medium text-muted hover:border-sand hover:text-sand rounded-xl transition-colors shrink-0"
                      >
                        Details →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ── How We Work ───────────────────────────────────────────── */}
      <section className="bg-navy py-24">
        <Container>
          <div className="text-center mb-14">
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-sand block mb-3">
              The Process
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-white tracking-tight">
              Simple from Start to Finish
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {PROCESS.map((p, i) => (
              <div key={p.step} className="relative">
                {i < PROCESS.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-[calc(100%-8px)] w-full h-px bg-white/10 z-0" />
                )}
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-12 h-12 rounded-full border border-sand/30 flex items-center justify-center text-sand shrink-0">
                      {p.icon}
                    </div>
                    <span className="font-serif text-3xl font-bold text-sand/20">
                      {p.step}
                    </span>
                  </div>
                  <h4 className="text-white font-semibold mb-2 tracking-wide">
                    {p.title}
                  </h4>
                  <p className="text-white/40 text-sm leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section className="py-20 bg-offwhite border-t border-border">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-sand block mb-3">
            Ready to Start?
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-navy mb-5 tracking-tight">
            Let&apos;s Discuss Your Requirements
          </h2>
          <p className="text-muted text-sm leading-relaxed mb-10">
            Add services and products to your quote basket, or contact our team directly. We
            respond to every enquiry within 4 business hours.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/trade/rfq"
              className="inline-flex items-center gap-2 bg-sand hover:bg-sand-dark text-white text-xs font-bold tracking-widest uppercase px-8 py-4 transition-colors rounded-full"
            >
              Request a Quote
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 border border-border text-charcoal hover:border-sand hover:text-sand text-xs font-bold tracking-widest uppercase px-8 py-4 transition-colors rounded-full"
            >
              Contact Us
            </Link>
          </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
