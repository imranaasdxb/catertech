"use client";

import { useState } from "react";
import Link from "next/link";

const CATEGORIES = ["All", "Hotel", "Corporate", "Wedding", "Government", "F&B"];

const POSTS = [
  { slug: "top-catering-equipment-trends-2025", category: "F&B", date: "12 Apr 2025", title: "Top Catering Equipment Trends Shaping UAE Events in 2025", excerpt: "From sustainable serving ware to smart kitchen appliances, what's changing in UAE's catering space." },
  { slug: "how-to-plan-a-corporate-event-dubai", category: "Corporate", date: "02 Mar 2025", title: "How to Plan a Flawless Corporate Event in Dubai", excerpt: "A practical guide to venue selection, equipment rental, and coordination for corporate events." },
  { slug: "wedding-equipment-rental-guide-uae", category: "Wedding", date: "18 Jan 2025", title: "The Complete Wedding Equipment Rental Guide for UAE Couples", excerpt: "Tables, chairs, linen, chafing dishes — everything you need for wedding equipment rental." },
  { slug: "hotel-kitchen-equipment-guide", category: "Hotel", date: "10 Dec 2024", title: "Commercial Kitchen Equipment Guide for UAE Hotels", excerpt: "Selecting the right commercial kitchen equipment for hotel operations in the UAE market." },
  { slug: "government-event-equipment-procurement", category: "Government", date: "22 Nov 2024", title: "Equipment Procurement for Government Events in UAE", excerpt: "Best practices for procuring event equipment for government and municipality functions." },
  { slug: "ramadan-iftar-catering-setup", category: "F&B", date: "15 Oct 2024", title: "Setting Up an Iftar Catering Operation in Dubai", excerpt: "Essential equipment and setup tips for Ramadan iftar catering services in UAE." },
];

export default function BlogPage() {
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? POSTS : POSTS.filter((p) => p.category === active);

  return (
    <>
      <section className="pt-40 pb-24 bg-navy">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-sand block mb-4">Our Blog</span>
          <div className="w-10 h-0.5 bg-sand mb-6" />
          <h1 className="font-serif text-5xl md:text-6xl text-white leading-tight max-w-2xl">
            Stories, Guides &amp; Industry Insights
          </h1>
        </div>
      </section>

      <section className="bg-offwhite py-16">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          {/* Filters */}
          <div className="flex gap-1 mb-12 border-b border-border overflow-x-auto">
            {CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => setActive(cat)}
                className={`px-5 py-3 text-xs font-semibold tracking-wider uppercase whitespace-nowrap transition-all relative ${active === cat ? "text-charcoal" : "text-muted hover:text-charcoal"}`}>
                {cat}
                {active === cat && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sand" />}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post, i) => (
              <Link key={i} href={`/blog/${post.slug}`} className="group bg-white border border-border hover:border-sand/30 hover:shadow-md transition-all block">
                <div className="aspect-[16/9] bg-cream relative">
                  <span className="absolute top-3 left-3 bg-sand/10 text-sand text-[10px] font-bold tracking-wider uppercase px-2.5 py-1">
                    {post.category}
                  </span>
                </div>
                <div className="p-6">
                  <p className="text-[10px] text-muted tracking-widest uppercase mb-3">{post.date}</p>
                  <h3 className="font-serif text-lg text-charcoal leading-snug mb-3 group-hover:text-sand transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-muted text-sm leading-relaxed line-clamp-2 mb-4">{post.excerpt}</p>
                  <span className="text-sand text-xs font-semibold tracking-wider uppercase flex items-center gap-1.5">
                    Read Story →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
