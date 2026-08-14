"use client";

import { useEffect, useRef } from "react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, CircleDollarSign, PackageCheck, UsersRound } from "lucide-react";
import furnitureImg from "@/assets/category-icons/furniture.png";
import glasswareImg from "@/assets/category-icons/glassware.png";
import ceramicwareImg from "@/assets/category-icons/ceramicware.png";
import stainlessSteelImg from "@/assets/category-icons/stainless-steel.png";
import diningCutleryImg from "@/assets/category-icons/dining-cutlery.png";
import buffetEquipmentImg from "@/assets/category-icons/buffet-equipment.png";
import kitchenEquipmentImg from "@/assets/category-icons/kitchen-equipment.png";
import outdoorEquipmentImg from "@/assets/category-icons/outdoor-equipment.png";
import kitchenUtensilsImg from "@/assets/category-icons/kitchen-utensils.png";

type CategoryItem = {
  name: string;
  slug: string;
  image: string | StaticImageData;
};

const CATEGORIES: CategoryItem[] = [
  { name: "Furniture", slug: "furniture", image: furnitureImg },
  { name: "Glass Ware", slug: "glass-ware", image: glasswareImg },
  { name: "Ceramic Ware", slug: "ceramic-ware", image: ceramicwareImg },
  { name: "Stainless Steel Ware", slug: "stainless-steel-ware", image: stainlessSteelImg },
  { name: "Dining Cutlery", slug: "dining-cutlery", image: diningCutleryImg },
  { name: "Buffet Equipment", slug: "buffet-equipment", image: buffetEquipmentImg },
  { name: "Kitchen Equipment", slug: "kitchen-equipment", image: kitchenEquipmentImg },
  { name: "Outdoor Equipment", slug: "outdoor-equipment", image: outdoorEquipmentImg },
  { name: "Kitchen Utensil", slug: "kitchen-utensil", image: kitchenUtensilsImg },
];

const REASONS = [
  { icon: PackageCheck, label: "Extensive Product Range" },
  { icon: UsersRound, label: "Trusted by Professionals" },
  { icon: CircleDollarSign, label: "Competitive Pricing" },
  { icon: BadgeCheck, label: "Local Support, Faster Results" },
];

function PartnerAside({ className }: { className?: string }) {
  return (
    <aside className={className}>
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
        Why partner with Catertech?
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {REASONS.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent/35 text-accent">
              <Icon className="h-4 w-4" strokeWidth={1.7} />
            </span>
            <span className="text-[10px] font-medium leading-tight text-white/82">{label}</span>
          </div>
        ))}
      </div>
      <Link
        href="/about"
        className="mt-5 inline-flex min-h-9 w-full items-center justify-center gap-2 rounded-full bg-accent px-5 text-[10px] font-bold uppercase tracking-[0.14em] text-primary transition-colors hover:bg-gold-soft"
      >
        Learn More About Us
        <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.2} />
      </Link>
    </aside>
  );
}

const DESKTOP_MIN_WINDOW_WIDTH = 1536;
const DESKTOP_GRID_MAX_CATEGORIES = 9;

function CategoryCard({ category }: { category: CategoryItem }) {
  return (
    <Link
      href={`/shop?category=${category.slug}`}
      className="hero-shop-category-card group flex w-[128px] shrink-0 flex-col overflow-hidden rounded-xl border border-primary/10 bg-white transition-transform duration-300 hover:-translate-y-0.5 sm:w-[140px] md:w-[148px] lg:w-[136px] lg:min-h-[196px]"
    >
      <div className="relative h-[92px] shrink-0 bg-white sm:h-[98px] lg:h-[108px]">
        <div className="absolute inset-1 sm:inset-1.5 lg:inset-1">
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-contain object-center transition-transform duration-500 group-hover:scale-[1.06]"
            sizes="(max-width: 640px) 128px, (max-width: 1280px) 148px, 12vw"
          />
        </div>
      </div>
      <div className="relative flex flex-1 flex-col px-2.5 pb-2.5 pt-4 sm:px-3 sm:pb-3 sm:pt-4 lg:px-2.5 lg:pb-2.5 lg:pt-4 xl:px-3">
        <p className="line-clamp-2 text-[11px] font-semibold leading-snug text-primary sm:text-xs lg:text-[11px] xl:text-xs">
          {category.name}
        </p>
        <span className="mt-2 ml-auto flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border border-accent/50 text-accent transition-colors group-hover:bg-accent group-hover:text-primary lg:h-6 lg:w-6">
          <ArrowRight className="h-2.5 w-2.5 sm:h-3 sm:w-3" strokeWidth={2.25} />
        </span>
      </div>
    </Link>
  );
}

