"use client";

import { formatUtcDateTime } from "@/lib/format-datetime";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Ban,
  Calendar,
  Camera,
  Clock,
  Mail,
  Pencil,
  Plus,
  Save,
  Search,
  Send,
  Shield,
  ShieldCheck,
  Trash2,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { AdminUserRow } from "@/app/api/admin/users/route";
import { AdminConfirmDialog } from "@/components/admin/AdminConfirmDialog";
import { AdminPanelModal } from "@/components/admin/AdminPanelModal";
import { admin } from "@/components/admin/adminTheme";
import { uploadMediaPublicUrl } from "@/lib/upload-media-client";
import { cn } from "@/lib/utils";

type Draft = {
  fullName: string;
  profileImageUrl: string;
  role: AdminUserRow["role"];
};

type CreateDraft = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  profileImageUrl: string;
};

type ConfirmAction =
  | { type: "delete"; user: AdminUserRow }
  | { type: "block"; user: AdminUserRow }
  | { type: "unblock"; user: AdminUserRow };

const STAT_STYLES = [
  {
    iconWrap: "bg-slate-100 text-slate-700 ring-1 ring-slate-200/80",
    accent: "from-slate-400/20 to-transparent",
    icon: Users,
  },
  {
    iconWrap: "bg-zinc-100 text-zinc-700 ring-1 ring-zinc-200/80",
    accent: "from-zinc-400/15 to-transparent",
    icon: Shield,
  },
  {
    iconWrap: "bg-slate-900 text-amber-200 ring-1 ring-slate-800/20",
    accent: "from-amber-300/25 to-transparent",
    icon: ShieldCheck,
  },
  {
    iconWrap: "bg-rose-50 text-rose-700 ring-1 ring-rose-100",
    accent: "from-rose-300/20 to-transparent",
    icon: Ban,
  },
] as const;

const PREMIUM_SURFACE =
  "border border-slate-200/90 bg-white shadow-[0_20px_48px_rgba(15,23,42,0.08),0_8px_18px_rgba(15,23,42,0.05),inset_0_1px_0_rgba(255,255,255,0.98)]";

const PREMIUM_SURFACE_HOVER =
  "transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_58px_rgba(15,23,42,0.11),0_12px_26px_rgba(15,23,42,0.07),inset_0_1px_0_rgba(255,255,255,1)]";

function initials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?"
  );
}

function roleLabel(role: AdminUserRow["role"]) {
  if (role === "superadmin") return "Super admin";
  if (role === "blocked") return "Blocked";
  return "Admin";
}

function roleBadgeClass(role: AdminUserRow["role"]) {
  if (role === "blocked") {
    return "border border-rose-100 bg-rose-50 text-rose-700 shadow-sm";
  }
  if (role === "superadmin") {
    return "border border-slate-800 bg-slate-900 text-white shadow-sm";
  }
  return "border border-slate-200 bg-slate-100 text-slate-700 shadow-sm";
}

function draftFromUser(user: AdminUserRow): Draft {
  return {
    fullName: user.fullName,
    profileImageUrl: user.profileImageUrl ?? "",
    role: user.role,
  };
}

