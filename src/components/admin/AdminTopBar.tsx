"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { Bell, Menu } from "lucide-react";
import SubmitSearch from "@/components/ui/SubmitSearch";
import { SUPERADMIN_ROLE } from "@/lib/admin-roles";
import { cn } from "@/lib/utils";
import { useAdminChrome } from "./AdminChromeContext";

const ACCENT = "#f87941";
const ADMIN_STATS_CHANGED_EVENT = "admin:stats-changed";
const VIEWED_NOTIFICATIONS_KEY = "catertech-admin-viewed-notifications";
const STATS_RELATED_API_PREFIXES = [
  "/api/admin/products",
  "/api/admin/contacts",
  "/api/admin/enquiries",
  "/api/admin/rfq",
  "/api/admin/quotations",
];

type Stats = {
  newContacts: number;
  newQuotes: number;
};

type NotificationItem = {
  id: string;
  type: "contact" | "quotation" | "enquiry" | "rfq";
  typeLabel: string;
  title: string;
  body: string;
  href: string;
  createdAt: string;
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

function relativeTimeLabel(value: string) {
  const time = new Date(value).getTime();
  if (!Number.isFinite(time)) return "";
  const diffSeconds = Math.max(0, Math.floor((Date.now() - time) / 1000));
  if (diffSeconds < 60) return "Just now";
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

function readViewedNotificationIds() {
  if (typeof window === "undefined") return new Set<string>();
  try {
    const raw = window.localStorage.getItem(VIEWED_NOTIFICATIONS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : []);
  } catch {
    return new Set<string>();
  }
}

function writeViewedNotificationIds(ids: Set<string>) {
  const recent = [...ids].slice(-200);
  window.localStorage.setItem(VIEWED_NOTIFICATIONS_KEY, JSON.stringify(recent));
}

function requestPath(input: RequestInfo | URL): string {
  if (typeof input === "string") {
    try {
      return new URL(input, window.location.origin).pathname;
    } catch {
      return input;
    }
  }
  if (input instanceof URL) return input.pathname;
  try {
    return new URL(input.url, window.location.origin).pathname;
  } catch {
    return input.url;
  }
}

function requestMethod(input: RequestInfo | URL, init?: RequestInit): string {
  if (init?.method) return init.method.toUpperCase();
  if (input instanceof Request) return input.method.toUpperCase();
  return "GET";
}

function isStatsRelatedMutation(input: RequestInfo | URL, init?: RequestInit): boolean {
  const method = requestMethod(input, init);
  if (method === "GET" || method === "HEAD") return false;

  const path = requestPath(input);
  return STATS_RELATED_API_PREFIXES.some((prefix) => path.startsWith(prefix));
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

export function AdminTopBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { setSidebarOpen, staffProfile, staffProfileLoading, canAccessContacts } = useAdminChrome();
  const pageTitle = titleForPath(pathname);

  const [q, setQ] = useState("");
  const [searchPending, startSearchTransition] = useTransition();
  const [stats, setStats] = useState<Stats | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [viewedNotificationIds, setViewedNotificationIds] = useState<Set<string>>(
    () => new Set()
  );
  const [notifOpen, setNotifOpen] = useState(false);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const refreshStats = useCallback(async (signal?: AbortSignal) => {
    const res = await fetch("/api/admin/stats", {
      cache: "no-store",
      signal,
    });
    if (!res.ok) return;
    const data = await res.json();
    setStats({
      newContacts: data.newContacts ?? 0,
      newQuotes: data.newQuotes ?? 0,
    });
  }, []);

  const refreshNotifications = useCallback(async (signal?: AbortSignal) => {
    const res = await fetch("/api/admin/notifications", {
      cache: "no-store",
      signal,
    });
    if (!res.ok) return;
    const data = (await res.json()) as { notifications?: NotificationItem[] };
    setNotifications(data.notifications ?? []);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    refreshStats(controller.signal).catch(() => {});
    refreshNotifications(controller.signal).catch(() => {});

    const onStatsChanged = () => {
      refreshStats().catch(() => {});
      refreshNotifications().catch(() => {});
    };

    window.addEventListener(ADMIN_STATS_CHANGED_EVENT, onStatsChanged);
    return () => {
      controller.abort();
      window.removeEventListener(ADMIN_STATS_CHANGED_EVENT, onStatsChanged);
    };
  }, [refreshNotifications, refreshStats]);

  useEffect(() => {
    setViewedNotificationIds(readViewedNotificationIds());
  }, []);

  useEffect(() => {
    const originalFetch = window.fetch.bind(window);

    const statsAwareFetch: typeof window.fetch = async (input, init) => {
      const shouldRefreshStats = isStatsRelatedMutation(input, init);
      const response = await originalFetch(input, init);

      if (shouldRefreshStats && response.ok) {
        window.dispatchEvent(new Event(ADMIN_STATS_CHANGED_EVENT));
      }

      return response;
    };

    window.fetch = statsAwareFetch;

    return () => {
      if (window.fetch === statsAwareFetch) {
        window.fetch = originalFetch;
      }
    };
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

  function onSearch(query: string) {
    setQ(query);
    startSearchTransition(() => {
      router.push(query ? `/admin/products?q=${encodeURIComponent(query)}` : "/admin/products");
    });
  }

  function markNotificationsViewed(ids: string[]) {
    setViewedNotificationIds((current) => {
      const next = new Set(current);
      ids.forEach((id) => next.add(id));
      writeViewedNotificationIds(next);
      return next;
    });
  }

  const visibleNotifications = notifications.filter(
    (item) =>
      !viewedNotificationIds.has(item.id) &&
      (item.type !== "contact" || canAccessContacts)
  );
  const displayedNotifications = showAllNotifications
    ? visibleNotifications
    : visibleNotifications.slice(0, 5);
  const hiddenNotificationCount = Math.max(
    0,
    visibleNotifications.length - displayedNotifications.length
  );
  const bellBadge = visibleNotifications.length;
  const notificationsCaughtUp = stats != null && visibleNotifications.length === 0;

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

      <SubmitSearch
        id="admin-search"
        value={q}
        onSearch={onSearch}
        loading={searchPending}
        label="Search products"
        placeholder="Search products..."
        className="flex-1 max-w-xl lg:max-w-[32rem]"
        inputClassName="h-11 w-full rounded-full border border-admin-border bg-admin-surface text-sm text-admin-ink outline-none placeholder:text-admin-faint focus:border-admin-accent/40 focus:ring-2 focus:ring-admin-accent/15"
      />

      <div ref={panelRef} className="ml-auto flex shrink-0 items-center gap-2 sm:gap-2.5">
        <div className="relative">
          <HeaderIconButton
            badge={bellBadge > 0 ? bellBadge : undefined}
            onClick={() => {
              setNotifOpen((o) => !o);
              setShowAllNotifications(false);
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
              className="absolute right-0 top-full z-50 mt-2 w-[min(100vw-2rem,380px)] overflow-hidden rounded-2xl border border-admin-border bg-admin-surface shadow-[0_10px_40px_rgba(0,0,0,0.08)]"
              role="menu"
            >
              <div className="flex items-center justify-between gap-3 border-b border-admin-border px-4 py-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-admin-muted">
                    Notifications
                  </p>
                  <p className="mt-0.5 text-xs text-admin-faint">
                    {bellBadge ? `${bellBadge} unread` : "No unread notifications"}
                  </p>
                </div>
                {visibleNotifications.length ? (
                  <button
                    type="button"
                    onClick={() => markNotificationsViewed(visibleNotifications.map((item) => item.id))}
                    className="shrink-0 text-xs font-semibold text-admin-accent hover:underline"
                  >
                    Clear all
                  </button>
                ) : null}
              </div>
              {displayedNotifications.length ? (
                <div className="max-h-[360px] overflow-y-auto py-1">
                  {displayedNotifications.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => {
                        markNotificationsViewed([item.id]);
                        setNotifOpen(false);
                      }}
                      className="block border-b border-admin-border/70 px-4 py-3 text-sm text-admin-ink transition-colors last:border-b-0 hover:bg-admin-nav-hover"
                      role="menuitem"
                    >
                      <span className="mb-1 flex items-center justify-between gap-3">
                        <span className="rounded-full bg-admin-accent/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-admin-accent">
                          {item.typeLabel}
                        </span>
                        <span className="shrink-0 text-[11px] text-admin-faint">
                          {relativeTimeLabel(item.createdAt)}
                        </span>
                      </span>
                      <span className="block truncate font-semibold">{item.title}</span>
                      <span className="mt-0.5 block truncate text-xs text-admin-muted">
                        {item.body}
                      </span>
                    </Link>
                  ))}
                </div>
              ) : null}
              {hiddenNotificationCount > 0 ? (
                <button
                  type="button"
                  onClick={() => setShowAllNotifications(true)}
                  className="w-full border-t border-admin-border px-4 py-2.5 text-center text-xs font-semibold text-admin-accent transition-colors hover:bg-admin-nav-hover"
                >
                  View all ({visibleNotifications.length})
                </button>
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