export default function HeroShopCategories() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const syncMarquee = () => {
      const columnWidth = viewport.clientWidth;
      const isDesktopWindow = window.innerWidth >= DESKTOP_MIN_WINDOW_WIDTH;
      const shouldUseDesktopGrid =
        isDesktopWindow && CATEGORIES.length <= DESKTOP_GRID_MAX_CATEGORIES;

      if (shouldUseDesktopGrid) {
        track.classList.add("hero-shop-categories-marquee--grid");
        viewport.classList.add("hero-shop-categories-viewport--grid");
        track.style.setProperty("--hero-categories-scroll", "0px");
        track.classList.remove("hero-shop-categories-marquee--active");
        return;
      }

      track.classList.remove("hero-shop-categories-marquee--grid");
      viewport.classList.remove("hero-shop-categories-viewport--grid");

      const overflow = track.scrollWidth - columnWidth;

      if (overflow <= 4) {
        track.style.setProperty("--hero-categories-scroll", "0px");
        track.classList.remove("hero-shop-categories-marquee--active");
        return;
      }

      track.style.setProperty("--hero-categories-scroll", `-${overflow}px`);
      track.classList.add("hero-shop-categories-marquee--active");
    };

    syncMarquee();

    const observer = new ResizeObserver(syncMarquee);
    observer.observe(viewport);
    observer.observe(track);
    window.addEventListener("resize", syncMarquee);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncMarquee);
    };
  }, []);

  return (
    <div className="hero-shop-categories bg-bg-warm/95 pt-4 pb-8 shadow-[inset_0_1px_0_rgba(27,43,75,0.08)] sm:pt-5 sm:pb-10 md:pb-12 xl:pt-4">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_300px] lg:grid-rows-[auto_auto] lg:items-start lg:gap-x-3 xl:grid-cols-[minmax(0,1fr)_320px] xl:gap-x-3">
        <div className="flex items-center justify-between gap-4 lg:col-start-1 lg:row-start-1">
          <div className="flex items-center gap-3">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
              Shop by Category
            </h2>
            <span className="hidden h-px w-12 bg-accent sm:block" aria-hidden />
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs font-semibold text-body-muted transition-colors hover:text-primary sm:text-sm"
          >
            <span className="hidden sm:inline">View all categories</span>
            <span className="sm:hidden">View all</span>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-primary sm:h-7 sm:w-7">
              <ArrowRight className="h-3.5 w-3.5 stroke-[2.25] sm:h-4 sm:w-4" />
            </span>
          </Link>
        </div>

        <div
          ref={viewportRef}
          className="min-w-0 overflow-hidden lg:col-start-1 lg:row-start-2"
          aria-label="Shop by category"
        >
          <div
            ref={trackRef}
            className="hero-shop-categories-marquee flex w-max gap-2 sm:gap-2.5"
          >
            {CATEGORIES.map((category) => (
              <CategoryCard key={category.slug} category={category} />
            ))}
          </div>
        </div>

        <PartnerAside className="hidden flex-col rounded-2xl bg-[rgba(27,43,75,0.9)] px-5 py-6 text-white shadow-[0_16px_40px_rgba(27,43,75,0.22)] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:flex lg:self-start" />

        <div className="overflow-x-auto lg:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <PartnerAside className="flex min-w-[min(100%,520px)] flex-col rounded-2xl bg-[rgba(27,43,75,0.9)] px-5 py-5 text-white shadow-[0_16px_40px_rgba(27,43,75,0.22)] sm:min-w-[560px] sm:px-6 sm:py-6" />
        </div>
      </div>
    </div>
  );
}
