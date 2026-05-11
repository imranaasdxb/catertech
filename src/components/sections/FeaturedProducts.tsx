"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import SectionHeader from "@/components/ui/SectionHeader";
import { SHOP_PRODUCT_CARDS } from "@/lib/shop-products";
import { useCart } from "@/lib/cart-context";

const TABS = ["All", "Catering", "Events", "Kitchen"];

export default function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState("All");
  const [addedIds, setAddedIds] = useState<number[]>([]);
  const { addItem } = useCart();

  const filtered =
    activeTab === "All"
      ? SHOP_PRODUCT_CARDS
      : SHOP_PRODUCT_CARDS.filter((p) => p.category === activeTab);

  const handleAdd = (e: React.MouseEvent, product: (typeof SHOP_PRODUCT_CARDS)[0]) => {
    e.preventDefault();
    addItem({
      id: `product-${product.id}`,
      name: product.name,
      category: product.category,
      price: product.price,
      image: product.image,
      type: "product",
    });
    setAddedIds((prev) => [...prev, product.id]);
    setTimeout(
      () => setAddedIds((prev) => prev.filter((id) => id !== product.id)),
      2000
    );
  };

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

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
          {filtered.slice(0, 8).map((product) => {
            const isAdded = addedIds.includes(product.id);
            return (
              <div key={product.id} className="group relative bg-white border border-border hover:border-sand/40 transition-all duration-300 hover:shadow-md">
                <Link href={`/shop/${product.id}`} className="block">
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden bg-cream">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />
                    {product.tag && (
                      <span className="absolute top-3 left-3 bg-sand text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 z-10">
                        {product.tag}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="px-4 pt-4 pb-11">
                    <p className="text-[10px] text-muted tracking-widest uppercase mb-1">
                      {product.category}
                    </p>
                    <h4 className="text-sm font-medium text-charcoal leading-snug group-hover:text-sand transition-colors">
                      {product.name}
                    </h4>
                  </div>
                </Link>

                {/* Add to Quote — always visible compact pill, bottom-right */}
                <button
                  onClick={(e) => handleAdd(e, product)}
                  className={`absolute bottom-3 right-3 z-10 inline-flex items-center gap-1 text-[10px] font-bold tracking-wide uppercase px-3 py-1.5 rounded-full transition-all duration-200 shadow-sm ${
                    isAdded
                      ? "bg-green-600 text-white"
                      : "bg-white border border-navy/20 text-navy hover:bg-navy hover:text-white"
                  }`}
                >
                  {isAdded ? (
                    <>
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Added
                    </>
                  ) : (
                    <>
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                      Quote
                    </>
                  )}
                </button>
              </div>
            );
          })}
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
