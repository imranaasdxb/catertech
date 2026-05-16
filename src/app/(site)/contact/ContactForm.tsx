"use client";

import { FormEvent, useState } from "react";

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
        phone: fd.get("phone") || "",
        message: fd.get("message"),
      }),
    });
    if (!res.ok) {
      setStatus("err");
      setMsg("Could not send. Please try again or call us.");
      return;
    }
    setStatus("ok");
    setMsg("Thank you — we will get back to you shortly.");
    e.currentTarget.reset();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="text-[10px] font-semibold tracking-widest uppercase text-muted block mb-2">
            Full Name
          </label>
          <input
            name="fullName"
            required
            type="text"
            className="w-full border border-border bg-white px-4 py-3 text-sm text-charcoal outline-none focus:border-sand transition-colors"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="text-[10px] font-semibold tracking-widest uppercase text-muted block mb-2">
            Email
          </label>
          <input
            name="email"
            required
            type="email"
            className="w-full border border-border bg-white px-4 py-3 text-sm text-charcoal outline-none focus:border-sand transition-colors"
            placeholder="your@email.com"
          />
        </div>
      </div>
      <div>
        <label className="text-[10px] font-semibold tracking-widest uppercase text-muted block mb-2">
          Phone
        </label>
        <input
          name="phone"
          type="tel"
          className="w-full border border-border bg-white px-4 py-3 text-sm text-charcoal outline-none focus:border-sand transition-colors"
          placeholder="+971 XX XXX XXXX"
        />
      </div>
      <div>
        <label className="text-[10px] font-semibold tracking-widest uppercase text-muted block mb-2">
          Message
        </label>
        <textarea
          name="message"
          required
          rows={5}
          className="w-full border border-border bg-white px-4 py-3 text-sm text-charcoal outline-none focus:border-sand transition-colors resize-none"
          placeholder="Tell us about your requirements..."
        />
      </div>
      {status === "ok" || status === "err" ? (
        <p className={status === "ok" ? "text-sm text-green-700" : "text-sm text-red-600"}>
          {msg}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full bg-sand hover:bg-sand-dark disabled:opacity-60 text-white text-xs font-semibold tracking-widest uppercase py-4 transition-colors duration-200"
      >
        {status === "sending" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
