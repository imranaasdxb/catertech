import footerBgImage from "@/assets/layout/footer-background.png";
import Image from "next/image";
import Link from "next/link";
import FooterMapPanel from "@/components/layout/FooterMapPanel";
import { SERVICES_LIST } from "@/lib/services";
import {
  CATER_TECH_LOCATION,
  GOOGLE_MAPS_PLACE_URL,
} from "@/lib/site-location";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Mail,
  MapPin,
  Phone,
  Shield,
} from "lucide-react";
import { FaFacebook, FaInstagram, FaLinkedin, FaWhatsapp } from "react-icons/fa";

const data = {
  facebookLink: "https://facebook.com",
  instaLink: "https://instagram.com",
  linkedinLink: "https://linkedin.com",
  whatsappLink: "https://wa.me/971504522867",
  about: {
    about: "/about",
    journey: "/about/journey",

    blog: "/blog",
  },
  help: {
    shop: "/shop",
    trade: "/trade",
    contact: "/contact",
  },
  contact: {
    emails: ["info@catertech.ae", "sales@catertech.ae"],
    phones: ["+971 50 4522867", "+971 50 1400957"],
    address: CATER_TECH_LOCATION.fullAddress,
    mapsUrl: GOOGLE_MAPS_PLACE_URL,
  },
  company: {
    tagline: "Trusted by Hospitality, Chosen for Quality.",
    description:
      "Dubai's trusted partner for catering, event and kitchen equipment since 2005. Serving hotels, venues and F&B teams across the UAE.",
  },
} as const;

const socialLinks = [
  { icon: FaInstagram, label: "Instagram", href: data.instaLink },
  { icon: FaFacebook, label: "Facebook", href: data.facebookLink },
  { icon: FaLinkedin, label: "LinkedIn", href: data.linkedinLink },
  { icon: FaWhatsapp, label: "WhatsApp", href: data.whatsappLink },
] as const;

const aboutLinks = [
  { text: "About Us", href: data.about.about },

  { text: "Blog", href: data.about.blog },
] as const;

const serviceLinks = [
  ...SERVICES_LIST.filter((service) => service.slug !== "event-management").map((service) => ({
    text: service.title,
    href: `/services/${service.slug}`,
  })),
  { text: "Trade & Corporate", href: data.help.trade },
];

type FooterLink = {
  text: string;
  href: string;
  hasIndicator?: boolean;
};

type FooterContact = {
  icon: LucideIcon;
  text: string;
  href: string;
  isAddress?: boolean;
};

const helpfulLinks: FooterLink[] = [
  { text: "Browse & Rent", href: data.help.shop },
  { text: "Trade & Corporate", href: data.help.trade },
  { text: "Contact Us", href: data.help.contact, hasIndicator: true },
];

const contactInfo: FooterContact[] = [
  ...data.contact.emails.map((email) => ({
    icon: Mail,
    text: email,
    href: `mailto:${email}`,
  })),
  ...data.contact.phones.map((phone) => ({
    icon: Phone,
    text: phone,
    href: `tel:${phone.replace(/\s/g, "")}`,
  })),
  {
    icon: MapPin,
    text: data.contact.address,
    href: data.contact.mapsUrl,
    isAddress: true,
  },
];

function FooterColumnHeading({ children }: { children: string }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
      {children}
      <span className="mt-2 block h-px w-10 bg-accent/70" aria-hidden />
    </p>
  );
}

