export type ShopProductCard = {
  id: number;
  name: string;
  category: string;
  price: string;
  tag: string | null;
};

export type ProductReview = {
  name: string;
  date: string;
  rating: number;
  text: string;
  initial: string;
};

export type ProductColor = {
  id: string;
  label: string;
};

export type ShopProductDetail = ShopProductCard & {
  shortDescription: string;
  longDescription: string;
  compareAtPrice?: string;
  discountPct?: number;
  rating: number;
  reviewCountLabel: string;
  colors: ProductColor[];
  packaging: string;
  shipping: string;
  specs: {
    height: string;
    width: string;
    materialLine1: string;
    materialLine2: string;
  };
  reviews: ProductReview[];
};

export const SHOP_PRODUCT_CARDS: ShopProductCard[] = [
  { id: 1, name: "Stainless Chafing Dish Set", category: "Catering", price: "AED 280", tag: "Popular" },
  { id: 2, name: "Folding Banquet Table 6ft", category: "Events", price: "AED 150 / day", tag: null },
  { id: 3, name: "Commercial Convection Oven", category: "Kitchen", price: "AED 4,200", tag: "New" },
  { id: 4, name: "Beverage Urn — 30L", category: "Catering", price: "AED 190", tag: null },
  { id: 5, name: "Chiavari Chair — Gold", category: "Events", price: "AED 25 / day", tag: "Popular" },
  { id: 6, name: "Undercounter Refrigerator", category: "Kitchen", price: "AED 2,800", tag: null },
  { id: 7, name: "Serving Tray Set — 5pc", category: "Catering", price: "AED 120", tag: null },
  { id: 8, name: "LED Stage Riser Panel", category: "Events", price: "AED 450 / day", tag: "New" },
];

