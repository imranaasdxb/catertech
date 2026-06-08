"use client";

import {
  ClipboardList,
  LayoutDashboard,
  LayoutGrid,
  Mail,
  Package,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AdminSessionNavBar } from "@/components/ui/sidebar";
import { AdminChromeProvider, useAdminChrome } from "./AdminChromeContext";
import { AdminTopBar } from "./AdminTopBar";

const links: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/quotations", label: "Quotations", icon: ClipboardList },
  { href: "/admin/enquiries", label: "Quick enquiries", icon: UsersRound },
  { href: "/admin/rfq", label: "Trade enquiries", icon: LayoutGrid },
  { href: "/admin/contacts", label: "Contacts", icon: Mail },
];

function AdminShellInner({ children }: { children: React.ReactNode }) {
  const {
    sidebarOpen,
    setSidebarOpen,
    sidebarCollapsed,
    toggleSidebarCollapsed,
    canAccessContacts,
    staffProfile,
    staffProfileLoading,
  } = useAdminChrome();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/auth?tab=login";
  }

  const navLinks = canAccessContacts
    ? links
    : links.filter((l) => l.href !== "/admin/contacts");

  const staffName = staffProfile?.fullName?.trim() || "Account";
  const staffEmail = staffProfile?.email?.trim();
  const staffInitials = staffName
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";

  return (
    <div className="min-h-dvh flex flex-col bg-[#F5F5F7] text-[#1a1a1a]">
      <div className="flex w-full flex-1 min-h-dvh items-start">
        {sidebarOpen ? (
          <button
            type="button"
            className="fixed inset-0 z-30 bg-black/40 md:hidden"
            aria-label="Close menu"
            onClick={() => setSidebarOpen(false)}
          />
        ) : null}

        <AdminSessionNavBar
          links={navLinks}
          collapsed={sidebarCollapsed}
          onToggleCollapsed={toggleSidebarCollapsed}
          mobileOpen={sidebarOpen}
          onMobileClose={() => setSidebarOpen(false)}
          onLogout={() => void logout()}
          staffName={staffProfileLoading ? "Loading…" : staffName}
          staffEmail={staffEmail}
          staffAvatarUrl={staffProfile?.profileImageUrl ?? null}
          staffInitials={staffInitials}
        />

        <div
          className={[
            "flex min-h-dvh min-w-0 flex-1 flex-col transition-[margin-left] duration-200 ease-out",
            sidebarCollapsed ? "md:ml-[3.05rem]" : "md:ml-[15rem]",
          ].join(" ")}
        >
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
