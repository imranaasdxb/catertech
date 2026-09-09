import { NextResponse } from "next/server";
import { getCatalogueProductData } from "@/lib/catalogue-presets";
import { z } from "zod";

const querySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(60).default(12),
  categoryId: z.string().uuid().optional(),
  subcategories: z.string().trim().max(500).default(""),
  search: z.string().trim().max(160).default(""),
  highlight: z.enum(["all", "Popular", "New"]).default("all"),
  sortOrder: z.enum(["default", "a-z"]).default("default"),
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = querySchema.safeParse({
    page: url.searchParams.get("page") || undefined,
    pageSize: url.searchParams.get("pageSize") || undefined,
    categoryId: url.searchParams.get("categoryId") || undefined,
    subcategories: url.searchParams.get("subcategories") || undefined,
    search: url.searchParams.get("search") || undefined,
    highlight: url.searchParams.get("highlight") || undefined,
    sortOrder: url.searchParams.get("sortOrder") || undefined,
  });

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { subcategories, ...query } = parsed.data;
  const data = await getCatalogueProductData({
    ...query,
    subcategoryNames: subcategories
      ? subcategories.split(",").map((item) => item.trim()).filter(Boolean)
      : [],
  });

  if (data.catalogError) {
    return NextResponse.json({ error: data.catalogError }, { status: 503 });
  }

  return NextResponse.json({
    products: data.products,
    pagination: data.pagination,
  });
}
