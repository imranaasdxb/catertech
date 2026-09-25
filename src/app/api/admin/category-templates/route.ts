import { NextResponse } from "next/server";
import {
  DEFAULT_TEMPLATE_FIELDS,
} from "@/lib/category-template";
import { getDb } from "@/db";
import { productCategories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { LINEN_TEMPLATE_FIELDS } from "@/lib/product-catalog/linen-presets";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const categoryId = url.searchParams.get("categoryId");
  const subCategoryId = url.searchParams.get("subCategoryId");

  if (!categoryId) {
    return NextResponse.json({ error: "categoryId is required" }, { status: 400 });
  }

  const subId = subCategoryId && subCategoryId !== "" ? subCategoryId : null;
  const db = getDb();
  const [category] = db
    ? await db
        .select({ name: productCategories.name })
        .from(productCategories)
        .where(eq(productCategories.id, categoryId))
        .limit(1)
    : [];
  const fields = category?.name === "Linen" ? LINEN_TEMPLATE_FIELDS : DEFAULT_TEMPLATE_FIELDS;

  return NextResponse.json({
    categoryId,
    subCategoryId: subId,
    fields,
    source: category?.name === "Linen" ? "linen" : "default",
    ownFields: null,
    defaults: fields,
  });
}

export async function PUT() {
  return NextResponse.json(
    { error: "Category templates are no longer stored." },
    { status: 410 }
  );
}
