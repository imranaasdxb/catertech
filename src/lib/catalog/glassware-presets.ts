import type {
  ProductAttributeValue,
  TemplateFieldDef,
} from "@/lib/category-template";

type GlasswarePreset = {
  title: string;
  sourceLabel: string;
  subcategory: string;
  attributes?: Record<string, ProductAttributeValue>;
};

const measure = (value: string, unit = "cm"): ProductAttributeValue => ({
  value,
  unit,
});

export const GLASSWARE_SUBCATEGORIES = [
  "Drinking Glasses",
  "Bowls",
  "Table Accessories",
  "Acrylic Glassware",
] as const;

export const GLASSWARE_TEMPLATE_FIELDS: TemplateFieldDef[] = [
  { key: "diameter", label: "Diameter", type: "dimension", unitOptions: ["cm", "m", "ft"], sortOrder: 0 },
  { key: "material", label: "Material", type: "text", sortOrder: 1 },
  { key: "color", label: "Color", type: "text", sortOrder: 2 },
  { key: "style", label: "Style", type: "text", sortOrder: 3 },
  { key: "additional_details", label: "Additional details", type: "textarea", sortOrder: 4 },
];

export const GLASSWARE_PRESETS: GlasswarePreset[] = [
  { title: "Beer Glass", sourceLabel: "Beer Glass", subcategory: "Drinking Glasses", attributes: { material: "Glass" } },
  { title: "Brandy Balloon Glass", sourceLabel: "Brandy Balloon Glass", subcategory: "Drinking Glasses", attributes: { material: "Glass", style: "Balloon" } },
  { title: "Champagne Flute Glass", sourceLabel: "Champagne Flute Glass", subcategory: "Drinking Glasses", attributes: { material: "Glass", style: "Flute" } },
  { title: "Champagne Saucer Glass", sourceLabel: "Champagne Saucer Glass", subcategory: "Drinking Glasses", attributes: { material: "Glass", style: "Saucer" } },
  { title: "Glass Decanter", sourceLabel: "Glass Decanter", subcategory: "Table Accessories", attributes: { material: "Glass" } },
  { title: "Glass Jug", sourceLabel: "Glass Jug", subcategory: "Table Accessories", attributes: { material: "Glass" } },
  { title: "Glass Tea Cup & Saucer", sourceLabel: "Glass Tea Cup & Saucer", subcategory: "Drinking Glasses", attributes: { material: "Glass", style: "Cup & Saucer" } },
  { title: "Hencen Glass", sourceLabel: "Hencen Glass", subcategory: "Drinking Glasses", attributes: { material: "Glass" } },
  { title: "Hi Ball Glass", sourceLabel: "Hi Ball Glass", subcategory: "Drinking Glasses", attributes: { material: "Glass", style: "Hi Ball" } },
  { title: "Juice Glass", sourceLabel: "Juice Glass", subcategory: "Drinking Glasses", attributes: { material: "Glass" } },
  { title: "Margarita Glass", sourceLabel: "Margarita Glass", subcategory: "Drinking Glasses", attributes: { material: "Glass", style: "Margarita" } },
  { title: "Martini Glass", sourceLabel: "Martini Glass", subcategory: "Drinking Glasses", attributes: { material: "Glass", style: "Martini" } },
  { title: "Red Wine Glass", sourceLabel: "Red Wine Glass Long Stem", subcategory: "Drinking Glasses", attributes: { material: "Glass", style: "Long Stem" } },
  { title: "Red Wine Glass", sourceLabel: "Red Wine Glass Normal", subcategory: "Drinking Glasses", attributes: { material: "Glass", style: "Normal" } },
  { title: "Rock / Whisky Glass", sourceLabel: "Rock Glass / Whisky Glass", subcategory: "Drinking Glasses", attributes: { material: "Glass", style: "Rock" } },
  { title: "Tequila Glass", sourceLabel: "Tequila Glass", subcategory: "Drinking Glasses", attributes: { material: "Glass" } },
  { title: "Tea Cutting Glass", sourceLabel: "Tea Cutting Glass", subcategory: "Drinking Glasses", attributes: { material: "Glass" } },
  { title: "Tom Collins Glass", sourceLabel: "Tom Collins Glass", subcategory: "Drinking Glasses", attributes: { material: "Glass", style: "Tom Collins" } },
  { title: "Water Goblet", sourceLabel: "Water Goblet", subcategory: "Drinking Glasses", attributes: { material: "Glass", style: "Goblet" } },
  { title: "White Wine Glass", sourceLabel: "White Wine Glass Long Stem", subcategory: "Drinking Glasses", attributes: { material: "Glass", style: "Long Stem" } },
  { title: "White Wine Glass", sourceLabel: "White Wine Glass Normal", subcategory: "Drinking Glasses", attributes: { material: "Glass", style: "Normal" } },
  { title: "Glass Bowl", sourceLabel: "Glass Bowl 20 cm", subcategory: "Bowls", attributes: { diameter: measure("20"), material: "Glass" } },
  { title: "Glass Bowl", sourceLabel: "Glass Bowl 23 cm", subcategory: "Bowls", attributes: { diameter: measure("23"), material: "Glass" } },
  { title: "Glass Bowl", sourceLabel: "Glass Bowl 26 cm", subcategory: "Bowls", attributes: { diameter: measure("26"), material: "Glass" } },
  { title: "Glass Bowl", sourceLabel: "Glass Bowl 28 cm", subcategory: "Bowls", attributes: { diameter: measure("28"), material: "Glass" } },
  { title: "Glass Bowl", sourceLabel: "Glass Bowl 30 cm", subcategory: "Bowls", attributes: { diameter: measure("30"), material: "Glass" } },
  { title: "Dessert Glass Bowl", sourceLabel: "Dessert Glass Bowl 10 cm", subcategory: "Bowls", attributes: { diameter: measure("10"), material: "Glass" } },
  { title: "Dessert Glass Bowl", sourceLabel: "Dessert Glass Bowl 12 cm", subcategory: "Bowls", attributes: { diameter: measure("12"), material: "Glass" } },
  { title: "Glass Ash Tray", sourceLabel: "Glass Ash Tray", subcategory: "Table Accessories", attributes: { material: "Glass" } },
  { title: "Centerpiece Glass Mirror", sourceLabel: "Centerpiece Glass Mirror Dia-60 cm", subcategory: "Table Accessories", attributes: { diameter: measure("60"), material: "Glass" } },
  { title: "Napkin Ring", sourceLabel: "Golden Napkin Ring", subcategory: "Table Accessories", attributes: { color: "Golden" } },
  { title: "Acrylic Show Plate", sourceLabel: "Acrylic Show Plate", subcategory: "Table Accessories", attributes: { material: "Acrylic" } },
  { title: "Acrylic Champagne Bowl", sourceLabel: "Acrylic Champagne Bowl", subcategory: "Acrylic Glassware", attributes: { material: "Acrylic" } },
  { title: "Acrylic Beer Glass", sourceLabel: "Acrylic Beer Glass", subcategory: "Acrylic Glassware", attributes: { material: "Acrylic" } },
  { title: "Acrylic Champagne Glass", sourceLabel: "Acrylic Champagne Glass", subcategory: "Acrylic Glassware", attributes: { material: "Acrylic" } },
  { title: "Acrylic Hi Ball Glass", sourceLabel: "Acrylic Hi Ball Glass", subcategory: "Acrylic Glassware", attributes: { material: "Acrylic", style: "Hi Ball" } },
  { title: "Acrylic Rock Glass", sourceLabel: "Acrylic Rock Glass", subcategory: "Acrylic Glassware", attributes: { material: "Acrylic", style: "Rock" } },
  { title: "Acrylic White Wine Glass", sourceLabel: "Acrylic White Wine Glass", subcategory: "Acrylic Glassware", attributes: { material: "Acrylic" } },
];
