"use client";

import { ADMIN_PURPLE } from "@/components/admin/adminTheme";
import { Loader2, X } from "lucide-react";

export function AdminBlockingOverlay(props: {
  open: boolean;
  title: string;
  subtitle?: string;
}) {
  if (!props.open) return null;
  return (
    <div
      className="fixed inset-0 z-[258] flex flex-col items-center justify-center bg-[#f5f5f7]/88 px-6 backdrop-blur-[2px]"
      role="progressbar"
      aria-busy="true"
      aria-label={props.title}
    >
      <Loader2 className="h-11 w-11 shrink-0 animate-spin text-admin-accent" aria-hidden />
      <p className="mt-5 max-w-sm text-center text-[15px] font-semibold leading-snug text-admin-ink">
        {props.title}
      </p>
      {props.subtitle ? (
        <p className="mt-2 max-w-sm text-center text-sm leading-snug text-admin-ink/48">
          {props.subtitle}
        </p>
      ) : null}
    </div>
  );
}

export function AdminSuccessModal(props: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  /** Close via X / backdrop — parent should hide the modal here. */
  onDismiss: () => void;
}) {
  if (!props.open) return null;

  function closeOverlay() {
    props.onDismiss();
  }

  return (
    <div
      className="fixed inset-0 z-[262] flex items-center justify-center bg-black/35 p-4 backdrop-blur-[1px]"
      role="presentation"
      onClick={closeOverlay}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-success-title"
        className="relative max-w-md w-full rounded-[24px] border border-black/[0.06] bg-white px-7 py-8 shadow-[0px_24px_80px_rgba(0,0,0,0.12)] text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full text-admin-ink/45 hover:bg-black/5 hover:text-admin-ink transition-colors"
          aria-label="Close"
          onClick={closeOverlay}
        >
          <X className="h-5 w-5" aria-hidden />
        </button>
        <div
          className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-2xl"
          aria-hidden
        >
          ✓
        </div>
        <h2 id="admin-success-title" className="text-xl font-bold text-admin-ink tracking-tight pr-8">
          {props.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-admin-ink/55">{props.message}</p>
        <button
          type="button"
          className="mt-8 w-full rounded-full py-3.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(248,121,65,0.25)] hover:opacity-95 active:opacity-90"
          style={{ backgroundColor: ADMIN_PURPLE }}
          onClick={props.onConfirm}
        >
          {props.confirmLabel ?? "Continue"}
        </button>
      </div>
    </div>
  );
}
