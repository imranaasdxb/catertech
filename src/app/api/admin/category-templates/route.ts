import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { productCategories, productSubcategories } from "@/db/schema";
import {
  DEFAULT_TEMPLATE_FIELDS,
  getCategoryTemplateRow,
  getEffectiveTemplateFields,
  normalizeTemplateFields,
  upsertCategoryTemplate,
  type TemplateFieldDef,
} from "@/lib/category-template";
import { uniqueCategorySlug, uniqueSubcategorySlug } from "@/lib/product-taxonomy";
import { z } from "zod";

const fieldSchema = z.object({
  key: z.string().min(1).max(64),
  label: z.string().min(1).max(120),
  type: z.enum(["text", "textarea", "dimension", "select"]),
  required: z.boolean().optional(),
  unitOptions: z.array(z.string().min(1).max(24)).optional(),
  options: z.array(z.string().min(1).max(120)).optional(),
  sortOrder: z.number().int().min(0).max(999),
});

const putSchema = z.object({
  categoryId: z.string().uuid(),
  subCategoryId: z.union([z.string().uuid(), z.null()]).optional(),
  fields: z.array(fieldSchema).min(1),
});

export async function GET(request: Request) {
  const db = getDb();
  if (!db)
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const url = new URL(request.url);
  const categoryId = url.searchParams.get("categoryId");
  const subCategoryId = url.searchParams.get("subCategoryId");

  if (!categoryId) {
    return NextResponse.json({ error: "categoryId is required" }, { status: 400 });
  }

  const subId = subCategoryId && subCategoryId !== "" ? subCategoryId : null;

  const effective = await getEffectiveTemplateFields(db, categoryId, subId);
  const ownRow = await getCategoryTemplateRow(db, categoryId, subId);

  return NextResponse.json({
    categoryId,
    subCategoryId: subId,
    fields: effective.fields,
    source: effective.source,
    ownFields: ownRow ? normalizeTemplateFields(ownRow.fields) : null,
    defaults: DEFAULT_TEMPLATE_FIELDS,
  });
}

export async function PUT(request: Request) {
  const db = getDb();
  if (!db)
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = putSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { categoryId, fields } = parsed.data;
  const subCategoryId =
    parsed.data.subCategoryId === undefined ? null : parsed.data.subCategoryId;

  const [cat] = await db
    .select({ id: productCategories.id })
    .from(productCategories)
    .where(eq(productCategories.id, categoryId))
    .limit(1);
  if (!cat) return NextResponse.json({ error: "Category not found" }, { status: 404 });

  if (subCategoryId) {
    const [sub] = await db
      .select()
      .from(productSubcategories)
      .where(eq(productSubcategories.id, subCategoryId))
      .limit(1);
    if (!sub || sub.categoryId !== categoryId) {
      return NextResponse.json({ error: "Sub-category not found for this category" }, { status: 400 });
    }
  }

  const row = await upsertCategoryTemplate(
    db,
    categoryId,
    subCategoryId,
    fields as TemplateFieldDef[]
  );

  return NextResponse.json(row);
}
