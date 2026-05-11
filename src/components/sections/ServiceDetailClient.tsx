"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import type { ServiceData } from "@/lib/services";

export default function ServiceDetailClient({ service }: { service: ServiceData }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({
      id: service.cartId,
      name: service.title,
      category: "Services",
      price: "Quote Required",
      image: service.image,
      type: "service",
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="min-h-screen bg-offwhite font-sans">
      {/* Hero */}
      <section className="relative min-h-[460px] flex items-end pb-16 pt-36 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={service.image}
            alt={service.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-navy via-navy/70 to-navy/30" />
        </div>
        <div className="relative max-w-7xl mx-auto px-5 md:px-8 w-full">
          <nav className="flex items-center gap-2 text-[11px] text-white/50 mb-6">
            <Link href="/" className="hover:text-sand transition-colors">Home</Link>
            <span>/</span>
            <Link href="/services" className="hover:text-sand transition-colors">Services</Link>
            <span>/</span>
            <span className="text-white/80">{service.title}</span>
          </nav>
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-sand block mb-3">
            {service.tagline}
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-white leading-[1.1] tracking-[-0.02em] max-w-2xl mb-4">
            {service.title}
          </h1>
          <p className="text-white/60 text-base max-w-xl leading-relaxed">
            {service.description}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12 items-start">
            {/* Left */}
            <div>
              <h2 className="font-serif text-2xl text-navy mb-5">About This Service</h2>
              <p className="text-[15px] leading-[1.8] text-muted mb-10">
                {service.longDescription}
              </p>

              <h3 className="text-[11px] font-bold tracking-[0.25em] uppercase text-sand mb-5">
                What&apos;s Included
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {service.includes.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 bg-white border border-border rounded-xl p-4"
                  >
                    <span className="w-2 h-2 rounded-full bg-sand shrink-0" />
                    <span className="text-sm font-medium text-charcoal">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — sticky CTA card */}
            <div className="lg:sticky lg:top-28">
              <div className="bg-white rounded-2xl border border-border p-7 shadow-[0_4px_24px_rgba(26,31,46,0.06)]">
                <h3 className="font-serif text-xl text-navy mb-2">
                  Interested in {service.title}?
                </h3>
                <p className="text-[13px] text-muted leading-relaxed mb-6">
                  Add this service to your quote basket and we&apos;ll send you a detailed
                  proposal within 4 business hours.
                </p>

                <button
                  onClick={handleAdd}
                  className={`w-full inline-flex items-center justify-center gap-2 text-sm font-semibold rounded-xl py-3.5 transition-all duration-200 mb-3 ${
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
                      Added to Quote Basket
                    </>
                  ) : (
                    <>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <path d="M16 10a4 4 0 01-8 0" />
                      </svg>
                      Add to Quote Basket
                    </>
                  )}
                </button>

                <Link
                  href="/trade/rfq"
                  className="w-full inline-flex items-center justify-center gap-2 border border-sand text-sand hover:bg-sand hover:text-white text-sm font-semibold rounded-xl py-3.5 transition-all duration-200"
                >
                  Request Quote Directly
                </Link>

                <div className="mt-6 pt-5 border-t border-border space-y-3">
                  <div className="flex items-center gap-2.5 text-xs text-muted">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C4A265" strokeWidth="1.75">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    Response within 4 business hours
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-muted">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C4A265" strokeWidth="1.75">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    Quality assured since 2005
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-muted">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C4A265" strokeWidth="1.75">
                      <rect x="1" y="3" width="15" height="13" rx="1" />
                      <path d="M16 8h4l3 5v3h-7V8z" />
                      <circle cx="5.5" cy="18.5" r="2.5" />
                      <circle cx="18.5" cy="18.5" r="2.5" />
                    </svg>
                    UAE-wide delivery available
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back to services */}
      <div className="max-w-7xl mx-auto px-5 md:px-8 pb-16 border-t border-border pt-10">
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-sand transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Back to All Services
        </Link>
      </div>
    </div>
  );
}
