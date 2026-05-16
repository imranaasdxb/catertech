import { desc } from "drizzle-orm";
import { getDb } from "@/db";
import { contactMessages } from "@/db/schema";

export default async function AdminContactsPage() {
  const db = getDb();
  if (!db) return <p className="text-muted">Configure DATABASE_URL.</p>;

  const rows = await db
    .select()
    .from(contactMessages)
    .orderBy(desc(contactMessages.createdAt));

  return (
    <div>
      <h1 className="font-serif text-3xl text-charcoal mb-8">Contacts</h1>
      <div className="space-y-4">
        {rows.map((r) => (
          <article
            key={r.id}
            className="border border-border bg-white p-6 space-y-2 text-sm"
          >
            <div className="flex justify-between text-[10px] uppercase tracking-widest text-muted">
              <span>{r.status}</span>
              <span>{new Date(r.createdAt).toLocaleString()}</span>
            </div>
            <p className="font-medium text-charcoal">{r.fullName}</p>
            <p className="text-muted">{r.email}{r.phone ? ` · ${r.phone}` : ""}</p>
            <p className="leading-relaxed">{r.message}</p>
          </article>
        ))}
        {rows.length === 0 ? (
          <p className="text-muted">No messages yet.</p>
        ) : null}
      </div>
    </div>
  );
}
