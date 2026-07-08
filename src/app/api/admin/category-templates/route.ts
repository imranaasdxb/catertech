import { NextResponse } from "next/server";
import {
  DEFAULT_TEMPLATE_FIELDS,
} from "@/lib/category-template";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const categoryId = url.searchParams.get("categoryId");
  const subCategoryId = url.searchParams.get("subCategoryId");

  if (!categoryId) {
    return NextResponse.json({ error: "categoryId is required" }, { status: 400 });
  }

  const subId = subCategoryId && subCategoryId !== "" ? subCategoryId : null;

  return NextResponse.json({
    categoryId,
    subCategoryId: subId,
    fields: DEFAULT_TEMPLATE_FIELDS,
    source: "default",
    ownFields: null,
    defaults: DEFAULT_TEMPLATE_FIELDS,
  });
}

export async function PUT() {
  return NextResponse.json(
    { error: "Category templates are no longer stored." },
    { status: 410 }
  );
}
