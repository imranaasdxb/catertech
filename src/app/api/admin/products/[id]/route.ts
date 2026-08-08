import { and, eq, ne } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { products, productTitlePresets, type ProductAttributeValue } from "@/db/schema";
import { cleanPresetProductTitle } from "@/lib/catalog/canonical-catalog";
import {
  buildCategoryDisplayLabel,
  validateSubcategoryForCategory,
} from "@/lib/product-taxonomy";
import { generateProductSeo } from "@/lib/product-seo";
import { normalizePricePerDayAed } from "@/lib/product-pricing";
import { resolveProductPresetMatch } from "@/lib/product-preset-match";
import { slugify } from "@/lib/slug";
import { z } from "zod";

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  pricePerDayAed: z.union([z.string().max(40), z.null()]).optional(),
  categoryId: z.union([z.string().uuid(), z.null()]).optional(),
  subCategoryId: z.union([z.string().uuid(), z.null()]).optional(),
  productTitlePresetId: z.union([z.string().uuid(), z.null()]).optional(),
  images: z.array(z.string()).optional(),
  isAvailable: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  published: z.boolean().optional(),
  attributes: z.record(z.string(), z.unknown()).optional(),
  seoTitle: z.string().trim().max(80).nullable().optional(),
  seoDescription: z.string().trim().max(180).nullable().optional(),
  searchKeywords: z.array(z.string().trim().min(1).max(80)).optional(),
  canonicalProductId: z.union([z.string().uuid(), z.null()]).optional(),
});

function replaceText(value: string | null, from: string | null | undefined, to: string | null | undefined) {
  const source = from?.trim();
  const target = to?.trim();
  if (!value || !source || !target || source === target) return value;
  return value.split(source).join(target);
}

function categoryParts(value: string | null | undefined) {
  return (value ?? "")
    .split(/›|â€º|>/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const db = getDb();
  if (!db)
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const [row] = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1);

  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(row);
}

