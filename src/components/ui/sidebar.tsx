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
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  LogOut,
  Settings,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ADMIN_ACTIVE = "bg-surface-container text-[#5B2D9B]";
const ADMIN_PURPLE = "#5B2D9B";
const SIDEBAR_OPEN_W = "15rem";
const SIDEBAR_CLOSED_W = "3.05rem";

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
    x: -20,
    opacity: 0,
    transition: { x: { stiffness: 100 } },
  },
};

const transitionProps = {
  type: "tween" as const,
  ease: "easeOut" as const,
  duration: 0.2,
};

const staggerVariants = {
  open: { transition: { staggerChildren: 0.03, delayChildren: 0.02 } },
};

export type AdminNavLink = {
  href: string;
  label: string;
  icon: LucideIcon;
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

  return (
    <motion.aside
      className={cn(
        "fixed left-0 top-0 z-40 h-dvh shrink-0 border-r border-border bg-white",
        "transition-transform duration-200 ease-out md:transition-none",
        mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
      )}
      initial={false}
      animate={isCollapsed ? "closed" : "open"}
      variants={sidebarVariants}
      transition={transitionProps}
      aria-label="Admin navigation"
    >
      <div className="relative z-40 flex h-full shrink-0 flex-col text-body-muted">
        <motion.ul variants={staggerVariants} className="flex h-full flex-col">
          <div className="flex grow flex-col">
            <div className="flex h-[54px] w-full shrink-0 items-center justify-between gap-1 border-b border-border px-2">
              <Link
                href="/admin"
                onClick={onMobileClose}
                className={cn(
                  "min-w-0 flex-1 rounded-md px-1 py-1 transition-colors hover:bg-surface-container",
                  isCollapsed && "flex justify-center",
                )}
                title="CaterTech Admin"
              >
                {expanded ? (
                  <p className="truncate text-sm font-semibold text-ink">CaterTech</p>
                ) : (
                  <p className="text-sm font-bold text-[#5B2D9B]" aria-hidden>
                    C
                  </p>
                )}
              </Link>
              <button
                type="button"
                onClick={onToggleCollapsed}
                className="flex size-8 shrink-0 items-center justify-center rounded-md text-body-muted transition-colors hover:bg-surface-container hover:text-ink"
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {isCollapsed ? (
                  <ChevronRight className="size-4" strokeWidth={2} aria-hidden />
                ) : (
                  <ChevronLeft className="size-4" strokeWidth={2} aria-hidden />
                )}
              </button>
            </div>

            <div className="flex h-full w-full flex-col">
              <div className="flex grow flex-col">
                <ScrollArea className="h-16 grow p-2">
                  <div className="flex w-full flex-col gap-1">
                    {links.map((l) => {
                      const active = isLinkActive(pathname, l.href);
                      const Icon = l.icon;
                      return (
                        <Link
                          key={l.href}
                          href={l.href}
                          onClick={onMobileClose}
                          className={cn(
                            "flex h-9 w-full flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-surface-container hover:text-ink",
                            isCollapsed && "justify-center px-0",
                            active && ADMIN_ACTIVE,
                          )}
                          aria-current={active ? "page" : undefined}
                          title={isCollapsed ? l.label : undefined}
                        >
                          <Icon
                            className="size-4 shrink-0"
                            style={active ? { color: ADMIN_PURPLE } : undefined}
                          />
                          <motion.span variants={labelVariants} className="min-w-0">
                            {expanded && (
                              <span className="ml-2 truncate text-sm font-medium text-ink">
                                {l.label}
                              </span>
                            )}
                          </motion.span>
                        </Link>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>

              <div className="flex flex-col gap-1 p-2">
                <Separator className="mb-1 w-full" />
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onMobileClose}
                  className={cn(
                    "flex h-9 w-full flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-surface-container hover:text-ink",
                    isCollapsed && "justify-center px-0",
                  )}
                  title={isCollapsed ? "Visit site" : undefined}
                >
                  <ExternalLink className="size-4 shrink-0" />
                  <motion.span variants={labelVariants}>
                    {expanded && (
                      <span className="ml-2 text-sm font-medium text-ink">Visit site</span>
                    )}
                  </motion.span>
                </a>
                <Link
                  href="/admin"
                  onClick={onMobileClose}
                  className={cn(
                    "flex h-9 w-full flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-surface-container hover:text-ink",
                    isCollapsed && "justify-center px-0",
                  )}
                  title={isCollapsed ? "Admin home" : undefined}
                >
                  <Settings className="size-4 shrink-0" />
                  <motion.span variants={labelVariants}>
                    {expanded && (
                      <span className="ml-2 text-sm font-medium text-ink">Admin home</span>
                    )}
                  </motion.span>
                </Link>
                <div>
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger
                      className={cn(
                        "flex h-9 w-full flex-row items-center gap-2 rounded-md px-2 py-1.5 transition hover:bg-surface-container hover:text-ink outline-none",
                        isCollapsed && "justify-center px-0",
                      )}
                    >
                      <Avatar className="size-6 shrink-0">
                        {staffAvatarUrl ? (
                          <AvatarImage src={staffAvatarUrl} alt={staffName} />
                        ) : null}
                        <AvatarFallback
                          className="text-[10px] font-semibold"
                          style={{ color: ADMIN_PURPLE }}
                        >
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <motion.span
                        variants={labelVariants}
                        className="flex min-w-0 flex-1 items-center gap-2"
                      >
                        {expanded && (
                          <>
                            <span className="truncate text-sm font-medium text-ink">
                              {staffName}
                            </span>
                            <ChevronsUpDown className="ml-auto size-4 shrink-0 text-body-muted/50" />
                          </>
                        )}
                      </motion.span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent sideOffset={5} align="start">
                      <div className="flex flex-row items-center gap-2 p-2">
                        <Avatar className="size-8">
                          {staffAvatarUrl ? (
                            <AvatarImage src={staffAvatarUrl} alt={staffName} />
                          ) : null}
                          <AvatarFallback
                            className="text-xs font-semibold"
                            style={{ color: ADMIN_PURPLE }}
                          >
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex min-w-0 flex-col text-left">
                          <span className="truncate text-sm font-medium text-ink">
                            {staffName}
                          </span>
                          {staffEmail ? (
                            <span className="line-clamp-1 text-xs text-body-muted">
                              {staffEmail}
                            </span>
                          ) : null}
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="flex cursor-pointer items-center gap-2"
                        onClick={() => void onLogout()}
                      >
                        <LogOut className="size-4" />
                        Sign out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        </motion.ul>
      </div>
    </motion.aside>
  );
}

export { SIDEBAR_OPEN_W, SIDEBAR_CLOSED_W };

/** @deprecated Use AdminSessionNavBar for CaterTech admin. */
export const SessionNavBar = AdminSessionNavBar;
