import type {
  ProductAttributeValue,
  TemplateFieldDef,
} from "@/lib/category-template";

export type CatalogueCategory = {
  name: string;
  aliases?: string[];
  subcategories: string[];
  fields: TemplateFieldDef[];
  classify: (label: string) => string;
};

type Attributes = Record<string, ProductAttributeValue>;

const dimension = (key: string, label: string, sortOrder: number): TemplateFieldDef => ({
  key,
  label,
  type: "dimension",
  unitOptions: ["mm", "cm", "m", "ft"],
  sortOrder,
});

const text = (key: string, label: string, sortOrder: number): TemplateFieldDef => ({
  key,
  label,
  type: "text",
  sortOrder,
});

const details = (sortOrder: number): TemplateFieldDef => ({
  key: "additional_details",
  label: "Additional details",
  type: "textarea",
  sortOrder,
});

const includesAny = (label: string, words: string[]) =>
  words.some((word) => label.toLowerCase().includes(word));

const COMMON_SIZE_FIELDS = [
  dimension("length", "Length", 0),
  dimension("width", "Width", 1),
  dimension("height", "Height", 2),
  dimension("diameter", "Diameter", 3),
];

export const CANONICAL_CATALOGUE: CatalogueCategory[] = [
  {
    name: "Furniture",
    subcategories: [],
    fields: [],
    classify: () => "",
  },
  {
    name: "Glass Ware",
    aliases: ["Glassware"],
    subcategories: [],
    fields: [],
    classify: () => "",
  },
  {
    name: "Ceramic Ware",
    aliases: ["Dining Crockery"],
    subcategories: ["Bowls", "Platters", "Plates", "Cups & Drinkware", "Table Accessories", "Other Ceramic Ware"],
    fields: [...COMMON_SIZE_FIELDS, text("shape", "Shape", 4), text("material", "Material", 5), text("color", "Color", 6), text("style", "Style", 7), details(8)],
    classify: (label) => includesAny(label, ["bowl", "ramiken", "ramekin"]) ? "Bowls"
      : includesAny(label, ["platter"]) ? "Platters"
      : includesAny(label, ["plate"]) ? "Plates"
      : includesAny(label, ["cup", "mug", "tea pot", "coffee pot", "creamer"]) ? "Cups & Drinkware"
      : includesAny(label, ["tray", "stand", "holder", "shaker", "vase", "vas", "ash"]) ? "Table Accessories"
      : "Other Ceramic Ware",
  },
  {
    name: "Stainless Steel Ware",
    aliases: ["Service Crockery"],
    subcategories: ["Platters & Trays", "Bowls & Pots", "Service Tools", "Stands & Accessories", "Other Stainless Steel Ware"],
    fields: [...COMMON_SIZE_FIELDS, text("material", "Material", 4), text("style", "Style", 5), text("components", "Components", 6), details(7)],
    classify: (label) => includesAny(label, ["platter", "tray"]) ? "Platters & Trays"
      : includesAny(label, ["bowl", "pot"]) ? "Bowls & Pots"
      : includesAny(label, ["tong", "whisk", "spatula", "funnel", "scissor"]) ? "Service Tools"
      : includesAny(label, ["stand", "holder", "basket", "divider", "steamer"]) ? "Stands & Accessories"
      : "Other Stainless Steel Ware",
  },
  {
    name: "Dining Cutlery",
    subcategories: ["Forks", "Knives", "Spoons", "Copper Serveware", "Other Dining Cutlery"],
    fields: [dimension("diameter", "Diameter", 0), text("material", "Material", 1), text("color", "Color", 2), text("style", "Style", 3), text("set_details", "Set details", 4), details(5)],
    classify: (label) => includesAny(label, ["fork"]) ? "Forks"
      : includesAny(label, ["knife"]) ? "Knives"
      : includesAny(label, ["spoon"]) ? "Spoons"
      : includesAny(label, ["copper", "thali", "handi", "katori"]) ? "Copper Serveware"
      : "Other Dining Cutlery",
  },
  {
    name: "Buffet Equipment",
    subcategories: ["Chafing Dishes", "Elevations & Displays", "Carving Lamps", "Serving Tools", "Dispensers & Beverage Service", "Buffet Accessories"],
    fields: [...COMMON_SIZE_FIELDS, text("material", "Material", 4), text("color", "Color", 5), text("capacity", "Capacity", 6), text("components", "Components", 7), text("style", "Style", 8), details(9)],
    classify: (label) => includesAny(label, ["chaf", "cheffing"]) ? "Chafing Dishes"
      : includesAny(label, ["elevation", "display", "stand", "sushi counter", "salad bar"]) ? "Elevations & Displays"
      : includesAny(label, ["lamp"]) ? "Carving Lamps"
      : includesAny(label, ["fork", "ladle", "laddel", "spoon", "tong"]) ? "Serving Tools"
      : includesAny(label, ["dispenser", "urn", "flask", "kettle", "dallah"]) ? "Dispensers & Beverage Service"
      : "Buffet Accessories",
  },
  {
    name: "Kitchen Equipment",
    aliases: ["Heavy Kitchen Equipment"],
    subcategories: ["Cooking Equipment", "Refrigeration & Cooling", "Food Preparation", "Beverage Equipment", "Warming & Holding", "Washing & Sinks", "Trolleys & Storage", "Other Kitchen Equipment"],
    fields: [...COMMON_SIZE_FIELDS, text("voltage", "Voltage", 4), text("power", "Power", 5), text("capacity", "Capacity", 6), text("material", "Material", 7), text("brand", "Brand", 8), text("weight", "Weight", 9), text("components", "Components", 10), details(11)],
    classify: (label) => includesAny(label, ["chiller", "freezer", "ice cube", "refriger"]) ? "Refrigeration & Cooling"
      : includesAny(label, ["grinder", "mixer", "crusher", "blender", "cutter", "mincer", "slicer", "washer", "roller", "sheetr", "pulverizer"]) ? "Food Preparation"
      : includesAny(label, ["coffee", "juice", "slush"]) ? "Beverage Equipment"
      : includesAny(label, ["warmer", "hot cabinet", "hot pass", "bain", "cambro"]) ? "Warming & Holding"
      : includesAny(label, ["sink", "dish washing"]) ? "Washing & Sinks"
      : includesAny(label, ["trolly", "trolley", "shelf", "stack"]) ? "Trolleys & Storage"
      : includesAny(label, ["oven", "burner", "grill", "fryer", "griddle", "wok", "cooker", "boiler", "induction", "toaster", "toster", "range", "shawarma", "tandoor", "saj", "steamer", "tilting pan", "waffle", "panene", "hot plate"]) ? "Cooking Equipment"
      : "Other Kitchen Equipment",
  },
  {
    name: "Outdoor Equipment",
    subcategories: ["Cooling & Heating", "Grills & Tandoors", "Machines & Counters", "Carpets & Event Setup", "Waste Bins", "Trolleys & Storage", "Outdoor Accessories"],
    fields: [...COMMON_SIZE_FIELDS, text("voltage", "Voltage", 4), text("power", "Power", 5), text("capacity", "Capacity", 6), text("material", "Material", 7), text("brand", "Brand", 8), text("weight", "Weight", 9), text("style", "Style", 10), details(11)],
    classify: (label) => includesAny(label, ["cooler", "heater", "mist fan", "chiller", "mosquito"]) ? "Cooling & Heating"
      : includesAny(label, ["grill", "tandoor"]) ? "Grills & Tandoors"
      : includesAny(label, ["machine", "counter", "fountain"]) ? "Machines & Counters"
      : includesAny(label, ["carpet", "rope", "pole", "tent", "umbrella", "raffle"]) ? "Carpets & Event Setup"
      : includesAny(label, ["garbage", "bin"]) ? "Waste Bins"
      : includesAny(label, ["trolly", "trolley", "caddy", "box"]) ? "Trolleys & Storage"
      : "Outdoor Accessories",
  },
  {
    name: "Kitchen Utensil",
    aliases: ["Kitchen Utensils"],
    subcategories: ["GN Inserts & Trays", "Pots & Pans", "Knives & Cutlery", "Serving Tools", "Baking & Bar Tools", "Storage & Service", "Shelves & Trolleys", "Other Kitchen Utensils"],
    fields: [...COMMON_SIZE_FIELDS, text("capacity", "Capacity", 4), text("material", "Material", 5), text("color", "Color", 6), text("components", "Components", 7), text("style", "Style", 8), text("set_details", "Set details", 9), details(10)],
    classify: (label) => includesAny(label, ["g.n", "gn insert", "gn tray", "round insert"]) ? "GN Inserts & Trays"
      : includesAny(label, ["pot", "pan", "kadai", "tawa", "parat", "lagan", "daboo", "balti", "saucepan"]) ? "Pots & Pans"
      : includesAny(label, ["knife", "fork", "spoon", "skewer"]) ? "Knives & Cutlery"
      : includesAny(label, ["tong", "ladle", "jara", "palta", "spatula", "stainer", "turner", "scooper", "squeezer"]) ? "Serving Tools"
      : includesAny(label, ["cake", "bar ", "cutter", "rolling pin", "mat"]) ? "Baking & Bar Tools"
      : includesAny(label, ["trolly", "trolley", "shelf", "self"]) ? "Shelves & Trolleys"
      : includesAny(label, ["tray", "bucket", "basket", "board", "box", "flask", "holder", "cover", "divider"]) ? "Storage & Service"
      : "Other Kitchen Utensils",
  },
];

