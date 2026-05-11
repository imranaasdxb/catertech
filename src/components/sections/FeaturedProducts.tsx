"use client";

import { useState } from "react";
import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";
import { SHOP_PRODUCT_CARDS } from "@/lib/shop-products";

const TABS = ["All", "Catering", "Events", "Kitchen"];

export default function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState("All");

  const filtered = activeTab === "All"
    ? SHOP_PRODUCT_CARDS
    : SHOP_PRODUCT_CARDS.filter((p) => p.category === activeTab);

  return (
    <section className="bg-cream py-24">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <SectionHeader
            eyebrow="Shop Our Range"
            title="Featured Equipment"
            subtitle="Browse our most-requested items for purchase and rental."
          />
          <Link
            href="/shop"
            className="text-sand text-sm font-medium tracking-wider hover:text-sand-dark transition-colors shrink-0 flex items-center gap-2"
          >
            View All →
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 mb-10 border-b border-border">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 text-xs font-semibold tracking-wider uppercase transition-all duration-200 relative ${
                activeTab === tab
                  ? "text-charcoal"
                  : "text-muted hover:text-charcoal"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sand" />
              )}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
          {filtered.slice(0, 8).map((product) => (
            <Link
              key={product.id}
              href={`/shop/${product.id}`}
              className="group bg-white border border-border hover:border-sand/40 transition-all duration-300 hover:shadow-md block"
            >
              {/* Image placeholder */}
              <div className="relative aspect-square bg-[#F5F1EB] overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#D4B483" strokeWidth="1">
                    <rect x="3" y="3" width="18" height="18" rx="1" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
                {product.tag && (
                  <span className="absolute top-3 left-3 bg-sand text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1">
                    {product.tag}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <p className="text-[10px] text-muted tracking-widest uppercase mb-1">
                  {product.category}
                </p>
                <h4 className="text-sm font-medium text-charcoal leading-snug mb-2 group-hover:text-sand transition-colors">
                  {product.name}
                </h4>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-charcoal">
                    {product.price}
                  </span>
                  <span className="text-sand opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
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
