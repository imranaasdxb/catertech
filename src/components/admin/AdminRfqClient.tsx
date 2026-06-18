"use client";

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

function formatDate(value: string | null) {
  if (!value?.trim()) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, { dateStyle: "medium" });
}

function formatDateTime(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
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
      <div className="space-y-8">
        <div>
          <h1 className="font-serif text-3xl text-charcoal tracking-tight">Events RFQ enquiry</h1>
          <p className="text-muted text-sm mt-2 max-w-full leading-snug sm:whitespace-nowrap sm:overflow-hidden sm:text-ellipsis">
            Submissions from /trade/rfq — search by name, reference, event, venue, company, or contact.
          </p>
        </div>

        {error ? (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>
        ) : null}

        <div className="flex flex-col xl:flex-row gap-3 xl:items-end xl:justify-between">
          <div className="w-full xl:max-w-lg">
            <label
              htmlFor="rfq-search"
              className="block text-[10px] font-bold uppercase tracking-widest text-charcoal mb-2"
            >
              Search
            </label>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
                size={18}
                strokeWidth={2}
                aria-hidden
              />
              <input
                id="rfq-search"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Name, reference, event, venue, company, email, phone…"
                className="w-full border border-border rounded-xl pl-10 pr-4 py-3 text-sm text-charcoal placeholder:text-muted/60 bg-white outline-none focus:border-sand transition-colors"
                autoComplete="off"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <div>
              <label htmlFor="rfq-status" className="block text-[10px] font-bold uppercase tracking-widest text-charcoal mb-2">
                Status
              </label>
              <select
                id="rfq-status"
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
              <label htmlFor="rfq-type" className="block text-[10px] font-bold uppercase tracking-widest text-charcoal mb-2">
                Event type
              </label>
              <select
                id="rfq-type"
                value={eventTypeFilter}
                onChange={(e) => setEventTypeFilter(e.target.value)}
                className="border border-border rounded-xl px-4 py-3 text-sm text-charcoal bg-white min-w-[180px] outline-none focus:border-sand max-w-[220px]"
              >
                <option value="all">All event types</option>
                {rfqEventTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="rfq-emirate" className="block text-[10px] font-bold uppercase tracking-widest text-charcoal mb-2">
                Emirate
              </label>
              <select
                id="rfq-emirate"
                value={emirateFilter}
                onChange={(e) => setEmirateFilter(e.target.value)}
                className="border border-border rounded-xl px-4 py-3 text-sm text-charcoal bg-white min-w-[180px] outline-none focus:border-sand"
              >
                <option value="all">All emirates</option>
                {UAE_EMIRATES.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading && rows.length === 0 ? (
          <p className="text-muted text-sm py-12 text-center border border-dashed border-border rounded-2xl bg-white">
            Loading events RFQ submissions…
          </p>
        ) : rows.length === 0 ? (
          <p className="text-muted text-sm py-12 text-center border border-dashed border-border rounded-2xl bg-white">
            No events RFQ submissions yet. They will appear here when customers submit the form.
          </p>
        ) : filtered.length === 0 ? (
          <p className="text-muted text-sm py-12 text-center border border-dashed border-border rounded-2xl bg-offwhite">
            No rows match your filters. Try clearing search or filters.
          </p>
        ) : (
          <div className="rounded-2xl border border-border bg-white overflow-hidden shadow-[0_4px_24px_rgba(26,31,46,0.06)]">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left min-w-[1100px]">
                <thead>
                  <tr className="bg-navy text-white text-[10px] uppercase tracking-wider">
                    <th className="px-4 py-3 font-bold w-14">S.No</th>
                    <th className="px-4 py-3 font-bold min-w-[160px]">Full name</th>
                    <th className="px-4 py-3 font-bold whitespace-nowrap">Ref no</th>
                    <th className="px-4 py-3 font-bold min-w-[140px]">Company</th>
                    <th className="px-4 py-3 font-bold whitespace-nowrap">Event date</th>
                    <th className="px-4 py-3 font-bold min-w-[140px]">Event name</th>
                    <th className="px-4 py-3 font-bold min-w-[120px]">Event type</th>
                    <th className="px-4 py-3 font-bold w-16 text-center">View</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, index) => (
                    <tr
                      key={r.id}
                      className="border-t border-border bg-white hover:bg-offwhite/80 transition-colors align-top"
                    >
                      <td className="px-4 py-3 text-muted tabular-nums">{index + 1}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-charcoal">{r.contactPerson}</p>
                        <p className="mt-0.5 text-xs text-muted break-all">{r.email}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex rounded-lg bg-offwhite border border-border px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-charcoal whitespace-nowrap">
                          {r.referenceNo}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-charcoal">{r.companyName}</td>
                      <td className="px-4 py-3 text-muted tabular-nums whitespace-nowrap text-xs">
                        {formatDate(r.eventDate)}
                      </td>
                      <td className="px-4 py-3 text-charcoal">{r.eventName}</td>
                      <td className="px-4 py-3 text-muted">{r.eventType}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => setSelected(r)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-navy transition-colors hover:border-sand hover:bg-offwhite"
                          aria-label={`View ${r.referenceNo}`}
                        >
                          <Eye className="h-4 w-4" strokeWidth={1.75} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <AdminPanelModal
        open={Boolean(selected)}
        title={selected?.eventName ?? "RFQ details"}
        subtitle={selected ? `${selected.referenceNo} · ${formatDateTime(selected.createdAt)}` : undefined}
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
                <DetailRow icon={Calendar} label="Event date" value={formatDate(selected.eventDate)} />
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