const toMeasure = (value: string, unit: string): ProductAttributeValue => ({
  value,
  unit: unit.toLowerCase(),
});

function firstMatch(label: string, pattern: RegExp) {
  return label.match(pattern)?.[1]?.trim();
}

function measurementMatch(label: string, pattern: RegExp, fallbackUnit?: string) {
  const match = label.match(pattern);
  const unit = match?.[2] ?? fallbackUnit;
  return match && unit ? toMeasure(match[1], unit) : undefined;
}

export function inferPresetAttributes(label: string): Attributes {
  const attributes: Attributes = {};
  const source = label.replace(/\s+/g, " ").trim();

  const sharedDimensionUnit = source.match(/\)\s*(mm|cm|m|ft)\b/i)?.[1]
    ?? source.match(/\b(?:l|length|w|width|b|h|height|dia|diameter|d)\s*[-:=]?\s*\d+(?:\.\d+)?\s*(mm|cm|m|ft)\b/i)?.[1];
  const length = measurementMatch(source, /\b(?:l|length)\s*[-:=]?\s*(\d+(?:\.\d+)?)\s*(mm|cm|m|ft)?\b/i, sharedDimensionUnit);
  const width = measurementMatch(source, /\b(?:w|width|b)\s*[-:=]?\s*(\d+(?:\.\d+)?)\s*(mm|cm|m|ft)?\b/i, sharedDimensionUnit);
  const height = measurementMatch(source, /\b(?:h|height)\s*[-:=]?\s*(\d+(?:\.\d+)?)\s*(mm|cm|m|ft)?\b/i, sharedDimensionUnit);
  const diameter = measurementMatch(source, /\b(?:dia|diameter|d)\s*[-:=]?\s*(\d+(?:\.\d+)?)\s*(mm|cm|m|ft)?\b/i, sharedDimensionUnit);
  const orderedDimensions = source.match(
    /\bdim(?:ension)?s?\s*wx?dx?h\s*\((mm|cm|m|ft)\)\s*[:=-]?\s*(\d+(?:\.\d+)?)\s*[xX*]\s*(\d+(?:\.\d+)?)\s*[xX*]\s*(\d+(?:\.\d+)?)/i
  );
  const paired = source.match(
    /\b(\d+(?:\.\d+)?)\s*[xX*]\s*(\d+(?:\.\d+)?)(?:\s*[xX*]\s*(\d+(?:\.\d+)?))?\s*\)?\s*(mm|cm|m|ft)\b/i
  );
  const unitlessPair = source.match(
    /\(\s*(\d+(?:\.\d+)?)\s*[xX*]\s*(\d+(?:\.\d+)?)\s*\)\s*$/
  );

  if (orderedDimensions) {
    attributes.width = toMeasure(orderedDimensions[2], orderedDimensions[1]);
    attributes.length = toMeasure(orderedDimensions[3], orderedDimensions[1]);
    attributes.height = toMeasure(orderedDimensions[4], orderedDimensions[1]);
  }
  if (length) attributes.length = length;
  if (width) attributes.width = width;
  if (height) attributes.height = height;
  if (diameter) attributes.diameter = diameter;
  if (paired && !attributes.length && !attributes.width) {
    attributes.length = toMeasure(paired[1], paired[4]);
    attributes.width = toMeasure(paired[2], paired[4]);
    if (paired[3]) attributes.height = toMeasure(paired[3], paired[4]);
  }
  if (unitlessPair && !attributes.length && !attributes.width) {
    attributes.length = { value: unitlessPair[1], unit: "" };
    attributes.width = { value: unitlessPair[2], unit: "" };
  }

  const simpleDiameter = source.match(/\b(\d+(?:\.\d+)?)\s*(mm|cm)\b/i);
  if (simpleDiameter && !attributes.length && !attributes.width && !attributes.height && !attributes.diameter) {
    attributes.diameter = toMeasure(simpleDiameter[1], simpleDiameter[2]);
  }

  const material = firstMatch(source, /\bmaterial\s*[-:=]\s*([^,()]+)/i)
    ?? (includesAny(source, ["s.s", "stainless steel"]) ? "Stainless Steel"
      : includesAny(source, ["acrylic"]) ? "Acrylic"
      : includesAny(source, ["aluminium", "alluminium"]) ? "Aluminium"
      : includesAny(source, ["wooden", "wood "]) ? "Wood"
      : includesAny(source, ["copper"]) ? "Copper"
      : includesAny(source, ["ceramic"]) ? "Ceramic"
      : "");
  if (material) attributes.material = material;

  const voltage = firstMatch(source, /\b(\d+(?:\s*[-~]\s*\d+)?)\s*v\b/i);
  const power = firstMatch(source, /\b(\d+(?:\.\d+)?)\s*(kw|w)\b/i);
  const capacity = firstMatch(source, /\b(?:capacity\s*[-:=]?\s*)?(\d+(?:\.\d+)?\s*(?:ltr|litre|ltrs|l\b|kg|pc))/i);
  const brand = firstMatch(source, /\bbrand\s*[-:=]\s*([^,()]+)/i);
  const weight = firstMatch(source, /\b(?:net\s*)?weight\s*[-:=]?\s*(\d+(?:\.\d+)?\s*kg)/i);
  const components = firstMatch(source, /\b(\d+)\s*(?:comp|component|rack|layer|tank|door|burner|tray|slot|nozzle)s?\b/i);
  const style = firstMatch(source, /\btype\s*[-:=]\s*([^,()]+)/i);

  if (voltage) attributes.voltage = `${voltage} V`;
  if (power) attributes.power = `${power} ${source.match(/\b\d+(?:\.\d+)?\s*(kw|w)\b/i)?.[1] ?? "W"}`;
  if (capacity) attributes.capacity = capacity;
  if (brand) attributes.brand = brand;
  if (weight) attributes.weight = weight;
  if (components) attributes.components = components;
  if (style) attributes.style = style;

  if (Object.keys(attributes).length === 0 || source.length > 80) {
    attributes.additional_details = source;
  }

  return attributes;
}

