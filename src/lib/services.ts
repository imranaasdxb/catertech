export type ServiceData = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  longDescription: string;
  image: string;
  includes: string[];
  cartId: string;
};

export const SERVICES_LIST: ServiceData[] = [
  {
    slug: "catering-equipment",
    title: "Catering Equipment",
    tagline: "Flawless buffets, every time",
    description:
      "Mirror-polished chafing dishes, beverage stations and serving accessories purpose-built for high-volume banquet and buffet service.",
    longDescription:
      "From intimate dinners to large-scale banquets, our catering equipment range covers everything you need for seamless food service. All items are food-grade certified and maintained to hotel standards. Available for purchase or short-term rental with same-week delivery across the UAE.",
    image:
      "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80",
    includes: [
      "Chafing Dish Sets",
      "Beverage Urns",
      "Serving Trays",
      "Display Stands",
      "Catering Uniforms",
      "Food Warmers",
    ],
    cartId: "service-catering-equipment",
  },
  {
    slug: "event-rental",
    title: "Event Equipment Rental",
    tagline: "Set the perfect stage",
    description:
      "Banquet tables, Chiavari chairs, linen, staging and AV for corporate galas, weddings and private functions across the UAE.",
    longDescription:
      "Our event rental fleet includes over 5,000 individual items available for daily or weekly hire. White-glove delivery and collection included. Our logistics team handles setup for larger events. Just tell us the venue and we handle the rest.",
    image:
      "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=80",
    includes: [
      "Banquet Tables",
      "Chiavari Chairs",
      "Table Linen",
      "Stage Risers",
      "LED Panels",
      "Pipe & Drape",
    ],
    cartId: "service-event-rental",
  },
  {
    slug: "kitchen-equipment",
    title: "Kitchen Equipment",
    tagline: "Professional kitchens, exceptional results",
    description:
      "Commercial-grade convection ovens, refrigeration units, food prep and dishwashing equipment for hotel and restaurant kitchens.",
    longDescription:
      "AISI 304 stainless interiors, energy-efficient compressors and intuitive digital controls across our kitchen equipment line. All units are pre-commissioned and tested before delivery. Installation and electrical survey available on request.",
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=80",
    includes: [
      "Convection Ovens",
      "Refrigeration Units",
      "Food Prep Equipment",
      "Dishwashers",
      "Cooking Ranges",
      "Salamander Grills",
    ],
    cartId: "service-kitchen-equipment",
  },
  {
    slug: "event-management",
    title: "Event Management",
    tagline: "From concept to flawless execution",
    description:
      "Full-service event coordination covering venue styling, equipment logistics, on-site management and post-event collection.",
    longDescription:
      "Our event management team partners with you from initial brief through to post-event wrap-up. We manage equipment procurement, logistics, on-site coordination and styling so you can focus on your guests. Available for corporate, hospitality and private events across the UAE.",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
    includes: [
      "Venue Setup",
      "Equipment Logistics",
      "On-site Coordination",
      "Décor & Styling",
      "Post-event Collection",
      "Event Photography",
    ],
    cartId: "service-event-management",
  },
];

export function getServiceBySlug(slug: string): ServiceData | null {
  return SERVICES_LIST.find((s) => s.slug === slug) ?? null;
}
