import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import {
  contactMessages,
  quotations,
  rfqSubmissions,
  tradeEnquiries,
} from "@/db/schema";

export const dynamic = "force-dynamic";

type NotificationItem = {
  id: string;
  type: "contact" | "quotation" | "enquiry" | "rfq";
  typeLabel: string;
  title: string;
  body: string;
  href: string;
  createdAt: Date;
};

export async function GET() {
  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const [contacts, quotes, enquiries, rfqs] = await Promise.all([
    db
      .select({
        id: contactMessages.id,
        fullName: contactMessages.fullName,
        email: contactMessages.email,
        message: contactMessages.message,
        createdAt: contactMessages.createdAt,
      })
      .from(contactMessages)
      .where(eq(contactMessages.status, "new"))
      .orderBy(desc(contactMessages.createdAt))
      .limit(12),
    db
      .select({
        id: quotations.id,
        customerName: quotations.customerName,
        email: quotations.email,
        company: quotations.company,
        createdAt: quotations.createdAt,
      })
      .from(quotations)
      .where(eq(quotations.status, "new"))
      .orderBy(desc(quotations.createdAt))
      .limit(12),
    db
      .select({
        id: tradeEnquiries.id,
        companyName: tradeEnquiries.companyName,
        contactName: tradeEnquiries.contactName,
        serviceInterest: tradeEnquiries.serviceInterest,
        createdAt: tradeEnquiries.createdAt,
      })
      .from(tradeEnquiries)
      .where(eq(tradeEnquiries.status, "new"))
      .orderBy(desc(tradeEnquiries.createdAt))
      .limit(12),
    db
      .select({
        id: rfqSubmissions.id,
        referenceNo: rfqSubmissions.referenceNo,
        companyName: rfqSubmissions.companyName,
        eventName: rfqSubmissions.eventName,
        createdAt: rfqSubmissions.createdAt,
      })
      .from(rfqSubmissions)
      .where(eq(rfqSubmissions.status, "new"))
      .orderBy(desc(rfqSubmissions.createdAt))
      .limit(12),
  ]);

  const notifications: NotificationItem[] = [
    ...contacts.map((row) => ({
      id: `contact:${row.id}`,
      type: "contact" as const,
      typeLabel: "Contact message",
      title: row.fullName,
      body: row.email || row.message,
      href: "/admin/contacts",
      createdAt: row.createdAt,
    })),
    ...quotes.map((row) => ({
      id: `quotation:${row.id}`,
      type: "quotation" as const,
      typeLabel: "Quotation",
      title: row.customerName,
      body: row.company || row.email,
      href: "/admin/quotations",
      createdAt: row.createdAt,
    })),
    ...enquiries.map((row) => ({
      id: `enquiry:${row.id}`,
      type: "enquiry" as const,
      typeLabel: "Trade enquiry",
      title: row.companyName,
      body: row.serviceInterest || row.contactName,
      href: "/admin/enquiries",
      createdAt: row.createdAt,
    })),
    ...rfqs.map((row) => ({
      id: `rfq:${row.id}`,
      type: "rfq" as const,
      typeLabel: "Events RFQ",
      title: row.eventName,
      body: row.companyName || row.referenceNo,
      href: "/admin/rfq",
      createdAt: row.createdAt,
    })),
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return NextResponse.json({ notifications: notifications.slice(0, 24) });
}
