"use client";

import { useState } from "react";

type LineItem = { item: string; qty: string; unit: string; notes: string };

export default function RFQPage() {
  const [rows, setRows] = useState<LineItem[]>([{ item: "", qty: "", unit: "", notes: "" }]);

  const addRow = () => setRows((prev) => [...prev, { item: "", qty: "", unit: "", notes: "" }]);
  const removeRow = (i: number) => setRows((prev) => prev.filter((_, idx) => idx !== i));
  const updateRow = (i: number, field: keyof LineItem, value: string) => {
    setRows((prev) => prev.map((row, idx) => idx === i ? { ...row, [field]: value } : row));
  };

  return (
    <>
      <section className="pt-40 pb-24 bg-navy">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-sand block mb-4">Trade Portal</span>
          <div className="w-10 h-0.5 bg-sand mb-6" />
          <h1 className="font-serif text-5xl text-white leading-tight max-w-xl">Request for Quotation</h1>
          <p className="text-white/50 mt-4 max-w-md">Submit your full requirements. You'll receive a reference number on submission.</p>
        </div>
      </section>

      <section className="bg-offwhite py-24">
        <div className="max-w-4xl mx-auto px-5 md:px-8">
          <form className="space-y-8 bg-white border border-border p-8 md:p-12">
            <div>
              <h3 className="font-serif text-lg text-charcoal mb-6 pb-3 border-b border-border">Company Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  { label: "Company Name", type: "text" },
                  { label: "Trade Licence No.", type: "text" },
                  { label: "Contact Person", type: "text" },
                  { label: "Phone", type: "tel" },
                  { label: "Email", type: "email" },
                  { label: "Budget (AED)", type: "text" },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="text-[10px] font-semibold tracking-widest uppercase text-muted block mb-2">{f.label}</label>
                    <input type={f.type} className="w-full border border-border px-4 py-3 text-sm outline-none focus:border-sand transition-colors" />
                  </div>
                ))}
                <div>
                  <label className="text-[10px] font-semibold tracking-widest uppercase text-muted block mb-2">Emirate</label>
                  <select className="w-full border border-border px-4 py-3 text-sm outline-none focus:border-sand bg-white transition-colors">
                    {["Dubai", "Abu Dhabi", "Sharjah", "RAK", "Ajman", "Fujairah"].map((e) => <option key={e}>{e}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-semibold tracking-widest uppercase text-muted block mb-2">Required Date</label>
                  <input type="date" className="w-full border border-border px-4 py-3 text-sm outline-none focus:border-sand transition-colors" />
                </div>
              </div>
            </div>

            {/* Line Items */}
            <div>
              <h3 className="font-serif text-lg text-charcoal mb-6 pb-3 border-b border-border">Item List</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      {["Item / Description", "Qty", "Unit", "Notes", ""].map((h) => (
                        <th key={h} className="text-left text-[10px] font-semibold tracking-widest uppercase text-muted py-3 pr-4 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {rows.map((row, i) => (
                      <tr key={i}>
                        {(["item", "qty", "unit", "notes"] as (keyof LineItem)[]).map((field) => (
                          <td key={field} className="py-2 pr-3">
                            <input
                              value={row[field]}
                              onChange={(e) => updateRow(i, field, e.target.value)}
                              className="w-full border border-border px-3 py-2 text-sm outline-none focus:border-sand transition-colors"
                              placeholder={field === "item" ? "e.g. Chafing Dish" : field === "qty" ? "10" : field === "unit" ? "pcs" : ""}
                            />
                          </td>
                        ))}
                        <td className="py-2">
                          {rows.length > 1 && (
                            <button type="button" onClick={() => removeRow(i)} className="text-muted hover:text-red-400 transition-colors p-1">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button type="button" onClick={addRow} className="mt-4 text-sand text-xs font-semibold tracking-widest uppercase flex items-center gap-2 hover:text-sand-dark transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add Row
              </button>
            </div>

            <div>
              <label className="text-[10px] font-semibold tracking-widest uppercase text-muted block mb-2">Attach Files (optional)</label>
              <input type="file" multiple className="w-full border border-border px-4 py-3 text-sm text-muted file:mr-4 file:py-1 file:px-4 file:border-0 file:bg-cream file:text-xs file:font-medium" />
            </div>

            <button type="submit" className="w-full bg-sand hover:bg-sand-dark text-white text-xs font-semibold tracking-widest uppercase py-4 transition-colors">
              Submit RFQ — Get Reference Number
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
