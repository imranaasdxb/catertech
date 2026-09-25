import { eq, or } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import {
  productCategories,
  productSubcategories,
  productTitlePresets,
} from "@/db/schema";
import {
  CANONICAL_CATALOGUE,
  cleanPresetProductTitle,
  inferPresetAttributes,
  normalizedPresetTitle,
} from "@/lib/product-catalog/canonical-catalog";
import {
  FURNITURE_PRESETS,
  FURNITURE_SUBCATEGORIES,
} from "@/lib/product-catalog/furniture-presets";
import {
  GLASSWARE_PRESETS,
  GLASSWARE_SUBCATEGORIES,
} from "@/lib/product-catalog/glassware-presets";
import { LINEN_PRESETS } from "@/lib/product-catalog/linen-presets";
import { uniqueCategorySlug, uniqueSubcategorySlug } from "@/lib/product-taxonomy";
import { z } from "zod";

const importSchema = z.object({
  categories: z.record(z.string(), z.array(z.string().min(1))).refine(
    (categories) => Object.keys(categories).length > 0,
    "At least one category is required"
  ),
});

function readOptionalPresetString(
  preset: unknown,
  key: "subcategory" | "description"
) {
  if (!preset || typeof preset !== "object" || !(key in preset)) return null;
  const value = (preset as Record<typeof key, unknown>)[key];
  return typeof value === "string" ? value : null;
}

export async function POST(request: Request) {
  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const parsed = importSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const imported: {
    category: string;
    productsDeleted: number;
    presets: number;
    subcategories: number;
  }[] = [];
  const canonicalCategoryIds: string[] = [];

  for (let sortOrder = 0; sortOrder < CANONICAL_CATALOGUE.length; sortOrder += 1) {
    const config = CANONICAL_CATALOGUE[sortOrder];
    const aliases = config.aliases ?? [];
    const candidates = [config.name, ...aliases];
    const sourceLabels = parsed.data.categories[config.name];
    const dedicatedPresets =
      config.name === "Furniture"
        ? FURNITURE_PRESETS
        : config.name === "Glass Ware"
          ? GLASSWARE_PRESETS
          : config.name === "Linen"
            ? LINEN_PRESETS
          : null;
    const subcategoryNames =
      config.name === "Furniture"
        ? [...FURNITURE_SUBCATEGORIES]
        : config.name === "Glass Ware"
          ? [...GLASSWARE_SUBCATEGORIES]
          : config.subcategories;

    const existingRows = await db
      .select()
      .from(productCategories)
      .where(
        candidates.length === 1
          ? eq(productCategories.name, candidates[0])
          : or(...candidates.map((name) => eq(productCategories.name, name)))
      );

    let categoryId = existingRows.find((row) => row.name === config.name)?.id
      ?? existingRows[0]?.id;

    if (!categoryId) {
      const slug = await uniqueCategorySlug(db, config.name);
      const [created] = await db
        .insert(productCategories)
        .values({ name: config.name, slug, sortOrder })
        .returning();
      categoryId = created.id;
    } else {
      await db
        .update(productCategories)
        .set({ name: config.name, sortOrder, updatedAt: new Date() })
        .where(eq(productCategories.id, categoryId));
    }

    canonicalCategoryIds.push(categoryId);

    if (!sourceLabels && !dedicatedPresets) continue;

    await db.delete(productTitlePresets).where(eq(productTitlePresets.categoryId, categoryId));
    await db
      .delete(productSubcategories)
      .where(eq(productSubcategories.categoryId, categoryId));

    const subcategoryIds = new Map<string, string>();
    for (let index = 0; index < subcategoryNames.length; index += 1) {
      const name = subcategoryNames[index];
      const slug = await uniqueSubcategorySlug(db, categoryId, name);
      const [subcategory] = await db
        .insert(productSubcategories)
        .values({ categoryId, name, slug, sortOrder: index })
        .returning();
      subcategoryIds.set(name, subcategory.id);
    }

    const uniqueLabels = [...new Set((sourceLabels ?? []).map(normalizedPresetTitle))];
    const rows = dedicatedPresets
      ? dedicatedPresets.map((preset, index) => {
          const subcategory = readOptionalPresetString(preset, "subcategory");
          const description = readOptionalPresetString(preset, "description");
          return {
            categoryId,
            subCategoryId: subcategory ? subcategoryIds.get(subcategory) ?? null : null,
            title: cleanPresetProductTitle(preset.title),
            sourceLabel: preset.sourceLabel,
            description,
            attributes: preset.attributes ?? {},
            sortOrder: index,
          };
        })
      : uniqueLabels.map((sourceLabel, index) => {
          const subcategory = config.classify(sourceLabel);
          return {
            categoryId,
            subCategoryId: subcategoryIds.get(subcategory) ?? null,
            title: cleanPresetProductTitle(sourceLabel),
            sourceLabel,
            description: null,
            attributes: inferPresetAttributes(sourceLabel),
            sortOrder: index,
          };
        });
    await db.insert(productTitlePresets).values(
      rows
    );

    imported.push({
      category: config.name,
      productsDeleted: 0,
      presets: rows.length,
      subcategories: subcategoryNames.length,
    });
  }

  return NextResponse.json({
    ok: true,
    imported,
    unrelatedCategoriesDeleted: 0,
    unrelatedProductsDeleted: 0,
    totalCategories: canonicalCategoryIds.length,
  });
}
