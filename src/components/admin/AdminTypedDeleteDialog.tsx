"use client";

import { admin } from "@/components/admin/adminTheme";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

export const ADMIN_DELETE_CONFIRM_WORD = "DELETE";

type Props = {
  open: boolean;
  noun: string;
  /** Shown below title — e.g. row title */
  highlight?: string;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
};

/** User must type DELETE exactly to enable the destructive button. */
export function AdminTypedDeleteDialog({
  open,
  noun,
  highlight,
  onCancel,
  onConfirm,
}: Props) {
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);

  const ok = value.trim() === ADMIN_DELETE_CONFIRM_WORD;

  useEffect(() => {
    if (open) setValue("");
  }, [open]);

  if (!open) return null;

  async function submit() {
    if (!ok || busy) return;
    setBusy(true);
    try {
      await onConfirm();
      onCancel();
    } catch {
      alert("Could not delete. Please try again.");
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
        aria-labelledby="typed-del-title"
        className="relative w-full max-w-md rounded-[20px] border border-black/[0.08] bg-white p-6 shadow-[0px_24px_80px_rgba(0,0,0,0.18)]"
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
        <h2 id="typed-del-title" className="text-lg font-bold text-admin-ink pr-10">
          Remove this {noun}?
        </h2>
        {highlight ? (
          <p className={`mt-2 text-sm ${admin.tdMuted} line-clamp-2 font-medium`}>{highlight}</p>
        ) : null}
        <p className={`mt-3 text-sm leading-relaxed ${admin.muted}`}>
          Type <strong className="text-admin-ink">{ADMIN_DELETE_CONFIRM_WORD}</strong> below to confirm.
          This cannot be undone.
        </p>
        <input
          type="text"
          autoComplete="off"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={ADMIN_DELETE_CONFIRM_WORD}
          className={`mt-4 ${admin.fieldModern} uppercase tracking-wide font-mono text-sm`}
        />
        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" className={`${admin.secondaryBtn} w-full justify-center sm:w-auto`} onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            disabled={!ok || busy}
            className={`${admin.primaryBtn} w-full justify-center sm:w-auto disabled:opacity-40 disabled:pointer-events-none border border-red-700`}
            style={ok && !busy ? { backgroundColor: "#b91c1c", boxShadow: "0 8px 24px rgba(185,28,28,0.2)" } : undefined}
            onClick={() => void submit()}
          >            {busy ? "Deleting…" : "Delete permanently"}
          </button>
        </div>
      </div>
    </div>
  );
}
