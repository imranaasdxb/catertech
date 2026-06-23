"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

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

const POLL_MS = 12_000;

function norm(s: string) {
  return s.toLowerCase().trim();
}

function rowMatchesSearch(row: ContactDirectoryRow, q: string) {
  if (!q.trim()) return true;
  const n = norm(q);
  const hay = [
    row.name,
    row.companyName ?? "",
    row.email,
    row.phone ?? "",
    row.address ?? "",
    row.sourceLabel,
    row.source,
  ]
    .join(" ")
    .toLowerCase();
  return hay.includes(n);
}

export default function AdminContactsDirectoryClient({
  dbConfigured,
}: {
  dbConfigured: boolean;
}) {
  const [rows, setRows] = useState<ContactDirectoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState<ContactDirectoryRow["source"] | "all">(
    "all"
  );

  const load = useCallback(async () => {
    if (!dbConfigured) {
      setLoading(false);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/contacts/directory", { cache: "no-store" });
      if (!res.ok) {
        if (res.status === 401) setError("Session expired. Please log in again.");
        else if (res.status === 403) setError("You need superadmin access for Contacts.");
        else setError("Could not load contact directory.");
        setRows([]);
        return;
      }
      const data = (await res.json()) as ContactDirectoryRow[];
      setRows(
        data.map((r) => ({
          ...r,
          phone: r.phone ?? null,
          createdAt:
            typeof r.createdAt === "string"
              ? r.createdAt
              : new Date(String(r.createdAt)).toISOString(),
        }))
      );
    } catch {
      setError("Network error while loading contacts.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [dbConfigured]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!dbConfigured) return;
    const id = window.setInterval(() => void load(), POLL_MS);
    return () => window.clearInterval(id);
  }, [dbConfigured, load]);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (sourceFilter !== "all" && r.source !== sourceFilter) return false;
      if (!rowMatchesSearch(r, search)) return false;
      return true;
    });
  }, [rows, search, sourceFilter]);

  const counts = useMemo(() => {
    const by = (s: ContactDirectoryRow["source"]) =>
      rows.filter((r) => r.source === s).length;
    return {
      total: rows.length,
      quick_enquiry: by("quick_enquiry"),
      trade_rfq: by("trade_rfq"),
      cart_quotation: by("cart_quotation"),
      contact_form: by("contact_form"),
    };
  }, [rows]);

  if (!dbConfigured) {
    return (
      <p className="text-muted text-sm">
        Configure <code className="text-charcoal">DATABASE_URL</code> to load contacts.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl text-charcoal tracking-tight">
            Customer contacts
          </h1>
          <p className="text-muted text-sm mt-2 max-w-2xl leading-relaxed">
            Unified directory from quick enquiries, trade RFQs, cart quotation requests,
            and contact form submissions. Refreshes automatically every few seconds.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <Stat label="Total rows" value={counts.total} />
        <Stat label="Quick enquiry" value={counts.quick_enquiry} />
        <Stat label="Trade enquiry" value={counts.trade_rfq} />
        <Stat label="Cart / quote" value={counts.cart_quotation} />
        <Stat label="Contact form" value={counts.contact_form} />
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <label className="block max-w-md flex-1">
          <span className="sr-only">Search</span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, company, email, phone, address…"
            className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-charcoal shadow-[0_2px_12px_rgba(26,31,46,0.04)] placeholder:text-muted focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/15"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["all", "All", counts.total],
              ["quick_enquiry", "Quick enquiry", counts.quick_enquiry],
              ["trade_rfq", "Trade", counts.trade_rfq],
              ["cart_quotation", "Cart / quote", counts.cart_quotation],
              ["contact_form", "Contact form", counts.contact_form],
            ] as const
          ).map(([key, label, n]) => (
            <button
              key={key}
              type="button"
              onClick={() => setSourceFilter(key)}
              className={[
                "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                sourceFilter === key
                  ? "border-navy bg-navy text-white"
                  : "border-border bg-white text-charcoal hover:border-navy/40",
              ].join(" ")}
            >
              {label}
              <span className="ml-1 tabular-nums opacity-70">({n})</span>
            </button>
          ))}
        </div>
      </div>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
          {error}
        </p>
      ) : null}

      <div className="rounded-2xl border border-border bg-white shadow-[0_2px_12px_rgba(26,31,46,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-[#fafafa] text-[10px] font-bold uppercase tracking-widest text-sand">
                <th className="px-4 py-3 font-semibold">Source</th>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Company</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold whitespace-nowrap">Phone</th>
                <th className="px-4 py-3 font-semibold">Address</th>
                <th className="px-4 py-3 font-semibold whitespace-nowrap">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {loading && rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-muted">
                    Loading…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-muted">
                    No contacts match your filters yet.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr
                    key={`${r.source}-${r.id}`}
                    className="border-b border-border last:border-0 hover:bg-[#fafafa]/80"
                  >
                    <td className="px-4 py-3 align-top">
                      <span className="inline-flex rounded-lg bg-admin-bg px-2 py-1 text-[11px] font-semibold text-charcoal">
                        {r.sourceLabel}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-top font-medium text-charcoal">{r.name}</td>
                    <td className="px-4 py-3 align-top text-charcoal">
                      {r.companyName?.trim() ? r.companyName : "—"}
                    </td>
                    <td className="px-4 py-3 align-top">
                      <a
                        href={`mailto:${encodeURIComponent(r.email)}`}
                        className="text-navy underline-offset-2 hover:underline break-all"
                      >
                        {r.email}
                      </a>
                    </td>
                    <td className="px-4 py-3 align-top tabular-nums text-charcoal whitespace-nowrap">
                      {r.phone?.trim() ? (
                        <a
                          href={`tel:${r.phone.replace(/\s+/g, "")}`}
                          className="text-navy underline-offset-2 hover:underline"
                        >
                          {r.phone.trim()}
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-3 align-top text-charcoal max-w-[220px]">
                      <span className="line-clamp-3 whitespace-pre-wrap wrap-break-word">
                        {r.address?.trim() ? r.address : "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-top text-muted whitespace-nowrap tabular-nums text-[13px]">
                      {new Date(r.createdAt).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {!loading && filtered.length > 0 ? (
        <p className="text-[11px] text-muted">
          Showing <span className="tabular-nums font-medium">{filtered.length}</span> of{" "}
          <span className="tabular-nums">{rows.length}</span> loaded rows (up to{" "}
          <span className="tabular-nums">400</span> per source).
        </p>
      ) : null}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-4 shadow-[0_2px_12px_rgba(26,31,46,0.04)]">
      <p className="text-[10px] font-bold uppercase tracking-widest text-sand">{label}</p>
      <p className="font-serif text-2xl text-navy mt-1 tabular-nums">{value}</p>
    </div>
  );
}
