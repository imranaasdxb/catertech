"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart-context";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Shop", href: "/shop" },
  { label: "Trade", href: "/trade" },
  { label: "Events", href: "/event-management" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isShopProductDetail =
    pathname.length > "/shop".length && pathname.startsWith("/shop/");
  const barSolid = scrolled || isShopProductDetail;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          barSolid
            ? "bg-white/80 backdrop-blur-xl border-b border-border/60 shadow-[0_1px_16px_rgba(26,31,46,0.08)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8 h-[72px] flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <span
              className={`text-lg font-bold tracking-[0.18em] uppercase transition-colors duration-300 ${
                barSolid ? "text-navy" : "text-white"
              }`}
            >
              Cater
            </span>
            <span className="text-lg font-light tracking-[0.18em] uppercase text-sand">
              TECH
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs font-medium tracking-widest uppercase transition-colors duration-200 hover:text-sand ${
                  barSolid ? "text-charcoal" : "text-white/80"
                } ${pathname === link.href ? "text-sand" : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/auth?tab=login"
              className={`text-xs font-semibold tracking-widest uppercase px-4 py-2.5 border transition-colors duration-200 shrink-0 ${
                barSolid
                  ? "border-border text-charcoal hover:border-sand hover:text-sand"
                  : "border-white/35 text-white/90 hover:border-sand hover:text-sand"
              }`}
            >
              Log in
            </Link>
            <Link
              href="/auth?tab=signup"
              className="bg-sand text-white text-xs font-semibold tracking-widest uppercase px-4 py-2.5 hover:bg-sand-dark transition-colors duration-200 shrink-0"
            >
              Sign up
            </Link>
            <button
              className={`text-xs font-medium tracking-widest uppercase transition-colors duration-200 hover:text-sand ${
                barSolid ? "text-muted" : "text-white/70"
              }`}
            >
              EN&nbsp;·&nbsp;AR
            </button>

            {/* Cart */}
            <Link
              href="/cart"
              className={`relative transition-colors duration-200 hover:text-sand ${
                barSolid ? "text-charcoal" : "text-white"
              }`}
              aria-label={`Cart — ${totalItems} item${totalItems !== 1 ? "s" : ""}`}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {totalItems > 0 ? (
                <span className="absolute -top-1.5 -right-1.5 bg-sand text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              ) : (
                <span className="absolute -top-1.5 -right-1.5 bg-sand text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                  0
                </span>
              )}
            </Link>

            {/* CTA */}
            <Link
              href="/trade/rfq"
              className="bg-sand text-white text-xs font-semibold tracking-widest uppercase px-5 py-2.5 hover:bg-sand-dark transition-colors duration-200"
            >
              Get Quote
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <div className="lg:hidden flex items-center gap-4">
            {/* Mobile Cart */}
            <Link
              href="/cart"
              className={`relative transition-colors duration-200 hover:text-sand ${
                barSolid ? "text-charcoal" : "text-white"
              }`}
              aria-label="Cart"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-sand text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                  {totalItems}
                </span>
              )}
            </Link>

            <button
              className={`flex flex-col gap-1.5 p-1 transition-colors duration-200 ${
                barSolid ? "text-charcoal" : "text-white"
              }`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span
                className={`block h-0.5 bg-current transition-all duration-300 origin-center ${
                  menuOpen ? "w-6 rotate-45 translate-y-2" : "w-6"
                }`}
              />
              <span
                className={`block h-0.5 bg-current transition-all duration-300 ${
                  menuOpen ? "opacity-0 w-0" : "w-4"
                }`}
              />
              <span
                className={`block h-0.5 bg-current transition-all duration-300 origin-center ${
                  menuOpen ? "w-6 -rotate-45 -translate-y-2" : "w-6"
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-navy transition-opacity duration-300 lg:hidden ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col h-full px-8 pt-24 pb-10">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-white/80 hover:text-white font-light text-3xl py-3 border-b border-white/10 transition-colors duration-150"
                style={{ transitionDelay: `${i * 40}ms` }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto flex flex-col gap-3">
            <div className="flex gap-3">
              <Link
                href="/auth?tab=login"
                onClick={() => setMenuOpen(false)}
                className="flex-1 border border-white/25 text-white text-center text-sm font-semibold tracking-widest uppercase py-4 hover:border-sand hover:text-sand transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/auth?tab=signup"
                onClick={() => setMenuOpen(false)}
                className="flex-1 bg-sand text-white text-center text-sm font-semibold tracking-widest uppercase py-4 hover:bg-sand-dark transition-colors"
              >
                Sign up
              </Link>
            </div>
            <Link
              href="/trade/rfq"
              onClick={() => setMenuOpen(false)}
              className="bg-white/10 border border-white/20 text-white text-sm font-semibold tracking-widest uppercase px-6 py-4 text-center hover:bg-white/15 transition-colors duration-200"
            >
              Get a Quote
            </Link>
            <div className="flex items-center justify-between text-sm text-white/50">
              <span>+971 4 XXX XXXX</span>
              <span>EN · AR</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
