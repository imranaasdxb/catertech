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
import { cn } from "@/lib/utils";

const links: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/quotations", label: "Quotations", icon: ClipboardList },
  { href: "/admin/enquiries", label: "Quick enquiries", icon: UsersRound },
  { href: "/admin/rfq", label: "Events RFQ enquiry", icon: LayoutGrid },
  { href: "/admin/contacts", label: "Contacts", icon: Mail },
];

export function DashboardContent({ children }: { children: React.ReactNode }) {
  return (
    <main className="admin-dashboard-content flex flex-1 flex-col overflow-hidden rounded-tl-[36px] rounded-tr-[28px] rounded-br-[28px] border border-admin-border/80 bg-admin-surface shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col px-5 py-6 sm:px-7 sm:py-8 lg:px-8">
        {children}
      </div>
    </main>
  );
}

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
    <div className="min-h-dvh bg-admin-bg font-sans text-admin-ink antialiased">
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
        className={cn(
          "flex min-h-dvh flex-col transition-[margin-left] duration-200 ease-in-out",
          sidebarCollapsed ? "md:ml-[4.5rem]" : "md:ml-[17.5rem]",
        )}
      >
        <AdminTopBar />
        <div className="flex flex-1 flex-col pr-3 pb-3 md:pr-4 md:pb-4">
          <DashboardContent>{children}</DashboardContent>
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

/** Premium dashboard shell alias */
export const DashboardShell = AdminShell;
