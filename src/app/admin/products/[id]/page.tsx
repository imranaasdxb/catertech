import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getDb } from "@/db";
import { products } from "@/db/schema";
import ProductEditClient from "./ProductEditClient";

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ id }] = await Promise.all([params, searchParams]);
  const db = getDb();
  if (!db) notFound();
  const [row] = await db.select().from(products).where(eq(products.id, id));
  if (!row) notFound();
  return <ProductEditClient product={row} />;
}
