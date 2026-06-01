import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { productCategories, productSubcategories } from "@/db/schema";
import { upsertCategoryTemplate, DEFAULT_TEMPLATE_FIELDS } from "@/lib/category-template";
import { uniqueCategorySlug, uniqueSubcategorySlug } from "@/lib/product-taxonomy";

const CATER_TECH_CATALOG: {
  name: string;
  subcategories?: string[];
}[] = [
  { name: "Furniture", subcategories: ["Tables", "Chairs", "Banquet seating"] },
  { name: "Glassware", subcategories: ["Wine glasses", "Water glasses", "Cocktail glasses"] },
  { name: "Dining Cutlery", subcategories: ["Forks", "Knives", "Spoons"] },
  {
    name: "Heavy Kitchen Equipment",
    subcategories: ["Ovens", "Ranges", "Fryers", "Grills"],
  },
  { name: "Kitchen Utensils", subcategories: ["Pots & pans", "Knives", "Tools"] },
  { name: "Dining Crockery", subcategories: ["Plates", "Bowls", "Serving dishes"] },
  { name: "Service Crockery", subcategories: ["Platters", "Bowls", "Serving trays"] },
  { name: "Buffet Equipment", subcategories: ["Chafing dishes", "Display stands", "Fuel holders"] },
  { name: "Bar Equipment", subcategories: ["Blenders", "Ice bins", "Bar stations"] },
  { name: "Premium Cutlery", subcategories: ["Steak knives", "Serving sets", "Specialty pieces"] },
  {
    name: "Vehicles",
    subcategories: ["Trucks", "Chiller vans", "Delivery vans"],
  },
  { name: "Linen & Textiles", subcategories: ["Tablecloths", "Napkins", "Chair covers"] },
  {
    name: "Chafing Dishes & Food Warmers",
    subcategories: ["Electric warmers", "Fuel chafers", "Roll-top lids"],
  },
  {
    name: "Cooling & Refrigeration",
    subcategories: ["Display fridges", "Walk-in coolers", "Ice machines"],
  },
];

export async function POST() {
  const db = getDb();
  if (!db)
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  let categoriesCreated = 0;
  let subcategoriesCreated = 0;
  let templatesCreated = 0;

  for (let i = 0; i < CATER_TECH_CATALOG.length; i += 1) {
    const item = CATER_TECH_CATALOG[i];
    const existing = await db
      .select()
      .from(productCategories)
      .where(eq(productCategories.name, item.name))
      .limit(1);

    let categoryId: string;
    if (existing.length) {
      categoryId = existing[0].id;
    } else {
      const slug = await uniqueCategorySlug(db, item.name);
      const [row] = await db
        .insert(productCategories)
        .values({ name: item.name, slug, sortOrder: i })
        .returning();
      categoryId = row.id;
      categoriesCreated += 1;
    }

    await upsertCategoryTemplate(db, categoryId, null, DEFAULT_TEMPLATE_FIELDS);
    templatesCreated += 1;

    for (let j = 0; j < (item.subcategories ?? []).length; j += 1) {
      const subName = item.subcategories![j];
      const subExisting = await db
        .select()
        .from(productSubcategories)
        .where(eq(productSubcategories.categoryId, categoryId));

      if (subExisting.some((s) => s.name === subName)) continue;

      const slug = await uniqueSubcategorySlug(db, categoryId, subName);
      await db.insert(productSubcategories).values({
        categoryId,
        name: subName,
        slug,
        sortOrder: j,
      });
      subcategoriesCreated += 1;
    }
  }

  return NextResponse.json({
    ok: true,
    categoriesCreated,
    subcategoriesCreated,
    templatesCreated,
    totalCategories: CATER_TECH_CATALOG.length,
  });
}
