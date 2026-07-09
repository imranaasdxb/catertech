"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Container from "@/components/Container";
import logo from "@/assets/logo.png";
import { ShoppingBasket } from "lucide-react";
import { useCart } from "@/lib/cart-context";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Products", href: "/shop" },
  { label: "Partners", href: "/partners" },
  { label: "Trade", href: "/trade" },
  { label: "Events", href: "/event-management" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const headerBtnBase =
  "btn-brand shrink-0 rounded-xl px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.12em]";

function CartIconLink({
  totalItems,
  showEmptyBadge = false,
  className = "",
}: {
  totalItems: number;
  showEmptyBadge?: boolean;
  className?: string;
}) {
  const showBadge = showEmptyBadge || totalItems > 0;

  return (
    <Link
      href="/cart"
      className={`relative inline-flex items-center justify-center text-ink/75 transition-colors duration-200 hover:text-ink ${className}`}
      aria-label={`Cart, ${totalItems} item${totalItems !== 1 ? "s" : ""}`}
    >
      <ShoppingBasket className="size-7 lg:size-8" strokeWidth={1.65} aria-hidden />
      {showBadge ? (
        <span className="brand-gradient-bg absolute -top-1.5 -right-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-0.5 text-[10px] leading-none font-bold text-white">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      ) : null}
    </Link>
  );
}

function isNavLinkActive(href: string, pathname: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

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

  const navLinkClass = (href: string) => {
    const active = isNavLinkActive(href, pathname);
    return [
      "relative inline-flex pb-1.5 text-[13px] font-semibold uppercase tracking-[0.12em] transition-colors duration-200",
      active
        ? "text-[#322b81] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:rounded-full after:bg-[#322b81] after:content-['']"
        : "text-primary hover:text-[#322b81]",
    ].join(" ");
  };

  const mobileNavLinkClass = (href: string) => {
    const active = isNavLinkActive(href, pathname);
    return [
      "border-b border-border py-3 font-display text-3xl transition-colors duration-150",
      active
        ? "font-medium text-[#322b81]"
        : "font-light text-ink/80 hover:text-ink",
    ].join(" ");
  };

  return (
    <>
      <header
        className={`site-header fixed top-0 left-0 right-0 z-50 ${
          scrolled ? "site-header--scrolled" : ""
        } ${isHome && !scrolled ? "site-header--on-hero" : ""} ${
          isShop && !scrolled ? "site-header--on-shop" : ""
        }`}
      >
        <Container className="flex h-[var(--header-height)] items-center justify-between gap-4">
          <Link
            href="/"
            className="flex shrink-0 items-center leading-none"
            aria-label="Catertech home"
          >
            <Image
              src={logo}
              alt="Catertech"
              width={300}
              height={130}
              priority
              className="site-header__logo block h-12 w-auto max-h-[52px] object-contain sm:h-[54px] sm:max-h-[56px] md:h-[62px] md:max-h-[66px] lg:h-[68px] lg:max-h-[72px]"
            />
          </Link>

          <nav className="hidden items-center gap-6 lg:flex xl:gap-7">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={navLinkClass(link.href)}
                aria-current={isNavLinkActive(link.href, pathname) ? "page" : undefined}
              >
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

            <CartIconLink totalItems={totalItems} showEmptyBadge />
          </div>

          <div className="flex items-center gap-4 lg:hidden">
            <CartIconLink totalItems={totalItems} />

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
        <div className="flex h-full flex-col px-8 pt-[var(--header-height)] pb-10">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={mobileNavLinkClass(link.href)}
                aria-current={isNavLinkActive(link.href, pathname) ? "page" : undefined}
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
