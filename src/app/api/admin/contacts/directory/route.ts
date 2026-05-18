import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import {
  contactMessages,
  quotations,
  rfqSubmissions,
  tradeEnquiries,
} from "@/db/schema";

export type ContactDirectoryRow = {
  id: string;
  source: "quick_enquiry" | "trade_rfq" | "cart_quotation" | "contact_form";
  sourceLabel: string;
  name: string;
  companyName: string | null;
  email: string;
  phone: string | null;
  address: string | null;
  createdAt: string;
};

const FETCH_LIMIT = 400;

function phoneOrNull(v: string | null | undefined): string | null {
  const t = String(v ?? "").trim();
  return t || null;
}

function toIso(v: Date | string): string {
  if (v instanceof Date) return v.toISOString();
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

export async function GET() {
  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const [quickRows, rfqRows, quoteRows, msgRows] = await Promise.all([
    db
      .select()
      .from(tradeEnquiries)
      .orderBy(desc(tradeEnquiries.createdAt))
      .limit(FETCH_LIMIT),
    db
      .select()
      .from(rfqSubmissions)
      .orderBy(desc(rfqSubmissions.createdAt))
      .limit(FETCH_LIMIT),
    db
      .select()
      .from(quotations)
      .orderBy(desc(quotations.createdAt))
      .limit(FETCH_LIMIT),
    db
      .select()
      .from(contactMessages)
      .orderBy(desc(contactMessages.createdAt))
      .limit(FETCH_LIMIT),
  ]);

  const unified: ContactDirectoryRow[] = [];

  for (const r of quickRows) {
    unified.push({
      id: r.id,
      source: "quick_enquiry",
      sourceLabel: "Quick enquiry",
      name: r.contactName,
      companyName: r.companyName,
      email: r.email,
      phone: phoneOrNull(r.phone),
      address: r.emirate?.trim() || null,
      createdAt: toIso(r.createdAt),
    });
  }

  for (const r of rfqRows) {
    unified.push({
      id: r.id,
      source: "trade_rfq",
      sourceLabel: "Trade enquiry",
      name: r.contactPerson,
      companyName: r.companyName,
      email: r.email,
      phone: phoneOrNull(r.phone),
      address: r.emirate?.trim() || null,
      createdAt: toIso(r.createdAt),
    });
  }

  for (const r of quoteRows) {
    unified.push({
      id: r.id,
      source: "cart_quotation",
      sourceLabel: "Cart / quotation",
      name: r.customerName,
      companyName: r.company ?? null,
      email: r.email,
      phone: phoneOrNull(r.phone),
      address: r.address?.trim() || null,
      createdAt: toIso(r.createdAt),
    });
  }

  for (const r of msgRows) {
    unified.push({
      id: r.id,
      source: "contact_form",
      sourceLabel: "Contact form",
      name: r.fullName,
      companyName: null,
      email: r.email,
      phone: phoneOrNull(r.phone),
      address: null,
      createdAt: toIso(r.createdAt),
    });
  }

  unified.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return NextResponse.json(unified satisfies ContactDirectoryRow[]);
}
