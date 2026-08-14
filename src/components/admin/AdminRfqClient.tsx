"use client";

import { admin } from "@/components/admin/admin-theme";
import { AdminPanelModal } from "@/components/admin/AdminPanelModal";
import { rfqEventTypes } from "@/lib/validations/forms";
import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  Banknote,
  Building2,
  Briefcase,
  Calendar,
  Clock,
  Eye,
  File,
  Mail,
  MapPin,
  MapPinned,
  Paperclip,
  Phone,
  Search,
  StickyNote,
  Tag,
  User,
  Users,
} from "lucide-react";
import { formatUtcDate, formatUtcDateTime } from "@/lib/format-datetime";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";

export type EventsRfqAdminRow = {
  id: string;
  referenceNo: string;
  companyName: string;
  tradeLicenceNo: string | null;
  contactPerson: string;
  phone: string;
  email: string;
  budgetAed: string | null;
  emirate: string | null;
  eventName: string;
  eventType: string;
  eventDate: string | null;
  eventDuration: string | null;
  venueName: string | null;
  venueLocation: string | null;
  expectedGuests: string | null;
  attachmentFiles: { name: string; size: number; type: string; url?: string | null; dataUrl?: string | null }[];
  notes: string | null;
  status: string;
  createdAt: string;
};

const UAE_EMIRATES = [
  "Abu Dhabi",
  "Ajman",
  "Dubai",
  "Fujairah",
  "Ras Al Khaimah",
  "Sharjah",
  "Umm Al Quwain",
] as const;

function norm(s: string) {
  return s.toLowerCase().trim();
}

function emirateMatches(rowEmirate: string | null, filter: string) {
  if (filter === "all") return true;
  const row = (rowEmirate || "").trim();
  if (!row) return false;
  if (row === filter) return true;
  if (filter === "Ras Al Khaimah" && row === "RAK") return true;
  return false;
}

function rowMatchesSearch(row: EventsRfqAdminRow, q: string) {
  if (!q.trim()) return true;
  const n = norm(q);
  const hay = [
    row.referenceNo,
    row.contactPerson,
    row.companyName,
    row.email,
    row.phone,
    row.eventName,
    row.eventType,
    row.eventDate ?? "",
    row.venueName ?? "",
    row.venueLocation ?? "",
    row.emirate ?? "",
    row.tradeLicenceNo ?? "",
    row.notes ?? "",
    row.status,
  ]
    .join(" ")
    .toLowerCase();
  return hay.includes(n);
}

function isImageAttachment(file: { name: string; type: string }) {
  if (file.type.startsWith("image/")) return true;
  return /\.(png|jpe?g|gif|webp|svg|bmp|avif)$/i.test(file.name);
}

function isPdfAttachment(file: { name: string; type: string }) {
  if (file.type === "application/pdf") return true;
  return /\.pdf$/i.test(file.name);
}

function attachmentSrc(file: { url?: string | null; dataUrl?: string | null }) {
  return file.url || file.dataUrl || null;
}

function DetailRow({
  icon: Icon,
  label,
  value,
  className = "",
}: {
  icon: LucideIcon;
  label: string;
  value: string | null | undefined;
  className?: string;
}) {
  const display = value?.trim() ? value : "—";
  return (
    <div className={`flex items-start gap-3 py-3 ${className}`}>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-admin-bg text-admin-accent">
        <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
      </span>
      <div className="min-w-0 flex-1 pt-0.5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted">{label}</p>
        <p className="mt-0.5 text-sm text-charcoal wrap-break-word whitespace-pre-wrap">{display}</p>
      </div>
    </div>
  );
}

function DetailGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2 rounded-xl border border-border bg-white px-4">
      {children}
    </div>
  );
}

