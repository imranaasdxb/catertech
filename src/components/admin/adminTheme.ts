/** Visual tokens shared with the CaterTech dashboard shell (purple / soft cards). */
export const ADMIN_PURPLE = "#5B2D9B";

export const adminCardShadow = {
  boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.05)",
} as const;

export const admin = {
  page: "font-sans text-[#1a1a1a]",
  h1: "text-2xl md:text-[28px] font-bold text-[#1a1a1a] tracking-tight",
  muted: "text-sm text-[#1a1a1a]/50",
  link: "text-sm font-semibold text-[#5B2D9B] hover:underline",
  headerRow:
    "flex w-full min-w-0 flex-row flex-nowrap items-center justify-between gap-x-4 mb-6",
  /** Title + subtitle cluster; keeps CTA on the same row without squishing the table width */
  headerLead: "min-w-0 flex-1 pr-2 sm:pr-4",
  primaryBtn:
    "inline-flex items-center justify-center rounded-full text-sm font-semibold text-white px-6 py-3.5 transition-opacity hover:opacity-95 active:opacity-90 disabled:opacity-50 disabled:pointer-events-none",
  secondaryBtn:
    "inline-flex items-center justify-center rounded-full text-sm font-semibold text-[#1a1a1a] px-6 py-3.5 border border-black/10 bg-[#F5F5F7] hover:bg-[#ebebed] transition-colors",
  dangerBtn:
    "inline-flex items-center justify-center rounded-full text-sm font-semibold px-6 py-3.5 border border-red-200 text-red-600 bg-white hover:bg-red-50 transition-colors",
  tableShell: "rounded-[24px] bg-white border border-black/6 overflow-hidden",
  tableHeadRow: "border-b border-black/6 bg-[#F5F5F7]/90",
  table: "w-full text-sm",
  th: "p-4 text-left text-xs font-semibold uppercase tracking-wide text-[#1a1a1a]/45",
  tr: "border-b border-black/6 last:border-b-0 hover:bg-[#F5F5F7]/60 transition-colors",
  tdLink:
    "font-semibold text-[#1a1a1a] hover:text-[#5B2D9B] transition-colors",
  tdMuted: "text-[#1a1a1a]/50",
  emptyCell: "p-10 text-center text-sm text-[#1a1a1a]/45",
  formCard: "rounded-[24px] bg-white border border-black/6 p-6 md:p-8 space-y-5 max-w-2xl",
  formCardNarrow: "rounded-[24px] bg-white border border-black/6 p-6 md:p-8 space-y-5 max-w-xl",
  label: "text-xs font-semibold text-[#1a1a1a]/45 uppercase tracking-wide block mb-2",
  field:
    "w-full rounded-2xl border border-black/10 bg-[#F5F5F7] px-4 py-3.5 text-sm text-[#1a1a1a] outline-none placeholder:text-[#1a1a1a]/35 focus:border-[#5B2D9B]/30 focus:ring-2 focus:ring-[#5B2D9B]/15",
  fieldMono:
    "w-full rounded-2xl border border-black/10 bg-[#F5F5F7] px-4 py-3.5 font-mono text-xs text-[#1a1a1a] outline-none focus:border-[#5B2D9B]/30 focus:ring-2 focus:ring-[#5B2D9B]/15",
  checkRow: "flex flex-wrap gap-6 text-sm text-[#1a1a1a]",
  checkbox: "h-4 w-4 rounded border-black/20 accent-[#5B2D9B] shrink-0 cursor-pointer",
  error: "text-sm text-red-600",

  /** “Create” flows: top-aligned inside the main pane so long forms don’t add dead space below */
  formCenterPage:
    "w-full flex flex-col items-center justify-start py-6 md:py-10 px-4 pb-16 md:pb-20",
  formCenterInner: "w-full max-w-xl md:max-w-2xl",
  formCenterInnerWide: "w-full max-w-xl md:max-w-3xl",

  /** Modern surface inputs (light card on white) */
  fieldModern:
    "w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-[#1a1a1a] shadow-[0_1px_2px_rgba(0,0,0,0.04)] outline-none placeholder:text-[#1a1a1a]/38 transition-shadow focus:border-[#5B2D9B]/45 focus:shadow-[0_0_0_4px_rgba(91,45,155,0.08)]",

  fieldModernMono:
    "w-full rounded-xl border border-black/10 bg-white px-4 py-3 font-mono text-[13px] leading-relaxed text-[#1a1a1a] shadow-[0_1px_2px_rgba(0,0,0,0.04)] outline-none focus:border-[#5B2D9B]/45 focus:shadow-[0_0_0_4px_rgba(91,45,155,0.08)]",

  labelModern: "text-sm font-semibold text-[#1a1a1a] block mb-1.5",
  hint: "text-xs text-[#1a1a1a]/45 mt-1.5 leading-snug",

  formSectionTitle:
    "text-[11px] font-bold uppercase tracking-[0.16em] text-[#5B2D9B]",
  formSectionDesc: "text-sm text-[#1a1a1a]/48 mt-1 mb-5 max-w-prose",

  formModernCard:
    "rounded-[28px] border border-black/6 bg-white p-7 md:p-10 shadow-[0px_24px_80px_rgba(0,0,0,0.06)]",
  formDivider: "my-7 md:my-8 border-t border-black/6",
  formFooter:
    "flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pt-2 border-t border-black/6 mt-8",
  togglePanel:
    "rounded-2xl border border-black/6 bg-[#F5F5F7]/80 p-4 md:p-5 flex flex-wrap gap-x-8 gap-y-4",
} as const;
