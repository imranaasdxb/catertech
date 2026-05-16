import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getDb } from "@/db";
import { blogPosts } from "@/db/schema";
import BlogEditClient from "./BlogEditClient";

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const db = getDb();
  if (!db) notFound();
  const [row] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
  if (!row) notFound();
  return <BlogEditClient post={row} />;
}