function AttachmentPreview({
  file,
}: {
  file: { name: string; size: number; type: string; url?: string | null; dataUrl?: string | null };
}) {
  const isImage = isImageAttachment(file);
  const isPdf = isPdfAttachment(file);
  const src = attachmentSrc(file);

  if (src && isImage) {
    return (
      <a
        href={src}
        target="_blank"
        rel="noopener noreferrer"
        className="group block w-28 shrink-0"
      >
        <div className="relative h-28 w-28 overflow-hidden rounded-xl border border-border bg-offwhite">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={file.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-[1.03]"
          />
        </div>
        <p className="mt-1.5 max-w-28 truncate text-[11px] text-muted">{file.name}</p>
      </a>
    );
  }

  if (src && isPdf) {
    return (
      <a
        href={src}
        target="_blank"
        rel="noopener noreferrer"
        className="group block w-40 shrink-0"
      >
        <div className="h-40 w-40 overflow-hidden rounded-xl border border-border bg-offwhite">
          <iframe src={src} title={file.name} className="h-full w-full border-0 pointer-events-none" />
        </div>
        <p className="mt-1.5 max-w-40 truncate text-[11px] text-muted">{file.name}</p>
      </a>
    );
  }

  const content = (
    <>
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border bg-offwhite text-navy">
        <File className="h-5 w-5" strokeWidth={1.75} aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm text-charcoal">{file.name}</p>
        <p className="text-xs text-muted">{Math.max(1, Math.round(file.size / 1024))} KB</p>
      </div>
    </>
  );

  if (src) {
    return (
      <a
        href={src}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-w-[200px] items-center gap-3 rounded-xl border border-border bg-white px-3 py-2.5 transition-colors hover:border-sand"
      >
        {content}
      </a>
    );
  }

  return (
    <div className="flex min-w-[200px] items-center gap-3 rounded-xl border border-border bg-white px-3 py-2.5">
      {content}
    </div>
  );
}

export default function AdminRfqClient({ dbConfigured }: { dbConfigured: boolean }) {
  const [rows, setRows] = useState<EventsRfqAdminRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [eventTypeFilter, setEventTypeFilter] = useState("all");
  const [emirateFilter, setEmirateFilter] = useState("all");
  const [selected, setSelected] = useState<EventsRfqAdminRow | null>(null);

  const load = useCallback(async () => {
    if (!dbConfigured) {
      setLoading(false);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/rfq", { cache: "no-store" });
      if (!res.ok) {
        setError(res.status === 401 ? "Session expired. Please log in again." : "Could not load events RFQ submissions.");
        setRows([]);
        return;
      }
      const data = (await res.json()) as EventsRfqAdminRow[];
      setRows(
        data.map((r) => ({
          ...r,
          createdAt:
            typeof r.createdAt === "string" ? r.createdAt : new Date(String(r.createdAt)).toISOString(),
        })),
      );
    } catch {
      setError("Network error while loading submissions.");
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

  useEffect(() => {
    if (!selected) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSelected(null);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [selected]);

  const statusOptions = useMemo(() => Array.from(new Set(rows.map((r) => r.status).filter(Boolean))).sort(), [rows]);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (eventTypeFilter !== "all" && r.eventType !== eventTypeFilter) return false;
      if (!emirateMatches(r.emirate, emirateFilter)) return false;
      return rowMatchesSearch(r, search);
    });
  }, [rows, search, statusFilter, eventTypeFilter, emirateFilter]);

  if (!dbConfigured) {
    return <p className="text-muted text-sm">Configure DATABASE_URL to load events RFQ submissions.</p>;
  }

  return (
    <>
      <div className="mx-auto w-full max-w-[1560px] px-1 sm:px-2 lg:px-4">
        <div className={admin.headerRow}>
          <div className={admin.headerLead}>
            <h1 className={admin.h1}>Events RFQ enquiry</h1>
            <p className={`${admin.muted} mt-1`}>
              Submissions from /trade/rfq — search by name, reference, event, venue, company, or contact.
            </p>
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
                id="rfq-search"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Name, reference, event, venue, company…"
                className="w-full rounded-lg border border-admin-border bg-white py-2.5 pl-9 pr-3 text-sm text-admin-ink outline-none placeholder:text-admin-ink/40 focus:border-admin-accent/50 focus:ring-2 focus:ring-admin-accent/15"
                autoComplete="off"
              />
            </div>
            <select
              id="rfq-status"
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
              id="rfq-type"
              value={eventTypeFilter}
              onChange={(e) => setEventTypeFilter(e.target.value)}
              aria-label="Filter by event type"
              className="cursor-pointer rounded-lg border border-admin-border bg-white px-3 py-2.5 text-sm text-admin-ink outline-none focus:border-admin-accent/50 focus:ring-2 focus:ring-admin-accent/15"
            >
              <option value="all">All event types</option>
              {rfqEventTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <select
              id="rfq-emirate"
              value={emirateFilter}
              onChange={(e) => setEmirateFilter(e.target.value)}
              aria-label="Filter by emirate"
              className="cursor-pointer rounded-lg border border-admin-border bg-white px-3 py-2.5 text-sm text-admin-ink outline-none focus:border-admin-accent/50 focus:ring-2 focus:ring-admin-accent/15"
            >
              <option value="all">All emirates</option>
              {UAE_EMIRATES.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
            <p className="shrink-0 text-sm text-gray-500">
              <span className="font-semibold text-gray-800">{filtered.length}</span>
              {filtered.length === 1 ? " submission" : " submissions"}
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-admin-border bg-white shadow-sm">
          <div className="overflow-x-auto sm:overflow-x-hidden [scrollbar-color:rgba(26,26,26,0.22)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-black/20 [&::-webkit-scrollbar-track]:bg-transparent">
            <table className="w-full table-fixed border-collapse max-sm:min-w-[680px]">
              <thead>
                <tr className="border-b border-admin-border bg-admin-accent-tint/75">
                  <th className="w-[44px] px-2 py-3 text-center text-xs font-semibold uppercase tracking-wider text-admin-ink/55 sm:px-3">
                    S.N
                  </th>
                  <th className="w-[20%] px-2 py-3 text-left text-xs font-semibold uppercase tracking-wider text-admin-ink/55 sm:px-3">
                    Full name
                  </th>
                  <th className="w-[14%] px-2 py-3 text-left text-xs font-semibold uppercase tracking-wider text-admin-ink/55 sm:px-3">
                    Ref no
                  </th>
                  <th className="w-[13%] px-2 py-3 text-left text-xs font-semibold uppercase tracking-wider text-admin-ink/55 sm:px-3">
                    Company
                  </th>
                  <th className="w-[11%] px-2 py-3 text-left text-xs font-semibold uppercase tracking-wider text-admin-ink/55 sm:px-3">
                    Event date
                  </th>
                  <th className="w-[17%] px-2 py-3 text-left text-xs font-semibold uppercase tracking-wider text-admin-ink/55 sm:px-3">
                    Event name
                  </th>
                  <th className="w-[14%] px-2 py-3 text-left text-xs font-semibold uppercase tracking-wider text-admin-ink/55 sm:px-3">
                    Event type
                  </th>
                  <th className="w-[72px] px-2 py-3 text-right text-xs font-semibold uppercase tracking-wider text-admin-ink/55 sm:px-3">
                    View
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading && rows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-sm text-admin-ink/45">
                      Loading events RFQ submissions…
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-sm text-admin-ink/45">
                      No events RFQ submissions yet. They will appear here when customers submit the form.
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-sm text-admin-ink/45">
                      No rows match your filters. Try clearing search or filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((r, index) => (
                    <tr
                      key={r.id}
                      className={`min-h-[72px] align-top border-b border-admin-border/60 transition-colors last:border-b-0 ${
                        index % 2 === 0 ? "bg-white" : "bg-admin-bg/90"
                      } hover:bg-admin-accent/[0.07]`}
                    >
                      <td className="px-2 py-3 align-top text-center text-xs font-semibold tabular-nums leading-snug text-gray-400 sm:px-3">
                        {index + 1}
                      </td>
                      <td className="px-2 py-3 align-top sm:px-3">
                        <p className="truncate text-sm font-semibold leading-snug text-gray-900">{r.contactPerson}</p>
                        <p className="mt-0.5 truncate text-xs leading-snug text-gray-400">{r.email}</p>
                      </td>
                      <td className="px-2 py-3 align-top sm:px-3">
                        <span className="inline-block max-w-full rounded-md bg-admin-accent/10 px-2 py-1 text-[9px] font-semibold leading-snug text-admin-accent ring-1 ring-admin-accent/20 break-all uppercase tracking-wide">
                          {r.referenceNo}
                        </span>
                      </td>
                      <td className="px-2 py-3 align-top sm:px-3">
                        <p className="truncate text-sm leading-snug text-gray-700">{r.companyName}</p>
                      </td>
                      <td className="px-2 py-3 align-top text-xs tabular-nums leading-snug text-gray-500 sm:px-3">
                        {formatUtcDate(r.eventDate)}
                      </td>
                      <td className="px-2 py-3 align-top sm:px-3">
                        <p className="truncate text-sm leading-snug text-gray-800">{r.eventName}</p>
                      </td>
                      <td className="px-2 py-3 align-top sm:px-3">
                        <p className="truncate text-xs leading-snug text-gray-500">{r.eventType}</p>
                      </td>
                      <td className="px-2 py-3 align-top sm:px-3">
                        <div className="flex justify-end pt-0.5">
                          <button
                            type="button"
                            onClick={() => setSelected(r)}
                            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-admin-ink/45 transition-colors hover:bg-admin-accent/15 hover:text-admin-accent"
                            aria-label={`View ${r.referenceNo}`}
                            title="View details"
                          >
                            <Eye className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                          </button>
                        </div>
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
        open={Boolean(selected)}
        title={selected?.eventName ?? "RFQ details"}
        subtitle={selected ? `${selected.referenceNo} · ${formatUtcDateTime(selected.createdAt)}` : undefined}
        onClose={() => setSelected(null)}
        widthClass="max-w-[min(100%-1.5rem,56rem)]"
      >
        {selected ? (
          <div className="space-y-6 py-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex rounded-lg bg-[#fdeadf] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-admin-accent">
                {selected.referenceNo}
              </span>
              <span className="inline-flex rounded-lg bg-offwhite border border-border px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-charcoal">
                {selected.status}
              </span>
            </div>

            <section>
              <h3 className="mb-1 text-xs font-bold uppercase tracking-widest text-sand">Contact & company</h3>
              <DetailGrid>
                <DetailRow icon={User} label="Full name" value={selected.contactPerson} />
                <DetailRow icon={Building2} label="Company name" value={selected.companyName} />
                <DetailRow icon={Mail} label="Email" value={selected.email} />
                <DetailRow icon={Phone} label="Phone" value={selected.phone} />
                <DetailRow icon={BadgeCheck} label="Trade licence no." value={selected.tradeLicenceNo} />
                <DetailRow icon={MapPin} label="Emirate" value={selected.emirate} />
                <DetailRow icon={Banknote} label="Budget (AED)" value={selected.budgetAed} />
              </DetailGrid>
            </section>

            <section>
              <h3 className="mb-1 text-xs font-bold uppercase tracking-widest text-sand">Event details</h3>
              <DetailGrid>
                <DetailRow icon={Tag} label="Event name" value={selected.eventName} />
                <DetailRow icon={Briefcase} label="Event type" value={selected.eventType} />
                <DetailRow icon={Calendar} label="Event date" value={formatUtcDate(selected.eventDate)} />
                <DetailRow icon={Clock} label="Event duration" value={selected.eventDuration} />
                <DetailRow icon={MapPinned} label="Venue name" value={selected.venueName} />
                <DetailRow icon={MapPin} label="Venue location" value={selected.venueLocation} />
                <DetailRow icon={Users} label="Expected guests" value={selected.expectedGuests} />
              </DetailGrid>
            </section>

            <section>
              <h3 className="mb-1 text-xs font-bold uppercase tracking-widest text-sand">Notes & attachments</h3>
              <DetailGrid>
                <DetailRow icon={StickyNote} label="Notes" value={selected.notes} className="sm:col-span-2" />
              </DetailGrid>
              <div className="mt-4">
                <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted">
                  <Paperclip className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                  Attachments
                </div>
                {selected.attachmentFiles?.length ? (
                  <div className="flex flex-wrap gap-4">
                    {selected.attachmentFiles.map((file) => (
                      <AttachmentPreview key={`${file.name}-${file.size}-${file.url ?? file.dataUrl ?? "local"}`} file={file} />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted">No attachments uploaded.</p>
                )}
              </div>
            </section>
          </div>
        ) : null}
      </AdminPanelModal>
    </>
  );
}