export async function PUT(
  request: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const db = getDb();
  if (!db)
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const d = parsed.data;

  const [row] = await db.select().from(products).where(eq(products.id, id));
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const nextCat =
    d.categoryId !== undefined ? d.categoryId : row.categoryId ?? null;
  let nextSub =
    d.subCategoryId !== undefined ? d.subCategoryId : row.subCategoryId ?? null;

  if (
    d.categoryId !== undefined &&
    d.categoryId !== row.categoryId &&
    d.subCategoryId === undefined
  ) {
    nextSub = null;
  }

  if (!nextCat) nextSub = null;

  const title = d.title ?? row.title;
  const pricePerDayAed =
    d.pricePerDayAed !== undefined
      ? normalizePricePerDayAed(d.pricePerDayAed ?? "")
      : row.pricePerDayAed;
  const nextAttributes =
    d.attributes !== undefined
      ? (d.attributes as Record<string, ProductAttributeValue>)
      : (row.attributes as Record<string, ProductAttributeValue>);

  let productTitlePresetId =
    d.productTitlePresetId !== undefined
      ? d.productTitlePresetId
      : row.productTitlePresetId;

  const presetLinkageChanged =
    (d.title !== undefined && d.title !== row.title) ||
    (d.categoryId !== undefined && d.categoryId !== row.categoryId) ||
    (d.subCategoryId !== undefined && d.subCategoryId !== row.subCategoryId) ||
    (d.attributes !== undefined &&
      JSON.stringify(d.attributes) !== JSON.stringify(row.attributes));

  if (presetLinkageChanged && d.productTitlePresetId === undefined) {
    productTitlePresetId = null;
    if (nextCat) {
      const categoryPresets = await db
        .select({
          id: productTitlePresets.id,
          title: productTitlePresets.title,
          sourceLabel: productTitlePresets.sourceLabel,
          subCategoryId: productTitlePresets.subCategoryId,
          attributes: productTitlePresets.attributes,
          pricePerDayAed: productTitlePresets.pricePerDayAed,
        })
        .from(productTitlePresets)
        .where(eq(productTitlePresets.categoryId, nextCat));

      const match = resolveProductPresetMatch(
        {
          title,
          productTitlePresetId: null,
          attributes: nextAttributes,
          subCategoryId: nextSub,
        },
        categoryPresets.map((preset) => ({
          ...preset,
          attributes: preset.attributes as Record<string, ProductAttributeValue>,
        }))
      );
      if (match) productTitlePresetId = match.id;
    }
  }

  if (productTitlePresetId && nextCat) {
    const [preset] = await db
      .select({
        id: productTitlePresets.id,
        categoryId: productTitlePresets.categoryId,
        subCategoryId: productTitlePresets.subCategoryId,
      })
      .from(productTitlePresets)
      .where(eq(productTitlePresets.id, productTitlePresetId))
      .limit(1);

    if (!preset) {
      return NextResponse.json(
        { error: "Selected title preset was not found." },
        { status: 400 }
      );
    }
  }

  const subCheck = await validateSubcategoryForCategory(db, nextCat, nextSub);
  if (!subCheck.ok) {
    return NextResponse.json({ error: subCheck.message }, { status: 400 });
  }

  if (!productTitlePresetId && nextCat) {
    const [sameSourcePreset] = await db
      .select({ id: productTitlePresets.id })
      .from(productTitlePresets)
      .where(
        and(
          eq(productTitlePresets.categoryId, nextCat),
          eq(productTitlePresets.sourceLabel, title)
        )
      )
      .limit(1);

    if (sameSourcePreset) {
      productTitlePresetId = sameSourcePreset.id;
    } else {
      const [createdPreset] = await db
        .insert(productTitlePresets)
        .values({
          categoryId: nextCat,
          subCategoryId: nextSub,
          title: cleanPresetProductTitle(title),
          sourceLabel: title,
          pricePerDayAed,
          attributes: nextAttributes,
        })
        .returning({ id: productTitlePresets.id });

      productTitlePresetId = createdPreset.id;
    }

    await db
      .update(productTitlePresets)
      .set({
        categoryId: nextCat,
        subCategoryId: nextSub,
        title: cleanPresetProductTitle(title),
        sourceLabel: title,
        pricePerDayAed,
        attributes: nextAttributes,
        updatedAt: new Date(),
      })
      .where(eq(productTitlePresets.id, productTitlePresetId));
  } else if (productTitlePresetId && nextCat) {
    const [sameSourcePreset] = await db
      .select({ id: productTitlePresets.id })
      .from(productTitlePresets)
      .where(
        and(
          eq(productTitlePresets.categoryId, nextCat),
          eq(productTitlePresets.sourceLabel, title),
          ne(productTitlePresets.id, productTitlePresetId)
        )
      )
      .limit(1);

    if (sameSourcePreset) {
      productTitlePresetId = sameSourcePreset.id;
    }

    await db
      .update(productTitlePresets)
      .set({
        categoryId: nextCat,
        subCategoryId: nextSub,
        title: cleanPresetProductTitle(title),
        sourceLabel: title,
        pricePerDayAed,
        attributes: nextAttributes,
        updatedAt: new Date(),
      })
      .where(eq(productTitlePresets.id, productTitlePresetId));
  }

  const categoryLabelRaw = await buildCategoryDisplayLabel(db, nextCat, nextSub);
  const categoryLabel =
    categoryLabelRaw === null &&
    nextCat === null &&
    nextSub === null &&
    row.categoryId === null &&
    row.subCategoryId === null
      ? row.category
      : categoryLabelRaw;

  let nextSlug = row.slug;
  if (d.title !== undefined && d.title !== row.title) {
    const base = slugify(d.title);
    nextSlug = base;
    let n = 0;
    while (n < 20) {
      const clash = await db
        .select({ id: products.id })
        .from(products)
        .where(and(eq(products.slug, nextSlug), ne(products.id, id)))
        .limit(1);
      if (!clash.length) break;
      n += 1;
      nextSlug = `${base}-${n}`;
    }
  }
  const oldCategoryParts = categoryParts(row.category);
  const newCategoryParts = categoryParts(categoryLabel);
  const submittedDescription =
    d.description !== undefined ? d.description : row.description;
  const description =
    d.description !== undefined && d.description === row.description
      ? replaceText(
          replaceText(
            replaceText(submittedDescription, row.title, title),
            oldCategoryParts[0],
            newCategoryParts[0]
          ),
          oldCategoryParts[1],
          newCategoryParts[1]
        )
      : submittedDescription;
  const generatedSeo = generateProductSeo({
    title,
    categoryName: newCategoryParts[0] ?? null,
    subCategoryName: newCategoryParts[1] ?? null,
    description,
    attributes: nextAttributes,
  });
  const seoSourceChanged =
    presetLinkageChanged ||
    d.description !== undefined ||
    d.categoryId !== undefined ||
    d.subCategoryId !== undefined;

  const [updated] = await db
    .update(products)
    .set({
      title,
      slug: nextSlug,
      description,
      pricePerDayAed,
      category: categoryLabel,
      categoryId: nextCat,
      subCategoryId: nextSub,
      productTitlePresetId,
      images: d.images !== undefined ? d.images : row.images,
      isAvailable: d.isAvailable ?? row.isAvailable,
      isFeatured: d.isFeatured ?? row.isFeatured,
      published: d.published ?? row.published,
      attributes: nextAttributes,
      seoTitle:
        d.seoTitle !== undefined
          ? d.seoTitle || generatedSeo.seoTitle
          : seoSourceChanged
            ? generatedSeo.seoTitle
            : row.seoTitle,
      seoDescription:
        d.seoDescription !== undefined
          ? d.seoDescription || generatedSeo.seoDescription
          : seoSourceChanged
            ? generatedSeo.seoDescription
            : row.seoDescription,
      searchKeywords:
        d.searchKeywords !== undefined
          ? d.searchKeywords.length
            ? d.searchKeywords
            : generatedSeo.searchKeywords
          : seoSourceChanged
            ? generatedSeo.searchKeywords
            : row.searchKeywords,
      canonicalProductId:
        d.canonicalProductId !== undefined ? d.canonicalProductId : row.canonicalProductId,
      updatedAt: new Date(),
    })
    .where(eq(products.id, id))
    .returning();

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const db = getDb();
  if (!db)
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const deleted = await db
    .delete(products)
    .where(eq(products.id, id))
    .returning({ id: products.id });

  if (!deleted.length)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
