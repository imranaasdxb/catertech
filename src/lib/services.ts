import service1Image from "@/assets/services/service-catering-equipment.png";
import service2Image from "@/assets/services/service-kitchen-equipment.png";
import service3Image from "@/assets/services/service-event-rental.png";
import service4Image from "@/assets/services/service-event-management.png";
import type { StaticImageData } from "next/image";

export type ServiceData = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  aboutParagraphs: string[];
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  image: string | StaticImageData;
  includes: string[];
  cartId: string;
  sidebarBullets: string[];
  comingSoon?: boolean;
};

export const SERVICES_LIST: ServiceData[] = [
  {
    slug: "catering-equipment",
    title: "Catering Equipment",
    tagline: "Flawless buffets, every time",
    description:
      "From a single chafing dish to a full banquet line, CaterTech equips five-star hotels, venues and event caterers across the UAE, Qatar and Oman with mirror-polished chafing dishes, beverage stations and serving accessories built for high-volume buffet service.",
    aboutParagraphs: [
      "Every piece in our catering equipment range is food-grade certified stainless steel, finished to a mirror polish and built to withstand nightly service in busy hotel kitchens and banqueting halls. Chafing dishes are available in gel-fuel and electric formats, sized for banquets of 20 to 2,000 covers, with drop-in inserts sold separately for menu flexibility.",
      "Hygiene is non-negotiable in hospitality service, so every unit is inspected, cleaned and sanitised to hotel food-safety standards before it leaves our facility, whether it's going out on rental or shipped as a purchase. Items showing wear are retired from the rental fleet rather than patched, so what arrives on your buffet line looks as good as it did on day one.",
      "Available for outright purchase or short-term rental, with same-week delivery to hotels, venues and event companies across the UAE, Qatar and Oman. CaterTech has supplied hospitality kitchens since 2005, and our account team can build a custom equipment list against your banquet calendar rather than a one-size-fits-all package.",
    ],
    metaTitle: "Catering Equipment Rental & Supply in Dubai, UAE | CaterTech",
    metaDescription:
      "Hotel-grade chafing dishes, beverage stations & buffet equipment for hospitality businesses across the UAE, Qatar and Oman. Purchase or rent. Since 2005.",
    keywords: [
      "catering equipment supplier Dubai",
      "chafing dish rental UAE",
      "buffet equipment hotels Qatar",
      "banquet catering equipment Oman",
      "food service equipment GCC",
    ],
    image: service1Image,
    includes: [
      "Chafing Dish Sets (gel-fuel and electric)",
      "Beverage Urns",
      "Serving Trays",
      "Display Stands",
      "Catering Uniforms",
      "Food Warmers",
    ],
    cartId: "service-catering-equipment",
    sidebarBullets: [
      "Response within 10 minutes",
      "Quality assured since 2005",
      "GCC-wide delivery available (UAE, Qatar, Oman)",
    ],
  },
  {
    slug: "event-rental",
    title: "Event Equipment Rental",
    tagline: "Set the perfect stage",
    description:
      "Banquet tables, Chiavari chairs, linen, staging and AV. CaterTech furnishes corporate galas, weddings and private functions for hotels, venues and event companies across the UAE, Qatar and Oman.",
    aboutParagraphs: [
      "Our event rental fleet holds over 5,000 individual items, from banquet seating and table linen to staging, LED panelling and pipe-and-drape. Stage risers are load-rated for safe use with performers, speakers and AV equipment, and our staging and rigging setups are handled by trained crews who follow standard venue safety practice on every build.",
      "Table linen is available in a range of colours and finishes to match event branding, and our Chiavari chair and banquet table stock is maintained to a consistent, scuff-free standard, so no mismatched furniture arriving on site.",
      "White-glove delivery, setup and collection is included as standard. Tell us the venue and guest count and our logistics team will handle load-in, breakdown and turnaround between multi-day events, across hotels and venues in the UAE, Qatar and Oman.",
    ],
    metaTitle: "Event Equipment Rental Dubai, Tables, Chairs, Staging & AV | CaterTech",
    metaDescription:
      "Banquet furniture, Chiavari chairs, staging and AV for corporate events and weddings across the UAE, Qatar and Oman. 5,000+ items, white-glove delivery.",
    keywords: [
      "event equipment rental Dubai",
      "Chiavari chair hire UAE",
      "banquet furniture rental Qatar",
      "corporate event staging Oman",
      "AV equipment hire GCC",
    ],
    image: service3Image,
    includes: [
      "Banquet Tables",
      "Chiavari Chairs",
      "Table Linen",
      "Stage Risers",
      "LED Panels",
      "Pipe & Drape",
    ],
    cartId: "service-event-rental",
    sidebarBullets: [
      "Response within 10 minutes",
      "Quality assured since 2005",
      "GCC-wide delivery available (UAE, Qatar, Oman)",
    ],
  },
  {
    slug: "kitchen-equipment",
    title: "Kitchen Equipment",
    tagline: "Professional kitchens, exceptional results",
    description:
      "Commercial-grade convection ovens, refrigeration units, food prep and dishwashing equipment, purpose-built for hotel and restaurant kitchens across the UAE, Qatar and Oman.",
    aboutParagraphs: [
      "Our kitchen equipment line is built around AISI 304 stainless steel interiors, a food-industry standard chosen for its resistance to corrosion and ease of cleaning in high-turnover commercial kitchens. Compressors are energy-efficient by design, which keeps running costs down on units that operate around the clock, and digital controls give kitchen teams precise temperature management across ovens, refrigeration and holding equipment.",
      "Every unit is pre-commissioned and function-tested before it leaves our facility, so what arrives on site is ready to install rather than ready to troubleshoot. For larger kitchen fit-outs, our team offers installation support and an electrical survey on request, to confirm your kitchen's power supply can support the load before equipment is delivered.",
      "From single-unit replacements to full back-of-house fit-outs, CaterTech has supplied hotel and restaurant kitchens across the UAE, Qatar and Oman since 2005.",
    ],
    metaTitle: "Commercial Kitchen Equipment Supplier Dubai, UAE | CaterTech",
    metaDescription:
      "Commercial-grade convection ovens, refrigeration and food prep equipment for hotel and restaurant kitchens across the UAE, Qatar and Oman. Since 2005.",
    keywords: [
      "commercial kitchen equipment Dubai",
      "hotel kitchen supplier UAE",
      "restaurant refrigeration Qatar",
      "food prep equipment Oman",
      "commercial kitchen fit-out GCC",
    ],
    image: service2Image,
    includes: [
      "Convection Ovens",
      "Refrigeration Units",
      "Food Prep Equipment",
      "Dishwashers",
      "Cooking Ranges",
      "Salamander Grills",
    ],
    cartId: "service-kitchen-equipment",
    sidebarBullets: [
      "Response within 10 minutes",
      "Quality assured since 2005",
      "GCC-wide delivery available (UAE, Qatar, Oman)",
    ],
  },
  {
    slug: "event-management",
    title: "Event Management",
    tagline: "From concept to flawless execution",
    description:
      "Full-service event coordination covering venue styling, equipment logistics, on-site management and post-event collection.",
    aboutParagraphs: [
      "Our event management team partners with you from initial brief through to post-event wrap-up. We manage equipment procurement, logistics, on-site coordination and styling so you can focus on your guests. Available for corporate, hospitality and private events across the UAE.",
    ],
    metaTitle: "Event Management | Catertech",
    metaDescription:
      "Full-service event coordination covering venue styling, equipment logistics, on-site management and post-event collection across the UAE.",
    keywords: ["event management Dubai", "corporate event coordination UAE"],
    image: service4Image,
    includes: [
      "Venue Setup",
      "Equipment Logistics",
      "On-site Coordination",
      "Décor & Styling",
      "Post-event Collection",
      "Event Photography",
    ],
    cartId: "service-event-management",
    sidebarBullets: [
      "Response within 10 minutes",
      "Quality assured since 2005",
      "UAE-wide delivery available",
    ],
    comingSoon: true,
  },
];

export function getServiceBySlug(slug: string): ServiceData | null {
  return SERVICES_LIST.find((s) => s.slug === slug) ?? null;
}
