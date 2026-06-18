"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  ChevronsLeft,
  ExternalLink,
  LogOut,
  MoreHorizontal,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SIDEBAR_OPEN_W = "17.5rem";
const SIDEBAR_CLOSED_W = "4.5rem";

const sidebarVariants = {
  open: { width: SIDEBAR_OPEN_W },
  closed: { width: SIDEBAR_CLOSED_W },
};

const labelVariants = {
  open: {
    x: 0,
    opacity: 1,
    transition: { x: { stiffness: 1000, velocity: -100 } },
  },
  closed: {
    x: -12,
    opacity: 0,
    transition: { x: { stiffness: 100 } },
  },
};

const transitionProps = {
  type: "tween" as const,
  ease: "easeOut" as const,
  duration: 0.2,
};

export type AdminNavLink = {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
};

export type AdminSessionNavBarProps = {
  links: AdminNavLink[];
  collapsed: boolean;
  onToggleCollapsed: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
  onLogout: () => void;
  staffName?: string;
  staffEmail?: string;
  staffAvatarUrl?: string | null;
  staffInitials?: string;
};

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function isLinkActive(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function SidebarMenuItem({
  href,
  label,
  icon: Icon,
  active,
  collapsed,
  badge,
  onNavigate,
  external,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
  collapsed: boolean;
  badge?: number;
  onNavigate?: () => void;
  external?: boolean;
}) {
  const className = cn(
    "group flex h-10 w-full items-center gap-3 px-3 transition-all duration-200 ease-in-out",
    collapsed ? "justify-center px-0" : "",
    active
      ? "rounded-2xl bg-admin-nav-active text-white shadow-[0_4px_14px_rgba(0,0,0,0.12)]"
      : "rounded-xl text-admin-ink hover:bg-admin-nav-hover",
  );

  const inner = (
    <>
      <Icon
        className={cn(
          "size-[18px] shrink-0",
          active ? "text-white" : "text-admin-muted group-hover:text-admin-ink",
        )}
        strokeWidth={active ? 2.25 : 2}
      />
      {!collapsed && (
        <motion.span variants={labelVariants} className="flex min-w-0 flex-1 items-center gap-2">
          <span className={cn("truncate text-sm font-medium", active && "text-white")}>
            {label}
          </span>
          {badge != null && badge > 0 ? (
            <span
              className={cn(
                "ml-auto shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold tabular-nums",
                active ? "bg-white/20 text-white" : "bg-admin-nav-hover text-admin-muted",
              )}
            >
              {badge > 99 ? "99+" : badge}
            </span>
          ) : null}
        </motion.span>
      )}
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onNavigate}
        className={className}
        title={collapsed ? label : undefined}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={className}
      aria-current={active ? "page" : undefined}
      title={collapsed ? label : undefined}
    >
      {inner}
    </Link>
  );
}

function SidebarSectionLabel({ label, collapsed }: { label: string; collapsed: boolean }) {
  if (collapsed) return <div className="h-2" aria-hidden />;
  return (
    <p className="mb-2 mt-5 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-admin-muted first:mt-2">
      {label}
    </p>
  );
}

