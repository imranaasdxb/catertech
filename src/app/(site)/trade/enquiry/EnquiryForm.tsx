"use client";

import { FormEvent, useEffect, useState } from "react";

export function EnquiryForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  useEffect(() => {
    if (!showSuccessDialog) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setShowSuccessDialog(false);
    }
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [showSuccessDialog]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/enquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        companyName: fd.get("companyName"),
        contactName: fd.get("contactName"),
        phone: fd.get("phone"),
        email: fd.get("email"),
        emirate: fd.get("emirate") || "",
        serviceInterest: fd.get("serviceInterest") || "",
        message: fd.get("message"),
      }),
    });
    if (!res.ok) {
      setStatus("err");
      return;
    }
    setStatus("ok");
    setShowSuccessDialog(true);
    e.currentTarget.reset();
  }

  return (
    <>
      {showSuccessDialog ? (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-black/50 backdrop-blur-[2px]"
          role="presentation"
          onClick={(ev) => {
            if (ev.target === ev.currentTarget) setShowSuccessDialog(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="enquiry-success-title"
            className="relative w-full max-w-md rounded-2xl border border-border bg-white p-8 md:p-10 shadow-[0_24px_80px_rgba(26,31,46,0.18)] text-center space-y-4"
          >
            <div
              className="mx-auto w-14 h-14 rounded-full flex items-center justify-center bg-green-50 border border-green-100 text-green-700"
              aria-hidden
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2
              id="enquiry-success-title"
              className="font-serif text-2xl text-charcoal tracking-tight"
            >
              Enquiry sent
            </h2>
            <p className="text-muted text-sm leading-relaxed">
              Thank you — we have received your enquiry and emailed our team.
              Expect a reply within four business hours.
            </p>
            <button
              type="button"
              className="w-full mt-2 bg-sand hover:bg-sand-dark text-white text-xs font-semibold tracking-widest uppercase py-4 transition-colors rounded-none"
              onClick={() => setShowSuccessDialog(false)}
            >
              Close
            </button>
          </div>
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="space-y-6 bg-white border border-border p-8 md:p-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-[10px] font-semibold tracking-widest uppercase text-muted block mb-2">
              Company Name *
            </label>
            <input
              name="companyName"
              required
              type="text"
              className="w-full border border-border px-4 py-3 text-sm outline-none focus:border-sand transition-colors"
            />
          </div>
          <div>
            <label className="text-[10px] font-semibold tracking-widest uppercase text-muted block mb-2">
              Contact Person *
            </label>
            <input
              name="contactName"
              required
              type="text"
              className="w-full border border-border px-4 py-3 text-sm outline-none focus:border-sand transition-colors"
            />
          </div>
          <div>
            <label className="text-[10px] font-semibold tracking-widest uppercase text-muted block mb-2">
              Phone *
            </label>
            <input
              name="phone"
              required
              type="tel"
              className="w-full border border-border px-4 py-3 text-sm outline-none focus:border-sand transition-colors"
            />
          </div>
          <div>
            <label className="text-[10px] font-semibold tracking-widest uppercase text-muted block mb-2">
              Email *
            </label>
            <input
              name="email"
              required
              type="email"
              className="w-full border border-border px-4 py-3 text-sm outline-none focus:border-sand transition-colors"
            />
          </div>
          <div>
            <label className="text-[10px] font-semibold tracking-widest uppercase text-muted block mb-2">
              Emirate
            </label>
            <select
              name="emirate"
              className="w-full border border-border px-4 py-3 text-sm outline-none focus:border-sand transition-colors bg-white"
            >
              <option value="">Select Emirate</option>
              {["Dubai", "Abu Dhabi", "Sharjah", "Ras Al Khaimah", "Ajman", "Fujairah", "Umm Al Quwain"].map(
                (item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                )
              )}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-semibold tracking-widest uppercase text-muted block mb-2">
              Service Interest
            </label>
            <select
              name="serviceInterest"
              className="w-full border border-border px-4 py-3 text-sm outline-none focus:border-sand transition-colors bg-white"
            >
              <option value="">Select Service</option>
              {[
                "Catering Equipment",
                "Event Equipment Rental",
                "Kitchen Equipment",
                "Event Management",
                "All Services",
              ].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="text-[10px] font-semibold tracking-widest uppercase text-muted block mb-2">
            Message *
          </label>
          <textarea
            name="message"
            required
            rows={5}
            className="w-full border border-border px-4 py-3 text-sm outline-none focus:border-sand transition-colors resize-none"
            placeholder="Describe your requirements..."
          />
        </div>
        <div>
          <label className="text-[10px] font-semibold tracking-widest uppercase text-muted block mb-2">
            Attach File (optional) — not stored yet
          </label>
          <input
            type="file"
            disabled
            className="w-full border border-border px-4 py-3 text-sm text-muted opacity-60"
          />
        </div>
        {status === "err" ? (
          <p className="text-sm text-red-600">Something went wrong. Please try again.</p>
        ) : null}
        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full bg-sand hover:bg-sand-dark text-white text-xs font-semibold tracking-widest uppercase py-4 transition-colors disabled:opacity-60"
        >
          {status === "sending" ? "Submitting…" : "Submit Enquiry"}
        </button>
      </form>
    </>
  );
}
