"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { SUPERADMIN_ROLE } from "@/lib/admin-roles";
import { useAdminChrome } from "./AdminChromeContext";

const PURPLE = "#5B2D9B";

type Stats = {
  newContacts: number;
  newQuotes: number;
};

function titleForPath(pathname: string): string {
  if (pathname === "/admin" || pathname === "/admin/") return "Dashboard";
  if (pathname.startsWith("/admin/products")) return "Products";
  if (pathname.startsWith("/admin/quotations")) return "Quotations";
  if (pathname.startsWith("/admin/enquiries")) return "Quick enquiries";
  if (pathname.startsWith("/admin/rfq")) return "Trade enquiries";
  if (pathname.startsWith("/admin/contacts")) return "Contacts";
  return "Admin";
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M21 15a4 4 0 01-4 4H8l-4 4V7a4 4 0 014-4h13a4 4 0 014 4v8z" strokeLinejoin="round" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path
        d="M18 8a6 6 0 10-12 0c0 7-3 7-3 7h18s-3 0-3-7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M13.73 21a2 2 0 01-3.46 0" strokeLinecap="round" />
    </svg>
  );
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

export function AdminTopBar() {
  const router = useRouter();
  const pathname = usePathname();
  const {
    setSidebarOpen,
    staffProfile,
    staffProfileLoading,
    canAccessContacts,
  } = useAdminChrome();
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

  const chatBadge = stats?.newContacts ?? 0;
  const bellBadge = stats?.newQuotes ?? 0;
  const showContactAttention = Boolean(canAccessContacts && stats && stats.newContacts > 0);
  const showQuoteAttention = Boolean(stats && stats.newQuotes > 0);
  const notificationsCaughtUp =
    stats != null && !showContactAttention && !showQuoteAttention;

  return (
    <header
      className="sticky top-0 z-30 h-[72px] shrink-0 border-b border-black/[0.06] bg-white flex items-center gap-3 sm:gap-5 px-4 sm:px-8"
      style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.04)" }}
    >
      <div className="flex items-center gap-3 min-w-0 shrink-0">
        <button
          type="button"
          className="md:hidden p-2 -ml-2 rounded-xl text-[#1a1a1a]/80 hover:bg-[#F5F5F7] transition-colors"
          aria-label="Open menu"
          onClick={() => setSidebarOpen(true)}
        >
          <MenuIcon />
        </button>
        <h1 className="text-base sm:text-lg font-bold text-[#1a1a1a] tracking-tight truncate">{pageTitle}</h1>
      </div>

      <form onSubmit={onSearch} className="flex-1 justify-center min-w-0 hidden sm:flex">
        <label htmlFor="admin-search" className="sr-only">
          Search products
        </label>
        <div className="relative w-full max-w-xl">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1a1a1a]/35 pointer-events-none">
            <SearchIcon />
          </span>
          <input
            id="admin-search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search something here..."
            className="w-full h-11 pl-11 pr-4 text-sm text-[#1a1a1a] bg-[#F5F5F7] rounded-full outline-none placeholder:text-[#1a1a1a]/35 focus:ring-2 focus:ring-[#5B2D9B]/20 transition-shadow border border-transparent focus:border-[#5B2D9B]/25"
          />
        </div>
      </form>

      <form onSubmit={onSearch} className="flex-1 min-w-0 sm:hidden">
        <label htmlFor="admin-search-mobile" className="sr-only">
          Search products
        </label>
        <div className="relative w-full">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1a1a1a]/35 pointer-events-none">
            <SearchIcon />
          </span>
          <input
            id="admin-search-mobile"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search…"
            className="w-full h-10 pl-9 pr-3 text-sm text-[#1a1a1a] bg-[#F5F5F7] rounded-full outline-none placeholder:text-[#1a1a1a]/35"
          />
        </div>
      </form>

      <div ref={panelRef} className="flex items-center gap-1 sm:gap-2 shrink-0">
        {canAccessContacts ? (
          <Link
            href="/admin/contacts"
            className="relative p-2.5 rounded-full text-[#1a1a1a]/55 hover:bg-[#F5F5F7] hover:text-[#1a1a1a] transition-colors"
            aria-label="Contact messages"
          >
            <ChatIcon />
            {chatBadge > 0 ? (
              <span
                className="absolute top-1 right-1 min-w-[20px] h-5 px-1 flex items-center justify-center rounded-full text-[10px] font-bold text-white leading-none"
                style={{ background: PURPLE }}
              >
                {chatBadge > 99 ? "99+" : chatBadge}
              </span>
            ) : null}
          </Link>
        ) : null}

        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setNotifOpen((o) => !o);
              setProfileOpen(false);
            }}
            className="relative p-2.5 rounded-full text-[#1a1a1a]/55 hover:bg-[#F5F5F7] hover:text-[#1a1a1a] transition-colors"
            aria-expanded={notifOpen}
            aria-haspopup="true"
            aria-label="Notifications"
          >
            <BellIcon />
            {bellBadge > 0 ? (
              <span
                className="absolute top-1 right-1 min-w-[20px] h-5 px-1 flex items-center justify-center rounded-full text-[10px] font-bold text-white leading-none"
                style={{ background: PURPLE }}
              >
                {bellBadge > 99 ? "99+" : bellBadge}
              </span>
            ) : null}
          </button>

          {notifOpen ? (
            <div
              className="absolute right-0 top-full mt-2 w-[min(100vw-2rem,320px)] rounded-[20px] bg-white z-50 py-2"
              style={{ boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.08)" }}
              role="menu"
            >
              <p className="px-4 py-2 text-[10px] font-semibold tracking-[0.15em] uppercase text-[#1a1a1a]/45">
                Attention needed
              </p>
              {stats != null && stats.newContacts > 0 && canAccessContacts ? (
                <Link
                  href="/admin/contacts"
                  onClick={() => setNotifOpen(false)}
                  className="block px-4 py-2.5 text-sm text-[#1a1a1a] hover:bg-[#F5F5F7]"
                  role="menuitem"
                >
                  <span className="font-semibold" style={{ color: PURPLE }}>
                    {stats.newContacts}
                  </span>{" "}
                  new contact message{stats.newContacts !== 1 ? "s" : ""}
                </Link>
              ) : null}
              {stats != null && stats.newQuotes > 0 ? (
                <Link
                  href="/admin/quotations"
                  onClick={() => setNotifOpen(false)}
                  className="block px-4 py-2.5 text-sm text-[#1a1a1a] hover:bg-[#F5F5F7]"
                  role="menuitem"
                >
                  <span className="font-semibold" style={{ color: PURPLE }}>
                    {stats.newQuotes}
                  </span>{" "}
                  new quotation{stats.newQuotes !== 1 ? "s" : ""}
                </Link>
              ) : null}
              {notificationsCaughtUp ? (
                <p className="px-4 py-3 text-sm text-[#1a1a1a]/50">You&apos;re all caught up.</p>
              ) : null}
              {stats === null ? <p className="px-4 py-3 text-sm text-[#1a1a1a]/50">Loading…</p> : null}
            </div>
          ) : null}
        </div>

        <div className="relative pl-1 sm:pl-2 border-l border-black/[0.06] ml-1">
          <button
            type="button"
            onClick={() => {
              setProfileOpen((o) => !o);
              setNotifOpen(false);
            }}
            className="flex items-center gap-2.5 pl-1 pr-1 py-1 rounded-2xl hover:bg-[#F5F5F7] transition-colors"
            aria-expanded={profileOpen}
            aria-haspopup="true"
            aria-label="Account menu"
          >
            {staffProfile?.profileImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={staffProfile.profileImageUrl}
                alt=""
                className="w-10 h-10 rounded-full object-cover ring-2 ring-white"
                style={{ boxShadow: "0px 10px 20px rgba(75, 38, 164, 0.25)" }}
              />
            ) : (
              <span
                className="w-10 h-10 rounded-full text-white text-xs font-bold flex items-center justify-center ring-2 ring-white"
                style={{
                  background: `linear-gradient(135deg, ${PURPLE}, #7c5ce0)`,
                  boxShadow: "0px 10px 20px rgba(75, 38, 164, 0.25)",
                }}
              >
                {staffProfileLoading ? "…" : initialsFromName(staffProfile?.fullName || "?")}
              </span>
            )}
            <span className="hidden lg:flex flex-col items-start min-w-0">
              <span className="text-sm font-semibold text-[#1a1a1a] leading-tight truncate max-w-[140px]">
                {staffProfileLoading ? "Loading…" : staffProfile?.fullName || "Staff"}
              </span>
              <span className="text-xs text-[#1a1a1a]/45 leading-tight">
                {staffProfileLoading ? "…" : roleLabel(staffProfile?.role)}
              </span>
            </span>
          </button>

          {profileOpen ? (
            <div
              className="absolute right-0 top-full mt-2 w-[min(100vw-2rem,280px)] rounded-[20px] bg-white z-50 py-1 overflow-hidden"
              style={{ boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.08)" }}
            >
              <div className="px-4 py-3 border-b border-black/[0.06] flex gap-3">
                {staffProfile?.profileImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={staffProfile.profileImageUrl}
                    alt=""
                    className="w-12 h-12 rounded-2xl object-cover shrink-0"
                  />
                ) : (
                  <span
                    className="w-12 h-12 rounded-2xl text-white text-sm font-bold flex items-center justify-center shrink-0"
                    style={{ background: `linear-gradient(135deg, ${PURPLE}, #7c5ce0)` }}
                  >
                    {initialsFromName(staffProfile?.fullName || "?")}
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[#1a1a1a] truncate">
                    {staffProfile?.fullName || "—"}
                  </p>
                  <p className="text-xs text-[#1a1a1a]/50 truncate mt-0.5">{staffProfile?.email || ""}</p>
                  <p className="text-[10px] font-semibold tracking-wider uppercase text-[#1a1a1a]/40 mt-1">
                    {roleLabel(staffProfile?.role)}
                  </p>
                </div>
              </div>
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setProfileOpen(false)}
                className="block px-4 py-2.5 text-sm text-[#1a1a1a] hover:bg-[#F5F5F7]"
              >
                View public site
              </a>
              <button
                type="button"
                className="w-full text-left px-4 py-2.5 text-sm text-[#1a1a1a] hover:bg-[#F5F5F7]"
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