export function AdminSessionNavBar({
  links,
  collapsed,
  onToggleCollapsed,
  mobileOpen,
  onMobileClose,
  onLogout,
  staffName = "Account",
  staffEmail,
  staffAvatarUrl,
  staffInitials,
}: AdminSessionNavBarProps) {
  const pathname = usePathname();
  const initials = staffInitials ?? initialsFromName(staffName);
  const isCollapsed = collapsed && !mobileOpen;
  const expanded = !isCollapsed;

  const otherLinks = [{ href: "/", label: "Visit site", icon: ExternalLink, external: true }] as const;

  return (
    <motion.aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-dvh shrink-0 flex-col overflow-visible border-r border-admin-border bg-admin-shell p-4",
        "transition-transform duration-200 ease-out md:transition-none",
        mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
      )}
      initial={false}
      animate={isCollapsed ? "closed" : "open"}
      variants={sidebarVariants}
      transition={transitionProps}
      aria-label="Admin navigation"
    >
      {/* Brand — height matches header (72px) */}
      <div className="relative flex h-[var(--admin-header-height)] shrink-0 items-center gap-2">
        <Link
          href="/admin"
          onClick={onMobileClose}
          className={cn(
            "flex min-w-0 flex-1 items-center gap-3 rounded-xl transition-all duration-200 ease-in-out hover:bg-admin-nav-hover",
            isCollapsed ? "justify-center px-0" : "px-1",
          )}
          title="CaterTech Admin"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-admin-nav-active text-sm font-bold text-white shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
            C
          </span>
          {expanded && (
            <motion.span variants={labelVariants} className="min-w-0 truncate text-lg font-bold tracking-tight text-admin-ink">
              CaterTech
            </motion.span>
          )}
        </Link>
        {!isCollapsed && (
          <button
            type="button"
            onClick={onToggleCollapsed}
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-admin-border bg-admin-surface text-admin-muted transition-all duration-200 ease-in-out hover:bg-admin-nav-hover hover:text-admin-ink"
            aria-label="Collapse sidebar"
            title="Collapse sidebar"
          >
            <ChevronsLeft className="size-4" strokeWidth={2} aria-hidden />
          </button>
        )}
      </div>

      {/* Collapsed: toggle sits on sidebar edge, half over header */}
      {isCollapsed && (
        <button
          type="button"
          onClick={onToggleCollapsed}
          className="absolute right-0 top-[calc(var(--admin-header-height)/2)] z-50 hidden size-7 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-admin-border bg-admin-surface text-admin-muted shadow-md transition-all duration-200 ease-in-out hover:bg-admin-nav-hover hover:text-admin-ink md:flex"
          aria-label="Expand sidebar"
          title="Expand sidebar"
        >
          <ChevronsLeft className="size-3.5 rotate-180" strokeWidth={2} aria-hidden />
        </button>
      )}

      <ScrollArea className="min-h-0 flex-1 -mx-1 px-1">
        <nav className="flex flex-col pb-2">
          <SidebarSectionLabel label="Menu" collapsed={isCollapsed} />
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <SidebarMenuItem
                key={l.href}
                href={l.href}
                label={l.label}
                icon={l.icon}
                active={isLinkActive(pathname, l.href)}
                collapsed={isCollapsed}
                badge={l.badge}
                onNavigate={onMobileClose}
              />
            ))}
          </div>

          <SidebarSectionLabel label="Others" collapsed={isCollapsed} />
          <div className="flex flex-col gap-1">
            {otherLinks.map((l) => (
              <SidebarMenuItem
                key={l.href + l.label}
                href={l.href}
                label={l.label}
                icon={l.icon}
                active={false}
                collapsed={isCollapsed}
                onNavigate={onMobileClose}
                external={l.external}
              />
            ))}
            <button
              type="button"
              onClick={() => {
                onMobileClose();
                void onLogout();
              }}
              className={cn(
                "group flex h-10 w-full items-center gap-3 px-3 transition-all duration-200 ease-in-out rounded-xl text-admin-ink hover:bg-admin-nav-hover",
                isCollapsed && "justify-center px-0",
              )}
              title={isCollapsed ? "Log out" : undefined}
            >
              <LogOut
                className="size-[18px] shrink-0 text-admin-muted group-hover:text-admin-ink"
                strokeWidth={2}
                aria-hidden
              />
              {!isCollapsed && (
                <span className="truncate text-sm font-medium">Log out</span>
              )}
            </button>
          </div>
        </nav>
      </ScrollArea>

      {/* Bottom profile card */}
      <div className="mt-3 shrink-0 pt-2">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger
            className={cn(
              "flex w-full items-center gap-3 rounded-2xl border border-admin-border bg-admin-surface p-2.5 outline-none transition-all duration-200 ease-in-out hover:bg-admin-nav-hover",
              isCollapsed && "justify-center px-2",
            )}
          >
            <Avatar className="size-9 shrink-0">
              {staffAvatarUrl ? <AvatarImage src={staffAvatarUrl} alt={staffName} /> : null}
              <AvatarFallback className="bg-admin-accent-tint text-xs font-semibold text-admin-accent">
                {initials}
              </AvatarFallback>
            </Avatar>
            {expanded && (
              <motion.span variants={labelVariants} className="flex min-w-0 flex-1 items-center gap-2 text-left">
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-admin-ink">{staffName}</span>
                  {staffEmail ? (
                    <span className="block truncate text-xs text-admin-muted">{staffEmail}</span>
                  ) : null}
                </span>
                <MoreHorizontal className="size-4 shrink-0 text-admin-muted" aria-hidden />
              </motion.span>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent sideOffset={8} align="start" className="w-56 rounded-2xl">
            <div className="flex items-center gap-2 p-2">
              <Avatar className="size-9">
                {staffAvatarUrl ? <AvatarImage src={staffAvatarUrl} alt={staffName} /> : null}
                <AvatarFallback className="bg-admin-accent-tint text-xs font-semibold text-admin-accent">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-admin-ink">{staffName}</p>
                {staffEmail ? (
                  <p className="truncate text-xs text-admin-muted">{staffEmail}</p>
                ) : null}
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer gap-2 rounded-lg"
              onClick={() => void onLogout()}
            >
              <LogOut className="size-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.aside>
  );
}

export { SIDEBAR_OPEN_W, SIDEBAR_CLOSED_W };

/** Premium dashboard sidebar alias */
export const DashboardSidebar = AdminSessionNavBar;

/** @deprecated Use AdminSessionNavBar for CaterTech admin. */
export const SessionNavBar = AdminSessionNavBar;
