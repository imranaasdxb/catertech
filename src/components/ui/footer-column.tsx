import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { FaFacebook, FaInstagram, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import logo from "@/assets/logo.png";

const data = {
  facebookLink: "https://facebook.com",
  instaLink: "https://instagram.com",
  linkedinLink: "https://linkedin.com",
  whatsappLink: "https://wa.me/971400000000",
  services: {
    catering: "/services/catering-equipment",
    eventRental: "/services/event-rental",
    kitchen: "/services/kitchen-equipment",
    eventMgmt: "/services/event-management",
  },
  about: {
    about: "/about",
    journey: "/about/journey",
    accreditations: "/about/accreditations",
    blog: "/blog",
  },
  help: {
    shop: "/shop",
    trade: "/trade",
    contact: "/contact",
    events: "/event-management",
  },
  contact: {
    email: "info@catertech.ae",
    phone: "+971 4 XXX XXXX",
    address: "Dubai, United Arab Emirates",
  },
  company: {
    name: "Catertech",
    description:
      "Dubai's trusted partner for catering, event and kitchen equipment since 2005. Serving hotels, venues and F&B teams across the UAE.",
  },
};

const socialLinks = [
  { icon: FaInstagram, label: "Instagram", href: data.instaLink },
  { icon: FaFacebook, label: "Facebook", href: data.facebookLink },
  { icon: FaLinkedin, label: "LinkedIn", href: data.linkedinLink },
  { icon: FaWhatsapp, label: "WhatsApp", href: data.whatsappLink },
];

const aboutLinks = [
  { text: "About Us", href: data.about.about },
  { text: "Company Journey", href: data.about.journey },
  { text: "Accreditations", href: data.about.accreditations },
  { text: "Blog", href: data.about.blog },
];

const serviceLinks = [
  { text: "Catering Equipment", href: data.services.catering },
  { text: "Event Equipment Rental", href: data.services.eventRental },
  { text: "Kitchen Equipment", href: data.services.kitchen },
  { text: "Event Management", href: data.services.eventMgmt },
];

const helpfulLinks = [
  { text: "Browse & Rent", href: data.help.shop },
  { text: "Trade & Corporate", href: data.help.trade },
  { text: "Contact Us", href: data.help.contact, hasIndicator: true },
  { text: "Event Services", href: data.help.events },
];

const contactInfo = [
  { icon: Mail, text: data.contact.email, href: `mailto:${data.contact.email}` },
  { icon: Phone, text: data.contact.phone, href: "tel:+97142000000" },
  {
    icon: MapPin,
    text: data.contact.address,
    href: "/contact",
    isAddress: true,
  },
];

export default function Footer4Col() {
  return (
    <div className="w-full bg-black text-white">
      <div className="mx-auto max-w-screen-xl px-4 pt-12 pb-6 sm:px-6 lg:px-8 lg:pt-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div>
            <div className="flex justify-center gap-3 sm:justify-start">
              <Link
                href="/"
                className="inline-flex items-center"
                aria-label="Catertech home"
              >
                <Image
                  src={logo}
                  alt="Catertech"
                  width={350}
                  height={150}
                  className="h-10 w-auto max-h-[42px] object-contain"
                />
              </Link>
            </div>

            <p className="mt-6 max-w-md text-center text-sm leading-relaxed text-white sm:max-w-xs sm:text-left">
              {data.company.description}
            </p>

            <ul className="mt-8 flex justify-center gap-6 sm:justify-start md:gap-8">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white transition hover:text-white/80"
                  >
                    <span className="sr-only">{label}</span>
                    <Icon className="size-5" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:col-span-2">
            <div className="text-center sm:text-left">
              <p className="text-lg font-medium text-white">About Us</p>
              <ul className="mt-8 space-y-4 text-sm">
                {aboutLinks.map(({ text, href }) => (
                  <li key={text}>
                    <Link
                      className="text-white transition hover:text-white/80"
                      href={href}
                    >
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg font-medium text-white">Our Services</p>
              <ul className="mt-8 space-y-4 text-sm">
                {serviceLinks.map(({ text, href }) => (
                  <li key={text}>
                    <Link
                      className="text-white transition hover:text-white/80"
                      href={href}
                    >
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg font-medium text-white">Helpful Links</p>
              <ul className="mt-8 space-y-4 text-sm">
                {helpfulLinks.map(({ text, href, hasIndicator }) => (
                  <li key={text}>
                    <Link
                      href={href}
                      className={
                        hasIndicator
                          ? "group flex items-center justify-center gap-1.5 sm:justify-start"
                          : "text-white transition hover:text-white/80"
                      }
                    >
                      <span className="text-white transition group-hover:text-white/80">
                        {text}
                      </span>
                      {hasIndicator && (
                        <span className="relative flex size-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/60 opacity-75" />
                          <span className="relative inline-flex size-2 rounded-full bg-white/80" />
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg font-medium text-white">Contact Us</p>
              <ul className="mt-8 space-y-4 text-sm">
                {contactInfo.map(({ icon: Icon, text, href, isAddress }) => (
                  <li key={text}>
                    <Link
                      className="flex items-center justify-center gap-1.5 sm:justify-start"
                      href={href}
                    >
                      <Icon className="size-5 shrink-0 text-white" />
                      {isAddress ? (
                        <address className="-mt-0.5 flex-1 not-italic text-white transition hover:text-white/80">
                          {text}
                        </address>
                      ) : (
                        <span className="flex-1 text-white transition hover:text-white/80">
                          {text}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
