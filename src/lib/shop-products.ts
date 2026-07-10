export type ShopProductCard = {
  id: number;
  name: string;
  category: string;
  /** Products with the same id appear together in a Netflix-style “collection” row on the PDP */
  familyId: string;
  /** One-line hint on carousel tiles (size, capacity, etc.) */
  cardSubtitle?: string;
  /** Labels matching featured sidebar “Type of equipment” options for this category tab */
  equipmentFilters: string[];
  price: string;
  tag: string | null;
  image: string;
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

export type ProductSize = {
  id: string;
  label: string;
};

export type ShopProductDetail = ShopProductCard & {
  /** Storefront slug, set for live catalogue products */
  slug?: string;
  shortDescription: string;
  longDescription: string;
  compareAtPrice?: string;
  discountPct?: number;
  rating: number;
  reviewCountLabel: string;
  colors: ProductColor[];
  sizes: ProductSize[];
  packaging: string;
  shipping: string;
  specs: {
    height: string;
    width: string;
    materialLine1: string;
    materialLine2: string;
    dimensionRows?: { label: string; value: string }[];
    detailRows?: { label: string; value: string }[];
  };
  reviews: ProductReview[];
  /** Extra angles for gallery thumbnails (hero stays `image`) */
  galleryImages?: string[];
};

/** Higher-res Unsplash URLs for crisp catalogue imagery */
const U = (photoId: string, sig?: string) =>
  `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=1400&q=88${sig ? `&${sig}` : ""}`;

export const SHOP_PRODUCT_CARDS: ShopProductCard[] = [
  {
    id: 1,
    name: "Stainless Chafing Dish Set",
    category: "Catering",
    familyId: "buffet-chafing",
    price: "AED 280",
    tag: "Popular",
    image: U("photo-1555244162-803834f70033"),
    equipmentFilters: ["Bain Marie", "Buffet & warming"],
  },
  {
    id: 2,
    name: "Folding Banquet Table 6ft",
    category: "Events",
    familyId: "banquet-tables",
    price: "AED 150 / day",
    tag: null,
    image: U("photo-1519671482749-fd09be7ccebf"),
    cardSubtitle: "6 ft · steel frame",
    equipmentFilters: ["Banquet tables", "Counter top equipment"],
  },
  {
    id: 9,
    name: "Coupe Dinner Plate",
    category: "Catering",
    familyId: "crockery-plates",
    cardSubtitle: '12" · fine porcelain coupe',
    price: "Quote",
    tag: "New",
    image: U("photo-1578749556568-bc2b40e14352"),
    equipmentFilters: ["Crockery & tableware", "Food prep equipment"],
  },
  {
    id: 10,
    name: "Classic Rim Dinner Plate",
    category: "Catering",
    familyId: "crockery-plates",
    cardSubtitle: '10" · rolled rim',
    price: "Quote",
    tag: null,
    image: U("photo-1610701596007-115028846209"),
    equipmentFilters: ["Crockery & tableware"],
  },
  {
    id: 11,
    name: "Bread & Side Plate",
    category: "Catering",
    familyId: "crockery-plates",
    cardSubtitle: '6.5" · stackable',
    price: "Quote",
    tag: null,
    image: U("photo-1604339459669-a80727800cec"),
    equipmentFilters: ["Crockery & tableware"],
  },
  {
    id: 12,
    name: "Deep Coupe Bowl",
    category: "Catering",
    familyId: "crockery-plates",
    cardSubtitle: '9" · pasta & salad',
    price: "Quote",
    tag: null,
    image: U("photo-1586075010923-2dd45780fb21"),
    equipmentFilters: ["Crockery & tableware", "Food prep equipment"],
  },
  {
    id: 3,
    name: "Commercial Convection Oven",
    category: "Kitchen",
    familyId: "kitchen-ovens",
    price: "AED 4,200",
    tag: "New",
    image: U("photo-1556909114-f6e7ad7d3136"),
    equipmentFilters: ["Convection oven", "Cooking equipment", "Gas equipment"],
  },
  {
    id: 4,
    name: "Beverage Urn, 30L",
    category: "Catering",
    familyId: "beverage-service",
    price: "AED 190",
    tag: null,
    image: U("photo-1495474472287-4d71bcdd2085"),
    equipmentFilters: ["Beverage dispenser", "Dispenser", "Coffee equipment"],
  },
  {
    id: 5,
    name: "Chiavari Chair, Gold",
    category: "Events",
    familyId: "seating-chiavari",
    price: "AED 25 / day",
    tag: "Popular",
    image: U("photo-1524758631624-e2822e304c36"),
    equipmentFilters: ["Seating & chairs"],
  },
  {
    id: 6,
    name: "Undercounter Refrigerator",
    category: "Kitchen",
    familyId: "refrigeration-uc",
    price: "AED 2,800",
    tag: null,
    image: U("photo-1584568694244-14fbdf83bd30"),
    equipmentFilters: ["Refrigeration & chiller", "Counter top equipment"],
  },
  {
    id: 7,
    name: "Serving Tray Set, 5pc",
    category: "Catering",
    familyId: "serveware-trays",
    price: "AED 120",
    tag: null,
    image: U("photo-1414235077428-338989a2e8c0"),
    equipmentFilters: ["Serving equipment", "Food prep equipment", "Counter top equipment"],
  },
  {
    id: 8,
    name: "LED Stage Riser Panel",
    category: "Events",
    familyId: "staging-led",
    price: "AED 450 / day",
    tag: "New",
    image: U("photo-1492684223066-81342ee5ff30"),
    equipmentFilters: ["Staging & lighting"],
  },
  {
    id: 13,
    name: "Heavy-Duty Blender 2 L, Sound Enclosure",
    category: "Kitchen",
    familyId: "blend-heavy",
    cardSubtitle: "2 L jug · tamper · NSF-rated jar",
    price: "AED 890",
    tag: null,
    image: U("photo-1578985545062-69928b1d9587"),
    equipmentFilters: ["Blender", "Food prep equipment", "Counter top equipment"],
  },
  {
    id: 14,
    name: "Electric Soup Kettle 10 L",
    category: "Catering",
    familyId: "soup-kettle",
    cardSubtitle: "Wet heat · hinged lid · dial thermostat",
    price: "AED 620",
    tag: "Popular",
    image: U("photo-1547592189-372fc972972a"),
    equipmentFilters: ["Boiling pan", "Bain Marie", "Cooking & catering"],
  },
  {
    id: 15,
    name: "Modular Salad Bar Cold Well",
    category: "Catering",
    familyId: "salad-bar",
    cardSubtitle: "4 × GN 1/1 · polycarbonate sneeze rail optional",
    price: "Quote",
    tag: null,
    image: U("photo-1517248135467-4c7edcad34c4"),
    equipmentFilters: ["Salad bar & cold display", "Buffet & warming", "Food prep equipment"],
  },
  {
    id: 16,
    name: "Tiered Champagne Fountain",
    category: "Events",
    familyId: "champagne-fountain",
    cardSubtitle: "5-tier stainless · LED ring optional",
    price: "AED 340 / event",
    tag: null,
    image: U("photo-1466978913421-dad2ebd01d17"),
    equipmentFilters: ["Serving equipment", "Bar equipment"],
  },
  {
    id: 17,
    name: "Espresso Machine, Two Group",
    category: "Catering",
    familyId: "espresso-2grp",
    cardSubtitle: "Rotary pump · volumetric dosing",
    price: "AED 12,400",
    tag: "New",
    image: U("photo-1497935586351-b67a49e012bf"),
    equipmentFilters: ["Coffee equipment", "Counter top equipment", "Bar equipment"],
  },
  {
    id: 18,
    name: "Undercounter Ice Maker, 120 kg",
    category: "Kitchen",
    familyId: "ice-uc120",
    cardSubtitle: "Half-dice · air-cooled · drain pump optional",
    price: "AED 5,900",
    tag: null,
    image: U("photo-1570960915966-b69763eeddee"),
    equipmentFilters: ["Ice maker", "Refrigeration & chiller", "Counter top equipment"],
  },
  {
    id: 19,
    name: "Pass-Through Conveyor Dishwasher",
    category: "Kitchen",
    familyId: "dish-conveyor",
    cardSubtitle: "Rinse-aid pump · heat recovery hood",
    price: "Quote",
    tag: "Popular",
    image: U("photo-1584568694244-14fbdf83bd30"),
    equipmentFilters: ["Dishwasher", "Cooking equipment"],
  },
  {
    id: 20,
    name: "Twin Tank Deep Fat Fryer, 2 × 8 L",
    category: "Kitchen",
    familyId: "fryer-twin",
    cardSubtitle: "Millivolt safety · basket timers",
    price: "AED 3,450",
    tag: null,
    image: U("photo-1590794056226-fffd804949cf"),
    equipmentFilters: ["Deep fat fryer", "Gas equipment", "Cooking equipment"],
  },
  {
    id: 21,
    name: "Chrome Flat Top Griddle 120 cm",
    category: "Kitchen",
    familyId: "griddle-chrome",
    cardSubtitle: "Thermostatic zones · grease drawers",
    price: "AED 4,100",
    tag: null,
    image: U("photo-1556911223-e19759d32469"),
    equipmentFilters: ["Griddle", "Cooking equipment", "Gas equipment"],
  },
  {
    id: 22,
    name: "Planetary Mixer, 20 qt",
    category: "Kitchen",
    familyId: "mixer-20qt",
    cardSubtitle: "Guard interlock · hook & whip incl.",
    price: "AED 2,650",
    tag: null,
    image: U("photo-1594385208974-2f171cebc219"),
    equipmentFilters: ["Planetary mixer", "Food prep equipment"],
  },
  {
    id: 23,
    name: "Stainless Prep Table, 180 × 60 cm",
    category: "Kitchen",
    familyId: "prep-18060",
    cardSubtitle: "Undershelf · backsplash · leveling feet",
    price: "AED 780",
    tag: "Popular",
    image: U("photo-1524758631624-e2822e304c36"),
    equipmentFilters: ["Stainless bench", "Food prep equipment"],
  },
  {
    id: 24,
    name: "Gas Range, Six Burner + Oven",
    category: "Kitchen",
    familyId: "range-6burn",
    cardSubtitle: "Cast iron grates · convection base",
    price: "Quote",
    tag: null,
    image: U("photo-1577212019215-de62ea988239"),
    equipmentFilters: ["Gas equipment", "Cooking equipment", "Cooking & catering"],
  },
  {
    id: 25,
    name: "Portable LED Service Bar, Fold Flat",
    category: "Events",
    familyId: "bar-led-fold",
    cardSubtitle: "Branding panels · cable ports · lock casters",
    price: "AED 290 / day",
    tag: "New",
    image: U("photo-1572116469695-31cba09259b8"),
    equipmentFilters: ["Bar equipment", "Counter top equipment", "Staging & lighting"],
  },
  {
    id: 26,
    name: "Pipe & Drape Kit, Black Velvet",
    category: "Events",
    familyId: "pipe-drape-k",
    cardSubtitle: "3 m uprights · crossbars · base plates",
    price: "AED 85 / lm",
    tag: null,
    image: U("photo-1489515217757-5fd1be406fef"),
    equipmentFilters: ["Pipe & drape", "Staging & lighting"],
  },
  {
    id: 27,
    name: "Modular Dance Floor, Oak Finish",
    category: "Events",
    familyId: "floor-mod-oak",
    cardSubtitle: "Clip-lock tiles · ramp edging incl.",
    price: "AED 42 / m²",
    tag: "Popular",
    image: U("photo-1464366400609-398bd96eb52e"),
    equipmentFilters: ["Dance floor", "Staging & lighting"],
  },
  {
    id: 28,
    name: "Stretch Tent, 15 × 10 m White",
    category: "Events",
    familyId: "tent-stretch",
    cardSubtitle: "Wind-rated rig · sidewalls optional",
    price: "Quote",
    tag: null,
    image: U("photo-1478137312665-fbaa146abf29"),
    equipmentFilters: ["Tent & marquee", "Staging & lighting"],
  },
  {
    id: 29,
    name: "Moving Head Beam, Pair Flight Case",
    category: "Events",
    familyId: "beam-pair",
    cardSubtitle: "DMX · prism · frost inserts",
    price: "AED 220 / day",
    tag: null,
    image: U("photo-1470229722913-7c724bd87d71"),
    equipmentFilters: ["AV & lighting", "Staging & lighting"],
  },
  {
    id: 30,
    name: "Banquet Linens, Round Ivory Pack",
    category: "Events",
    familyId: "linens-ivory",
    cardSubtitle: "fits 180 cm rounds · pressed fold",
    price: "AED 18 / pc",
    tag: null,
    image: U("photo-1519167758481-83f550bb49b3"),
    equipmentFilters: ["Table linen", "Banquet tables"],
  },
  {
    id: 31,
    name: "Stemware Crate, Champagne Flutes ×120",
    category: "Catering",
    familyId: "stemware-flute",
    cardSubtitle: "machine-polished · compartment trays",
    price: "Quote",
    tag: null,
    image: U("photo-1510814920518-e54211297337"),
    equipmentFilters: ["Glassware & stemware", "Serving equipment"],
  },
  {
    id: 32,
    name: "Cross-Back Dining Chair, Walnut",
    category: "Events",
    familyId: "chair-crossback",
    cardSubtitle: "stack 8 · felt pad feet",
    price: "AED 35 / day",
    tag: null,
    image: U("photo-1549497556-99be036433be"),
    equipmentFilters: ["Seating & chairs"],
  },
  {
    id: 33,
    name: "Utility Bus Cart, Three Shelf SS",
    category: "Catering",
    familyId: "cart-bus-ss",
    cardSubtitle: "300 kg rated · bumper wrap",
    price: "AED 410",
    tag: null,
    image: U("photo-1582719478250-c89cae4dc85b"),
    equipmentFilters: ["Cart & transport", "Serving equipment"],
  },
  {
    id: 34,
    name: "Combi Steam Oven, 6 GN",
    category: "Kitchen",
    familyId: "combi-6gn",
    cardSubtitle: "Touch controls · automated cleaning",
    price: "Quote",
    tag: "New",
    image: U("photo-1626135360528-e31856ca72fd"),
    equipmentFilters: ["Steam oven", "Convection oven", "Cooking equipment"],
  },
  {
    id: 35,
    name: "Salamander Grill, Quartz Elements",
    category: "Kitchen",
    familyId: "salamander-q",
    cardSubtitle: "Pass-through gantry · minute timer",
    price: "AED 2,190",
    tag: null,
    image: U("photo-1600891964599-f61ba0e24092"),
    equipmentFilters: ["Grill", "Cooking equipment", "Gas equipment"],
  },
  {
    id: 36,
    name: "Hot Holding Cabinet, 16 Tray",
    category: "Catering",
    familyId: "hold-cab16",
    cardSubtitle: "Humidity drawer · banquet castors",
    price: "AED 3,800",
    tag: null,
    image: U("photo-1565538810743-3823b6626318"),
    equipmentFilters: ["Food warmer", "Buffet & warming", "Cooking & catering"],
  },
  {
    id: 37,
    name: "Robot Coupe–Style Food Processor",
    category: "Kitchen",
    familyId: "robot-processor",
    cardSubtitle: "3 L bowl · discs kit · pulse",
    price: "AED 1,450",
    tag: null,
    image: U("photo-1590794319687-ab52fe659ca9"),
    equipmentFilters: ["Food processor", "Food prep equipment"],
  },
  {
    id: 38,
    name: "Banquet Plate Warmer Cabinet, 120 pc",
    category: "Catering",
    familyId: "plate-warmer120",
    cardSubtitle: "Sliding racks · insulated door",
    price: "AED 2,100",
    tag: "Popular",
    image: U("photo-1559339352-11d035aa65de"),
    equipmentFilters: ["Food warmer", "Buffet & warming", "Serving equipment"],
  },
];

/** Sidebar checkbox lists per catalogue tab, strings must match `equipmentFilters` on products */
export const FEATURED_EQUIPMENT_OPTIONS_BY_TAB: Record<
  "Catering" | "Events" | "Kitchen",
  readonly string[]
> = {
  Catering: [
    "Bain Marie",
    "Bar equipment",
    "Blender",
    "Boiling pan",
    "Buffet & warming",
    "Beverage dispenser",
    "Cart & transport",
    "Coffee equipment",
    "Cooking & catering",
    "Counter top equipment",
    "Crockery & tableware",
    "Deep fat fryer",
    "Dispenser",
    "Food prep equipment",
    "Food warmer",
    "Glassware & stemware",
    "Griddle",
    "Salad bar & cold display",
    "Serving equipment",
  ],
  Events: [
    "AV & lighting",
    "Banquet tables",
    "Bar equipment",
    "Cart & transport",
    "Counter top equipment",
    "Dance floor",
    "Food prep equipment",
    "Gas equipment",
    "Pipe & drape",
    "Seating & chairs",
    "Staging & lighting",
    "Table linen",
    "Tent & marquee",
  ],
  Kitchen: [
    "Blender",
    "Convection oven",
    "Cooking equipment",
    "Counter top equipment",
    "Deep fat fryer",
    "Dishwasher",
    "Dispenser",
    "Extractor hood",
    "Food prep equipment",
    "Food processor",
    "Gas equipment",
    "Griddle",
    "Grill",
    "Ice maker",
    "Planetary mixer",
    "Refrigeration & chiller",
    "Stainless bench",
    "Steam oven",
  ],
};

export function getFeaturedSidebarEquipmentFilters(
  tab: "All" | "Catering" | "Events" | "Kitchen"
): string[] {
  if (tab === "All") {
    const merged = [
      ...FEATURED_EQUIPMENT_OPTIONS_BY_TAB.Catering,
      ...FEATURED_EQUIPMENT_OPTIONS_BY_TAB.Events,
      ...FEATURED_EQUIPMENT_OPTIONS_BY_TAB.Kitchen,
    ];
    return [...new Set(merged)].sort((a, b) => a.localeCompare(b));
  }
  return [...FEATURED_EQUIPMENT_OPTIONS_BY_TAB[tab]].sort((a, b) => a.localeCompare(b));
}

export const PRODUCT_FAMILY_META: Record<string, { title: string; blurb: string }> = {
  "crockery-plates": {
    title: "This crockery collection",
    blurb: "Different diameters and profiles. Open any tile to set quantity, finish, then add to your quote basket.",
  },
  "buffet-chafing": {
    title: "Buffet warming line",
    blurb: "Customers configuring chafers often pair these pieces.",
  },
  "banquet-tables": {
    title: "Tables & surfaces",
    blurb: "Alternative footprints for the same hire workflow.",
  },
  "beverage-service": {
    title: "Beverage service",
    blurb: "Matching urns and dispensers for banquet flows.",
  },
  "serveware-trays": {
    title: "Serveware & trays",
    blurb: "Display layers that complement plated service.",
  },
  "kitchen-ovens": {
    title: "Kitchen cooking line",
    blurb: "Related convection and prep hardware.",
  },
  "seating-chiavari": {
    title: "Event seating",
    blurb: "Alternative finishes and heights.",
  },
  "refrigeration-uc": {
    title: "Undercounter cooling",
    blurb: "Different widths for bars and satellite kitchens.",
  },
  "staging-led": {
    title: "Stage & scenic",
    blurb: "Modular scenic tiles that rig together.",
  },
};

export function getFamilyMeta(familyId: string) {
  return (
    PRODUCT_FAMILY_META[familyId] ?? {
      title: "Related in this range",
      blurb: "Explore complementary equipment.",
    }
  );
}

/** Same `familyId` as current product, Netflix-style collection strip */
export function getCollectionSiblings(productId: number, familyId: string): ShopProductCard[] {
  return SHOP_PRODUCT_CARDS.filter((p) => p.familyId === familyId && p.id !== productId);
}

/** Same category, different families first; then fill from rest of catalogue */
export function getCrossSellProducts(productId: number, category: string, familyId: string): ShopProductCard[] {
  const limit = 14;
  const sameCatOther = SHOP_PRODUCT_CARDS.filter(
    (p) => p.id !== productId && p.category === category && p.familyId !== familyId
  );
  const seen = new Set(sameCatOther.map((p) => p.id));
  const rest = SHOP_PRODUCT_CARDS.filter((p) => p.id !== productId && !seen.has(p.id));
  return [...sameCatOther, ...rest].slice(0, limit);
}

const DETAILS: Record<number, Omit<ShopProductDetail, keyof ShopProductCard>> = {
  1: {
    shortDescription:
      "Mirror-finish stainless set with tempered glass lids and fuel holders,built for banquet lines, buffets and high-volume catering.",
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
    sizes: [
      { id: "full", label: "Full Pan" },
      { id: "half", label: "Half Pan" },
      { id: "third", label: "Third Pan" },
      { id: "round7", label: "Round 7 qt" },
    ],
    packaging: "Each set is carton-packed with protective corner inserts and pan separators. Frames ship flat; quick tool-free assembly on site.",
    shipping: "Available for UAE delivery and venue drop-off. Express slots for event dates subject to fleet availability,confirm at checkout enquiry.",
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
        text: "We ordered twelve sets for a corporate gala. Fuel trays aligned perfectly,no rattling during transport.",
        initial: "M",
      },
    ],
  },
  2: {
    shortDescription:
      'Heavy-duty blow-molded top with steel folding legs,light to move, steady when locked, ideal for indoor and covered outdoor setups.',
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
    sizes: [
      { id: "4ft", label: "4 ft × 2 ft" },
      { id: "6ft", label: "6 ft × 2.5 ft" },
      { id: "8ft", label: "8 ft × 2.5 ft" },
      { id: "round60", label: "Round 60\"" },
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
      "Dual-fan convection with intuitive digital controls,consistent browning for pastries, poultry and banquet prep at scale.",
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
    sizes: [
      { id: "half", label: "Half-Size (5 trays)" },
      { id: "full", label: "Full-Size (10 trays)" },
      { id: "double", label: "Double Stack" },
      { id: "compact", label: "Compact Combi" },
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
      "Brushed stainless urn with ergonomic tap and drip tray,steady pour for receptions, gala coffee and concierge stations.",
    longDescription:
      "Integrated sight glass, concealed element, and insulated body keep beverages hot without scorching bases. Concealed cord channel keeps lines tidy.",
    rating: 4.7,
    reviewCountLabel: "164+ Reviews",
    colors: [
      { id: "steel", label: "Stainless" },
      { id: "copper", label: "Copper accent" },
    ],
    sizes: [
      { id: "10l", label: "10 L" },
      { id: "20l", label: "20 L" },
      { id: "30l", label: "30 L" },
      { id: "50l", label: "50 L" },
    ],
    packaging: "Double-boxed drum with locking lid strap.",
    shipping: "Compatible with courier or venue staging,mention floor access for weight.",
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
        text: "Ran two units back-to-back for a product launch,no dribble after the second refill.",
        initial: "P",
      },
    ],
  },
  5: {
    shortDescription:
      "Chiavari profile with plush cushion optional,classic ballroom silhouette photographed beautifully under warm lighting.",
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
    sizes: [
      { id: "standard", label: "Standard Adult" },
      { id: "bar", label: "Bar Height" },
      { id: "kids", label: "Children's 60 cm" },
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
        text: "Photographer-friendly finish,no hotspots under LED uplighting.",
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
      "Forced-air cooling with digital thermostat,perfect for satellite bars and back-of-house prep islands.",
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
    sizes: [
      { id: "45cm", label: "Under-bar 45 cm" },
      { id: "60cm", label: "60 cm wide" },
      { id: "90cm", label: "90 cm wide" },
      { id: "120cm", label: "120 cm wide" },
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
        text: "Held 2 °C variance through service,quiet enough for guest-facing counters.",
        initial: "R",
      },
    ],
  },
  7: {
    shortDescription:
      "Five mirrored trays with anti-slip silicone feet,staging canapés, desserts and banquet displays elegantly.",
    longDescription:
      "Brushed underside hides fingerprints during carry. Edges softly rolled so linens glide without snagging threads.",
    rating: 4.6,
    reviewCountLabel: "540+ Reviews",
    colors: [
      { id: "silver", label: "Steel" },
      { id: "gold", label: "Champagne rim" },
    ],
    sizes: [
      { id: "sm", label: "Small 12\" × 9\"" },
      { id: "md", label: "Medium 15\" × 11\"" },
      { id: "lg", label: "Large 18\" × 13\"" },
      { id: "mixed", label: "Mixed 5-pc Set" },
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
        text: "Gorgeous mirror polish,reflection read clean in venue photography.",
        initial: "E",
      },
    ],
  },
  8: {
    shortDescription:
      "Tour-grade LED riser tiles with diffusion lens,rapid stage builds for launches, gala reveals and experiential sets.",
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
    sizes: [
      { id: "8in", label: "8\" Single Tier" },
      { id: "16in", label: "16\" Double Tier" },
      { id: "combo", label: "8\"+16\" Combo" },
      { id: "full", label: "Full Stage Kit" },
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
        text: "Power harnessing snapped in straight,no hotspots after a 36-hour expo build.",
        initial: "J",
      },
    ],
  },
  9: {
    shortDescription:
      "Bright coupe profile stacks cleanly on banquet carts, dishwasher-safe glaze suited to high-turn catered mains.",
    longDescription:
      "Fired porcelain with reinforced rim resists chips during rack washing. Matte underside reduces tabletop scratching while the coupe well keeps sauces centred for elegant plating.",
    rating: 4.8,
    reviewCountLabel: "210+ Reviews",
    galleryImages: [
      U("photo-1610701596007-115028846209"),
      U("photo-1604339459669-a80727800cec"),
      U("photo-1586075010923-2dd45780fb21"),
    ],
    colors: [
      { id: "white", label: "Brilliant white" },
      { id: "ivory", label: "Warm ivory" },
      { id: "stone", label: "Stone grey" },
    ],
    sizes: [
      { id: "12", label: '12" coupe' },
      { id: "11", label: '11" coupe' },
      { id: "10", label: '10" coupe' },
    ],
    packaging: "12 pcs per sleeve; export carton 48 pcs with divider grids.",
    shipping: "Compact parcels, combine with other crockery SKUs on one skid.",
    specs: {
      height: '1.1" coupe depth',
      width: '12" Ø face',
      materialLine1: "Body: High-fired porcelain",
      materialLine2: "Glaze: Lead-free culinary gloss",
    },
    reviews: [
      {
        name: "Amira K.",
        date: "02 Apr 2026",
        rating: 4.9,
        text: "Held plating temps through buffet photography, coupe rim photographed beautifully.",
        initial: "A",
      },
    ],
  },
  10: {
    shortDescription:
      "Traditional rolled rim dinner plate, sturdy stack height for airline catering and ballroom resets.",
    longDescription:
      "Balanced weight distribution avoids tipping on oval chargers. Compatible with induction warmers via spacer discs.",
    rating: 4.7,
    reviewCountLabel: "340+ Reviews",
    galleryImages: [
      U("photo-1578749556568-bc2b40e14352"),
      U("photo-1528735602780-2552fd46c7af"),
      U("photo-1556912173-46c336c7fd55"),
    ],
    colors: [
      { id: "white", label: "Classic white" },
      { id: "blue-rim", label: "Blue pinstripe rim" },
    ],
    sizes: [
      { id: "10", label: '10" rim plate' },
      { id: "9", label: '9" rim plate' },
    ],
    packaging: "Foam disk separators every 10 pcs.",
    shipping: "Pallet MOQ-friendly, consolidates with bowls below.",
    specs: {
      height: '0.95" rim rise',
      width: '10.25" Ø',
      materialLine1: "Ware: Vitreous china",
      materialLine2: "Foot ring: Hand polished",
    },
    reviews: [
      {
        name: "Jon P.",
        date: "18 Mar 2026",
        rating: 4.7,
        text: "Stacks to 48 high on our dolleys without chipping corners.",
        initial: "J",
      },
    ],
  },
  11: {
    shortDescription:
      "Compact bread & butter plate, pairs with coupe mains for formal five-course layouts.",
    longDescription:
      "Microwave tolerant for butter melts during VIP tastings. Feather-light for tray-pass programs.",
    rating: 4.8,
    reviewCountLabel: "188+ Reviews",
    galleryImages: [
      U("photo-1604339459669-a80727800cec"),
      U("photo-1578749556568-bc2b40e14352"),
      U("photo-1567525933719-67bb4aab77e8"),
    ],
    colors: [{ id: "white", label: "Classic white" }],
    sizes: [
      { id: "6_5", label: '6.5" side plate' },
      { id: "7", label: '7" side plate' },
    ],
    packaging: "Nested sleeves of 24.",
    shipping: "Air-shippable cubic efficiency.",
    specs: {
      height: '0.7" lip',
      width: '6.6" Ø',
      materialLine1: "Ware: Porcelain",
      materialLine2: "Finish: Gloss rim only",
    },
    reviews: [
      {
        name: "Sofia L.",
        date: "01 Feb 2026",
        rating: 5,
        text: "Perfect proportion against our 12 inch coupes.",
        initial: "S",
      },
    ],
  },
  12: {
    shortDescription:
      "Deep coupe bowl for pasta, salads and dessert compositions, elevated gallery lip reduces spill during tray carry.",
    longDescription:
      "Thermal shock resistant between blast chill and hot pass. Designed for spoon-forward plating styles.",
    rating: 4.9,
    reviewCountLabel: "420+ Reviews",
    galleryImages: [
      U("photo-1586075010923-2dd45780fb21"),
      U("photo-1546069901-ba9599a7e63c"),
      U("photo-1577983937367-fadc07121fca"),
    ],
    colors: [
      { id: "white", label: "White" },
      { id: "slate", label: "Matte slate" },
    ],
    sizes: [
      { id: "9", label: '9" deep coupe' },
      { id: "8", label: '8" shallow' },
    ],
    packaging: "Clamshell per bowl for VIP rentals.",
    shipping: "Mixed pallets with plates above.",
    specs: {
      height: '2.4" bowl depth',
      width: '9.25" Ø opening',
      materialLine1: "Body: Stoneware porcelain blend",
      materialLine2: "Interior: Nano-glazed stain guard",
    },
    reviews: [
      {
        name: "Chef Rahul",
        date: "27 Apr 2026",
        rating: 4.9,
        text: "Deep enough for ramen tastings without splash, glaze cleans fast.",
        initial: "R",
      },
    ],
  },
};