export default function AdminUsersClient() {
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);
  const [avatarUploadingId, setAvatarUploadingId] = useState<string | null>(null);
  const [emailEditId, setEmailEditId] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailBusyId, setEmailBusyId] = useState<string | null>(null);
  const [emailMessage, setEmailMessage] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [createFormKey, setCreateFormKey] = useState(0);
  const [createDraft, setCreateDraft] = useState<CreateDraft>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    profileImageUrl: "",
  });
  const [createAvatarPreviewUrl, setCreateAvatarPreviewUrl] = useState<string | null>(null);
  const [createUploading, setCreateUploading] = useState(false);
  const [createBusy, setCreateBusy] = useState(false);
  const [createOtpSent, setCreateOtpSent] = useState(false);
  const [createCode, setCreateCode] = useState("");
  const [createMessage, setCreateMessage] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);

  const load = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users", { cache: "no-store" });
      if (!res.ok) {
        setError(res.status === 403 ? "You need superadmin access for Users." : "Could not load users.");
        setUsers([]);
        return;
      }
      setUsers((await res.json()) as AdminUserRow[]);
    } catch {
      setError("Network error while loading users.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    return () => {
      if (avatarPreviewUrl) URL.revokeObjectURL(avatarPreviewUrl);
      if (createAvatarPreviewUrl) URL.revokeObjectURL(createAvatarPreviewUrl);
    };
  }, [avatarPreviewUrl, createAvatarPreviewUrl]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter((user) =>
      [user.fullName, user.email, roleLabel(user.role)].join(" ").toLowerCase().includes(q)
    );
  }, [search, users]);

  const counts = useMemo(
    () => ({
      total: users.length,
      admins: users.filter((user) => user.role === "admin").length,
      superadmins: users.filter((user) => user.role === "superadmin").length,
      blocked: users.filter((user) => user.role === "blocked").length,
    }),
    [users]
  );

  function beginEdit(user: AdminUserRow) {
    setEditingId(user.id);
    setDraft(draftFromUser(user));
    if (avatarPreviewUrl) URL.revokeObjectURL(avatarPreviewUrl);
    setAvatarPreviewUrl(null);
    setError(null);
  }

  function cancelEdit() {
    if (avatarPreviewUrl) URL.revokeObjectURL(avatarPreviewUrl);
    setAvatarPreviewUrl(null);
    cancelEmailEdit();
    setEditingId(null);
    setDraft(null);
  }

  function beginEmailEdit(user: AdminUserRow) {
    setEmailEditId(user.id);
    setNewEmail("");
    setEmailCode("");
    setEmailOtpSent(false);
    setEmailMessage(null);
    setError(null);
  }

  function cancelEmailEdit() {
    setEmailEditId(null);
    setNewEmail("");
    setEmailCode("");
    setEmailOtpSent(false);
    setEmailMessage(null);
  }

  function resetCreateForm() {
    if (createAvatarPreviewUrl) URL.revokeObjectURL(createAvatarPreviewUrl);
    setCreateAvatarPreviewUrl(null);
    setCreateDraft({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      profileImageUrl: "",
    });
    setCreateOtpSent(false);
    setCreateCode("");
    setCreateMessage(null);
  }

  function openCreateModal() {
    resetCreateForm();
    setCreateFormKey((key) => key + 1);
    setCreateOpen(true);
    setError(null);
  }

  function closeCreateModal() {
    setCreateOpen(false);
    resetCreateForm();
  }

  async function updateUser(user: AdminUserRow, nextDraft: Draft) {
    setSavingId(user.id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: nextDraft.fullName,
          profileImageUrl: nextDraft.profileImageUrl,
          role: nextDraft.role,
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error || "Could not update user.");
        return;
      }
      cancelEdit();
      await load();
    } finally {
      setSavingId(null);
    }
  }

  async function setUserRole(user: AdminUserRow, role: AdminUserRow["role"]) {
    setSavingId(user.id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: user.fullName,
          profileImageUrl: user.profileImageUrl ?? "",
          role,
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        const message = data?.error || "Could not update user.";
        setError(message);
        throw new Error(message);
      }
      await load();
    } finally {
      setSavingId(null);
    }
  }

  async function uploadAvatar(file: File) {
    if (!editingId || !draft) return;
    if (avatarPreviewUrl) URL.revokeObjectURL(avatarPreviewUrl);
    setAvatarPreviewUrl(URL.createObjectURL(file));
    setAvatarUploadingId(editingId);
    setError(null);
    try {
      const result = await uploadMediaPublicUrl(file);
      if (!result.ok) {
        setError(result.message);
        setAvatarPreviewUrl(null);
        return;
      }
      setDraft((current) => (current ? { ...current, profileImageUrl: result.url } : current));
    } finally {
      setAvatarUploadingId(null);
    }
  }

  async function uploadCreateAvatar(file: File) {
    if (createAvatarPreviewUrl) URL.revokeObjectURL(createAvatarPreviewUrl);
    setCreateAvatarPreviewUrl(URL.createObjectURL(file));
    setCreateUploading(true);
    setError(null);
    try {
      const result = await uploadMediaPublicUrl(file);
      if (!result.ok) {
        setError(result.message);
        setCreateAvatarPreviewUrl(null);
        return;
      }
      setCreateDraft((current) => ({ ...current, profileImageUrl: result.url }));
    } finally {
      setCreateUploading(false);
    }
  }

  async function sendEmailOtp(user: AdminUserRow) {
    setEmailBusyId(user.id);
    setEmailMessage(null);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${user.id}/email/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail }),
      });
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      if (!res.ok) {
        setError(data?.error || "Could not send email verification code.");
        return;
      }
      setEmailOtpSent(true);
      setEmailMessage("OTP sent to the new email.");
    } finally {
      setEmailBusyId(null);
    }
  }

  async function verifyEmailOtp(user: AdminUserRow) {
    setEmailBusyId(user.id);
    setEmailMessage(null);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${user.id}/email/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail, code: emailCode }),
      });
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      if (!res.ok) {
        setError(data?.error || "Could not verify email code.");
        return;
      }
      cancelEmailEdit();
      await load();
    } finally {
      setEmailBusyId(null);
    }
  }

  async function sendCreateOtp() {
    if (createDraft.password !== createDraft.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setCreateBusy(true);
    setCreateMessage(null);
    setError(null);
    try {
      const res = await fetch("/api/admin/users/create/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: createDraft.fullName,
          email: createDraft.email,
          password: createDraft.password,
          profileImageUrl: createDraft.profileImageUrl,
        }),
      });
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      if (!res.ok) {
        setError(data?.error || "Could not send user verification code.");
        return;
      }
      setCreateOtpSent(true);
      setCreateMessage("OTP sent to the new user's email.");
    } finally {
      setCreateBusy(false);
    }
  }

  async function verifyCreateOtp() {
    setCreateBusy(true);
    setCreateMessage(null);
    setError(null);
    try {
      const res = await fetch("/api/admin/users/create/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: createDraft.email, code: createCode }),
      });
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      if (!res.ok) {
        setError(data?.error || "Could not verify user creation code.");
        return;
      }
      closeCreateModal();
      await load();
    } finally {
      setCreateBusy(false);
    }
  }

  async function deleteUser(user: AdminUserRow) {
    setSavingId(user.id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        const message = data?.error || "Could not delete user.";
        setError(message);
        throw new Error(message);
      }
      await load();
    } finally {
      setSavingId(null);
    }
  }

  async function handleConfirmAction() {
    if (!confirmAction) return;
    const { type, user } = confirmAction;
    if (type === "delete") {
      await deleteUser(user);
      return;
    }
    if (type === "block") {
      await setUserRole(user, "blocked");
      return;
    }
    await setUserRole(user, "admin");
  }

  const confirmDialog = useMemo(() => {
    if (!confirmAction) return null;
    const { type, user } = confirmAction;
    if (type === "delete") {
      return {
        title: "Delete user?",
        highlight: user.fullName,
        message: "This will permanently remove the user account. This action cannot be undone.",
        confirmLabel: "Delete",
        confirmVariant: "danger" as const,
      };
    }
    if (type === "block") {
      return {
        title: "Block user?",
        highlight: user.fullName,
        message: "This user will lose access to the admin panel until you unblock them.",
        confirmLabel: "Block",
        confirmVariant: "danger" as const,
      };
    }
    return {
      title: "Unblock user?",
      highlight: user.fullName,
      message: "This user will regain admin access.",
      confirmLabel: "Unblock",
      confirmVariant: "primary" as const,
    };
  }, [confirmAction]);

  const statItems = [
    { label: "Total users", value: counts.total },
    { label: "Admins", value: counts.admins },
    { label: "Super admins", value: counts.superadmins },
    { label: "Blocked", value: counts.blocked },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      <AdminConfirmDialog
        open={Boolean(confirmAction)}
        title={confirmDialog?.title ?? "Are you sure?"}
        highlight={confirmDialog?.highlight}
        message={confirmDialog?.message}
        confirmLabel={confirmDialog?.confirmLabel}
        confirmVariant={confirmDialog?.confirmVariant}
        onCancel={() => setConfirmAction(null)}
        onConfirm={handleConfirmAction}
      />

      <AdminPanelModal
        open={createOpen}
        title="Add admin user"
        subtitle="Create the profile after the new user verifies the OTP sent to their email."
        onClose={closeCreateModal}
        widthClass="max-w-[min(100%-1rem,34rem)]"
      >
        <form
          key={createFormKey}
          autoComplete="off"
          onSubmit={(event) => event.preventDefault()}
          className="space-y-4 rounded-[20px] border border-admin-border bg-white p-4 shadow-sm"
        >
          <div className="flex justify-center">
            <ProfileAvatar
              name={createDraft.fullName}
              imageUrl={createAvatarPreviewUrl || createDraft.profileImageUrl}
              size="lg"
              editable
              onPickFile={(file) => void uploadCreateAvatar(file)}
            />
          </div>

          <input
            value={createDraft.fullName}
            onChange={(e) => setCreateDraft({ ...createDraft, fullName: e.target.value })}
            className={admin.fieldModern}
            placeholder="Full name"
            name="admin-create-full-name"
            autoComplete="off"
          />
          <input
            value={createDraft.email}
            onChange={(e) => setCreateDraft({ ...createDraft, email: e.target.value })}
            className={admin.fieldModern}
            placeholder="Email"
            type="email"
            name="admin-create-email"
            autoComplete="off"
            readOnly
            onFocus={(event) => event.currentTarget.removeAttribute("readonly")}
          />
          <input
            type="password"
            value={createDraft.password}
            onChange={(e) => setCreateDraft({ ...createDraft, password: e.target.value })}
            className={admin.fieldModern}
            placeholder="Password"
            name="admin-create-password"
            autoComplete="new-password"
            readOnly
            onFocus={(event) => event.currentTarget.removeAttribute("readonly")}
          />
          <input
            type="password"
            value={createDraft.confirmPassword}
            onChange={(e) =>
              setCreateDraft({ ...createDraft, confirmPassword: e.target.value })
            }
            className={admin.fieldModern}
            placeholder="Confirm password"
            name="admin-create-confirm-password"
            autoComplete="new-password"
            readOnly
            onFocus={(event) => event.currentTarget.removeAttribute("readonly")}
          />
          {createOtpSent ? (
            <input
              value={createCode}
              onChange={(e) => setCreateCode(e.target.value)}
              className={admin.fieldModern}
              inputMode="numeric"
              maxLength={6}
              placeholder="6-digit OTP"
              name="admin-create-otp"
              autoComplete="one-time-code"
            />
          ) : null}
          {createUploading ? (
            <p className="text-xs font-medium text-admin-muted">Uploading profile image...</p>
          ) : null}
          {createMessage ? (
            <p className="text-xs font-medium text-admin-accent">{createMessage}</p>
          ) : null}
          <div className="grid grid-cols-2 gap-2">
            <IconButton
              label={createOtpSent ? "Resend OTP" : "Send OTP"}
              icon={Send}
              disabled={createBusy || createUploading}
              onClick={() => void sendCreateOtp()}
            />
            <IconButton
              label="Create user"
              icon={Plus}
              disabled={createBusy || !createOtpSent}
              onClick={() => void verifyCreateOtp()}
              variant="primary"
            />
          </div>
        </form>
      </AdminPanelModal>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className={admin.formSectionTitle}>Super admin access</p>
          <h1 className={`${admin.h1} mt-2`}>Admin users</h1>
        </div>
        <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex h-11 min-w-[148px] shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-admin-accent bg-admin-accent px-6 text-sm font-semibold text-white transition-colors hover:bg-admin-accent-strong"
          >
            <Plus className="size-4 shrink-0" aria-hidden />
            <span className="text-center">Add user</span>
          </button>
          <label className="relative block w-full sm:min-w-[20rem]">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-admin-muted"
              aria-hidden
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className={`${admin.fieldModern} pl-10`}
            />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {statItems.map((item, index) => (
          <StatCard key={item.label} label={item.label} value={item.value} variant={index} />
        ))}
      </div>

      {error ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
          {error}
        </p>
      ) : null}

      {loading ? (
        <div className="rounded-[24px] border border-admin-border bg-white px-5 py-14 text-center text-sm text-admin-muted shadow-sm">
          Loading users...
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-[24px] border border-admin-border bg-white px-5 py-14 text-center text-sm text-admin-muted shadow-sm">
          No admin users match your search.
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((user) => {
            const isEditing = editingId === user.id && draft;
            const busy = savingId === user.id;
            const emailBusy = emailBusyId === user.id;
            const shownName = isEditing ? draft.fullName || user.fullName : user.fullName;
            const shownAvatar =
              isEditing ? avatarPreviewUrl || draft.profileImageUrl : user.profileImageUrl;
            const shownRole = isEditing ? draft.role : user.role;

            return (
              <article
                key={user.id}
                className={cn(
                  "group overflow-hidden rounded-[26px]",
                  PREMIUM_SURFACE,
                  PREMIUM_SURFACE_HOVER
                )}
              >
                <div className="relative h-[92px] overflow-hidden border-b border-slate-100 bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_100%)]">
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -right-8 -top-10 size-32 rounded-full bg-slate-300/15 blur-2xl"
                  />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute left-6 top-0 h-px w-24 bg-gradient-to-r from-transparent via-white to-transparent opacity-90"
                  />
                  <span
                    className={cn(
                      "absolute right-4 top-4 inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em]",
                      roleBadgeClass(shownRole)
                    )}
                  >
                    {roleLabel(shownRole)}
                  </span>
                </div>

                <div className="relative px-5 pb-5">
                  <div className="-mt-12 flex flex-col items-center text-center">
                    <ProfileAvatar
                      name={shownName}
                      imageUrl={shownAvatar || undefined}
                      editable={Boolean(isEditing)}
                      onPickFile={(file) => void uploadAvatar(file)}
                    />
                    <h2 className="mt-4 max-w-full truncate text-lg font-bold tracking-tight text-slate-900">
                      {shownName}
                    </h2>
                    <a
                      href={`mailto:${encodeURIComponent(user.email)}`}
                      className="mt-1 max-w-full truncate text-sm text-slate-500 transition-colors hover:text-slate-800"
                    >
                      {user.email}
                    </a>
                  </div>

                  <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <Meta icon={Calendar} label="Created" value={user.createdAt ? formatUtcDateTime(user.createdAt) : "Never"} />
                    <Meta icon={Clock} label="Last login" value={user.lastLoginAt ? formatUtcDateTime(user.lastLoginAt) : "Never"} />
                  </div>

                  {isEditing ? (
                    <div className="mt-5 space-y-3 border-t border-admin-border pt-5">
                      <input
                        value={draft.fullName}
                        onChange={(e) => setDraft({ ...draft, fullName: e.target.value })}
                        className={admin.fieldModern}
                        placeholder="Full name"
                      />
                      {avatarUploadingId === user.id ? (
                        <p className="text-xs font-medium text-admin-muted">
                          Uploading profile image...
                        </p>
                      ) : null}
                      <select
                        value={draft.role}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            role: e.target.value as AdminUserRow["role"],
                          })
                        }
                        className={admin.fieldModern}
                      >
                        <option value="admin">Admin</option>
                        <option value="superadmin">Super admin</option>
                        <option value="blocked">Blocked</option>
                      </select>
                      <div className="rounded-2xl border border-admin-border bg-admin-bg/70 p-3">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div className="min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-admin-muted">
                              Login email
                            </p>
                            <p className="mt-0.5 truncate text-sm font-medium text-admin-ink">
                              {user.email}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              emailEditId === user.id ? cancelEmailEdit() : beginEmailEdit(user)
                            }
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-admin-border bg-white px-3 text-sm font-semibold text-admin-ink transition-colors hover:border-admin-accent/35 hover:bg-admin-bg"
                          >
                            <Mail className="size-4" aria-hidden />
                            {emailEditId === user.id ? "Cancel email" : "Change email"}
                          </button>
                        </div>

                        {emailEditId === user.id ? (
                          <div className="mt-3 space-y-2">
                            <input
                              value={newEmail}
                              onChange={(e) => setNewEmail(e.target.value)}
                              className={admin.fieldModern}
                              placeholder="New verified email"
                            />
                            {emailOtpSent ? (
                              <input
                                value={emailCode}
                                onChange={(e) => setEmailCode(e.target.value)}
                                className={admin.fieldModern}
                                inputMode="numeric"
                                maxLength={6}
                                placeholder="6-digit OTP"
                              />
                            ) : null}
                            {emailMessage ? (
                              <p className="text-xs font-medium text-admin-accent">
                                {emailMessage}
                              </p>
                            ) : null}
                            <div className="grid grid-cols-2 gap-2">
                              <IconButton
                                label={emailOtpSent ? "Resend" : "Send OTP"}
                                icon={Send}
                                disabled={emailBusy}
                                onClick={() => void sendEmailOtp(user)}
                              />
                              <IconButton
                                label="Verify"
                                icon={Save}
                                disabled={emailBusy || !emailOtpSent}
                                onClick={() => void verifyEmailOtp(user)}
                                variant="primary"
                              />
                            </div>
                          </div>
                        ) : null}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <IconButton
                          label="Save"
                          icon={Save}
                          disabled={busy || avatarUploadingId === user.id}
                          onClick={() => void updateUser(user, draft)}
                          variant="primary"
                        />
                        <IconButton label="Cancel" icon={X} onClick={cancelEdit} />
                      </div>
                    </div>
                  ) : (
                    <div className="mt-5 grid grid-cols-2 gap-2 border-t border-slate-100 pt-5">
                      <IconButton label="Edit" icon={Pencil} onClick={() => beginEdit(user)} />
                      {user.role === "blocked" ? (
                        <IconButton
                          label="Unblock"
                          icon={UserCheck}
                          disabled={busy}
                          onClick={() => setConfirmAction({ type: "unblock", user })}
                          variant="primary"
                        />
                      ) : (
                        <IconButton
                          label="Block"
                          icon={Ban}
                          disabled={busy || user.isCurrentUser}
                          onClick={() => setConfirmAction({ type: "block", user })}
                          variant="warning"
                        />
                      )}
                      <IconButton
                        label="Delete"
                        icon={Trash2}
                        disabled={busy || user.isCurrentUser}
                        onClick={() => setConfirmAction({ type: "delete", user })}
                        variant="danger"
                        className="col-span-2"
                      />
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ProfileAvatar({
  name,
  imageUrl,
  size = "md",
  editable = false,
  onPickFile,
}: {
  name: string;
  imageUrl?: string;
  size?: "md" | "lg";
  editable?: boolean;
  onPickFile?: (file: File) => void;
}) {
  const dimension = size === "lg" ? "size-24" : "size-[92px]";
  const textSize = size === "lg" ? "text-2xl" : "text-2xl";

  return (
    <div className={cn("relative shrink-0", dimension)}>
      <div
        className={cn(
          "group/avatar overflow-hidden rounded-[22px] border border-slate-200/90 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] shadow-[0_14px_32px_rgba(15,23,42,0.12),inset_0_1px_0_rgba(255,255,255,0.95)] ring-4 ring-white",
          dimension
        )}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            className="size-full object-cover object-center transition-transform duration-300 group-hover/avatar:scale-105"
          />
        ) : (
          <span
            className={cn(
              "flex size-full items-center justify-center font-semibold text-slate-800",
              textSize
            )}
          >
            {initials(name)}
          </span>
        )}
      </div>
      {editable && onPickFile ? (
        <label className="absolute -right-2 -bottom-2 grid size-9 cursor-pointer place-items-center rounded-full border-2 border-white bg-admin-accent text-white shadow-lg transition-transform hover:scale-110">
          <Camera className="size-4" aria-hidden />
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) onPickFile(file);
              event.currentTarget.value = "";
            }}
          />
        </label>
      ) : null}
    </div>
  );
}

