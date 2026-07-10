"use client";

import { admin } from "@/components/admin/adminTheme";
import { AdminPanelModal } from "@/components/admin/AdminPanelModal";
import { MessageSquare, Search } from "lucide-react";
import { formatUtcDateTime } from "@/lib/format-datetime";
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
  const [messagePreview, setMessagePreview] = useState<TradeEnquiryAdminRow | null>(null);

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
    <>
    <div className="mx-auto w-full max-w-6xl px-1 sm:px-2 lg:px-4">
      <div className={admin.headerRow}>
        <div className={admin.headerLead}>
          <h1 className={admin.h1}>Quick enquiries</h1>
        </div>
      </div>

      {error ? (
        <p className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
          {error}
        </p>
      ) : null}

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="relative min-w-0 w-full sm:max-w-xs sm:flex-1 sm:w-auto">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              aria-hidden
            />
            <input
              id="enq-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Company, contact, email, phone, message…"
              className="w-full rounded-lg border border-admin-border bg-white py-2.5 pl-9 pr-3 text-sm text-admin-ink outline-none placeholder:text-admin-ink/40 focus:border-admin-accent/50 focus:ring-2 focus:ring-admin-accent/15"
              autoComplete="off"
            />
          </div>
          <select
            id="enq-status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by status"
            className="cursor-pointer rounded-lg border border-admin-border bg-white px-3 py-2.5 text-sm text-admin-ink outline-none focus:border-admin-accent/50 focus:ring-2 focus:ring-admin-accent/15"
          >
            <option value="all">All statuses</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            id="enq-emirate"
            value={emirateFilter}
            onChange={(e) => setEmirateFilter(e.target.value)}
            aria-label="Filter by emirate"
            className="cursor-pointer rounded-lg border border-admin-border bg-white px-3 py-2.5 text-sm text-admin-ink outline-none focus:border-admin-accent/50 focus:ring-2 focus:ring-admin-accent/15"
          >
            <option value="all">All emirates</option>
            {emirateOptions.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
          <select
            id="enq-service"
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            aria-label="Filter by service interest"
            className="cursor-pointer rounded-lg border border-admin-border bg-white px-3 py-2.5 text-sm text-admin-ink outline-none focus:border-admin-accent/50 focus:ring-2 focus:ring-admin-accent/15"
          >
            <option value="all">All interests</option>
            {serviceOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <p className="shrink-0 text-sm text-gray-500">
            <span className="font-semibold text-gray-800">{filtered.length}</span>
            {filtered.length === 1 ? " enquiry" : " enquiries"}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-admin-border bg-white shadow-sm">
        <div className="overflow-x-auto sm:overflow-x-hidden [scrollbar-color:rgba(26,26,26,0.22)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-black/20 [&::-webkit-scrollbar-track]:bg-transparent">
          <table className="w-full table-fixed border-collapse max-sm:min-w-[580px]">
            <thead>
              <tr className="border-b border-admin-border bg-admin-accent-tint/75">
                <th className="w-[12%] px-2 py-3 text-left text-xs font-semibold uppercase tracking-wider text-admin-ink/55 sm:px-3">
                  Date
                </th>
                <th className="w-[13%] px-2 py-3 text-left text-xs font-semibold uppercase tracking-wider text-admin-ink/55 sm:px-3">
                  Company
                </th>
                <th className="w-[18%] px-2 py-3 text-left text-xs font-semibold uppercase tracking-wider text-admin-ink/55 sm:px-3">
                  Contact
                </th>
                <th className="w-[9%] px-2 py-3 text-left text-xs font-semibold uppercase tracking-wider text-admin-ink/55 sm:px-3">
                  Emirate
                </th>
                <th className="w-[11%] px-2 py-3 text-left text-xs font-semibold uppercase tracking-wider text-admin-ink/55 sm:px-3">
                  Service
                </th>
                <th className="w-[8%] px-2 py-3 text-left text-xs font-semibold uppercase tracking-wider text-admin-ink/55 sm:px-3">
                  Status
                </th>
                <th className="w-[44px] px-1 py-3 text-center text-xs font-semibold uppercase tracking-wider text-admin-ink/55 sm:px-2">
                  Msg
                </th>
              </tr>
            </thead>
            <tbody>
              {loading && rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-admin-ink/45">
                    Loading enquiries…
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-admin-ink/45">
                    No quick enquiries yet. They will appear here when customers submit the form.
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-admin-ink/45">
                    No rows match your filters. Try clearing search or filters.
                  </td>
                </tr>
              ) : (
                filtered.map((r, index) => (
                  <tr
                    key={r.id}
                    className={`min-h-[68px] align-top border-b border-admin-border/60 transition-colors last:border-b-0 ${
                      index % 2 === 0 ? "bg-white" : "bg-admin-bg/90"
                    } hover:bg-admin-accent/[0.07]`}
                  >
                    <td className="min-w-0 px-2 py-3 align-top text-xs tabular-nums leading-snug text-gray-500 sm:px-3">
                      {formatUtcDateTime(r.createdAt)}
                    </td>
                    <td className="min-w-0 px-2 py-3 align-top sm:px-3">
                      <p className="truncate text-sm font-semibold leading-snug text-gray-900">
                        {r.companyName}
                      </p>
                    </td>
                    <td className="min-w-0 px-2 py-3 align-top sm:px-3">
                      <p className="truncate text-sm font-semibold leading-snug text-gray-900">
                        {r.contactName}
                      </p>
                      <a
                        href={`tel:${r.phone.replace(/\s/g, "")}`}
                        className="mt-0.5 block truncate text-xs leading-snug text-admin-accent hover:underline"
                      >
                        {r.phone}
                      </a>
                      <a
                        href={`mailto:${encodeURIComponent(r.email)}`}
                        className="mt-0.5 block truncate text-xs leading-snug text-admin-accent hover:underline"
                      >
                        {r.email}
                      </a>
                    </td>
                    <td className="min-w-0 px-2 py-3 align-top sm:px-3">
                      <p className="truncate text-xs leading-snug text-gray-500">
                        {(r.emirate || "—").trim() || "—"}
                      </p>
                    </td>
                    <td className="min-w-0 px-2 py-3 align-top sm:px-3">
                      <p className="truncate text-xs leading-snug text-gray-500">
                        {r.serviceInterest || "—"}
                      </p>
                    </td>
                    <td className="min-w-0 px-2 py-3 align-top sm:px-3">
                      <span className="inline-block max-w-full rounded-md bg-admin-accent/10 px-2 py-1 text-[9px] font-semibold leading-snug text-admin-accent ring-1 ring-admin-accent/20 break-all uppercase tracking-wide">
                        {r.status}
                      </span>
                    </td>
                    <td className="px-1 py-3 align-top text-center sm:px-2">
                      <button
                        type="button"
                        onClick={() => setMessagePreview(r)}
                        disabled={!r.message?.trim()}
                        className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-admin-ink/45 transition-colors hover:bg-admin-accent/15 hover:text-admin-accent disabled:cursor-not-allowed disabled:opacity-35"
                        aria-label={`View message from ${r.contactName}`}
                        title={r.message?.trim() ? "View message" : "No message"}
                      >
                        <MessageSquare className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <AdminPanelModal
      open={Boolean(messagePreview)}
      title="Enquiry message"
      subtitle={
        messagePreview
          ? `${messagePreview.contactName} · ${messagePreview.companyName}`
          : undefined
      }
      onClose={() => setMessagePreview(null)}
      widthClass="max-w-[min(100%-1rem,26rem)]"
      maxHeightClass="max-h-[min(80vh,360px)]"
    >
      {messagePreview ? (
        <p className="text-sm leading-relaxed text-admin-ink whitespace-pre-wrap wrap-break-word">
          {messagePreview.message?.trim() || "No message provided."}
        </p>
      ) : null}
    </AdminPanelModal>
    </>
  );
}
