import { count, eq } from "drizzle-orm";

import { AdminDashboardView } from "@/components/admin/AdminDashboardView";
import { getDb } from "@/db";
import {
  contactMessages,
  products,
  quotations,
  rfqSubmissions,
  tradeEnquiries,
} from "@/db/schema";

export default async function AdminDashboardPage() {
  const db = getDb();

  if (!db) {
    return (
      <div className="font-sans">
        <h1 className="mb-2 text-3xl font-bold text-admin-ink">Dashboard</h1>
        <p className="max-w-md text-sm leading-relaxed text-admin-ink/50">
          Set{" "}
          <code className="rounded-md bg-admin-bg px-1.5 py-0.5 text-admin-ink">
            DATABASE_URL
          </code>{" "}
          in{" "}
          <code className="rounded-md bg-admin-bg px-1.5 py-0.5 text-admin-ink">
            .env.local
          </code>{" "}
          and run{" "}
          <code className="rounded-md bg-admin-bg px-1.5 py-0.5 text-admin-ink">
            npx drizzle-kit push
          </code>{" "}
          to create tables in Neon.
        </p>
      </div>
    );
  }

  const [
    productCount,
    messageCount,
    enquiryCount,
    rfqCount,
    quoteCount,
    newContacts,
    newQuotes,
  ] = await Promise.all([
    db.select({ c: count() }).from(products).then((r) => r[0].c),
    db.select({ c: count() }).from(contactMessages).then((r) => r[0].c),
    db.select({ c: count() }).from(tradeEnquiries).then((r) => r[0].c),
    db.select({ c: count() }).from(rfqSubmissions).then((r) => r[0].c),
    db.select({ c: count() }).from(quotations).then((r) => r[0].c),
    db
      .select({ c: count() })
      .from(contactMessages)
      .where(eq(contactMessages.status, "new"))
      .then((r) => r[0].c),
    db
      .select({ c: count() })
      .from(quotations)
      .where(eq(quotations.status, "new"))
      .then((r) => r[0].c),
  ]);

  return (
    <AdminDashboardView
      productCount={productCount}
      messageCount={messageCount}
      enquiryCount={enquiryCount}
      rfqCount={rfqCount}
      quoteCount={quoteCount}
      newContacts={newContacts}
      newQuotes={newQuotes}
    />
  );
}
