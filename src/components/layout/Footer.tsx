import Link from "next/link";

const NAV_COLUMN = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Company Journey", href: "/about/journey" },
  { label: "Accreditations", href: "/about/accreditations" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const SERVICES_COLUMN = [
  { label: "Catering Equipment", href: "/services/catering-equipment" },
  { label: "Event Equipment Rental", href: "/services/event-rental" },
  { label: "Kitchen Equipment", href: "/services/kitchen-equipment" },
  { label: "Browse & Rent", href: "/shop" },
  { label: "Trade & Corporate", href: "/trade" },
  { label: "Event Management", href: "/event-management" },
];

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      {/* Newsletter Strip */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-sand mb-1">
              Stay Updated
            </p>
            <h3 className="font-serif text-xl text-white">
              Industry news & exclusive offers
            </h3>
          </div>
          <form className="flex w-full md:w-auto gap-0">
            <input
              type="email"
              placeholder="Your email address"
              className="bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm px-4 py-3 outline-none focus:border-sand transition-colors w-full md:w-72"
            />
            <button
              type="submit"
              className="bg-sand hover:bg-sand-dark text-white text-xs font-semibold tracking-widest uppercase px-6 py-3 transition-colors duration-200 shrink-0"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Column 1 — Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <span className="text-lg font-bold tracking-[0.18em] uppercase text-white">CATER</span>
              <span className="text-lg font-light tracking-[0.18em] uppercase text-sand">TECH</span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              Dubai's trusted partner for catering, event and kitchen equipment since 2005. 
              Serving hotels, venues and events across UAE.
            </p>
            <p className="text-white/30 text-xs tracking-wider uppercase">
              UAE Trade Licence: xxxxxxxx
            </p>
            <p className="text-white/30 text-xs tracking-wider uppercase mt-1">
              Dubai, UAE — Est. 2005
            </p>
          </div>

          {/* Column 2 — Navigation */}
          <div>
            <h4 className="text-xs font-semibold tracking-[0.18em] uppercase text-sand mb-6">
              Navigation
            </h4>
            <ul className="flex flex-col gap-3">
              {NAV_COLUMN.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-white/50 hover:text-white text-sm transition-colors duration-150"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Services */}
          <div>
            <h4 className="text-xs font-semibold tracking-[0.18em] uppercase text-sand mb-6">
              Services
            </h4>
            <ul className="flex flex-col gap-3">
              {SERVICES_COLUMN.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-white/50 hover:text-white text-sm transition-colors duration-150"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Contact & Social */}
          <div>
            <h4 className="text-xs font-semibold tracking-[0.18em] uppercase text-sand mb-6">
              Get In Touch
            </h4>
            <ul className="flex flex-col gap-4">
              <li>
                <a
                  href="tel:+97142000000"
                  className="flex items-start gap-3 text-white/50 hover:text-white text-sm transition-colors group"
                >
                  <svg className="mt-0.5 shrink-0 group-hover:text-sand transition-colors" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.69A2 2 0 012.18 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.16a16 16 0 006.29 6.29l1.52-1.52a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                  </svg>
                  +971 4 XXX XXXX
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@catertech.ae"
                  className="flex items-start gap-3 text-white/50 hover:text-white text-sm transition-colors group"
                >
                  <svg className="mt-0.5 shrink-0 group-hover:text-sand transition-colors" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  info@catertech.ae
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/971400000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-white/50 hover:text-white text-sm transition-colors group"
                >
                  <svg className="mt-0.5 shrink-0 group-hover:text-sand transition-colors" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp Us
                </a>
              </li>
            </ul>

            {/* Social Icons */}
            <div className="flex items-center gap-4 mt-8">
              {[
                { label: "Instagram", href: "#", d: "M16 4H8a4 4 0 00-4 4v8a4 4 0 004 4h8a4 4 0 004-4V8a4 4 0 00-4-4zM12 15a3 3 0 110-6 3 3 0 010 6zm3.5-8.5a1 1 0 110 2 1 1 0 010-2z" },
                { label: "Facebook", href: "#", d: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" },
                { label: "LinkedIn", href: "#", d: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="text-white/30 hover:text-sand transition-colors duration-200"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d={s.d} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} Catertech. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/privacy-policy" className="text-white/30 hover:text-white/60 text-xs transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-white/30 hover:text-white/60 text-xs transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
