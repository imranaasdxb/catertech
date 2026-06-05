"use client";

import { ArrowRight } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function EnquiryForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const inputClass =
    "w-full rounded-lg border border-[#e5e7eb] bg-white px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-[#9ca3af] hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20";
  const labelClass = "mb-2 block text-sm text-body-muted";

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
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-6 backdrop-blur-[2px]"
          role="presentation"
          onClick={(ev) => {
            if (ev.target === ev.currentTarget) setShowSuccessDialog(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="enquiry-success-title"
            className="relative w-full max-w-md rounded-2xl border border-[#e5e7eb] bg-white p-8 text-center shadow-[0_24px_80px_rgba(20,19,31,0.18)] md:p-10"
          >
            <div
              className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-green-100 bg-green-50 text-green-700"
              aria-hidden
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 id="enquiry-success-title" className="mt-4 text-2xl font-bold tracking-tight text-ink">
              Enquiry sent
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-body-muted">
              Thank you - we have received your enquiry and emailed our team. Expect a
              reply within four business hours.
            </p>
            <button
              type="button"
              className="btn-brand mt-6 w-full rounded-xl px-5 py-3 text-xs font-semibold uppercase tracking-widest"
              onClick={() => setShowSuccessDialog(false)}
            >
              <span className="btn-brand__content justify-center">Close</span>
            </button>
          </div>
        </div>
      ) : null}

      <div>
        <h2 className="text-2xl font-bold tracking-tight text-ink md:text-[1.75rem]">
          Send your enquiry
        </h2>

        <form onSubmit={onSubmit} className="mt-8 space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className={labelClass}>
                Company Name <span className="text-accent">*</span>
              </label>
              <input name="companyName" required type="text" className={inputClass} placeholder="Company name" />
            </div>
            <div>
              <label className={labelClass}>
                Contact Person <span className="text-accent">*</span>
              </label>
              <input name="contactName" required type="text" className={inputClass} placeholder="Full name" />
            </div>
            <div>
              <label className={labelClass}>
                Phone <span className="text-accent">*</span>
              </label>
              <input name="phone" required type="tel" className={inputClass} placeholder="+971" />
            </div>
            <div>
              <label className={labelClass}>
                Email <span className="text-accent">*</span>
              </label>
              <input name="email" required type="email" className={inputClass} placeholder="Type your email" />
            </div>
            <div>
              <label className={labelClass}>Emirate</label>
              <select name="emirate" className={inputClass}>
                <option value="">Select Emirate</option>
                {["Dubai", "Abu Dhabi", "Sharjah", "Ras Al Khaimah", "Ajman", "Fujairah", "Umm Al Quwain"].map(
                  (item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ),
                )}
              </select>
            </div>
            <div>
              <label className={labelClass}>Service Interest</label>
              <select name="serviceInterest" className={inputClass}>
                <option value="">Select Service</option>
                {[
                  "Catering Equipment",
                  "Event Equipment Rental",
                  "Kitchen Equipment",
                  "Event Management",
                  "All Services",
                ].map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>
              Message <span className="text-accent">*</span>
            </label>
            <textarea
              name="message"
              required
              rows={5}
              className={`${inputClass} resize-none`}
              placeholder="Describe your requirements..."
            />
          </div>

          <div>
            <label className={labelClass}>Attach File (optional) - not stored yet</label>
            <input type="file" disabled className={`${inputClass} cursor-not-allowed text-body-muted opacity-60`} />
          </div>

          {status === "err" ? (
            <p className="text-sm text-accent">Something went wrong. Please try again.</p>
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
              {status === "sending" ? "Submitting..." : "Submit Enquiry"}
              <span className="btn-brand__arrow h-8 w-8" aria-hidden>
                <ArrowRight className="size-4" strokeWidth={2} />
              </span>
            </span>
          </button>
        </form>
      </div>
    </>
  );
}
