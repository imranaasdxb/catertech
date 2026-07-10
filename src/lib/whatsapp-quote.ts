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
  const phone = getWhatsAppDigits();
  return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(prefilledMessage)}`;
}

export type QuoteLineForMessage = {
  name: string;
  category: string;
  qty: number;
  price?: string;
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
    ...opts.items.map((item, idx) => {
      const pricePart = item.price?.trim() ? ` — ${item.price.trim()}` : "";
      return `${idx + 1}. ${item.name} × ${item.qty}${pricePart} (${item.category})`;
    }),
  ];
  if (opts.message?.trim()) {
    lines.push("", "Additional notes:", opts.message.trim());
  }
  return lines.join("\n");
}

export function openWhatsAppChat(url: string): boolean {
  const win = window.open(url, "_blank");
  if (win) {
    try {
      win.opener = null;
    } catch {
      // ignore
    }
    return true;
  }

  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  link.remove();
  return false;
}
