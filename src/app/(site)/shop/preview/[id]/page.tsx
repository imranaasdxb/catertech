import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getDb } from "@/db";
import { products, type ProductAttributeValue } from "@/db/schema";
import { isAdminGuestAuthed } from "@/lib/admin-guest-auth";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata: Metadata = {
  title: "Product preview | CaterTech",
  robots: { index: false, follow: false },
};

function formatAttributeValue(attribute: ProductAttributeValue) {
  if (typeof attribute === "string") return attribute;
  return `${attribute.value}${attribute.unit ? ` ${attribute.unit}` : ""}`;
}

/** Catalogue preview for logged-in admin only (guest cookie). */
export default async function AdminProductPreviewPage({ params, searchParams }: Props) {
  if (!(await isAdminGuestAuthed())) notFound();

  const [{ id }] = await Promise.all([params, searchParams]);
  const db = getDb();
  if (!db) notFound();

  const [p] = await db.select().from(products).where(eq(products.id, id)).limit(1);
  if (!p) notFound();

  const imgs = p.images?.length ? p.images : [];
  const attributes = Object.entries(p.attributes ?? {});

  return (
    <div className="bg-offwhite min-h-[50vh] pb-20">
      <div className="border-b border-amber-200 bg-amber-50 text-amber-950 px-5 py-3 text-center text-sm">
        Admin product preview {!p.published ? "(not published on live flows)" : null}
        {" · "}
        <Link href={`/admin/products/${p.id}`} className="font-semibold underline">
          Edit
        </Link>
      </div>
      <section className="pt-16 pb-10 border-b border-border bg-navy text-white">
        <div className="max-w-5xl mx-auto px-5 md:px-8">
          {p.category ? (
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-sand/90 mb-3">
              {p.category}
            </p>
          ) : null}
          <h1 className="font-serif text-3xl md:text-4xl leading-tight">{p.title}</h1>
        </div>
      </section>
      <div className="max-w-5xl mx-auto px-5 md:px-8 py-10 grid md:grid-cols-2 gap-8">
        <div className="space-y-3">
          {imgs.length ? (
            imgs.map((src) => (
              <div key={src} className="rounded-lg border border-border overflow-hidden bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="w-full object-cover max-h-80" />
              </div>
            ))
          ) : (
            <p className="text-muted text-sm border border-dashed border-border rounded-lg p-8 text-center">
              No gallery images
            </p>
          )}
        </div>
        <div>
          {p.description ? (
            <div
              className="prose-content text-charcoal text-sm leading-relaxed [&_img]:max-w-full [&_video]:max-w-full"
              dangerouslySetInnerHTML={{ __html: p.description }}
            />
          ) : (
            <p className="text-muted text-sm">No description.</p>
          )}
          {attributes.length ? (
            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-border pt-6">
              {attributes.map(([key, value]) => (
                <div key={key}>
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                    {key.replace(/_/g, " ")}
                  </dt>
                  <dd className="mt-1 text-sm text-charcoal">{formatAttributeValue(value)}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </div>
    </div>
  );
}
