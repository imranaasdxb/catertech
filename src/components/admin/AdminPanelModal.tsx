"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
  /** Default ~56rem wide, slightly shorter max height for compact admin lists. */
  widthClass?: string;
  /** When false, body does not scroll — content must fit the card. */
  scrollable?: boolean;
  /** Override max height of the dialog shell. */
  maxHeightClass?: string;
};

/** Large centred card overlay for edit / detail inside admin (same screen). */
export function AdminPanelModal({
  open,
  title,
  subtitle,
  onClose,
  children,
  widthClass = "max-w-[min(100%-1rem,52rem)]",
  scrollable = true,
  maxHeightClass = "max-h-[min(90vh,820px)]",
}: Props) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[218] flex items-center justify-center p-3 sm:p-5"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/42 backdrop-blur-[1px] transition-opacity"
        aria-label="Close panel"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-panel-title"
        className={`relative flex ${maxHeightClass} w-full flex-col overflow-hidden rounded-[22px] border border-black/8 bg-[#fafafa] shadow-[0px_28px_120px_rgba(0,0,0,0.2)] ${widthClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-black/8 bg-white px-5 py-4 sm:px-6">
          <div className="min-w-0 pr-2">
            <h2 id="admin-panel-title" className="text-lg font-bold tracking-tight text-admin-ink">
              {title}
            </h2>
            {subtitle ? (
              <p className="mt-1 text-sm leading-snug text-admin-ink/48">{subtitle}</p>
            ) : null}
          </div>
          <button
            type="button"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-admin-ink/45 transition-colors hover:bg-black/[0.06] hover:text-admin-ink"
            aria-label="Close"
            onClick={onClose}
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </header>
        <div
          className={`min-h-0 flex-1 bg-[#fafafa] px-3 py-3 sm:px-5 sm:py-4 ${
            scrollable ? "overflow-y-auto overflow-x-hidden" : "overflow-hidden"
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
