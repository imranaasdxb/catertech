"use client";

import "./AdminSidebarSlotted.css";

import {
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  ExternalLink,
  FileText,
  LayoutDashboard,
  LayoutGrid,
  LogOut,
  Mail,
  Package,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminChromeProvider, useAdminChrome } from "./AdminChromeContext";
import { AdminTopBar } from "./AdminTopBar";

const ADMIN_PURPLE = "#5B2D9B";
const LAVENDER_CTA = "#D4C4F4";

const links: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/blogs", label: "Blog", icon: FileText },
  { href: "/admin/quotations", label: "Quotations", icon: ClipboardList },
  { href: "/admin/enquiries", label: "Quick enquiries", icon: UsersRound },
  { href: "/admin/rfq", label: "Trade enquiries", icon: LayoutGrid },
  { href: "/admin/contacts", label: "Contacts", icon: Mail },
];

function AdminShellInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const {
    sidebarOpen,
    setSidebarOpen,
    sidebarCollapsed,
    toggleSidebarCollapsed,
    canAccessContacts,
  } = useAdminChrome();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/auth?tab=login";
  }

  const navLinks = canAccessContacts
    ? links
    : links.filter((l) => l.href !== "/admin/contacts");

  return (
    <div
      className="min-h-dvh flex flex-col text-[#1a1a1a] bg-[#F5F5F7]"
    >
      {/* Page scroll on the viewport (single scrollbar). Sticky sidebar + header stay full-height / pinned so no bare strip beside the sidebar. */}
      <div className="flex w-full flex-1 min-h-dvh items-start">
        {sidebarOpen ? (
          <button
            type="button"
            className="fixed inset-0 z-30 bg-black/40 md:hidden"
            aria-label="Close menu"
            onClick={() => setSidebarOpen(false)}
          />
        ) : null}

        <aside
          className={[
            "admin-slotted-sidebar z-40 flex flex-col py-7 shrink-0",
            sidebarCollapsed ? "admin-slotted-sidebar--collapsed" : "",
            /* Mobile drawer */
            "fixed inset-y-0 left-0",
            /* Desktop: full viewport rail, sticks while the page scrolls */
            "md:sticky md:top-0 md:self-start md:left-auto md:inset-auto md:h-dvh md:max-h-dvh md:z-auto",
            "transition-[transform,width] duration-200 ease-out",
            "md:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          ].join(" ")}
        >
          <div
            className={[
              "pb-7 flex shrink-0 items-center gap-3 px-5",
              sidebarCollapsed ? "md:flex-col md:items-center md:gap-3 md:px-3" : "",
            ].join(" ")}
          >
            <span
              className="w-11 h-11 rounded-full bg-white/18 flex items-center justify-center text-white text-lg font-bold leading-none ring-2 ring-white/30 shrink-0"
              aria-hidden
            >
              C
            </span>
            <div
              className={[
                "min-w-0 flex-1",
                sidebarCollapsed ? "md:sr-only md:hidden" : "",
              ].join(" ")}
            >
              <p className="text-white text-[17px] font-bold tracking-tight truncate">
                CaterTech
              </p>
              <p className="text-white/60 text-[11px] font-medium">Admin panel</p>
            </div>
            <button
              type="button"
              onClick={toggleSidebarCollapsed}
              className={[
                "hidden md:flex items-center justify-center rounded-xl text-white/80 hover:text-white hover:bg-white/12 transition-colors shrink-0",
                sidebarCollapsed ? "size-9" : "size-8",
              ].join(" ")}
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="size-5" strokeWidth={2} aria-hidden />
              ) : (
                <ChevronLeft className="size-5" strokeWidth={2} aria-hidden />
              )}
            </button>
          </div>

          <nav className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden" aria-label="Admin">
            <ul className="admin-slotted-nav">
              {navLinks.map((l) => {
                const active =
                  l.href === "/admin"
                    ? pathname === "/admin"
                    : pathname === l.href || pathname.startsWith(`${l.href}/`);
                const Icon = l.icon;
                return (
                  <li key={l.href} className="admin-slotted-nav__item">
                    <Link
                      href={l.href}
                      onClick={() => setSidebarOpen(false)}
                      className={[
                        "admin-slotted-nav__link",
                        active ? "admin-slotted-nav__link--active" : "",
                      ].join(" ")}
                      aria-current={active ? "page" : undefined}
                      title={sidebarCollapsed ? l.label : undefined}
                    >
                      <Icon className="size-[20px] shrink-0" strokeWidth={1.85} aria-hidden />
                      <span className="admin-slotted-nav__label">{l.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div
            className={[
              "pt-5 mt-auto shrink-0 space-y-3 border-t border-white/18 px-5",
              sidebarCollapsed ? "md:px-2" : "",
            ].join(" ")}
          >
            <p
              className={[
                "text-[10px] text-white/45 leading-relaxed text-center px-1",
                sidebarCollapsed ? "md:sr-only md:hidden" : "",
              ].join(" ")}
            >
              © {new Date().getFullYear()} CaterTech. Internal use only.
            </p>
            <Link
              href="/"
              onClick={() => setSidebarOpen(false)}
              className={[
                "flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition-opacity hover:opacity-95 active:opacity-90",
                sidebarCollapsed ? "md:p-3 md:gap-0" : "",
              ].join(" ")}
              style={{ background: LAVENDER_CTA, color: ADMIN_PURPLE }}
              title="Visit site"
            >
              <span className={sidebarCollapsed ? "md:sr-only" : ""}>Visit site</span>
              <ExternalLink
                className={[
                  "size-[18px] shrink-0 hidden",
                  sidebarCollapsed ? "md:block" : "",
                ].join(" ")}
                strokeWidth={2.25}
                aria-hidden
              />
              <span className={sidebarCollapsed ? "md:hidden" : ""} aria-hidden={sidebarCollapsed}>
                <ArrowRightIcon />
              </span>
            </Link>
            <button
              type="button"
              onClick={() => void logout()}
              className={[
                "w-full flex items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-4 py-3 text-xs font-semibold tracking-wide text-white/92 hover:bg-white/15 transition-colors",
                sidebarCollapsed ? "md:p-3 md:gap-0" : "",
              ].join(" ")}
              title="Log out"
            >
              <LogOut className="size-4 shrink-0" strokeWidth={2} aria-hidden />
              <span className={sidebarCollapsed ? "md:sr-only" : ""}>Log out</span>
            </button>
          </div>
        </aside>

        <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
          <AdminTopBar />
          <main className="flex flex-1 flex-col bg-[#F5F5F7]">
            <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col bg-[#F5F5F7] px-4 py-8 pb-14 sm:px-6 lg:px-10">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <AdminChromeProvider>
      <AdminShellInner>{children}</AdminShellInner>
    </AdminChromeProvider>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
