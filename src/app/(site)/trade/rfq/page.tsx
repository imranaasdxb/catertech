"use client";

import logo from "@/assets/logo.png";
import vector1 from "@/assets/vector1.png";
import Container from "@/components/Container";
import { rfqEventTypes } from "@/lib/validations/forms";
import { cn } from "@/lib/utils";
import NextImage from "next/image";
import { ArrowRight, CheckCircle2, FileText, ReceiptText, Timer, X } from "lucide-react";
import { FormEvent, useEffect, useRef, useState, type ChangeEvent } from "react";

const inputClass =
  "w-full rounded-lg border border-[#e5e7eb] bg-white px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-[#9ca3af] hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20";
const labelClass = "mb-2 block text-sm text-body-muted";

const EMIRATES = ["Dubai", "Abu Dhabi", "Sharjah", "RAK", "Ajman", "Fujairah"];
const today = new Date().toISOString().split("T")[0];

const initialForm = {
  contactPerson: "",
  companyName: "",
  tradeLicenceNo: "",
  phone: "",
  email: "",
  budgetAed: "",
  emirate: "Dubai",
  eventName: "",
  eventType: "",
  eventDate: "",
  eventDuration: "",
  venueName: "",
  venueLocation: "",
  expectedGuests: "",
  notes: "",
};

type AttachmentKind = "image" | "pdf" | "other";

type AttachmentDraft = {
  id: string;
  file: File;
  previewUrl: string;
  kind: AttachmentKind;
};

function getAttachmentKind(file: File): AttachmentKind {
  if (file.type.startsWith("image/")) return "image";
  if (file.type === "application/pdf" || /\.pdf$/i.test(file.name)) return "pdf";
  return "other";
}