const DETAILS: Record<number, Omit<ShopProductDetail, keyof ShopProductCard>> = {
  1: {
    shortDescription:
      "Mirror-finish stainless set with tempered glass lids and fuel holders—built for banquet lines, buffets and high-volume catering.",
    longDescription:
      "Engineered for even heat retention and effortless service, this chafing set pairs stackable frames with deep food pans so you can run a clean, consistent buffet line all evening. Polished pans wipe down quickly between services.",
    compareAtPrice: "AED 320",
    discountPct: 12,
    rating: 4.9,
    reviewCountLabel: "380+ Reviews",
    colors: [
      { id: "silver", label: "Stainless" },
      { id: "black", label: "Black trim" },
      { id: "gold", label: "Gold trim" },
    ],
    packaging: "Each set is carton-packed with protective corner inserts and pan separators. Frames ship flat; quick tool-free assembly on site.",
    shipping: "Available for UAE delivery and venue drop-off. Express slots for event dates subject to fleet availability—confirm at checkout enquiry.",
    specs: {
      height: 'Full stack: 17" seated',
      width: '9.5" per unit (fourth pan add-on)',
      materialLine1: "Bodies: Food-grade stainless",
      materialLine2: "Lids: Tempered glass & steel rims",
    },
    reviews: [
      {
        name: "Layla Al M.",
        date: "12 Mar 2026",
        rating: 4.9,
        text: "Held temperature through a 4-hour wedding service. Cleanup was fast and polish still looks showroom fresh.",
        initial: "L",
      },
      {
        name: "Marcus Reid",
        date: "03 Feb 2026",
        rating: 4.8,
        text: "We ordered twelve sets for a corporate gala. Fuel trays aligned perfectly—no rattling during transport.",
        initial: "M",
      },
    ],
  },
  2: {
    shortDescription:
      'Heavy-duty blow-molded top with steel folding legs—light to move, steady when locked, ideal for indoor and covered outdoor setups.',
    longDescription:
      "Banquet-tested folding mechanism with reinforced hinges. Seats linens and full place settings without flex. Ships with non-marring feet to protect ballroom floors.",
    compareAtPrice: "AED 175 / day",
    discountPct: 14,
    rating: 4.8,
    reviewCountLabel: "210+ Reviews",
    colors: [
      { id: "white", label: "White" },
      { id: "wood", label: "Woodgrain" },
      { id: "black", label: "Black" },
    ],
    packaging: "Legs folded flat; carton includes edge protectors. SKU tag for quick dock scanning.",
    shipping: "Rental carts available. Same-week warehouse pickup or white-glove delivery across Dubai.",
    specs: {
      height: '29" tabletop height',
      width: '30" × 72" footprint',
      materialLine1: "Top: HDPE laminate",
      materialLine2: "Legs: Powder-coated steel",
    },
    reviews: [
      {
        name: "Huda S.",
        date: "27 Jan 2026",
        rating: 4.9,
        text: "Set up forty tables in under two hours. Leg locks felt solid throughout the exhibition weekend.",
        initial: "H",
      },
    ],
  },
  3: {
    shortDescription:
      "Dual-fan convection with intuitive digital controls—consistent browning for pastries, poultry and banquet prep at scale.",
    longDescription:
      "AISI 304 interior, cool-touch glass and programmable routines for busy expo kitchens. Energy-efficient recuperation cycles help manage peak-load bills.",
    compareAtPrice: "AED 4,650",
    discountPct: 10,
    rating: 4.9,
    reviewCountLabel: "95+ Reviews",
    colors: [
      { id: "steel", label: "Stainless" },
      { id: "black", label: "Graphite panel" },
    ],
    packaging: "Crated with shock mounts; technician hookup guide included.",
    shipping: "Requires lift-gate delivery. Installation slot booked after electrical survey.",
    specs: {
      height: '36.5" (with casters)',
      width: '38" W × 41" D',
      materialLine1: "Cavity: Stainless steel",
      materialLine2: "Controls: Reinforced fascia",
    },
    reviews: [
      {
        name: "Chef Omar",
        date: "08 Apr 2026",
        rating: 5,
        text: "Even airflow across six sheet pans. Calibration out of the box matched our probes.",
        initial: "O",
      },
    ],
  },
  4: {
    shortDescription:
      "Brushed stainless urn with ergonomic tap and drip tray—steady pour for receptions, gala coffee and concierge stations.",
    longDescription:
      "Integrated sight glass, concealed element, and insulated body keep beverages hot without scorching bases. Concealed cord channel keeps lines tidy.",
    rating: 4.7,
    reviewCountLabel: "164+ Reviews",
    colors: [
      { id: "steel", label: "Stainless" },
      { id: "copper", label: "Copper accent" },
    ],
    packaging: "Double-boxed drum with locking lid strap.",
    shipping: "Compatible with courier or venue staging—mention floor access for weight.",
    specs: {
      height: '26" total height',
      width: '16" Ø base',
      materialLine1: "Shell: Stainless",
      materialLine2: "Tap: Reinforced nylon & brass valve",
    },
    reviews: [
      {
        name: "Priya N.",
        date: "02 Mar 2026",
        rating: 4.7,
        text: "Ran two units back-to-back for a product launch—no dribble after the second refill.",
        initial: "P",
      },
    ],
  },
  5: {
    shortDescription:
      "Chiavari profile with plush cushion optional—classic ballroom silhouette photographed beautifully under warm lighting.",
    longDescription:
      "Structural resin core with metallic finish layering resists scratching during transport carts. Stacks 10 high on compatible dollies.",
    compareAtPrice: "AED 30 / day",
    discountPct: 17,
    rating: 4.9,
    reviewCountLabel: "1.2K+ Reviews",
    colors: [
      { id: "gold", label: "Gold" },
      { id: "silver", label: "Silver" },
      { id: "black", label: "Black gloss" },
    ],
    packaging: "Chair socks + protective films applied at warehouse.",
    shipping: "Rental manifests include QC photos; swaps available onsite during build windows.",
    specs: {
      height: '36" seat height optional',
      width: '15.5" × 15.5" footprint',
      materialLine1: "Frame: Metallic resin laminate",
      materialLine2: "Seatpad: Density foam optional",
    },
    reviews: [
      {
        name: "Danielle K.",
        date: "19 Feb 2026",
        rating: 4.9,
        text: "Photographer-friendly finish—no hotspots under LED uplighting.",
        initial: "D",
      },
      {
        name: "Victor Ade",
        date: "11 Jan 2026",
        rating: 4.8,
        text: "Cart loading was painless; QA tags matched ballroom layout map.",
        initial: "V",
      },
    ],
  },
  6: {
    shortDescription:
      "Forced-air cooling with digital thermostat—perfect for satellite bars and back-of-house prep islands.",
    longDescription:
      "Ventilated front grille, reversible door and LED interior simplify tight galley installs. Energy label tuned for UAE climate loads.",
    compareAtPrice: "AED 3,050",
    discountPct: 8,
    rating: 4.8,
    reviewCountLabel: "72+ Reviews",
    colors: [
      { id: "silver", label: "Stainless" },
      { id: "black", label: "Black door" },
    ],
    packaging: "Palletized with corner guards.",
    shipping: "Requires placement path ≥ 82 cm width; inform concierge for loading dock slots.",
    specs: {
      height: '34" counter height series',
      width: '48" nominal width classes',
      materialLine1: "Interior: GN-compatible shelves",
      materialLine2: "Compressor deck: Tropicalized tuning",
    },
    reviews: [
      {
        name: "Ronan Malik",
        date: "30 Mar 2026",
        rating: 4.8,
        text: "Held 2 °C variance through service—quiet enough for guest-facing counters.",
        initial: "R",
      },
    ],
  },
  7: {
    shortDescription:
      "Five mirrored trays with anti-slip silicone feet—staging canapés, desserts and banquet displays elegantly.",
    longDescription:
      "Brushed underside hides fingerprints during carry. Edges softly rolled so linens glide without snagging threads.",
    rating: 4.6,
    reviewCountLabel: "540+ Reviews",
    colors: [
      { id: "silver", label: "Steel" },
      { id: "gold", label: "Champagne rim" },
    ],
    packaging: "Nested with microfiber separators inside retail box.",
    shipping: "Lightweight courier OK; consolidated with other smallwares on pallets.",
    specs: {
      height: '1.25" tray lip',
      width: 'Assorted 12"–18" series',
      materialLine1: "Trays: 18/8 stainless",
      materialLine2: "Feet: Food-safe silicone",
    },
    reviews: [
      {
        name: "Elena Torres",
        date: "06 Apr 2026",
        rating: 4.6,
        text: "Gorgeous mirror polish—reflection read clean in venue photography.",
        initial: "E",
      },
    ],
  },
  8: {
    shortDescription:
      "Tour-grade LED riser tiles with diffusion lens—rapid stage builds for launches, gala reveals and experiential sets.",
    longDescription:
      "Modular interconnect, cable spine channels and quick-lock edging reduce install time without sacrificing safety inspection compliance.",
    compareAtPrice: "AED 520 / day",
    discountPct: 13,
    rating: 4.9,
    reviewCountLabel: "120+ Reviews",
    colors: [
      { id: "black", label: "Matte black fascia" },
      { id: "white", label: "Frost diffuser" },
    ],
    packaging: "Flight-ready cases labeled by segment with cable bags.",
    shipping: "Truck pack manifests include weight distribution diagrams for riggers.",
    specs: {
      height: '8", 16" tier modules mixable',
      width: "2' × 4' nominal tile",
      materialLine1: "Frame: Aluminium trussing",
      materialLine2: "Facing: Acrylic diffusion",
    },
    reviews: [
      {
        name: "JP Audio House",
        date: "22 Feb 2026",
        rating: 4.9,
        text: "Power harnessing snapped in straight—no hotspots after a 36-hour expo build.",
        initial: "J",
      },
    ],
  },
};

export function getShopProductDetail(idStr: string): ShopProductDetail | null {
  const id = Number(idStr);
  if (!Number.isFinite(id)) return null;
  const card = SHOP_PRODUCT_CARDS.find((p) => p.id === id);
  const detail = DETAILS[id];
  if (!card || !detail) return null;
  return { ...card, ...detail };
}

export function getAllShopProductIds(): string[] {
  return SHOP_PRODUCT_CARDS.map((p) => String(p.id));
}
