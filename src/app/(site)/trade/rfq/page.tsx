"use client";

import Container from "@/components/Container";
import { cn } from "@/lib/utils";
import { ArrowRight, CheckCircle2, FileText, Plus, ReceiptText, Timer, X } from "lucide-react";
import { FormEvent, useState } from "react";

type LineItem = { item: string; qty: string; unit: string; notes: string };

const inputClass =
  "w-full rounded-lg border border-[#e5e7eb] bg-white px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-[#9ca3af] hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20";
const labelClass = "mb-2 block text-sm text-body-muted";

function RFQGraphic() {
  return (
    <div className="relative mx-auto w-full max-w-[380px]" aria-hidden>
      <div className="absolute -left-6 top-8 h-24 w-24 rounded-full bg-primary-soft blur-2xl" />
      <svg viewBox="0 0 380 300" className="relative h-auto w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="66" y="52" width="210" height="190" rx="28" fill="#F8F7F7" stroke="#E5E1DA" />
        <rect x="96" y="86" width="92" height="16" rx="8" fill="#322B81" opacity=".16" />
        <rect x="96" y="126" width="148" height="10" rx="5" fill="#D8D4CC" />
        <rect x="96" y="154" width="148" height="10" rx="5" fill="#D8D4CC" />
        <rect x="96" y="182" width="148" height="10" rx="5" fill="#D8D4CC" />
        <rect x="96" y="210" width="84" height="24" rx="12" fill="#322B81" />
        <path d="M115 222h42" stroke="white" strokeWidth="4" strokeLinecap="round" />
        <g>
          <animateTransform attributeName="transform" type="translate" values="0 0;0 -8;0 0" dur="4.6s" repeatCount="indefinite" />
          <rect x="230" y="38" width="88" height="72" rx="22" fill="#FFFFFF" stroke="#E5E1DA" />
          <path d="M256 73h40M256 90h26" stroke="#C21722" strokeWidth="7" strokeLinecap="round" />
        </g>
        <g>
          <animateTransform attributeName="transform" type="translate" values="0 0;8 0;0 0" dur="5.2s" repeatCount="indefinite" />
          <circle cx="272" cy="226" r="42" fill="#FFFFFF" stroke="#E5E1DA" />
          <path d="m255 225 11 11 25-29" stroke="#C21722" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

export default function RFQPage() {
  const [rows, setRows] = useState<LineItem[]>([{ item: "", qty: "", unit: "", notes: "" }]);
  const [company, setCompany] = useState({
    companyName: "",
    tradeLicenceNo: "",
    contactPerson: "",
    phone: "",
    email: "",
    budgetAed: "",
    emirate: "Dubai",
    requiredDate: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [ref, setRef] = useState("");

  const addRow = () => setRows((prev) => [...prev, { item: "", qty: "", unit: "", notes: "" }]);
  const removeRow = (i: number) => setRows((prev) => prev.filter((_, idx) => idx !== i));
  const updateRow = (i: number, field: keyof LineItem, value: string) => {
    setRows((prev) => prev.map((row, idx) => (idx === i ? { ...row, [field]: value } : row)));
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const lineItems = rows.filter((r) => r.item.trim());
    if (lineItems.length === 0) {
      setStatus("err");
      return;
    }
    const res = await fetch("/api/rfq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...company,
        lineItems,
      }),
    });
    setStatus("idle");
    if (!res.ok) {
      setStatus("err");
      return;
    }
    const data = (await res.json()) as { reference?: string };
    setRef(data.reference || "");
    setStatus("ok");
  }

  return (
    <section className="relative overflow-hidden bg-white pt-32 pb-20 md:pt-40 md:pb-28">
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full opacity-70 md:h-[520px] md:w-[520px]"
        style={{
          background:
            "radial-gradient(circle, rgba(180, 120, 220, 0.40) 0%, rgba(240, 225, 255, 0.18) 45%, transparent 70%)",
        }}
        aria-hidden
      />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
          <div className="max-w-xl">
            <h1 className="text-[2.35rem] font-bold leading-[1.08] tracking-[-0.03em] text-ink sm:text-[2.75rem] lg:text-[3.1rem]">
              <span className="block font-sans">Request for</span>
              <span
                className="mt-1 block font-normal italic text-ink"
                style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}
              >
                quotation
              </span>
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-body-muted md:text-lg">
              Submit line items, quantities, and timing details for a structured trade
              quotation.
            </p>

            <div className="mt-8 space-y-5">
              {[
                { icon: FileText, title: "Add company and requirement details", tone: "bg-[#fef9c3]" },
                { icon: ReceiptText, title: "Build your item list", tone: "bg-[#dbeafe]" },
                { icon: Timer, title: "Receive a reference number", tone: "bg-accent-soft" },
              ].map(({ icon: Icon, title, tone }) => (
                <div key={title} className="flex items-center gap-4">
                  <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${tone}`}>
                    <Icon className="h-5 w-5 text-ink" strokeWidth={1.75} aria-hidden />
                  </span>
                  <p className="text-base font-bold text-ink">{title}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-center lg:justify-start">
              <RFQGraphic />
            </div>
          </div>

          <div className="lg:pt-2">
            {status === "ok" ? (
              <div className="mb-8 rounded-2xl border border-green-100 bg-green-50/80 p-6">
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-green-700">
                    <CheckCircle2 className="h-6 w-6" strokeWidth={2} aria-hidden />
                  </span>
                  <div>
                    <p className="text-xl font-bold tracking-tight text-ink">RFQ submitted</p>
                    <p className="mt-1 text-sm text-body-muted">
                      Reference: <strong className="text-primary">{ref}</strong>
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            <form onSubmit={onSubmit} className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-ink md:text-[1.75rem]">
                  Company details
                </h2>
                <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className={labelClass}>
                      Company Name <span className="text-accent">*</span>
                    </label>
                    <input
                      required
                      value={company.companyName}
                      onChange={(e) => setCompany((c) => ({ ...c, companyName: e.target.value }))}
                      className={inputClass}
                      placeholder="Company name"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Trade Licence No.</label>
                    <input
                      value={company.tradeLicenceNo}
                      onChange={(e) => setCompany((c) => ({ ...c, tradeLicenceNo: e.target.value }))}
                      className={inputClass}
                      placeholder="Optional"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      Contact Person <span className="text-accent">*</span>
                    </label>
                    <input
                      required
                      value={company.contactPerson}
                      onChange={(e) => setCompany((c) => ({ ...c, contactPerson: e.target.value }))}
                      className={inputClass}
                      placeholder="Full name"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      Phone <span className="text-accent">*</span>
                    </label>
                    <input
                      required
                      type="tel"
                      value={company.phone}
                      onChange={(e) => setCompany((c) => ({ ...c, phone: e.target.value }))}
                      className={inputClass}
                      placeholder="+971"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      Email <span className="text-accent">*</span>
                    </label>
                    <input
                      required
                      type="email"
                      value={company.email}
                      onChange={(e) => setCompany((c) => ({ ...c, email: e.target.value }))}
                      className={inputClass}
                      placeholder="Type your email"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Budget (AED)</label>
                    <input
                      value={company.budgetAed}
                      onChange={(e) => setCompany((c) => ({ ...c, budgetAed: e.target.value }))}
                      className={inputClass}
                      placeholder="Optional"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Emirate</label>
                    <select
                      value={company.emirate}
                      onChange={(e) => setCompany((c) => ({ ...c, emirate: e.target.value }))}
                      className={inputClass}
                    >
                      {["Dubai", "Abu Dhabi", "Sharjah", "RAK", "Ajman", "Fujairah"].map((emirate) => (
                        <option key={emirate} value={emirate}>
                          {emirate}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Required Date</label>
                    <input
                      type="date"
                      value={company.requiredDate}
                      onChange={(e) => setCompany((c) => ({ ...c, requiredDate: e.target.value }))}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex flex-col gap-3 border-t border-[#e5e7eb] pt-8 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-2xl font-bold tracking-tight text-ink md:text-[1.75rem]">
                    Item list
                  </h2>
                  <button
                    type="button"
                    onClick={addRow}
                    className="inline-flex items-center gap-2 rounded-full border border-[#e5e7eb] bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-primary transition-colors hover:border-primary"
                  >
                    <Plus className="h-4 w-4" strokeWidth={2} aria-hidden />
                    Add Row
                  </button>
                </div>

                <div className="mt-6 overflow-x-auto rounded-2xl border border-[#e5e7eb] bg-white">
                  <table className="w-full min-w-[720px] text-sm">
                    <thead className="bg-surface-card">
                      <tr>
                        {["Item / Description", "Qty", "Unit", "Notes", ""].map((heading) => (
                          <th
                            key={heading}
                            className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.16em] text-body-muted"
                          >
                            {heading}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e5e7eb]">
                      {rows.map((row, i) => (
                        <tr key={i}>
                          {(["item", "qty", "unit", "notes"] as (keyof LineItem)[]).map((field) => (
                            <td key={field} className="p-3">
                              <input
                                value={row[field]}
                                onChange={(e) => updateRow(i, field, e.target.value)}
                                className="w-full rounded-lg border border-[#e5e7eb] bg-white px-3 py-2 text-sm text-ink outline-none transition-colors placeholder:text-[#9ca3af] hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20"
                                placeholder={
                                  field === "item"
                                    ? "e.g. Chafing Dish"
                                    : field === "qty"
                                      ? "10"
                                      : field === "unit"
                                        ? "pcs"
                                        : "Notes"
                                }
                              />
                            </td>
                          ))}
                          <td className="p-3 text-right">
                            {rows.length > 1 ? (
                              <button
                                type="button"
                                onClick={() => removeRow(i)}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-body-muted transition-colors hover:bg-accent-soft hover:text-accent"
                                aria-label="Remove row"
                              >
                                <X className="h-4 w-4" strokeWidth={2} aria-hidden />
                              </button>
                            ) : null}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <label className={labelClass}>Attach Files (optional) - coming soon</label>
                <input
                  type="file"
                  multiple
                  disabled
                  className={`${inputClass} cursor-not-allowed text-body-muted opacity-60`}
                />
              </div>

              {status === "err" ? (
                <p className="text-sm text-accent">
                  Please add at least one line item with a description, or check your network connection.
                </p>
              ) : null}

              <button
                type="submit"
                disabled={status === "sending"}
                className={cn(
                  "btn-brand min-h-11 rounded-xl px-6 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.14em]",
                  "disabled:cursor-not-allowed disabled:opacity-60",
                )}
              >
                <span className="btn-brand__content gap-2">
                  {status === "sending" ? "Submitting..." : "Submit RFQ"}
                  <span className="btn-brand__arrow h-8 w-8" aria-hidden>
                    <ArrowRight className="size-4" strokeWidth={2} />
                  </span>
                </span>
              </button>
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
}
