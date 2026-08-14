import Image from "next/image";
import Link from "next/link";
import { Handshake, Layers, Package, Sparkles, Truck } from "lucide-react";
import servicesDesktop from "@/assets/services/services-section-desktop.png";
import servicesTablet from "@/assets/services/services-section-tablet.png";
import servicesMobile from "@/assets/services/services-section-mobile.png";
import service1Image from "@/assets/services/service-catering-equipment.png";
import service2Image from "@/assets/services/service-kitchen-equipment.png";
import service3Image from "@/assets/services/service-event-rental.png";
import service4Image from "@/assets/services/service-event-management.png";
import service5Image from "@/assets/services/service-trade-corporate.png";
import type { StaticImageData } from "next/image";
import { SERVICES_FEATURES_SECTION_ID } from "@/lib/connect-us-sections";

const features: {
  description: string;
  icon: typeof Package;
  image: string | StaticImageData;
  title: string;
  href?: string;
}[] = [
  {
    description:
      "From chafing dishes to banquet seating, one trade desk for procurement, rental and logistics across the UAE.",
    icon: Package,
    image: service1Image,
    title: "Full-range supply",
    href: "/services/catering-equipment",
  },
  {
    description:
      "Hotel-grade equipment, pre-commissioned kitchen units and white-glove delivery so your service day runs smoothly.",
    icon: Sparkles,
    image: service2Image,
    title: "Built for hospitality",
  },
  {
    description:
      "Same-week delivery, venue setup and post-event collection handled by our in-house logistics team.",
    icon: Truck,
    image: service3Image,
    title: "Logistics you can trust",
    href: "/services/event-rental",
  },
  {
    description:
      "End-to-end coordination: styling, equipment, on-site management and wrap-up for corporate and private events.",
    icon: Layers,
    image: service4Image,
    title: "Event management",
    href: "/services/event-management",
  },
  {
    description:
      "Volume pricing, formal quotations and dedicated account support for hotels, venues and F&B teams.",
    icon: Handshake,
    image: service5Image,
    title: "Trade & corporate",
    href: "/trade",
  },
];

type FeatureItem = (typeof features)[number];

function ServiceFeatureCard({ feature }: { feature: FeatureItem }) {
  const Icon = feature.icon;
  const isStatic = !feature.href;

  const cardClass =
    "service-feature-card group flex h-full w-[calc(50vw-1.375rem)] max-w-[280px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white shadow-[0_8px_32px_rgba(0,0,0,0.10),0_2px_8px_rgba(0,0,0,0.06)] transition-[box-shadow,transform] duration-300 min-[420px]:w-[calc(50vw-1.5rem)] md:w-[calc(33.333vw-1.35rem)] xl:w-full xl:max-w-[280px] xl:shrink xl:snap-align-none " +
    (isStatic
      ? "cursor-default"
      : "hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.12),0_4px_12px_rgba(0,0,0,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1a2e]/15");

  const content = (
    <>
      <div className="flex flex-1 flex-col items-center px-6 pt-7 text-center">
        <Icon
          size={32}
          strokeWidth={1.5}
          className="text-[#C9A84C]"
          fill="none"
          aria-hidden
        />
        <span
          className="mt-3 block h-0.5 w-[30px] rounded-full bg-[#C9A84C]"
          aria-hidden
        />
        <h3 className="mt-3 line-clamp-1 h-[3.125rem] w-full text-lg font-bold leading-snug text-[#1a1a2e]">
          {feature.title}
        </h3>
        <p className="mt-2.5 line-clamp-4 h-[5.6rem] w-full text-sm leading-[1.6] text-[#555555]">
          {feature.description}
        </p>
      </div>

      <div className="relative mt-auto h-[140px] w-full shrink-0">
        <Image
          src={feature.image}
          alt=""
          fill
          className="object-cover object-center"
          sizes="280px"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-linear-to-b from-white from-0% to-transparent to-40%"
          aria-hidden
        />
      </div>
    </>
  );

  if (!feature.href) {
    return <div className={cardClass}>{content}</div>;
  }

  return (
    <Link href={feature.href} className={cardClass}>
      {content}
    </Link>
  );
}

export default function ServicesFeatureShowcase() {
  return (
    <section
      id={SERVICES_FEATURES_SECTION_ID}
      className="relative overflow-hidden bg-[#f5f4f0] pt-16 pb-16 sm:pt-28 sm:pb-28"
    >
      <div className="pointer-events-none absolute inset-0 min-h-full w-full">
        <Image
          src={servicesMobile}
          alt=""
          fill
          priority={false}
          sizes="100vw"
          className="h-full w-full object-cover object-center md:hidden"
        />
        <Image
          src={servicesTablet}
          alt=""
          fill
          priority={false}
          sizes="100vw"
          className="hidden h-full w-full object-cover object-center md:block lg:hidden"
        />
        <Image
          src={servicesDesktop}
          alt=""
          fill
          priority={false}
          sizes="100vw"
          className="hidden h-full w-full object-cover object-center lg:block"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-full">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-center space-y-4 px-5 text-center md:px-10">
          <h2 className="max-w-3xl font-display text-4xl font-medium text-ink sm:text-5xl lg:text-6xl">
            Everything your venue needs, in one place
          </h2>
          <p className="max-w-xl text-base text-body-muted md:text-lg">
            Whether you&apos;re scaling a hotel kitchen, styling an event, or managing trade
            procurement for a portfolio of venues, Catertech simplifies the process, the right
            equipment, delivered on time, backed by a team that understands hospitality.
          </p>
        </div>

        <div className="mt-10 lg:px-8 xl:px-10">
          <div
            className="flex snap-x snap-mandatory gap-2.5 overflow-x-auto overscroll-x-contain scroll-px-5 px-5 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] min-[420px]:gap-3 sm:gap-3.5 md:gap-4 md:scroll-px-6 lg:scroll-px-8 [&::-webkit-scrollbar]:hidden xl:grid xl:grid-cols-5 xl:justify-items-center xl:overflow-visible xl:snap-none xl:scroll-px-0 xl:px-0 xl:pb-1 xl:gap-5"
            aria-label="Service categories"
          >
          {features.map((feature) => (
            <ServiceFeatureCard feature={feature} key={feature.title} />
          ))}
          <div aria-hidden className="w-1 shrink-0 xl:hidden" />
          </div>
        </div>
      </div>
    </section>
  );
}
