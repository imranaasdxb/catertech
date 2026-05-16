import { count, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import {
  blogPosts,
  contactMessages,
  products,
  quotations,
  rfqSubmissions,
  tradeEnquiries,
} from "@/db/schema";

export async function GET() {
  const db = getDb();
  if (!db) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 503 }
    );
  }

  const [
    productCount,
    blogCount,
    contactCount,
    enquiryCount,
    rfqCount,
    quoteCount,
  ] = await Promise.all([
    db.select({ c: count() }).from(products).then((r) => r[0].c),
    db.select({ c: count() }).from(blogPosts).then((r) => r[0].c),
    db.select({ c: count() }).from(contactMessages).then((r) => r[0].c),
    db.select({ c: count() }).from(tradeEnquiries).then((r) => r[0].c),
    db.select({ c: count() }).from(rfqSubmissions).then((r) => r[0].c),
    db.select({ c: count() }).from(quotations).then((r) => r[0].c),
  ]);

  const newContacts = await db
    .select({ c: count() })
    .from(contactMessages)
    .where(eq(contactMessages.status, "new"))
    .then((r) => r[0].c);

  const newQuotes = await db
    .select({ c: count() })
    .from(quotations)
    .where(eq(quotations.status, "new"))
    .then((r) => r[0].c);

  return NextResponse.json({
    products: productCount,
    blogs: blogCount,
    messages: contactCount,
    enquiries: enquiryCount,
    rfqs: rfqCount,
    quotations: quoteCount,
    newContacts,
    newQuotes,
  });
}
