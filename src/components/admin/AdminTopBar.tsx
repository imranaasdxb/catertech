"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Bell, Menu, Search } from "lucide-react";
import { SUPERADMIN_ROLE } from "@/lib/admin-roles";
import { cn } from "@/lib/utils";
import { useAdminChrome } from "./AdminChromeContext";

const ACCENT = "#f87941";

type Stats = {
  newContacts: number;
  newQuotes: number;
};

function titleForPath(pathname: string): string {
  if (pathname === "/admin" || pathname === "/admin/") return "Dashboard";
  if (pathname.startsWith("/admin/products")) return "Products";
  if (pathname.startsWith("/admin/quotations")) return "Quotations";
  if (pathname.startsWith("/admin/enquiries")) return "Quick enquiries";
  if (pathname.startsWith("/admin/rfq")) return "Events RFQ enquiry";
  if (pathname.startsWith("/admin/contacts")) return "Contacts";
  return "Admin";
}

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function roleLabel(role: string | undefined): string {
  const r = (role || "").trim().toLowerCase();
  if (r === SUPERADMIN_ROLE) return "Superadmin";
  return "Admin";
}

function HeaderIconButton({
  children,
  className,
  badge,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { badge?: number }) {
  return (
    <button
      type="button"
      className={cn(
        "relative flex size-10 shrink-0 items-center justify-center rounded-full border border-admin-border bg-admin-surface text-admin-muted transition-all duration-200 ease-in-out hover:bg-admin-nav-hover hover:text-admin-ink",
        className,
      )}
      {...props}
    >
      {children}
      {badge != null && badge > 0 ? (
        <span
          className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-[10px] font-bold leading-none text-white"
          style={{ background: ACCENT }}
        >
          {badge > 99 ? "99+" : badge}
        </span>
      ) : null}
    </button>
  );
}

function SearchField({
  id,
  value,
  onChange,
  onSubmit,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  onSubmit: (e: FormEvent) => void;
}) {
  return (
    <form onSubmit={onSubmit} className="flex min-w-0 flex-1 sm:justify-center">
      <label htmlFor={id} className="sr-only">
        Search products
      </label>
      <div className="relative w-full max-w-xl lg:max-w-[32rem]">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-admin-faint"
          strokeWidth={2}
          aria-hidden
        />
        <input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search something here..."
          className="h-11 w-full rounded-full border border-admin-border bg-admin-surface pl-11 pr-20 text-sm text-admin-ink outline-none transition-all duration-200 ease-in-out placeholder:text-admin-faint focus:border-admin-accent/40 focus:ring-2 focus:ring-admin-accent/15"
        />
        <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 rounded-lg border border-admin-border bg-admin-bg px-2 py-1 text-[10px] font-medium text-admin-muted sm:inline-flex">
          ⌘ K
        </kbd>
      </div>
    </form>
  );
}

export function AdminTopBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { setSidebarOpen, staffProfile, staffProfileLoading, canAccessContacts } = useAdminChrome();
  const pageTitle = titleForPath(pathname);

  const [q, setQ] = useState("");
  const [stats, setStats] = useState<Stats | null>(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) {
          setStats({
            newContacts: data.newContacts ?? 0,
            newQuotes: data.newQuotes ?? 0,
          });
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!panelRef.current?.contains(e.target as Node)) {
        setNotifOpen(false);
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function onSearch(e: FormEvent) {
    e.preventDefault();
    const s = q.trim();
    if (!s) return;
    router.push(`/admin/products?q=${encodeURIComponent(s)}`);
  }

  const bellBadge = stats?.newQuotes ?? 0;
  const showContactAttention = Boolean(canAccessContacts && stats && stats.newContacts > 0);
  const showQuoteAttention = Boolean(stats && stats.newQuotes > 0);
  const notificationsCaughtUp =
    stats != null && !showContactAttention && !showQuoteAttention;

  return (
    <header className="sticky top-0 z-30 flex h-[var(--admin-header-height)] shrink-0 items-center gap-3 bg-admin-bg px-4 sm:gap-4 sm:px-6 lg:px-7">
      <div className="flex min-w-0 shrink-0 items-center gap-2 md:hidden">
        <button
          type="button"
          className="flex size-10 items-center justify-center rounded-full border border-admin-border bg-admin-surface text-admin-ink transition-all duration-200 ease-in-out hover:bg-admin-nav-hover"
          aria-label="Open menu"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="size-5" strokeWidth={2} aria-hidden />
        </button>
        <h1 className="truncate text-base font-bold tracking-tight text-admin-ink">{pageTitle}</h1>
      </div>

      <SearchField id="admin-search" value={q} onChange={setQ} onSubmit={onSearch} />

      <div ref={panelRef} className="ml-auto flex shrink-0 items-center gap-2 sm:gap-2.5">
        <div className="relative">
          <HeaderIconButton
            badge={bellBadge > 0 ? bellBadge : undefined}
            onClick={() => {
              setNotifOpen((o) => !o);
              setProfileOpen(false);
            }}
            aria-expanded={notifOpen}
            aria-haspopup="true"
            aria-label="Notifications"
          >
            <Bell className="size-[18px]" strokeWidth={2} aria-hidden />
          </HeaderIconButton>

          {notifOpen ? (
            <div
              className="absolute right-0 top-full z-50 mt-2 w-[min(100vw-2rem,320px)] rounded-2xl border border-admin-border bg-admin-surface py-2 shadow-[0_10px_40px_rgba(0,0,0,0.08)]"
              role="menu"
            >
              <p className="px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-admin-muted">
                Attention needed
              </p>
              {stats != null && stats.newContacts > 0 && canAccessContacts ? (
                <Link
                  href="/admin/contacts"
                  onClick={() => setNotifOpen(false)}
                  className="block px-4 py-2.5 text-sm text-admin-ink transition-colors hover:bg-admin-nav-hover"
                  role="menuitem"
                >
                  <span className="font-semibold text-admin-accent">{stats.newContacts}</span> new contact
                  message{stats.newContacts !== 1 ? "s" : ""}
                </Link>
              ) : null}
              {stats != null && stats.newQuotes > 0 ? (
                <Link
                  href="/admin/quotations"
                  onClick={() => setNotifOpen(false)}
                  className="block px-4 py-2.5 text-sm text-admin-ink transition-colors hover:bg-admin-nav-hover"
                  role="menuitem"
                >
                  <span className="font-semibold text-admin-accent">{stats.newQuotes}</span> new quotation
                  {stats.newQuotes !== 1 ? "s" : ""}
                </Link>
              ) : null}
              {notificationsCaughtUp ? (
                <p className="px-4 py-3 text-sm text-admin-muted">You&apos;re all caught up.</p>
              ) : null}
              {stats === null ? <p className="px-4 py-3 text-sm text-admin-muted">Loading…</p> : null}
            </div>
          ) : null}
        </div>

        <div className="relative border-l border-admin-border pl-2 sm:pl-2.5">
          <button
            type="button"
            onClick={() => {
              setProfileOpen((o) => !o);
              setNotifOpen(false);
            }}
            className="flex items-center gap-2 rounded-full p-0.5 transition-all duration-200 ease-in-out hover:bg-admin-nav-hover"
            aria-expanded={profileOpen}
            aria-haspopup="true"
            aria-label="Account menu"
          >
            {staffProfile?.profileImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={staffProfile.profileImageUrl}
                alt=""
                className="size-10 rounded-full border-2 border-admin-surface object-cover shadow-sm"
              />
            ) : (
              <span
                className="flex size-10 items-center justify-center rounded-full border-2 border-admin-surface text-xs font-bold text-white shadow-sm"
                style={{ background: `linear-gradient(135deg, ${ACCENT}, #f9b095)` }}
              >
                {staffProfileLoading ? "…" : initialsFromName(staffProfile?.fullName || "?")}
              </span>
            )}
            <span className="hidden min-w-0 flex-col items-start lg:flex">
              <span className="max-w-[120px] truncate text-sm font-semibold leading-tight text-admin-ink">
                {staffProfileLoading ? "Loading…" : staffProfile?.fullName || "Staff"}
              </span>
              <span className="text-xs leading-tight text-admin-muted">
                {staffProfileLoading ? "…" : roleLabel(staffProfile?.role)}
              </span>
            </span>
          </button>

          {profileOpen ? (
            <div className="absolute right-0 top-full z-50 mt-2 w-[min(100vw-2rem,280px)] overflow-hidden rounded-2xl border border-admin-border bg-admin-surface py-1 shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
              <div className="flex gap-3 border-b border-admin-border px-4 py-3">
                {staffProfile?.profileImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={staffProfile.profileImageUrl}
                    alt=""
                    className="size-12 shrink-0 rounded-2xl object-cover"
                  />
                ) : (
                  <span
                    className="flex size-12 shrink-0 items-center justify-center rounded-2xl text-sm font-bold text-white"
                    style={{ background: `linear-gradient(135deg, ${ACCENT}, #f9b095)` }}
                  >
                    {initialsFromName(staffProfile?.fullName || "?")}
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-admin-ink">{staffProfile?.fullName || "—"}</p>
                  <p className="mt-0.5 truncate text-xs text-admin-muted">{staffProfile?.email || ""}</p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-admin-faint">
                    {roleLabel(staffProfile?.role)}
                  </p>
                </div>
              </div>
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setProfileOpen(false)}
                className="block px-4 py-2.5 text-sm text-admin-ink transition-colors hover:bg-admin-nav-hover"
              >
                View public site
              </a>
              <button
                type="button"
                className="w-full px-4 py-2.5 text-left text-sm text-admin-ink transition-colors hover:bg-admin-nav-hover"
                onClick={() => {
                  setProfileOpen(false);
                  void fetch("/api/auth/logout", { method: "POST" }).then(() => {
                    window.location.href = "/auth?tab=login";
                  });
                }}
              >
                Log out
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

/** Premium dashboard header alias */
export const DashboardHeader = AdminTopBar;
