import { desc } from "drizzle-orm";
import { getDb } from "@/db";
import { quotations } from "@/db/schema";
import AdminQuotationsClient, {
  type QuotationAdminRow,
} from "@/components/admin/AdminQuotationsClient";

export const dynamic = "force-dynamic";

export default async function AdminQuotationsPage() {
  const db = getDb();
  if (!db) return <p className="text-muted">Configure DATABASE_URL.</p>;

  const rows = await db
    .select()
    .from(quotations)
    .orderBy(desc(quotations.createdAt));

  const serialized: QuotationAdminRow[] = rows.map((r) => ({
    id: r.id,
    customerName: r.customerName,
    email: r.email,
    phone: r.phone,
    company: r.company,
    address: r.address,
    source: r.source,
    items: r.items,
    message: r.message,
    status: r.status,
    createdAt:
      r.createdAt instanceof Date
        ? r.createdAt.toISOString()
        : String(r.createdAt),
  }));

  return <AdminQuotationsClient rows={serialized} />;
}
