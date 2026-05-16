import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getDb } from "@/db";
import { products } from "@/db/schema";
import ProductEditClient from "./ProductEditClient";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const db = getDb();
  if (!db) notFound();
  const [row] = await db.select().from(products).where(eq(products.id, id));
  if (!row) notFound();
  return <ProductEditClient product={row} />;
}