export function normalizedPresetTitle(label: string) {
  return label.replace(/\s+/g, " ").trim();
}

export function cleanPresetProductTitle(label: string) {
  let title = normalizedPresetTitle(label);

  title = title
    .replace(/\s*\(\s*type\s*[-:=][\s\S]*$/i, "")
    .replace(/\s*\(\s*\d+(?:\.\d+)?(?:\s*[-~]\s*\d+(?:\.\d+)?)?\s*(?:v|w|kw|kg|mm|cm|m|ft|ltr|litre)\b.*$/i, "")
    .replace(/\s*(?:[-,.]|\()\s*(?:brand|voltage|volts?|power|capacity|cap|dim(?:ension)?s?|size|material|net weight|weight|water tank|water consumption|made in|color)\b.*$/i, "")
    .replace(/\s*material\s*[-:=].*$/i, "")
    .replace(/\s+\b(?:brand|voltage|volts?|power|capacity|cap|dim(?:ension)?s?|size|material|net weight|weight|water tank|water consumption|made in|color)\s*[-:=].*$/i, "")
    .replace(/\s+\bdim(?:ension)?s?\b.*$/i, "")
    .replace(/\s*(?:[,(]\s*|\s+)\b(?:l|w|h|d|dia|length|width|height|diameter)\s*[-:=]?\s*\d.*$/i, "")
    .replace(/\s+\b(?:l|w|h|d|dia|length|width|height|diameter)\s*[-:=]?\s*\d+(?:\.\d+)?(?:\s*[xX*]\s*\d+(?:\.\d+)?)*\s*(?:mm|cm|m|ft)?\b.*$/i, "")
    .replace(/\s+\(?\s*\d+(?:\.\d+)?\s*[xX*]\s*\d+(?:\.\d+)?(?:\s*[xX*]\s*\d+(?:\.\d+)?)?\s*\)?\s*(?:mm|cm|m|ft)\b.*$/i, "")
    .replace(/\s+\(\s*\d+(?:\.\d+)?\s*[xX*]\s*\d+(?:\.\d+)?\s*\)\s*$/i, "")
    .replace(/\s+\d+(?:\.\d+)?\s*(?:mm|cm|m|ft|ltr|ltrs|litre|litres)\b.*$/i, "")
    .replace(/\s*\((?:\s*(?:material|voltage|volts?|power|capacity|cap|dim(?:ension)?s?|size|net weight|weight|h|w|l|d|dia)\b)[^)]*\)\s*$/i, "")
    .replace(/\s+/g, " ")
    .replace(/\s*[-,]\s*$/, "")
    .trim();

  return title || normalizedPresetTitle(label);
}
