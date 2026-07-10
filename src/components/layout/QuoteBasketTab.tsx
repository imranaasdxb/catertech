"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart-context";

const HIDDEN_ROUTES = ["/cart"];

export default function QuoteBasketTab() {
  const pathname = usePathname();
  const { totalItems, isHydrated } = useCart();

  const visible =
    isHydrated &&
    totalItems > 0 &&
    !HIDDEN_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));

  const countLabel = isHydrated ? (totalItems > 99 ? "99+" : String(totalItems)) : "0";
  const itemLabel = isHydrated ? totalItems : 0;

  return (
    <Link
      href="/cart"
      aria-label={`${itemLabel} item${itemLabel !== 1 ? "s" : ""} in quote basket. Request a quote.`}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`quote-basket-tab group fixed right-0 top-[calc(50%+7rem)] z-40 transition-transform duration-[900ms] ease-[cubic-bezier(0.33,1,0.68,1)] motion-reduce:transition-none ${
        visible
          ? "pointer-events-auto translate-x-0"
          : "pointer-events-none translate-x-full"
      }`}
    >
      <span className="btn-brand quote-basket-tab__pill relative flex h-[132px] w-9 shrink-0 flex-col items-center justify-center gap-3.5 overflow-hidden rounded-l-2xl rounded-r-none border-r-0 py-3 shadow-[-8px_0_32px_rgba(27,43,75,0.16)] sm:h-[148px] sm:w-11 sm:gap-4 sm:py-4 md:h-[168px] md:w-12">
        <span
          className="flex h-[18px] min-w-[18px] shrink-0 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-bold leading-none text-primary shadow-sm md:text-[10px]"
          aria-hidden
        >
          {countLabel}
        </span>
        <span
          className="quote-basket-tab__label btn-brand__content whitespace-nowrap text-[10px] font-extrabold uppercase leading-none tracking-[0.08em] text-[#c21722] transition-colors duration-300 group-hover:text-accent md:text-[11px]"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          Request Quote
        </span>
      </span>
    </Link>
  );
}
