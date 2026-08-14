import type {
  ProductAttributeValue,
  TemplateFieldDef,
} from "@/lib/category-template";

type FurniturePreset = {
  title: string;
  sourceLabel: string;
  subcategory: string;
  attributes?: Record<string, ProductAttributeValue>;
};

const measure = (value: string, unit = "cm"): ProductAttributeValue => ({
  value,
  unit,
});

export const FURNITURE_SUBCATEGORIES = [
  "Tables",
  "Chairs & Seating",
  "Bar Counters",
  "Beds & Cots",
  "Podiums",
  "Stages",
  "Canopies & Partitions",
  "Trolleys",
  "Other Furniture",
] as const;

export const FURNITURE_TEMPLATE_FIELDS: TemplateFieldDef[] = [
  { key: "length", label: "Length", type: "dimension", unitOptions: ["cm", "m", "ft"], sortOrder: 0 },
  { key: "width", label: "Width", type: "dimension", unitOptions: ["cm", "m", "ft"], sortOrder: 1 },
  { key: "height", label: "Height", type: "dimension", unitOptions: ["cm", "m", "ft"], sortOrder: 2 },
  { key: "diameter", label: "Diameter", type: "dimension", unitOptions: ["cm", "m", "ft"], sortOrder: 3 },
  { key: "shape", label: "Shape", type: "text", sortOrder: 4 },
  { key: "material", label: "Material", type: "text", sortOrder: 5 },
  { key: "color", label: "Color", type: "text", sortOrder: 6 },
  { key: "set_details", label: "Set details", type: "text", sortOrder: 7 },
  { key: "additional_details", label: "Additional details", type: "textarea", sortOrder: 8 },
];

