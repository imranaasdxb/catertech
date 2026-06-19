import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, CircleDollarSign, PackageCheck, UsersRound } from "lucide-react";

const CATEGORIES = [
  {
    name: "Buffet & Display Supplies",
    image:
      "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=85",
  },
  {
    name: "Cooking Equipment",
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=85",
  },
  {
    name: "Refrigeration & Storage",
    image:
      "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=800&q=85",
  },
  {
    name: "Warewashing Solutions",
    image:
      "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=800&q=85",
  },
  {
    name: "Tabletop & Service",
    image:
      "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=800&q=85",
  },
  {
    name: "Kitchen Tools",
    image:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=85",
  },
  {
    name: "Bar & Cafe Equipment",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=85",
  },
  {
    name: "Storage & Shelving",
    image:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=85",
  },
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

export default function HeroShopCategories() {
  return (
    <div className="hero-shop-categories bg-bg-warm/95 pt-4 pb-8 shadow-[inset_0_1px_0_rgba(27,43,75,0.08)] sm:pt-5 sm:pb-10 md:pb-12 xl:pt-4">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_300px] lg:grid-rows-[auto_auto] lg:items-start lg:gap-x-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex items-center justify-between gap-4 lg:col-start-1 lg:row-start-1">
          <div className="flex items-center gap-3">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
              Shop by Category
            </h2>
            <span className="hidden h-px w-12 bg-accent sm:block" aria-hidden />
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-[10px] font-semibold text-body-muted transition-colors hover:text-primary"
          >
            <span className="hidden sm:inline">View all categories</span>
            <span className="sm:hidden">View all</span>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-primary">
              <ArrowRight className="h-3 w-3" strokeWidth={2.25} />
            </span>
          </Link>
        </div>

        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain scroll-px-1 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] lg:col-start-1 lg:row-start-2 lg:grid lg:grid-cols-8 lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden">
          {CATEGORIES.map((category) => (
            <Link
              key={category.name}
              href="/shop"
              className="group flex w-[42vw] max-w-[168px] shrink-0 snap-start flex-col overflow-hidden rounded-xl border border-primary/8 bg-white shadow-[0_10px_30px_rgba(27,43,75,0.08)] transition-transform duration-300 hover:-translate-y-0.5 sm:w-[36vw] sm:max-w-[176px] md:max-w-[184px] lg:w-auto lg:max-w-none lg:min-h-[178px] lg:shrink"
            >
              <div className="relative h-[72px] shrink-0 bg-white sm:h-20">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-contain p-2.5 transition-transform duration-500 group-hover:scale-[1.04]"
                  sizes="(max-width: 1024px) 42vw, 10vw"
                />
              </div>
              <div className="flex flex-1 items-end justify-between gap-2 px-3 pb-2.5 pt-1">
                <p className="text-[10px] font-semibold leading-tight text-primary">{category.name}</p>
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-accent/50 text-accent transition-colors group-hover:bg-accent group-hover:text-primary">
                  <ArrowRight className="h-3 w-3" strokeWidth={2.25} />
                </span>
              </div>
            </Link>
          ))}
          <div aria-hidden className="w-1 shrink-0 lg:hidden" />
        </div>

        <PartnerAside className="hidden flex-col rounded-2xl bg-[rgba(27,43,75,0.9)] px-5 py-6 text-white shadow-[0_16px_40px_rgba(27,43,75,0.22)] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:flex lg:self-start" />

        <div className="overflow-x-auto lg:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <PartnerAside className="flex min-w-[min(100%,520px)] flex-col rounded-2xl bg-[rgba(27,43,75,0.9)] px-5 py-5 text-white shadow-[0_16px_40px_rgba(27,43,75,0.22)] sm:min-w-[560px] sm:px-6 sm:py-6" />
        </div>
      </div>
    </div>
  );
}
