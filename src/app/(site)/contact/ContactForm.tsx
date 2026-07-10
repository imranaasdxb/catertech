"use client";

import { ArrowRight } from "lucide-react";
import { FormEvent, useState } from "react";
import { cn } from "@/lib/utils";
import FormResponseTimeNote from "@/components/ui/FormResponseTimeNote";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setMsg("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: fd.get("fullName"),
        email: fd.get("email"),
        phone: "",
        message: fd.get("message"),
      }),
    });
    if (!res.ok) {
      setStatus("err");
      setMsg("Could not send. Please try again or call us.");
      return;
    }
    setStatus("ok");
    setMsg("Thank you. Our team will respond within 10 minutes.");
    e.currentTarget.reset();
  }

  const inputClass =
    "w-full rounded-lg border border-[#e5e7eb] bg-white px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-[#9ca3af] hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20";

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-2xl font-bold tracking-tight text-ink md:text-[1.75rem]">
          Drop us a line
        </h2>
        <FormResponseTimeNote />
      </div>

      <form onSubmit={onSubmit} className="mt-8 space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="fullName" className="mb-2 block text-sm text-body-muted">
              Full Name <span className="text-accent">*</span>
            </label>
            <input
              id="fullName"
              name="fullName"
              required
              type="text"
              className={inputClass}
              placeholder="Your full name"
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-2 block text-sm text-body-muted">
              Email <span className="text-accent">*</span>
            </label>
            <input
              id="email"
              name="email"
              required
              type="email"
              className={inputClass}
              placeholder="Type your email"
            />
          </div>
        </div>

        <div>
          <label htmlFor="message" className="mb-2 block text-sm text-body-muted">
            Message <span className="text-accent">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={6}
            className={`${inputClass} resize-none`}
            placeholder="Tell us about your catering or event equipment needs..."
          />
        </div>

        {status === "ok" || status === "err" ? (
          <p
            role="status"
            className={status === "ok" ? "text-sm text-green-700" : "text-sm text-accent"}
          >
            {msg}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={status === "sending"}
          className={cn(
            "btn-brand min-h-10 rounded-xl px-5 py-2.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] sm:min-h-11 sm:px-6 sm:text-[0.72rem]",
            "disabled:cursor-not-allowed disabled:opacity-60",
          )}
        >
          <span className="btn-brand__content gap-2">
            {status === "sending" ? "Sending…" : "Submit"}
            <span
              className="btn-brand__arrow h-7 w-7 sm:h-8 sm:w-8"
              aria-hidden
            >
              <ArrowRight className="size-3.5 sm:size-4" strokeWidth={2} />
            </span>
          </span>
        </button>
      </form>
    </div>
  );
}
