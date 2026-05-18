/** Digits only: country code, no + (e.g. 971557789673). */
export const DEFAULT_WHATSAPP_NUMBER = "971557789673";

export function getWhatsAppDigits(): string {
  const raw =
    (typeof process !== "undefined" &&
      process.env?.NEXT_PUBLIC_WHATSAPP_NUMBER) ||
    DEFAULT_WHATSAPP_NUMBER;
  const digits = String(raw).replace(/\D/g, "");
  return digits.length ? digits : DEFAULT_WHATSAPP_NUMBER;
}

export function buildWhatsAppUrl(prefilledMessage: string): string {
  return `https://wa.me/${getWhatsAppDigits()}?text=${encodeURIComponent(prefilledMessage)}`;
}

export type QuoteLineForMessage = {
  name: string;
  category: string;
  qty: number;
};

export function buildQuoteWhatsAppMessage(opts: {
  customerName: string;
  email: string;
  phone: string;
  address: string;
  message?: string;
  items: QuoteLineForMessage[];
}): string {
  const lines = [
    "Hello Catertech, I would like a quotation.",
    "",
    "Customer details:",
    `Name: ${opts.customerName}`,
    `Email: ${opts.email}`,
    `Phone: ${opts.phone}`,
    `Address: ${opts.address}`,
    "",
    "Items requested:",
    ...opts.items.map(
      (i, idx) => `${idx + 1}. ${i.name} × ${i.qty} (${i.category})`
    ),
  ];
  if (opts.message?.trim()) {
    lines.push("", "Additional notes:", opts.message.trim());
  }
  return lines.join("\n");
}