export default function Footer() {
  return (
    <footer className="site-footer relative isolate w-full overflow-hidden text-white">
      <Image
        src={footerBgImage}
        alt=""
        fill
        priority={false}
        sizes="100vw"
        className="object-cover object-center"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-primary/55"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-screen-xl px-4 pt-10 pb-8 sm:px-6 sm:pt-12 lg:px-8 lg:pt-14 lg:pb-10">
        {/* Newsletter CTA */}
        <div className="overflow-hidden rounded-2xl border border-accent/55 bg-primary/88 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-sm">
          <div className="grid items-stretch md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
            <div className="px-5 py-6 sm:px-7 sm:py-8 lg:px-9 lg:py-9">
              <div className="flex items-center gap-2.5">
                <span className="flex size-8 items-center justify-center rounded-full border border-accent/50 bg-primary-dark/60">
                  <Mail className="size-3.5 text-accent" strokeWidth={1.75} />
                </span>
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-accent">
                  Stay connected
                </p>
              </div>

              <h3 className="mt-4 font-display text-2xl font-medium leading-tight text-white sm:text-[1.75rem] lg:text-[2rem]">
                Stay ahead with Catertech
              </h3>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/82 sm:text-[15px]">
                Join hospitality and event professionals who rely on Catertech for
                equipment updates, trade offers and industry insights across the UAE.
              </p>

              <form className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-stretch">
                <label className="sr-only" htmlFor="footer-email">
                  Email address
                </label>
                <div className="relative flex-1">
                  <Mail
                    className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-accent/80"
                    strokeWidth={1.75}
                  />
                  <input
                    id="footer-email"
                    type="email"
                    placeholder="Enter your email"
                    className="h-11 w-full rounded-lg border border-accent/55 bg-primary-dark/75 pr-4 pl-10 text-sm text-white outline-none placeholder:text-white/45 focus:border-accent focus:ring-2 focus:ring-accent/25 sm:h-12"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-accent px-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary transition hover:bg-accent-dark sm:h-12 sm:px-6"
                >
                  Subscribe
                  <span className="flex size-7 items-center justify-center rounded-full bg-primary text-accent">
                    <ArrowRight className="size-3.5" strokeWidth={2.25} />
                  </span>
                </button>
              </form>
            </div>

            <FooterMapPanel
              mapsUrl={GOOGLE_MAPS_PLACE_URL}
              addressLine={CATER_TECH_LOCATION.addressLine}
            />
          </div>
        </div>

        {/* Main navigation */}
        <div className="mt-12 grid grid-cols-1 gap-10 lg:mt-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,2fr)] lg:gap-14">
          <div>
            <Link href="/" className="inline-flex items-center" aria-label="Catertech home">
              <span className="font-display text-[1.75rem] font-bold leading-none tracking-tight sm:text-[1.85rem]">
                <span className="text-white">Cater</span>
                <span className="text-accent">Tech</span>
              </span>
            </Link>

            <p className="mt-3 text-sm font-medium text-accent">{data.company.tagline}</p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/80">
              {data.company.description}
            </p>

            <ul className="mt-7 flex flex-wrap gap-3">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex size-9 items-center justify-center rounded-full border border-white/25 text-white transition hover:border-accent hover:text-accent"
                  >
                    <span className="sr-only">{label}</span>
                    <Icon className="size-4" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            <div>
              <FooterColumnHeading>About Us</FooterColumnHeading>
              <ul className="mt-5 space-y-3 text-sm">
                {aboutLinks.map(({ text, href }) => (
                  <li key={text}>
                    <Link
                      className="text-white/85 transition hover:text-accent"
                      href={href}
                    >
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <FooterColumnHeading>Our Services</FooterColumnHeading>
              <ul className="mt-5 space-y-3 text-sm">
                {serviceLinks.map(({ text, href }) => (
                  <li key={text}>
                    <Link
                      className="text-white/85 transition hover:text-accent"
                      href={href}
                    >
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <FooterColumnHeading>Helpful Links</FooterColumnHeading>
              <ul className="mt-5 space-y-3 text-sm">
                {helpfulLinks.map(({ text, href, hasIndicator }) => (
                  <li key={text}>
                    <Link
                      href={href}
                      className={
                        hasIndicator
                          ? "group inline-flex items-center gap-2 text-white/85 transition hover:text-accent"
                          : "text-white/85 transition hover:text-accent"
                      }
                    >
                      {text}
                      {hasIndicator ? (
                        <span className="size-1.5 rounded-full bg-accent" aria-hidden />
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <FooterColumnHeading>Contact Us</FooterColumnHeading>
              <ul className="mt-5 space-y-3.5 text-sm">
                {contactInfo.map(({ icon: Icon, text, href, isAddress }) => (
                  <li key={text}>
                    <Link
                      className="flex items-start gap-2.5 text-white/85 transition hover:text-accent"
                      href={href}
                      {...(isAddress
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      <Icon className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={1.75} />
                      {isAddress ? (
                        <address className="not-italic">{text}</address>
                      ) : (
                        <span>{text}</span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10   pt-6 lg:mt-12">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="flex items-center gap-2 text-xs text-white/75">
              <Shield className="size-3.5 text-accent" strokeWidth={1.75} />
              © {new Date().getFullYear()} Catertech. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-white/75 sm:justify-end">
              <Link
                href="/auth?tab=login"
                className="transition hover:text-accent"
              >
                Staff Login
              </Link>
              <span className="hidden h-3 w-px bg-white/25 sm:block" aria-hidden />
              <Link
                href="/privacy-policy"
                className="transition hover:text-accent"
              >
                Privacy Policy
              </Link>
              <span className="hidden h-3 w-px bg-white/25 sm:block" aria-hidden />
              <Link href="/terms" className="transition hover:text-accent">
                Terms &amp; Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
