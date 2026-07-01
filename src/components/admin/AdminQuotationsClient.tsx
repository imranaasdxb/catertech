"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

export type QuotationAdminRow = {
  id: string;
  customerName: string;
  email: string;
  phone: string | null;
  company: string | null;
  address: string | null;
  source: string;
  items: { name: string; category: string; price: string; qty: number }[];
  message: string | null;
  status: string;
  createdAt: string;
};

function norm(s: string) {
  return s.toLowerCase().trim();
}

function rowMatchesSearch(row: QuotationAdminRow, q: string) {
  if (!q.trim()) return true;
  const n = norm(q);
  const hay = [
    row.customerName,
    row.email,
    row.phone ?? "",
    row.address ?? "",
    row.company ?? "",
    row.message ?? "",
    row.status,
    ...row.items.map((i) => `${i.name} ${i.category}`),
  ]
    .join(" ")
    .toLowerCase();
  return hay.includes(n);
}

function sameQuotationRows(a: QuotationAdminRow[], b: QuotationAdminRow[]) {
  if (a.length !== b.length) return false;
  return a.every((row, index) => {
    const next = b[index];
    return next && row.id === next.id && row.status === next.status;
  });
}

export default function AdminQuotationsClient({
  rows: initialRows,
}: {
  rows: QuotationAdminRow[];
}) {
  const [rows, setRows] = useState(initialRows);
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState<"all" | "email" | "whatsapp">(
    "all"
  );
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const refreshRows = useCallback(async (signal?: AbortSignal) => {
    const res = await fetch("/api/admin/quotations", {
      cache: "no-store",
      signal,
    });
    if (!res.ok) return;
    const next = await res.json();
    if (!Array.isArray(next)) return;
    setRows((current) =>
      sameQuotationRows(current, next as QuotationAdminRow[])
        ? current
        : (next as QuotationAdminRow[])
    );
  }, []);

  useEffect(() => {
    setRows(initialRows);
  }, [initialRows]);

  useEffect(() => {
    const controller = new AbortController();
    refreshRows(controller.signal).catch(() => {});

    const id = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        refreshRows().catch(() => {});
      }
    }, 5000);

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        refreshRows().catch(() => {});
      }
    };

    window.addEventListener("focus", onVisible);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      controller.abort();
      window.clearInterval(id);
      window.removeEventListener("focus", onVisible);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [refreshRows]);

  const statusOptions = useMemo(() => {
    const set = new Set(rows.map((r) => r.status).filter(Boolean));
    return Array.from(set).sort();
  }, [rows]);

  const stats = useMemo(() => {
    const email = rows.filter((r) => r.source === "email").length;
    const wa = rows.filter((r) => r.source === "whatsapp").length;
    return {
      total: rows.length,
      email,
      whatsapp: wa,
      newCount: rows.filter((r) => norm(r.status) === "new").length,
    };
  }, [rows]);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (sourceFilter !== "all" && r.source !== sourceFilter) return false;
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (!rowMatchesSearch(r, search)) return false;
      return true;
    });
  }, [rows, search, sourceFilter, statusFilter]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-charcoal tracking-tight">
          Cart quotations
        </h1>
        <p className="text-muted text-sm mt-2 max-w-2xl leading-relaxed">
          Review customer details and every line item they requested. Search by
          name, email, phone, address, or product. Filter by channel or status.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-2xl border border-border bg-white p-4 shadow-[0_2px_12px_rgba(26,31,46,0.04)]">
          <p className="text-[10px] font-bold uppercase tracking-widest text-sand">
            Total requests
          </p>
          <p className="font-serif text-2xl text-navy mt-1 tabular-nums">
            {stats.total}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-white p-4 shadow-[0_2px_12px_rgba(26,31,46,0.04)]">
          <p className="text-[10px] font-bold uppercase tracking-widest text-sand">
            Showing
          </p>
          <p className="font-serif text-2xl text-navy mt-1 tabular-nums">
            {filtered.length}
          </p>
          {filtered.length !== stats.total ? (
            <p className="text-[11px] text-muted mt-0.5">after filters</p>
          ) : null}
        </div>
        <div className="rounded-2xl border border-border bg-white p-4 shadow-[0_2px_12px_rgba(26,31,46,0.04)]">
          <p className="text-[10px] font-bold uppercase tracking-widest text-sand">
            By channel
          </p>
          <p className="text-sm text-charcoal mt-2">
            <span className="font-medium">{stats.email}</span>
            <span className="text-muted"> email</span>
            <span className="text-border mx-2">·</span>
            <span className="font-medium">{stats.whatsapp}</span>
            <span className="text-muted"> WhatsApp</span>
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-white p-4 shadow-[0_2px_12px_rgba(26,31,46,0.04)]">
          <p className="text-[10px] font-bold uppercase tracking-widest text-sand">
            Status &quot;new&quot;
          </p>
          <p className="font-serif text-2xl text-navy mt-1 tabular-nums">
            {stats.newCount}
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row gap-3 lg:items-end lg:justify-between">
        <div className="w-full lg:max-w-md">
          <label
            htmlFor="q-search"
            className="block text-[10px] font-bold uppercase tracking-widest text-charcoal mb-2"
          >
            Search
          </label>
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              id="q-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Name, email, phone, product…"
              className="w-full border border-border rounded-xl pl-10 pr-4 py-3 text-sm text-charcoal placeholder:text-muted/60 bg-white outline-none focus:border-sand transition-colors"
              autoComplete="off"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <div>
            <label
              htmlFor="q-source"
              className="block text-[10px] font-bold uppercase tracking-widest text-charcoal mb-2"
            >
              Channel
            </label>
            <select
              id="q-source"
              value={sourceFilter}
              onChange={(e) =>
                setSourceFilter(e.target.value as typeof sourceFilter)
              }
              className="border border-border rounded-xl px-4 py-3 text-sm text-charcoal bg-white min-w-[140px] outline-none focus:border-sand"
            >
              <option value="all">All channels</option>
              <option value="email">Email</option>
              <option value="whatsapp">WhatsApp</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="q-status"
              className="block text-[10px] font-bold uppercase tracking-widest text-charcoal mb-2"
            >
              Status
            </label>
            <select
              id="q-status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-border rounded-xl px-4 py-3 text-sm text-charcoal bg-white min-w-[140px] outline-none focus:border-sand"
            >
              <option value="all">All statuses</option>
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* List */}
      {rows.length === 0 ? (
        <p className="text-muted text-sm py-12 text-center border border-dashed border-border rounded-2xl bg-white">
          No quotation requests yet.
        </p>
      ) : filtered.length === 0 ? (
        <p className="text-muted text-sm py-12 text-center border border-dashed border-border rounded-2xl bg-offwhite">
          No quotations match your filters. Try clearing search or filters.
        </p>
      ) : (
        <div className="space-y-5">
          {filtered.map((r) => (
            <article
              key={r.id}
              className="rounded-2xl border border-border bg-white overflow-hidden shadow-[0_4px_24px_rgba(26,31,46,0.06)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 px-5 sm:px-6 pt-5 pb-4 border-b border-border bg-offwhite/60">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center rounded-lg bg-white border border-border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-charcoal">
                    {r.status}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${
                      r.source === "whatsapp"
                        ? "bg-[#dcf8c6] text-[#075e54]"
                        : "bg-cream text-navy border border-border"
                    }`}
                  >
                    {r.source === "whatsapp" ? "WhatsApp" : "Email"}
                  </span>
                  <span className="text-[11px] text-muted tabular-nums">
                    {r.items.length} line item{r.items.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="text-right space-y-0.5">
                  <p className="text-xs font-medium text-charcoal tabular-nums">
                    {new Date(r.createdAt).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                  <p className="text-[10px] text-muted font-mono select-all">
                    ID {r.id.slice(0, 8)}…
                  </p>
                </div>
              </div>

              <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-[minmax(0,280px)_1fr] gap-6 lg:gap-10">
                {/* Customer */}
                <div className="space-y-4 text-sm">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-sand">
                    Customer
                  </p>
                  <div>
                    <p className="font-semibold text-charcoal text-base leading-snug">
                      {r.customerName}
                    </p>
                    {r.company ? (
                      <p className="text-muted text-xs mt-0.5">{r.company}</p>
                    ) : null}
                  </div>
                  <dl className="space-y-3 text-[13px]">
                    <div>
                      <dt className="text-[10px] uppercase tracking-wide text-muted mb-0.5">
                        Email
                      </dt>
                      <dd>
                        <a
                          href={`mailto:${encodeURIComponent(r.email)}`}
                          className="text-navy hover:underline break-all"
                        >
                          {r.email}
                        </a>
                      </dd>
                    </div>
                    {r.phone ? (
                      <div>
                        <dt className="text-[10px] uppercase tracking-wide text-muted mb-0.5">
                          Phone
                        </dt>
                        <dd>
                          <a
                            href={`tel:${r.phone.replace(/\s/g, "")}`}
                            className="text-navy hover:underline"
                          >
                            {r.phone}
                          </a>
                        </dd>
                      </div>
                    ) : null}
                    {r.address ? (
                      <div>
                        <dt className="text-[10px] uppercase tracking-wide text-muted mb-0.5">
                          Address
                        </dt>
                        <dd className="text-charcoal leading-relaxed whitespace-pre-wrap">
                          {r.address}
                        </dd>
                      </div>
                    ) : null}
                  </dl>
                  {r.message ? (
                    <div className="rounded-xl border border-border bg-offwhite p-3.5">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-sand mb-1.5">
                        Customer notes
                      </p>
                      <p className="text-charcoal text-[13px] leading-relaxed whitespace-pre-wrap">
                        {r.message}
                      </p>
                    </div>
                  ) : null}
                </div>

                {/* Line items */}
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-sand mb-3">
                    Requested items
                  </p>
                  <div className="rounded-xl border border-border overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead>
                          <tr className="bg-navy text-white text-[10px] uppercase tracking-wider">
                            <th className="px-3 py-2.5 font-bold">Product</th>
                            <th className="px-3 py-2.5 font-bold hidden sm:table-cell">
                              Category
                            </th>
                            <th className="px-3 py-2.5 font-bold text-right whitespace-nowrap">
                              Qty
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {r.items.map((item, idx) => (
                            <tr
                              key={`${r.id}-${idx}-${item.name}`}
                              className="border-t border-border bg-white hover:bg-offwhite/80 transition-colors"
                            >
                              <td className="px-3 py-3 text-charcoal font-medium">
                                <span className="sm:hidden text-[10px] text-muted block font-normal">
                                  {item.category}
                                </span>
                                {item.name}
                              </td>
                              <td className="px-3 py-3 text-muted hidden sm:table-cell">
                                {item.category}
                              </td>
                              <td className="px-3 py-3 text-right tabular-nums font-semibold text-charcoal">
                                {item.qty}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