function createAttachmentDraft(file: File): AttachmentDraft {
  return {
    id: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2, 9)}`,
    file,
    previewUrl: URL.createObjectURL(file),
    kind: getAttachmentKind(file),
  };
}

function RFQGraphic() {
  return (
    <div className="relative mx-auto w-full max-w-[380px]" aria-hidden>
      <div className="absolute -left-6 top-8 h-24 w-24 rounded-full bg-primary-soft blur-2xl" />
      <NextImage
        src={vector1}
        alt=""
        width={380}
        height={300}
        className="relative h-auto w-full object-contain"
        priority
      />
    </div>
  );
}

export default function RFQPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const attachmentsRef = useRef<AttachmentDraft[]>([]);
  const [form, setForm] = useState(initialForm);
  const [submittedForm, setSubmittedForm] = useState(initialForm);
  const [attachments, setAttachments] = useState<AttachmentDraft[]>([]);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [ref, setRef] = useState("");

  attachmentsRef.current = attachments;

  useEffect(() => {
    return () => {
      attachmentsRef.current.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };
  }, []);

  function updateField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleFilesChange(e: ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    if (!picked.length) return;
    setAttachments((prev) => [...prev, ...picked.map(createAttachmentDraft)]);
    e.target.value = "";
  }

  function removeAttachment(id: string) {
    setAttachments((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((item) => item.id !== id);
    });
  }

  function clearAttachments() {
    setAttachments((prev) => {
      prev.forEach((item) => URL.revokeObjectURL(item.previewUrl));
      return [];
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });
    attachments.forEach((item) => {
      formData.append("attachments", item.file);
    });

    const res = await fetch("/api/rfq", {
      method: "POST",
      body: formData,
    });
    setStatus("idle");
    if (!res.ok) {
      setStatus("err");
      return;
    }
    const data = (await res.json()) as { reference?: string };
    setRef(data.reference || "");
    setSubmittedForm(form);
    setStatus("ok");
  }

  function resetAfterReferenceAction() {
    setForm(initialForm);
    setSubmittedForm(initialForm);
    setRef("");
    setStatus("idle");
    clearAttachments();
  }

  function loadReceiptLogo() {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = logo.src;
    });
  }

  async function saveReference() {
    if (!ref) return;

    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 760;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    try {
      const receiptLogo = await loadReceiptLogo();
      ctx.drawImage(receiptLogo, 64, 42, 170, 92);
    } catch {
      ctx.fillStyle = "#322B81";
      ctx.font = "700 34px Arial";
      ctx.fillText("CaterTech", 64, 100);
    }

    ctx.fillStyle = "#C21722";
    ctx.fillRect(64, 172, 1072, 6);

    ctx.fillStyle = "#1a1a1a";
    ctx.font = "700 44px Arial";
    ctx.fillText("RFQ Submitted", 64, 252);
    ctx.font = "700 56px Arial";
    ctx.fillStyle = "#322B81";
    ctx.fillText(ref, 64, 328);

    const details = [
      ["Client Name", submittedForm.contactPerson],
      ["Company Name", submittedForm.companyName],
      ["Contact No.", submittedForm.phone],
      ["Email", submittedForm.email],
      ["Event Name", submittedForm.eventName],
      ["Event Type", submittedForm.eventType],
    ];

    let y = 416;
    for (const [label, value] of details) {
      ctx.fillStyle = "#6b7280";
      ctx.font = "600 22px Arial";
      ctx.fillText(label, 64, y);
      ctx.fillStyle = "#1a1a1a";
      ctx.font = "500 26px Arial";
      ctx.fillText(value || "-", 310, y);
      y += 52;
    }

    ctx.fillStyle = "#6b7280";
    ctx.font = "500 20px Arial";
    ctx.fillText("Please keep this image for your records.", 310, y + 6);

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `${ref}.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    resetAfterReferenceAction();
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
        {status === "ok" ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
            <div className="w-full max-w-sm rounded-2xl border border-green-100 bg-white p-6 text-center shadow-2xl">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-700">
                <CheckCircle2 className="h-7 w-7" strokeWidth={2} aria-hidden />
              </span>
              <p className="mt-4 text-xl font-bold tracking-tight text-ink">RFQ submitted</p>
              <p className="mt-2 text-sm text-body-muted">Your reference number is</p>
              <p className="mt-2 text-2xl font-bold tracking-tight text-primary">{ref}</p>
              <div className="mt-5 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={saveReference}
                  className="cursor-pointer rounded-xl bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={resetAfterReferenceAction}
                  className="cursor-pointer rounded-xl border border-[#e5e7eb] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:text-primary hover:shadow-md active:translate-y-0"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        ) : null}

        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
          <div className="max-w-xl">
            <h1 className="text-[2.35rem] font-bold leading-[1.08] tracking-[-0.03em] text-ink sm:text-[2.75rem] lg:text-[3.1rem]">
              <span className="font-sans">Request for </span>
              <span
                className="font-normal italic text-ink"
                style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}
              >
                quotation
              </span>
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-body-muted md:text-lg">
              Share your company and event details for a structured trade quotation.
            </p>

            <div className="mt-8 space-y-5">
              {[
                { icon: FileText, title: "Add company and contact details", tone: "bg-[#fef9c3]" },
                { icon: ReceiptText, title: "Tell us about your event", tone: "bg-[#dbeafe]" },
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
                      Full Name <span className="text-accent">*</span>
                    </label>
                    <input
                      required
                      value={form.contactPerson}
                      onChange={(e) => updateField("contactPerson", e.target.value)}
                      className={inputClass}
                      placeholder="Full name"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      Company Name <span className="text-accent">*</span>
                    </label>
                    <input
                      required
                      value={form.companyName}
                      onChange={(e) => updateField("companyName", e.target.value)}
                      className={inputClass}
                      placeholder="Company name"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Trade Licence No.</label>
                    <input
                      value={form.tradeLicenceNo}
                      onChange={(e) => updateField("tradeLicenceNo", e.target.value)}
                      className={inputClass}
                      placeholder="Optional"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      Phone <span className="text-accent">*</span>
                    </label>
                    <input
                      required
                      type="tel"
                      value={form.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
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
                      value={form.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      className={inputClass}
                      placeholder="Type your email"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Budget (AED)</label>
                    <input
                      value={form.budgetAed}
                      onChange={(e) => updateField("budgetAed", e.target.value)}
                      className={inputClass}
                      placeholder="Optional"
                    />
                  </div>
                  <div className="md:col-span-2 md:max-w-md">
                    <label className={labelClass}>Emirate</label>
                    <select
                      value={form.emirate}
                      onChange={(e) => updateField("emirate", e.target.value)}
                      className={inputClass}
                    >
                      {EMIRATES.map((emirate) => (
                        <option key={emirate} value={emirate}>
                          {emirate}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="border-t border-[#e5e7eb] pt-8 text-2xl font-bold tracking-tight text-ink md:text-[1.75rem]">
                  Event details
                </h2>
                <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className={labelClass}>
                      Event Name <span className="text-accent">*</span>
                    </label>
                    <input
                      required
                      value={form.eventName}
                      onChange={(e) => updateField("eventName", e.target.value)}
                      className={inputClass}
                      placeholder="e.g. Annual Gala Dinner"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      Event Type <span className="text-accent">*</span>
                    </label>
                    <select
                      required
                      value={form.eventType}
                      onChange={(e) => updateField("eventType", e.target.value)}
                      className={inputClass}
                    >
                      <option value="">Select event type</option>
                      {rfqEventTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Event Date</label>
                    <input
                      type="date"
                      min={today}
                      value={form.eventDate}
                      onChange={(e) => updateField("eventDate", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Event Duration</label>
                    <input
                      value={form.eventDuration}
                      onChange={(e) => updateField("eventDuration", e.target.value)}
                      className={inputClass}
                      placeholder="e.g. 4 hours, full day"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Venue Name</label>
                    <input
                      value={form.venueName}
                      onChange={(e) => updateField("venueName", e.target.value)}
                      className={inputClass}
                      placeholder="Venue name"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Venue Location</label>
                    <input
                      value={form.venueLocation}
                      onChange={(e) => updateField("venueLocation", e.target.value)}
                      className={inputClass}
                      placeholder="Area or address"
                    />
                  </div>
                  <div className="md:max-w-[calc(50%-0.75rem)]">
                    <label className={labelClass}>Expected Guests</label>
                    <input
                      value={form.expectedGuests}
                      onChange={(e) => updateField("expectedGuests", e.target.value)}
                      className={inputClass}
                      placeholder="e.g. 150"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className={labelClass}>Attach Files (optional)</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,application/pdf,.pdf"
                  onChange={handleFilesChange}
                  className={`${inputClass} file:mr-4 file:rounded-md file:border-0 file:bg-primary-soft file:px-3 file:py-1.5 file:text-xs file:font-semibold file:uppercase file:tracking-wide file:text-primary`}
                />
                <p className="mt-2 text-xs text-body-muted">
                  Images and PDFs show a preview below. Files upload to ImageKit when you submit.
                </p>

                {attachments.length > 0 ? (
                  <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {attachments.map((item) => (
                      <div
                        key={item.id}
                        className="relative overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-sm"
                      >
                        <button
                          type="button"
                          onClick={() => removeAttachment(item.id)}
                          className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-ink shadow-sm transition-colors hover:bg-accent-soft hover:text-accent"
                          aria-label={`Remove ${item.file.name}`}
                        >
                          <X className="h-4 w-4" strokeWidth={2} />
                        </button>

                        {item.kind === "image" ? (
                          <div className="aspect-square bg-offwhite">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.previewUrl}
                              alt={item.file.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : item.kind === "pdf" ? (
                          <div className="aspect-square bg-offwhite">
                            <iframe
                              src={item.previewUrl}
                              title={item.file.name}
                              className="h-full w-full border-0"
                            />
                          </div>
                        ) : (
                          <div className="flex aspect-square flex-col items-center justify-center gap-2 bg-offwhite px-3 text-center">
                            <FileText className="h-8 w-8 text-primary" strokeWidth={1.5} aria-hidden />
                            <span className="text-[11px] font-medium text-body-muted">Document</span>
                          </div>
                        )}

                        <div className="border-t border-[#e5e7eb] px-3 py-2">
                          <p className="truncate text-xs font-medium text-ink">{item.file.name}</p>
                          <p className="text-[11px] text-body-muted">
                            {Math.max(1, Math.round(item.file.size / 1024))} KB
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>

              <div>
                <label className={labelClass}>Notes</label>
                <textarea
                  rows={5}
                  value={form.notes}
                  onChange={(e) => updateField("notes", e.target.value)}
                  className={`${inputClass} resize-none`}
                  placeholder="Any additional requirements or notes..."
                />
              </div>

              {status === "err" ? (
                <p className="text-sm text-accent">
                  Please check required fields and your network connection, then try again.
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
