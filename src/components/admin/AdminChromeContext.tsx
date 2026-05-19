"use client";

import { SUPERADMIN_ROLE } from "@/lib/admin-roles";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type StaffProfile = {
  fullName: string;
  email: string;
  profileImageUrl: string | null;
  role: string;
};

const SIDEBAR_COLLAPSED_KEY = "admin-sidebar-collapsed";

type AdminChromeContextValue = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebarCollapsed: () => void;
  staffProfile: StaffProfile | null;
  staffProfileLoading: boolean;
  canAccessContacts: boolean;
};

const AdminChromeContext = createContext<AdminChromeContextValue | null>(null);

export function AdminChromeProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [staffProfile, setStaffProfile] = useState<StaffProfile | null>(null);
  const [staffProfileLoading, setStaffProfileLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
      if (stored === "true") setSidebarCollapsed(true);
    } catch {
      /* ignore */
    }
  }, []);

  function toggleSidebarCollapsed() {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data: StaffProfile | null) => {
        if (cancelled || !data?.email) return;
        setStaffProfile(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setStaffProfileLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const canAccessContacts = useMemo(
    () => staffProfile?.role?.trim().toLowerCase() === SUPERADMIN_ROLE,
    [staffProfile?.role]
  );

  const value: AdminChromeContextValue = {
    sidebarOpen,
    setSidebarOpen,
    sidebarCollapsed,
    setSidebarCollapsed,
    toggleSidebarCollapsed,
    staffProfile,
    staffProfileLoading,
    canAccessContacts,
  };

  return (
    <AdminChromeContext.Provider value={value}>{children}</AdminChromeContext.Provider>
  );
}

export function useAdminChrome() {
  const ctx = useContext(AdminChromeContext);
  if (!ctx) {
    throw new Error("useAdminChrome must be used within AdminChromeProvider");
  }
  return ctx;
}
