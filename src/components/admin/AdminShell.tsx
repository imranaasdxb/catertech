"use client";

import "./AdminSidebarSlotted.css";

import {
  ClipboardList,
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
  const { sidebarOpen, setSidebarOpen, canAccessContacts } = useAdminChrome();

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
            /* Mobile drawer */
            "fixed inset-y-0 left-0",
            /* Desktop: full viewport rail, sticks while the page scrolls */
            "md:sticky md:top-0 md:self-start md:left-auto md:inset-auto md:h-dvh md:max-h-dvh md:z-auto",
            "transition-transform duration-200 ease-out",
            "md:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          ].join(" ")}
        >
          <div className="px-5 pb-7 flex items-center gap-3 shrink-0">
            <span
              className="w-11 h-11 rounded-full bg-white/18 flex items-center justify-center text-white text-lg font-bold leading-none ring-2 ring-white/30"
              aria-hidden
            >
              C
            </span>
            <div className="min-w-0">
              <p className="text-white text-[17px] font-bold tracking-tight truncate">
                CaterTech
              </p>
              <p className="text-white/60 text-[11px] font-medium">Admin panel</p>
            </div>
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
                    >
                      <Icon className="size-[20px] shrink-0" strokeWidth={1.85} aria-hidden />
                      {l.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="px-5 pt-5 mt-auto shrink-0 space-y-3 border-t border-white/18">
            <p className="text-[10px] text-white/45 leading-relaxed text-center px-1">
              © {new Date().getFullYear()} CaterTech. Internal use only.
            </p>
            <Link
              href="/"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition-opacity hover:opacity-95 active:opacity-90"
              style={{ background: LAVENDER_CTA, color: ADMIN_PURPLE }}
            >
              Visit site
              <ArrowRightIcon />
            </Link>
            <button
              type="button"
              onClick={() => void logout()}
              className="w-full flex items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-4 py-3 text-xs font-semibold tracking-wide text-white/92 hover:bg-white/15 transition-colors"
            >
              <LogOut className="size-4 shrink-0" strokeWidth={2} aria-hidden />
              Log out
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
