import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import {
  productTitlePresets,
  type ProductAttributeValue,
} from "@/db/schema";
import { z } from "zod";

const attributeSchema = z.union([
  z.string().max(1000),
  z.object({
    value: z.string().max(240),
    unit: z.string().max(24).optional(),
  }),
]);

const updateSchema = z.object({
  title: z.string().trim().min(1).max(240),
  attributes: z
    .record(z.string().trim().min(1).max(64), attributeSchema)
    .refine((attributes) => Object.keys(attributes).length <= 30, {
      message: "Too many specification fields",
    }),
});

export async function PATCH(
  request: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

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

  const [updated] = await db
    .update(productTitlePresets)
    .set({
      title: parsed.data.title,
      attributes: parsed.data.attributes as Record<string, ProductAttributeValue>,
      updatedAt: new Date(),
    })
    .where(eq(productTitlePresets.id, id))
    .returning({
      id: productTitlePresets.id,
      title: productTitlePresets.title,
      attributes: productTitlePresets.attributes,
    });

  if (!updated) {
    return NextResponse.json({ error: "Preset not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}
