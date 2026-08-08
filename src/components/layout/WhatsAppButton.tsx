"use client";

import { useMemo, useState, type SVGProps } from "react";
import { buildWhatsAppUrl, openWhatsAppChat } from "@/lib/whatsapp-quote";

type ChatLead = {
  name: string;
  phone: string;
  need: string;
  details: string;
};

type SaveState = "idle" | "saving" | "saved" | "error";

const NEED_OPTIONS = [
  "Catering equipment rental",
  "Quotation request",
  "Product availability",
  "Event rental support",
  "Speak to sales",
  "Other",
];

function SuccessCheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function MessageCircleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7A8.4 8.4 0 0 1 4 11.5a8.5 8.5 0 0 1 17 0Z" />
    </svg>
  );
}

function SendIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function buildLeadMessage(lead: ChatLead) {
  return [
    "Hello Catertech, I need help from your sales team.",
    "",
    `Name: ${lead.name || "Not provided"}`,
    `Phone: ${lead.phone || "Not provided"}`,
    `Request type: ${lead.need || "General enquiry"}`,
    `Details: ${lead.details || "Not provided"}`,
  ].join("\n");
}

export default function WhatsAppButton() {
  const [open, setOpen] = useState(false);
  const [lead, setLead] = useState<ChatLead>({
    name: "",
    phone: "",
    need: "",
    details: "",
  });
  const [introMessage, setIntroMessage] = useState("");
  const [submittedMessage, setSubmittedMessage] = useState("");
  const [saveState, setSaveState] = useState<SaveState>("idle");

  const whatsappUrl = useMemo(() => buildWhatsAppUrl(buildLeadMessage(lead)), [lead]);
  const hasStarted = submittedMessage.trim().length > 0;
  const needsCustomMessage = lead.need === "Other";
  const canContinue =
    lead.need.trim().length > 0 &&
    lead.name.trim().length > 1 &&
    lead.phone.trim().length > 4 &&
    (!needsCustomMessage || lead.details.trim().length > 2);

  function updateLead<K extends keyof ChatLead>(key: K, value: ChatLead[K]) {
    setLead((current) => ({ ...current, [key]: value }));
    if (saveState !== "idle") setSaveState("idle");
  }

  function inferNeedFromMessage(message: string) {
    const text = message.toLowerCase();
    if (/\b(quote|quotation|price|cost|rate)\b/.test(text)) return "Quotation request";
    if (/\b(available|availability|stock)\b/.test(text)) return "Product availability";
    if (/\b(event|wedding|conference|exhibition|party)\b/.test(text)) return "Event rental support";
    if (/\b(sales|agent|executive|person|call)\b/.test(text)) return "Speak to sales";
    if (/\b(equipment|rent|rental|chair|table|plate|glass|buffet|kitchen)\b/.test(text)) {
      return "Catering equipment rental";
    }
    if (/\b(hi|hello|hey|salam|good morning|good evening)\b/.test(text)) return "";
    return "Other";
  }

  function submitIntroMessage() {
    const message = introMessage.trim();
    if (!message) return;

    const inferredNeed = inferNeedFromMessage(message);
    setSubmittedMessage(message);
    setIntroMessage("");
    if (inferredNeed) {
      setLead((current) => ({
        ...current,
        need: inferredNeed,
        details: current.details || message,
      }));
    }
    if (saveState !== "idle") setSaveState("idle");
  }

  async function saveLead() {
    if (!canContinue || saveState === "saving") return false;

    setSaveState("saving");
    try {
      const res = await fetch("/api/chatbot-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });

      if (!res.ok) throw new Error("Could not save chat lead");
      setSaveState("saved");
      return true;
    } catch {
      setSaveState("error");
      return false;
    }
  }

  async function continueToWhatsApp() {
    await saveLead();
    openWhatsAppChat(whatsappUrl);
  }

  function selectNeed(need: string) {
    updateLead("need", need);
  }

  function clearChat() {
    setLead({
      name: "",
      phone: "",
      need: "",
      details: "",
    });
    setIntroMessage("");
    setSubmittedMessage("");
    setSaveState("idle");
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open ? (
        <section
          aria-label="Catertech sales chat"
          className="w-[min(calc(100vw-2rem),380px)] overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_20px_70px_rgba(18,25,38,0.22)]"
        >
          <div className="flex items-start justify-between gap-4 border-b border-black/10 bg-[#0b1320] px-4 py-4 text-white">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9be7b7]">
                Catertech Assistant
              </p>
              <div
                role="heading"
                aria-level={2}
                className="mt-1 text-lg font-bold leading-tight"
                style={{ color: "#f6d98f" }}
              >
                How can we help?
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={clearChat}
                className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#f6d98f]/85 transition hover:bg-white/10 hover:text-[#f6d98f]"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="inline-flex size-8 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                <XIcon className="size-4" strokeWidth={2.2} />
              </button>
            </div>
          </div>

          <div className="space-y-4 px-4 py-4">
            <div className="rounded-2xl rounded-tl-sm bg-[#f4f5f7] px-4 py-3 text-sm leading-relaxed text-[#202632]">
              Hi, welcome to Catertech. I can help route your request to the right sales executive.
            </div>

            {hasStarted ? (
              <div className="ml-auto max-w-[88%] rounded-2xl rounded-tr-sm bg-[#111827] px-4 py-3 text-sm leading-relaxed text-white">
                {submittedMessage}
              </div>
            ) : (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  submitIntroMessage();
                }}
                className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white p-2 shadow-sm"
              >
                <input
                  value={introMessage}
                  onChange={(event) => setIntroMessage(event.target.value)}
                  placeholder="Type hello or tell us what you need..."
                  className="min-h-10 flex-1 bg-transparent px-2 text-sm text-[#111827] outline-none placeholder:text-[#9ca3af]"
                />
                <button
                  type="submit"
                  aria-label="Send message"
                  className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-[#111827] text-white transition hover:bg-[#243044]"
                >
                  <SendIcon className="size-4" strokeWidth={2.2} />
                </button>
              </form>
            )}

            {hasStarted ? (
              <div className="rounded-2xl rounded-tl-sm bg-[#f4f5f7] px-4 py-3 text-sm leading-relaxed text-[#202632]">
                {lead.need
                  ? `Thanks. I can help with ${lead.need.toLowerCase()}. Please share your details below.`
                  : "Thanks. Please choose what you need, or select Other and type your query."}
              </div>
            ) : null}

            {hasStarted ? (
            <div className="flex flex-wrap gap-2">
              {NEED_OPTIONS.map((option) => {
                const active = lead.need === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => selectNeed(option)}
                    className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${
                      active
                        ? "border-[#111827] bg-[#111827] text-white"
                        : "border-black/10 bg-white text-[#374151] hover:border-[#111827]/30"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            ) : null}

            {lead.need ? (
            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-[#4b5563]">Name</span>
                  <input
                    value={lead.name}
                    onChange={(event) => updateLead("name", event.target.value)}
                    placeholder="Your name"
                    autoComplete="name"
                    className="w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm text-[#111827] outline-none transition placeholder:text-[#9ca3af] focus:border-[#111827] focus:ring-2 focus:ring-[#111827]/10"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-[#4b5563]">Phone</span>
                  <input
                    value={lead.phone}
                    onChange={(event) => updateLead("phone", event.target.value)}
                    placeholder="+971..."
                    autoComplete="tel"
                    className="w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm text-[#111827] outline-none transition placeholder:text-[#9ca3af] focus:border-[#111827] focus:ring-2 focus:ring-[#111827]/10"
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-[#4b5563]">
                  {needsCustomMessage ? "Type your query" : "Request details"}
                </span>
                <textarea
                  value={lead.details}
                  onChange={(event) => updateLead("details", event.target.value)}
                  placeholder={
                    needsCustomMessage
                      ? "Tell us what you are looking for..."
                      : "Product, quantity, event date or location..."
                  }
                  rows={3}
                  className="w-full resize-none rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm text-[#111827] outline-none transition placeholder:text-[#9ca3af] focus:border-[#111827] focus:ring-2 focus:ring-[#111827]/10"
                />
              </label>
            </div>
            ) : null}

            {saveState === "saved" ? (
              <p className="flex items-center gap-1.5 text-xs font-medium text-[#147a3f]">
                <SuccessCheckIcon className="size-3.5" strokeWidth={2.4} />
                Your details were saved for follow-up.
              </p>
            ) : saveState === "error" ? (
              <p className="text-xs font-medium text-[#b42318]">
                WhatsApp will still open. The website could not save this lead.
              </p>
            ) : null}

            {lead.need ? (
              <>
                <button
                  type="button"
                  onClick={continueToWhatsApp}
                  disabled={!canContinue || saveState === "saving"}
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1ebe5d] disabled:cursor-not-allowed disabled:bg-[#9bd9b4]"
                >
                  <SendIcon className="size-4" strokeWidth={2.2} />
                  {saveState === "saving" ? "Saving..." : "Continue on WhatsApp"}
                </button>
                <p className="text-center text-xs font-medium leading-relaxed text-[#6b7280]">
                  Our sales executive is usually available within 5 minutes after you continue.
                </p>
              </>
            ) : null}
          </div>
        </section>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label={open ? "Close Catertech chat" : "Open Catertech chat"}
        aria-expanded={open}
        className="flex size-[54px] items-center justify-center rounded-full bg-[#111827] text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
      >
        {open ? <XIcon className="size-5" strokeWidth={2.2} /> : <MessageCircleIcon className="size-6" strokeWidth={2.1} />}
      </button>
    </div>
  );
}
