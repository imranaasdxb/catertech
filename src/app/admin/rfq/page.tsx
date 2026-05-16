import { desc } from "drizzle-orm";
import { getDb } from "@/db";
import { rfqSubmissions } from "@/db/schema";

export default async function AdminRfqPage() {
  const db = getDb();
  if (!db) return <p className="text-muted">Configure DATABASE_URL.</p>;

  const rows = await db
    .select()
    .from(rfqSubmissions)
    .orderBy(desc(rfqSubmissions.createdAt));

  return (
    <div>
      <h1 className="font-serif text-3xl text-charcoal mb-8">Trade enquiries (RFQ)</h1>
      <div className="space-y-6">
        {rows.map((r) => (
          <article
            key={r.id}
            className="border border-border bg-white p-6 text-sm space-y-3"
          >
            <div className="flex justify-between text-[10px] uppercase tracking-widest text-muted">
              <span>Ref {r.id.slice(0, 8).toUpperCase()}</span>
              <span>{new Date(r.createdAt).toLocaleString()}</span>
            </div>
            <p className="font-medium">{r.companyName}</p>
            <p className="text-muted">
              {r.contactPerson} · {r.email} · {r.phone}
            </p>
            <pre className="text-xs bg-offwhite border border-border p-3 overflow-x-auto whitespace-pre-wrap">
              {JSON.stringify(r.lineItems, null, 2)}
            </pre>
          </article>
        ))}
        {rows.length === 0 ? (
          <p className="text-muted">No trade enquiry (RFQ) submissions yet.</p>
        ) : null}
      </div>
    </div>
  );
}