function StatCard({
  label,
  value,
  variant,
}: {
  label: string;
  value: number;
  variant: number;
}) {
  const style = STAT_STYLES[variant % STAT_STYLES.length];
  const Icon = style.icon;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[26px] p-4 sm:p-5",
        PREMIUM_SURFACE,
        PREMIUM_SURFACE_HOVER
      )}
    >
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute -right-6 -top-8 size-28 rounded-full bg-gradient-to-br blur-2xl",
          style.accent
        )}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent"
      />
      <div className="relative flex items-start justify-between gap-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
          {label}
        </p>
        <span
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-2xl shadow-[0_8px_18px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.85)]",
            style.iconWrap
          )}
        >
          <Icon className="size-[18px]" strokeWidth={1.75} aria-hidden />
        </span>
      </div>
      <p className="relative mt-5 text-3xl font-semibold tabular-nums tracking-tight text-slate-900">
        {value}
      </p>
    </div>
  );
}

function Meta({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-start gap-2.5 rounded-2xl border border-slate-200/90 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_6px_16px_rgba(15,23,42,0.05)]">
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-500 shadow-sm">
        <Icon className="size-3.5" strokeWidth={1.75} aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
          {label}
        </p>
        <p className="mt-0.5 truncate text-[13px] font-medium text-slate-800">{value}</p>
      </div>
    </div>
  );
}

function IconButton({
  label,
  icon: Icon,
  onClick,
  disabled,
  variant = "default",
  className = "",
}: {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  disabled?: boolean;
  variant?: "default" | "primary" | "warning" | "danger";
  className?: string;
}) {
  const classes = {
    default:
      "border-admin-border bg-white text-admin-ink hover:border-admin-accent/35 hover:bg-admin-bg",
    primary: "border-admin-accent bg-admin-accent text-white hover:bg-admin-accent-strong",
    warning: "border-amber-200 bg-amber-50 text-amber-900 hover:border-amber-300",
    danger: "border-red-200 bg-red-50 text-red-900 hover:border-red-300",
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-xl border px-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        classes[variant],
        className
      )}
    >
      <Icon className="size-4" aria-hidden />
      {label}
    </button>
  );
}
