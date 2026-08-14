"use client";

import { admin, ADMIN_PURPLE } from "@/components/admin/admin-theme";
import { X } from "lucide-react";
import { useState } from "react";

type Props = {
  open: boolean;
  title: string;
  message?: string;
  highlight?: string;
  confirmLabel?: string;
  confirmVariant?: "danger" | "primary";
  onCancel: () => void;
  onConfirm: () => Promise<void>;
};

export function AdminConfirmDialog({
  open,
  title,
  message = "This cannot be undone.",
  highlight,
  confirmLabel = "Delete",
  confirmVariant = "danger",
  onCancel,
  onConfirm,
}: Props) {
  const [busy, setBusy] = useState(false);

  if (!open) return null;

  async function submit() {
    if (busy) return;
    setBusy(true);
    try {
      await onConfirm();
      onCancel();
    } catch {
      /* caller sets err */
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[268] flex items-center justify-center bg-black/45 p-4 backdrop-blur-[1px]"
      role="presentation"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className="relative w-full max-w-sm rounded-[20px] border border-black/[0.08] bg-white p-6 shadow-[0px_24px_80px_rgba(0,0,0,0.18)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full text-admin-ink/45 hover:bg-black/[0.05]"
          aria-label="Close"
          onClick={onCancel}
        >
          <X className="h-5 w-5" />
        </button>
        <h2 id="confirm-dialog-title" className="pr-8 text-lg font-bold text-admin-ink">
          {title}
        </h2>
        {highlight ? (
          <p className="mt-2 line-clamp-2 text-sm font-semibold text-admin-ink/75">{highlight}</p>
        ) : null}
        <p className={`mt-3 text-sm leading-relaxed ${admin.muted}`}>{message}</p>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" onClick={onCancel} className={`${admin.secondaryBtn} py-2.5 text-sm`}>
            Cancel
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => void submit()}
            className={`${confirmVariant === "primary" ? admin.primaryBtn : admin.dangerBtn} py-2.5 text-sm disabled:opacity-50`}
            style={confirmVariant === "primary" ? { backgroundColor: ADMIN_PURPLE } : undefined}
          >
            {busy
              ? confirmVariant === "danger"
                ? "Deleting…"
                : "Saving…"
              : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
