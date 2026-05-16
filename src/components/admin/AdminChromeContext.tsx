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

type AdminChromeContextValue = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  staffProfile: StaffProfile | null;
  staffProfileLoading: boolean;
  canAccessContacts: boolean;
};

const AdminChromeContext = createContext<AdminChromeContextValue | null>(null);

export function AdminChromeProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [staffProfile, setStaffProfile] = useState<StaffProfile | null>(null);
  const [staffProfileLoading, setStaffProfileLoading] = useState(true);

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
