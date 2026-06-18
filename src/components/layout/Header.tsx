"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Container from "@/components/Container";
import logo from "@/assets/logo.png";
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

const headerBtnBase =
  "btn-brand shrink-0 rounded-xl px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.12em]";

export default function Header() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHome = pathname === "/";
  const isShop = pathname === "/shop";

  const navLinkClass = (href: string) =>
    `text-[13px] font-semibold uppercase tracking-[0.12em] text-primary transition-colors duration-200 ${
      pathname === href ? "text-accent-dark" : "hover:text-accent-dark"
    }`;

  return (
    <>
      <header
        className={`site-header fixed top-0 left-0 right-0 z-50 ${
          scrolled ? "site-header--scrolled" : ""
        } ${isHome && !scrolled ? "site-header--on-hero" : ""} ${
          isShop && !scrolled ? "site-header--on-shop" : ""
        }`}
      >
        <Container className="flex h-[var(--header-height)] min-h-[84px] items-center justify-between gap-4">
          <Link
            href="/"
            className="flex shrink-0 items-center"
            aria-label="Catertech home"
          >
            <Image
              src={logo}
              alt="Catertech"
              width={300}
              height={130}
              priority
              className="h-10 w-auto max-h-[42px] object-contain"
            />
          </Link>

          <nav className="hidden items-center gap-6 lg:flex xl:gap-7">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className={navLinkClass(link.href)}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2.5 lg:flex">
            <Link
              href="/auth?tab=login"
              className={headerBtnBase}
            >
              Log in
            </Link>
            <Link
              href="/auth?tab=signup"
              className={headerBtnBase}
            >
              Sign up
            </Link>
            <button className="px-1 text-[11px] font-medium uppercase tracking-[0.12em] text-muted transition-colors duration-200 hover:text-ink">
              EN&nbsp;·&nbsp;AR
            </button>

            <Link
              href="/cart"
              className="relative text-ink/70 transition-colors duration-200 hover:text-ink"
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
              <span className="brand-gradient-bg absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full text-[9px] leading-none font-bold text-white">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4 lg:hidden">
            <Link
              href="/cart"
              className="relative text-ink/70 transition-colors duration-200 hover:text-ink"
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
                <span className="brand-gradient-bg absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full text-[9px] leading-none font-bold text-white">
                  {totalItems}
                </span>
              )}
            </Link>

            <button
              className="flex flex-col gap-1.5 p-1 text-ink transition-colors duration-200"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span
                className={`block h-0.5 origin-center bg-current transition-all duration-300 ${
                  menuOpen ? "w-6 translate-y-2 rotate-45" : "w-6"
                }`}
              />
              <span
                className={`block h-0.5 bg-current transition-all duration-300 ${
                  menuOpen ? "w-0 opacity-0" : "w-4"
                }`}
              />
              <span
                className={`block h-0.5 origin-center bg-current transition-all duration-300 ${
                  menuOpen ? "w-6 -translate-y-2 -rotate-45" : "w-6"
                }`}
              />
            </button>
          </div>
        </Container>
      </header>

      <div
        className={`fixed inset-0 z-40 bg-white transition-opacity duration-300 lg:hidden ${
          menuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex h-full flex-col px-8 pt-24 pb-10">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="border-b border-border py-3 font-display text-3xl font-light text-ink/80 transition-colors duration-150 hover:text-ink"
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
                className="btn-brand flex-1 rounded-xl py-4 text-center text-sm font-semibold uppercase tracking-widest"
              >
                Log in
              </Link>
              <Link
                href="/auth?tab=signup"
                onClick={() => setMenuOpen(false)}
                className="btn-brand flex-1 rounded-xl py-4 text-center text-sm font-semibold uppercase tracking-widest"
              >
                Sign up
              </Link>
            </div>
            <div className="flex items-center justify-between text-sm text-muted">
              <span>+971 4 XXX XXXX</span>
              <span>EN · AR</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