export const FURNITURE_PRESETS: FurniturePreset[] = [
  { title: "S Shape Table Set", sourceLabel: '"S" Shape Table, Set', subcategory: "Tables", attributes: { shape: "S Shape", set_details: "Set" } },
  { title: "Round Table", sourceLabel: "5 ft Round Table", subcategory: "Tables", attributes: { diameter: measure("5", "ft"), shape: "Round" } },
  { title: "Round Table", sourceLabel: "6 ft Round Table", subcategory: "Tables", attributes: { diameter: measure("6", "ft"), shape: "Round" } },
  { title: "Square Table", sourceLabel: "76 x 76 cm Square Table", subcategory: "Tables", attributes: { length: measure("76"), width: measure("76"), shape: "Square" } },
  { title: "Square Table", sourceLabel: "90 x 90 cm Square Table", subcategory: "Tables", attributes: { length: measure("90"), width: measure("90"), shape: "Square" } },
  { title: "Square Table", sourceLabel: "90 x 90 cm Square Table (Fiber)", subcategory: "Tables", attributes: { length: measure("90"), width: measure("90"), shape: "Square", material: "Fiber" } },
  { title: "Acrylic Chair", sourceLabel: "Acrylic Chair (Flat)", subcategory: "Chairs & Seating", attributes: { material: "Acrylic", shape: "Flat" } },
  { title: "Acrylic Chair", sourceLabel: "Acrylic Chair (Oval)", subcategory: "Chairs & Seating", attributes: { material: "Acrylic", shape: "Oval" } },
  { title: "Baby Cot", sourceLabel: "Baby Cot L-120 x W-65 x H-80 cm", subcategory: "Beds & Cots", attributes: { length: measure("120"), width: measure("65"), height: measure("80") } },
  { title: "Rectangle Bar Counter", sourceLabel: "Rectangle Bar Counter 200 x 66 cm", subcategory: "Bar Counters", attributes: { length: measure("200"), width: measure("66"), shape: "Rectangle" } },
  { title: "L Shape Bar Counter", sourceLabel: 'White "L" Shape Bar Counter 200 x 66 cm', subcategory: "Bar Counters", attributes: { length: measure("200"), width: measure("66"), shape: "L Shape", color: "White" } },
  { title: "Curve Bar Counter", sourceLabel: "White Curve Bar Counter 244 x 66 cm", subcategory: "Bar Counters", attributes: { length: measure("244"), width: measure("66"), shape: "Curve", color: "White" } },
  { title: "Leather Bar Stool", sourceLabel: "White Leather Bar Stool H-82 cm", subcategory: "Chairs & Seating", attributes: { height: measure("82"), material: "Leather", color: "White" } },
  { title: "Chair", sourceLabel: "Blue Chair", subcategory: "Chairs & Seating", attributes: { color: "Blue" } },
  { title: "Chair With Arm", sourceLabel: "Blue Chair With Arm", subcategory: "Chairs & Seating", attributes: { color: "Blue", additional_details: "With arm" } },
  { title: "Canopy Set", sourceLabel: "Canopy Set", subcategory: "Canopies & Partitions", attributes: { set_details: "Set" } },
  { title: "Chiavari Chair", sourceLabel: "White Chiavari Chair", subcategory: "Chairs & Seating", attributes: { color: "White" } },
  { title: "Chiavari Chair", sourceLabel: "Golden Chiavari Chair", subcategory: "Chairs & Seating", attributes: { color: "Golden" } },
  { title: "Chiavari Chair", sourceLabel: "Silver Chiavari Chair", subcategory: "Chairs & Seating", attributes: { color: "Silver" } },
  { title: "Golden Wire Cocktail Table", sourceLabel: "Golden Wire Cocktail Table H-110 x D-70 cm", subcategory: "Tables", attributes: { height: measure("110"), diameter: measure("70"), color: "Golden", material: "Wire" } },
  { title: "Conference Table", sourceLabel: "Conference Table 185 x 45 cm", subcategory: "Tables", attributes: { length: measure("185"), width: measure("45") } },
  { title: "Dior Chair", sourceLabel: "Dior Chair", subcategory: "Chairs & Seating" },
  { title: "Extra Bed", sourceLabel: "Extra Bed L-192 x W-95 x H-59 cm, Mattress 15 cm", subcategory: "Beds & Cots", attributes: { length: measure("192"), width: measure("95"), height: measure("59"), additional_details: "Mattress thickness: 15 cm" } },
  { title: "Foldable Cocktail Table", sourceLabel: "Foldable Cocktail Table 100 x 70 cm", subcategory: "Tables", attributes: { height: measure("100"), diameter: measure("70"), additional_details: "Foldable" } },
  { title: "Golden Wire Cocktail Table", sourceLabel: "Golden Wire Cocktail Table 110 x 70 cm", subcategory: "Tables", attributes: { height: measure("110"), diameter: measure("70"), color: "Golden", material: "Wire" } },
  { title: "Half Moon Table", sourceLabel: "Half Moon Table", subcategory: "Tables", attributes: { shape: "Half Moon" } },
  { title: "Intermetal Cocktail Table", sourceLabel: "Intermetal Cocktail Table 110 x 70 cm", subcategory: "Tables", attributes: { height: measure("110"), diameter: measure("70"), material: "Metal" } },
  { title: "King Chair", sourceLabel: "Blue King Chair", subcategory: "Chairs & Seating", attributes: { color: "Blue" } },
  { title: "King Chair", sourceLabel: "Red King Chair", subcategory: "Chairs & Seating", attributes: { color: "Red" } },
  { title: "Leather Chair With Wheel", sourceLabel: "Black Leather Chair With Wheel", subcategory: "Chairs & Seating", attributes: { material: "Leather", color: "Black", additional_details: "With wheel" } },
  { title: "LED Bar Counter", sourceLabel: "LED Bar Counter 137 x 40 cm", subcategory: "Bar Counters", attributes: { length: measure("137"), width: measure("40"), additional_details: "LED" } },
  { title: "LED Cocktail Table", sourceLabel: "LED Cocktail Table 100 x 70 cm", subcategory: "Tables", attributes: { height: measure("100"), diameter: measure("70"), additional_details: "LED" } },
  { title: "Portable Stage", sourceLabel: "Portable Stage L-245 x W-183 x H-60 cm", subcategory: "Stages", attributes: { length: measure("245"), width: measure("183"), height: measure("60"), additional_details: "Portable" } },
  { title: "Quarter Table", sourceLabel: "Quarter Table", subcategory: "Tables", attributes: { shape: "Quarter" } },
  { title: "Rectangle Table", sourceLabel: "Rectangle Table 183 x 76 cm (Fiber)", subcategory: "Tables", attributes: { length: measure("183"), width: measure("76"), shape: "Rectangle", material: "Fiber" } },
  { title: "Rectangle Table", sourceLabel: "Rectangle Table 183 x 76 cm", subcategory: "Tables", attributes: { length: measure("183"), width: measure("76"), shape: "Rectangle" } },
  { title: "Rectangle Table", sourceLabel: "Rectangle Table 240 x 90 cm (Fiber)", subcategory: "Tables", attributes: { length: measure("240"), width: measure("90"), shape: "Rectangle", material: "Fiber" } },
  { title: "Banqueting Chair", sourceLabel: "Red Banqueting Chair", subcategory: "Chairs & Seating", attributes: { color: "Red" } },
  { title: "Stainless Steel Podium", sourceLabel: "Stainless Steel Podium W-34 x H-110 cm", subcategory: "Podiums", attributes: { width: measure("34"), height: measure("110"), material: "Stainless Steel" } },
  { title: "VIP Chair", sourceLabel: "VIP Chair", subcategory: "Chairs & Seating" },
  { title: "Wooden Cocktail Table", sourceLabel: "Wooden Cocktail Table 100 x 70 cm", subcategory: "Tables", attributes: { height: measure("100"), diameter: measure("70"), material: "Wood" } },
  { title: "Wooden Canopy Trolley", sourceLabel: "Wooden Canopy Trolley", subcategory: "Trolleys", attributes: { material: "Wood" } },
  { title: "Wooden Partition", sourceLabel: "Wooden Partition 2 x 2 m", subcategory: "Canopies & Partitions", attributes: { length: measure("2", "m"), width: measure("2", "m"), material: "Wood" } },
  { title: "Wooden Podium", sourceLabel: "Wooden Podium W-34 x H-110 cm", subcategory: "Podiums", attributes: { width: measure("34"), height: measure("110"), material: "Wood" } },
];