function defaultShopDetail(card: ShopProductCard): Omit<ShopProductDetail, keyof ShopProductCard> {
  return {
    shortDescription: `${card.name}, commercial-grade equipment for ${card.category.toLowerCase()} programmes. Final specs ship with your CaterTech quotation.`,
    longDescription:
      "Imagery is representative of hospitality-grade inventory we rotate across UAE venues. Availability, finishes and bundled services are confirmed after RFQ review. Mention venue access and timeline when you submit your basket.",
    rating: 4.75,
    reviewCountLabel: "Quote-ready SKU",
    colors: [
      { id: "standard", label: "Standard finish" },
      { id: "alt", label: "Alternate finish (lead time)" },
    ],
    sizes: [
      { id: "base", label: "Catalogue format" },
      { id: "xl", label: "Heavy-duty / extended" },
    ],
    packaging: "QC-checked prior to warehouse dispatch or venue staging.",
    shipping:
      "UAE-wide delivery and installation slots subject to survey. Include dock height and floor loads in your enquiry.",
    specs: {
      height: "Datasheet issued with quotation",
      width: "Datasheet issued with quotation",
      materialLine1: "Commercial hospitality specification",
      materialLine2: "Factory codes matched at order confirmation",
    },
    reviews: [
      {
        name: "Venue Ops Team",
        date: "Apr 2026",
        rating: 5,
        text: "Responsive quoting. Staging matched our PO timeline.",
        initial: "V",
      },
    ],
  };
}

export function getShopProductDetail(idStr: string): ShopProductDetail | null {
  const id = Number(idStr);
  if (!Number.isFinite(id)) return null;
  const card = SHOP_PRODUCT_CARDS.find((p) => p.id === id);
  if (!card) return null;
  const detail = DETAILS[id] ?? defaultShopDetail(card);
  return { ...card, ...detail };
}

export function getAllShopProductIds(): string[] {
  return SHOP_PRODUCT_CARDS.map((p) => String(p.id));
}
