/** Visual tokens shared with the CaterTech admin shell (warm neutrals / coral accent). */
export const ADMIN_PURPLE = "#f87941";

export const adminCardShadow = {
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
} as const;

export const adminCard =
  "rounded-[24px] border border-gray-100 bg-white shadow-sm transition-all duration-200 ease-in-out";

export const admin = {
  page: "font-sans text-admin-ink",
  h1: "text-2xl md:text-[28px] font-bold text-admin-ink tracking-tight",
  muted: "text-sm text-admin-ink/50",
  link: "text-sm font-semibold text-admin-accent hover:underline",
  headerRow:
    "flex w-full min-w-0 flex-row flex-nowrap items-center justify-between gap-x-4 mb-6",
  /** Title + subtitle cluster; keeps CTA on the same row without squishing the table width */
  headerLead: "min-w-0 flex-1 pr-2 sm:pr-4",
  primaryBtn:
    "inline-flex items-center justify-center rounded-full bg-admin-accent text-sm font-semibold text-white px-6 py-3.5 transition-colors hover:bg-admin-accent-strong active:opacity-90 disabled:opacity-50 disabled:pointer-events-none",
  secondaryBtn:
    "inline-flex items-center justify-center rounded-full text-sm font-semibold text-admin-ink px-6 py-3.5 border border-admin-border bg-admin-bg hover:bg-admin-border transition-colors",
  dangerBtn:
    "inline-flex items-center justify-center rounded-full text-sm font-semibold px-6 py-3.5 border border-red-200 text-red-600 bg-white hover:bg-red-50 transition-colors",
  tableShell: "rounded-[24px] bg-white border border-gray-100 shadow-sm overflow-hidden",
  tableHeadRow: "border-b border-admin-border bg-admin-bg/90",
  table: "w-full text-sm",
  th: "p-4 text-left text-xs font-semibold uppercase tracking-wide text-admin-ink/45",
  tr: "border-b border-admin-border last:border-b-0 hover:bg-admin-bg/60 transition-colors",
  tdLink:
    "font-semibold text-admin-ink hover:text-admin-accent transition-colors",
  tdMuted: "text-admin-ink/50",
  emptyCell: "p-10 text-center text-sm text-admin-ink/45",
  formCard: "rounded-[24px] bg-admin-surface border border-admin-border p-6 md:p-8 space-y-5 max-w-2xl",
  formCardNarrow: "rounded-[24px] bg-admin-surface border border-admin-border p-6 md:p-8 space-y-5 max-w-xl",
  label: "text-xs font-semibold text-admin-ink/45 uppercase tracking-wide block mb-2",
  field:
    "w-full rounded-2xl border border-admin-border bg-admin-bg px-4 py-3.5 text-sm text-admin-ink outline-none placeholder:text-admin-ink/35 focus:border-admin-accent/40 focus:ring-2 focus:ring-admin-accent/15",
  fieldMono:
    "w-full rounded-2xl border border-admin-border bg-admin-bg px-4 py-3.5 font-mono text-xs text-admin-ink outline-none focus:border-admin-accent/40 focus:ring-2 focus:ring-admin-accent/15",
  checkRow: "flex flex-wrap gap-6 text-sm text-admin-ink",
  checkbox: "h-4 w-4 rounded border-admin-border accent-admin-accent shrink-0 cursor-pointer",
  error: "text-sm text-red-600",

  /** “Create” flows: top-aligned inside the main pane so long forms don’t add dead space below */
  formCenterPage:
    "w-full flex flex-col items-center justify-start py-6 md:py-10 px-4 pb-16 md:pb-20",
  formCenterInner: "w-full max-w-xl md:max-w-2xl",
  formCenterInnerWide: "w-full max-w-xl md:max-w-3xl",

  /** Modern surface inputs (light card on white) */
  fieldModern:
    "w-full rounded-xl border border-admin-border bg-admin-surface px-4 py-3 text-sm text-admin-ink shadow-[0_1px_2px_rgba(47,48,53,0.04)] outline-none placeholder:text-admin-ink/38 transition-shadow focus:border-admin-accent/55 focus:shadow-[0_0_0_4px_rgba(248,121,65,0.12)]",

  fieldModernMono:
    "w-full rounded-xl border border-admin-border bg-admin-surface px-4 py-3 font-mono text-[13px] leading-relaxed text-admin-ink shadow-[0_1px_2px_rgba(47,48,53,0.04)] outline-none focus:border-admin-accent/55 focus:shadow-[0_0_0_4px_rgba(248,121,65,0.12)]",

  labelModern: "text-sm font-semibold text-admin-ink block mb-1.5",
  hint: "text-xs text-admin-ink/45 mt-1.5 leading-snug",

  formSectionTitle:
    "text-[11px] font-bold uppercase tracking-[0.16em] text-admin-accent",
  formSectionDesc: "text-sm text-admin-ink/48 mt-1 mb-5 max-w-prose",

  formModernCard:
    "rounded-[28px] border border-admin-border bg-admin-surface p-7 md:p-10 shadow-[0px_24px_80px_rgba(47,48,53,0.07)]",
  formDivider: "my-7 md:my-8 border-t border-admin-border",
  formFooter:
    "flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pt-2 border-t border-admin-border mt-8",
  togglePanel:
    "rounded-2xl border border-admin-border bg-admin-bg/80 p-4 md:p-5 flex flex-wrap gap-x-8 gap-y-4",
} as const;
