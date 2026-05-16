"use client";

import { FormEvent, useState } from "react";

type LineItem = { item: string; qty: string; unit: string; notes: string };

export default function RFQPage() {
  const [rows, setRows] = useState<LineItem[]>([
    { item: "", qty: "", unit: "", notes: "" },
  ]);
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

  const addRow = () =>
    setRows((prev) => [...prev, { item: "", qty: "", unit: "", notes: "" }]);
  const removeRow = (i: number) =>
    setRows((prev) => prev.filter((_, idx) => idx !== i));
  const updateRow = (i: number, field: keyof LineItem, value: string) => {
    setRows((prev) =>
      prev.map((row, idx) => (idx === i ? { ...row, [field]: value } : row))
    );
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
    <>
      <section className="pt-40 pb-24 bg-navy">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-sand block mb-4">
            Trade Portal
          </span>
          <div className="w-10 h-0.5 bg-sand mb-6" />
          <h1 className="font-serif text-5xl text-white leading-tight max-w-xl">
            Request for Quotation
          </h1>
          <p className="text-white/50 mt-4 max-w-md">
            Submit your full requirements. You&apos;ll receive a reference number on
            submission.
          </p>
        </div>
      </section>

      <section className="bg-offwhite py-24">
        <div className="max-w-4xl mx-auto px-5 md:px-8">
          {status === "ok" ? (
            <div className="bg-white border border-border p-10 text-center mb-8">
              <p className="font-serif text-2xl text-charcoal mb-2">
                RFQ submitted
              </p>
              <p className="text-muted">
                Reference: <strong className="text-sand">{ref}</strong>
              </p>
            </div>
          ) : null}

          <form onSubmit={onSubmit} className="space-y-8 bg-white border border-border p-8 md:p-12">
            <div>
              <h3 className="font-serif text-lg text-charcoal mb-6 pb-3 border-b border-border">
                Company Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-[10px] font-semibold tracking-widest uppercase text-muted block mb-2">
                    Company Name *
                  </label>
                  <input
                    required
                    value={company.companyName}
                    onChange={(e) =>
                      setCompany((c) => ({ ...c, companyName: e.target.value }))
                    }
                    className="w-full border border-border px-4 py-3 text-sm outline-none focus:border-sand transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold tracking-widest uppercase text-muted block mb-2">
                    Trade Licence No.
                  </label>
                  <input
                    value={company.tradeLicenceNo}
                    onChange={(e) =>
                      setCompany((c) => ({ ...c, tradeLicenceNo: e.target.value }))
                    }
                    className="w-full border border-border px-4 py-3 text-sm outline-none focus:border-sand transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold tracking-widest uppercase text-muted block mb-2">
                    Contact Person *
                  </label>
                  <input
                    required
                    value={company.contactPerson}
                    onChange={(e) =>
                      setCompany((c) => ({ ...c, contactPerson: e.target.value }))
                    }
                    className="w-full border border-border px-4 py-3 text-sm outline-none focus:border-sand transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold tracking-widest uppercase text-muted block mb-2">
                    Phone *
                  </label>
                  <input
                    required
                    type="tel"
                    value={company.phone}
                    onChange={(e) =>
                      setCompany((c) => ({ ...c, phone: e.target.value }))
                    }
                    className="w-full border border-border px-4 py-3 text-sm outline-none focus:border-sand transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold tracking-widest uppercase text-muted block mb-2">
                    Email *
                  </label>
                  <input
                    required
                    type="email"
                    value={company.email}
                    onChange={(e) =>
                      setCompany((c) => ({ ...c, email: e.target.value }))
                    }
                    className="w-full border border-border px-4 py-3 text-sm outline-none focus:border-sand transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold tracking-widest uppercase text-muted block mb-2">
                    Budget (AED)
                  </label>
                  <input
                    value={company.budgetAed}
                    onChange={(e) =>
                      setCompany((c) => ({ ...c, budgetAed: e.target.value }))
                    }
                    className="w-full border border-border px-4 py-3 text-sm outline-none focus:border-sand transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold tracking-widest uppercase text-muted block mb-2">
                    Emirate
                  </label>
                  <select
                    value={company.emirate}
                    onChange={(e) =>
                      setCompany((c) => ({ ...c, emirate: e.target.value }))
                    }
                    className="w-full border border-border px-4 py-3 text-sm outline-none focus:border-sand bg-white transition-colors"
                  >
                    {["Dubai", "Abu Dhabi", "Sharjah", "RAK", "Ajman", "Fujairah"].map(
                      (e) => (
                        <option key={e} value={e}>
                          {e}
                        </option>
                      )
                    )}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-semibold tracking-widest uppercase text-muted block mb-2">
                    Required Date
                  </label>
                  <input
                    type="date"
                    value={company.requiredDate}
                    onChange={(e) =>
                      setCompany((c) => ({ ...c, requiredDate: e.target.value }))
                    }
                    className="w-full border border-border px-4 py-3 text-sm outline-none focus:border-sand transition-colors"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-serif text-lg text-charcoal mb-6 pb-3 border-b border-border">
                Item List
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      {["Item / Description", "Qty", "Unit", "Notes", ""].map((h) => (
                        <th
                          key={h}
                          className="text-left text-[10px] font-semibold tracking-widest uppercase text-muted py-3 pr-4 whitespace-nowrap"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {rows.map((row, i) => (
                      <tr key={i}>
                        {(["item", "qty", "unit", "notes"] as (keyof LineItem)[]).map(
                          (field) => (
                            <td key={field} className="py-2 pr-3">
                              <input
                                value={row[field]}
                                onChange={(e) => updateRow(i, field, e.target.value)}
                                className="w-full border border-border px-3 py-2 text-sm outline-none focus:border-sand transition-colors"
                                placeholder={
                                  field === "item"
                                    ? "e.g. Chafing Dish"
                                    : field === "qty"
                                      ? "10"
                                      : field === "unit"
                                        ? "pcs"
                                        : ""
                                }
                              />
                            </td>
                          )
                        )}
                        <td className="py-2">
                          {rows.length > 1 ? (
                            <button
                              type="button"
                              onClick={() => removeRow(i)}
                              className="text-muted hover:text-red-400 transition-colors p-1"
                            >
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                              </svg>
                            </button>
                          ) : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                type="button"
                onClick={addRow}
                className="mt-4 text-sand text-xs font-semibold tracking-widest uppercase flex items-center gap-2 hover:text-sand-dark transition-colors"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add Row
              </button>
            </div>

            <div>
              <label className="text-[10px] font-semibold tracking-widest uppercase text-muted block mb-2">
                Attach Files (optional) — coming soon
              </label>
              <input
                type="file"
                multiple
                disabled
                className="w-full border border-border px-4 py-3 text-sm text-muted opacity-50"
              />
            </div>

            {status === "err" ? (
              <p className="text-sm text-red-600">
                Please add at least one line item with a description, or check your
                network connection.
              </p>
            ) : null}

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full bg-sand hover:bg-sand-dark text-white text-xs font-semibold tracking-widest uppercase py-4 transition-colors disabled:opacity-60"
            >
              {status === "sending" ? "Submitting…" : "Submit RFQ — Get Reference Number"}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
