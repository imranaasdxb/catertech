"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

export type TradeEnquiryAdminRow = {
  id: string;
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  emirate: string | null;
  serviceInterest: string | null;
  message: string;
  attachmentUrl: string | null;
  status: string;
  createdAt: string;
};

function norm(s: string) {
  return s.toLowerCase().trim();
}

function rowMatchesSearch(row: TradeEnquiryAdminRow, q: string) {
  if (!q.trim()) return true;
  const n = norm(q);
  const hay = [
    row.companyName,
    row.contactName,
    row.email,
    row.phone,
    row.emirate ?? "",
    row.serviceInterest ?? "",
    row.message,
    row.status,
    row.id,
  ]
    .join(" ")
    .toLowerCase();
  return hay.includes(n);
}

export default function AdminEnquiriesClient({
  dbConfigured,
}: {
  dbConfigured: boolean;
}) {
  const [rows, setRows] = useState<TradeEnquiryAdminRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [emirateFilter, setEmirateFilter] = useState<string>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");

  const load = useCallback(async () => {
    if (!dbConfigured) {
      setLoading(false);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/enquiries", { cache: "no-store" });
      if (!res.ok) {
        if (res.status === 401) {
          setError("Session expired. Please log in again.");
        } else {
          setError("Could not load enquiries.");
        }
        setRows([]);
        return;
      }
      const data = (await res.json()) as TradeEnquiryAdminRow[];
      setRows(
        data.map((r) => ({
          ...r,
          createdAt:
            typeof r.createdAt === "string"
              ? r.createdAt
              : new Date(String(r.createdAt)).toISOString(),
        }))
      );
    } catch {
      setError("Network error while loading enquiries.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [dbConfigured]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    function onVis() {
      if (document.visibilityState === "visible") void load();
    }
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [load]);

  const statusOptions = useMemo(() => {
    const set = new Set(rows.map((r) => r.status).filter(Boolean));
    return Array.from(set).sort();
  }, [rows]);

  const emirateOptions = useMemo(() => {
    const set = new Set(
      rows.map((r) => r.emirate).filter((e): e is string => Boolean(e && e.trim()))
    );
    return Array.from(set).sort();
  }, [rows]);

  const serviceOptions = useMemo(() => {
    const set = new Set(
      rows
        .map((r) => r.serviceInterest)
        .filter((s): s is string => Boolean(s && s.trim()))
    );
    return Array.from(set).sort();
  }, [rows]);

  const stats = useMemo(() => {
    const newCount = rows.filter((r) => norm(r.status) === "new").length;
    return { total: rows.length, newCount };
  }, [rows]);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (emirateFilter !== "all") {
        if ((r.emirate || "").trim() !== emirateFilter) return false;
      }
      if (serviceFilter !== "all") {
        if ((r.serviceInterest || "").trim() !== serviceFilter) return false;
      }
      if (!rowMatchesSearch(r, search)) return false;
      return true;
    });
  }, [rows, search, statusFilter, emirateFilter, serviceFilter]);

  if (!dbConfigured) {
    return (
      <p className="text-muted text-sm">Configure DATABASE_URL to load enquiries.</p>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl text-charcoal tracking-tight">
            Quick enquiries
          </h1>
          <p className="text-muted text-sm mt-2 max-w-2xl leading-relaxed">
            Submissions from the website Quick Enquiry form (
            <span className="text-charcoal/80">/trade/enquiry</span>). Data loads
            from the database via the admin API — use Refresh after new submissions.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          disabled={loading}
          className="shrink-0 rounded-xl border border-border bg-white px-4 py-3 text-xs font-semibold uppercase tracking-widest text-charcoal hover:border-sand transition-colors disabled:opacity-50"
        >
          {loading ? "Loading…" : "Refresh"}
        </button>
      </div>

      {error ? (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          {error}
        </p>
      ) : null}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-2xl border border-border bg-white p-4 shadow-[0_2px_12px_rgba(26,31,46,0.04)]">
          <p className="text-[10px] font-bold uppercase tracking-widest text-sand">
            Total enquiries
          </p>
          <p className="font-serif text-2xl text-navy mt-1 tabular-nums">{stats.total}</p>
        </div>
        <div className="rounded-2xl border border-border bg-white p-4 shadow-[0_2px_12px_rgba(26,31,46,0.04)]">
          <p className="text-[10px] font-bold uppercase tracking-widest text-sand">
            Showing
          </p>
          <p className="font-serif text-2xl text-navy mt-1 tabular-nums">{filtered.length}</p>
          {filtered.length !== stats.total ? (
            <p className="text-[11px] text-muted mt-0.5">after filters</p>
          ) : null}
        </div>
        <div className="rounded-2xl border border-border bg-white p-4 shadow-[0_2px_12px_rgba(26,31,46,0.04)]">
          <p className="text-[10px] font-bold uppercase tracking-widest text-sand">
            Status “new”
          </p>
          <p className="font-serif text-2xl text-navy mt-1 tabular-nums">{stats.newCount}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col xl:flex-row gap-3 xl:items-end xl:justify-between">
        <div className="w-full xl:max-w-md">
          <label
            htmlFor="enq-search"
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
              id="enq-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Company, contact, email, phone, message…"
              className="w-full border border-border rounded-xl pl-10 pr-4 py-3 text-sm text-charcoal placeholder:text-muted/60 bg-white outline-none focus:border-sand transition-colors"
              autoComplete="off"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <div>
            <label
              htmlFor="enq-status"
              className="block text-[10px] font-bold uppercase tracking-widest text-charcoal mb-2"
            >
              Status
            </label>
            <select
              id="enq-status"
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
          <div>
            <label
              htmlFor="enq-emirate"
              className="block text-[10px] font-bold uppercase tracking-widest text-charcoal mb-2"
            >
              Emirate
            </label>
            <select
              id="enq-emirate"
              value={emirateFilter}
              onChange={(e) => setEmirateFilter(e.target.value)}
              className="border border-border rounded-xl px-4 py-3 text-sm text-charcoal bg-white min-w-[160px] outline-none focus:border-sand"
            >
              <option value="all">All emirates</option>
              {emirateOptions.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="enq-service"
              className="block text-[10px] font-bold uppercase tracking-widest text-charcoal mb-2"
            >
              Service
            </label>
            <select
              id="enq-service"
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="border border-border rounded-xl px-4 py-3 text-sm text-charcoal bg-white min-w-[180px] outline-none focus:border-sand max-w-[220px]"
            >
              <option value="all">All interests</option>
              {serviceOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      {loading && rows.length === 0 ? (
        <p className="text-muted text-sm py-12 text-center border border-dashed border-border rounded-2xl bg-white">
          Loading enquiries…
        </p>
      ) : rows.length === 0 ? (
        <p className="text-muted text-sm py-12 text-center border border-dashed border-border rounded-2xl bg-white">
          No quick enquiries yet. They will appear here when customers submit the form.
        </p>
      ) : filtered.length === 0 ? (
        <p className="text-muted text-sm py-12 text-center border border-dashed border-border rounded-2xl bg-offwhite">
          No rows match your filters. Try clearing search or filters.
        </p>
      ) : (
        <div className="rounded-2xl border border-border bg-white overflow-hidden shadow-[0_4px_24px_rgba(26,31,46,0.06)]">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left min-w-[920px]">
              <thead>
                <tr className="bg-navy text-white text-[10px] uppercase tracking-wider">
                  <th className="px-4 py-3 font-bold whitespace-nowrap">Date</th>
                  <th className="px-4 py-3 font-bold min-w-[120px]">Company</th>
                  <th className="px-4 py-3 font-bold">Contact</th>
                  <th className="px-4 py-3 font-bold">Phone</th>
                  <th className="px-4 py-3 font-bold min-w-[160px]">Email</th>
                  <th className="px-4 py-3 font-bold whitespace-nowrap">Emirate</th>
                  <th className="px-4 py-3 font-bold min-w-[120px]">Service</th>
                  <th className="px-4 py-3 font-bold whitespace-nowrap">Status</th>
                  <th className="px-4 py-3 font-bold min-w-[220px]">Message</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr
                    key={r.id}
                    className="border-t border-border bg-white hover:bg-offwhite/80 transition-colors align-top"
                  >
                    <td className="px-4 py-3 text-muted tabular-nums whitespace-nowrap text-xs">
                      {new Date(r.createdAt).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                    <td className="px-4 py-3 font-medium text-charcoal">{r.companyName}</td>
                    <td className="px-4 py-3 text-charcoal">{r.contactName}</td>
                    <td className="px-4 py-3">
                      <a
                        href={`tel:${r.phone.replace(/\s/g, "")}`}
                        className="text-navy hover:underline whitespace-nowrap"
                      >
                        {r.phone}
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={`mailto:${encodeURIComponent(r.email)}`}
                        className="text-navy hover:underline break-all"
                      >
                        {r.email}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {(r.emirate || "—").trim() || "—"}
                    </td>
                    <td className="px-4 py-3 text-muted">{r.serviceInterest || "—"}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-lg bg-offwhite border border-border px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-charcoal">
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-charcoal text-[13px] max-w-[320px]">
                      <span className="line-clamp-4 whitespace-pre-wrap">{r.message}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
