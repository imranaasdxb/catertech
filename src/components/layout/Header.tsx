"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  /** Product URLs (/shop/[id]): white hero — keep bar readable like scrolled state */
  const isShopProductDetail =
    pathname.length > "/shop".length && pathname.startsWith("/shop/");
  const barSolid = scrolled || isShopProductDetail;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          barSolid
            ? "bg-white/95 backdrop-blur-md border-b border-border shadow-sm"
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
            <span
              className="text-lg font-light tracking-[0.18em] uppercase text-sand"
            >
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
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Language Toggle */}
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
              aria-label="Cart"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              <span className="absolute -top-1.5 -right-1.5 bg-sand text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                0
              </span>
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
          <button
            className={`lg:hidden flex flex-col gap-1.5 p-1 transition-colors duration-200 ${
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
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-navy transition-opacity duration-300 lg:hidden ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
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

          <div className="mt-auto flex flex-col gap-4">
            <Link
              href="/trade/rfq"
              onClick={() => setMenuOpen(false)}
              className="bg-sand text-white text-sm font-semibold tracking-widest uppercase px-6 py-4 text-center hover:bg-sand-dark transition-colors duration-200"
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
