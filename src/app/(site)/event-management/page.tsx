import Container from "@/components/layout/PageContainer";
import {
  ArrowRight,
  BadgeCheck,
  Camera,
  ClipboardList,
  QrCode,
  Sparkles,
  TicketCheck,
  UsersRound,
} from "lucide-react";
import Link from "next/link";

const SERVICES = [
  {
    href: "/event-management/media",
    title: "Photography & Videography",
    desc: "Professional event photography and videography packages including reels and highlight videos.",
    icon: Camera,
    tone: "bg-[#fef9c3]",
  },
  {
    href: "#",
    title: "Event Report",
    desc: "Post-event report with attendance, photo summary, and branded PDF document.",
    icon: ClipboardList,
    tone: "bg-[#ede9fe]",
  },
  {
    href: "/event-management/checkin",
    title: "Event Check-in / Check-out",
    desc: "Staff-managed or self-serve guest check-in system with real-time attendance tracking.",
    icon: TicketCheck,
    tone: "bg-[#dbeafe]",
  },
  {
    href: "/event-management/badges",
    title: "Badge & QR Generator",
    desc: "Branded badges with unique QR code per guest, scanned at entry for check-in.",
    icon: QrCode,
    tone: "bg-accent-soft",
  },
  {
    href: "#",
    title: "Event Management",
    desc: "Full on-ground event management and coordination services across Dubai and GCC.",
    icon: UsersRound,
    tone: "bg-primary-soft",
  },
];

const audience = ["Corporate", "Wedding", "Government", "Hotel", "Private"];

function EventGraphic() {
  return (
    <div className="relative mx-auto w-full max-w-[440px]" aria-hidden>
      <div className="absolute -left-6 top-8 h-24 w-24 rounded-full bg-white/60 blur-2xl" />
      <div className="absolute -right-8 bottom-5 h-32 w-32 rounded-full bg-primary-soft/90 blur-2xl" />
      <svg
        viewBox="0 0 440 350"
        className="relative h-auto w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="70" y="82" width="240" height="178" rx="34" fill="#FFFFFF" stroke="#E5E1DA" />
        <rect x="100" y="118" width="104" height="16" rx="8" fill="#322B81" opacity=".18" />
        <rect x="100" y="154" width="174" height="12" rx="6" fill="#D8D4CC" />
        <rect x="100" y="181" width="146" height="12" rx="6" fill="#D8D4CC" />
        <rect x="100" y="208" width="116" height="34" rx="17" fill="#322B81" />
        <path d="M122 225h48" stroke="white" strokeWidth="5" strokeLinecap="round" />

        <rect x="250" y="48" width="112" height="88" rx="26" fill="#FFFFFF" stroke="#E5E1DA" />
        <path d="M278 92h56M278 110h38" stroke="#B478DC" strokeWidth="8" strokeLinecap="round" />
        <circle cx="278" cy="70" r="10" fill="#F0E1FF" />
        <path d="m274 70 4 4 8-10" stroke="#322B81" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        <rect x="238" y="220" width="136" height="78" rx="26" fill="#FFFFFF" stroke="#E5E1DA" />
        <path d="M270 258h72" stroke="#322B81" strokeWidth="10" strokeLinecap="round" opacity=".16" />
        <path d="M270 278h48" stroke="#322B81" strokeWidth="10" strokeLinecap="round" opacity=".16" />
        <path d="M264 242h26l8 12h28l8-12h26" stroke="#C21722" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />

        <circle cx="78" cy="62" r="8" fill="#B478DC" opacity=".75" />
        <circle cx="390" cy="176" r="7" fill="#322B81" opacity=".45" />
        <circle cx="50" cy="284" r="5" fill="#C21722" opacity=".45" />
        <path d="M57 242c24-16 50-16 76 0" stroke="#B478DC" strokeWidth="5" strokeLinecap="round" opacity=".45" />
      </svg>
    </div>
  );
}

export default function EventManagementPage() {
  return (
    <section className="relative overflow-hidden bg-white pt-32 pb-20 md:pt-40 md:pb-28">
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full opacity-100 md:h-[540px] md:w-[540px]"
        style={{
          background:
            "radial-gradient(circle, rgba(180, 120, 220, 0.40) 0%, rgba(240, 225, 255, 0.18) 45%, transparent 70%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-28 top-[36rem] h-[360px] w-[360px] rounded-full opacity-70"
        style={{
          background:
            "radial-gradient(circle, rgba(180, 120, 220, 0.40) 0%, rgba(240, 225, 255, 0.18) 45%, transparent 70%)",
        }}
        aria-hidden
      />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 xl:gap-12">
          <div className="max-w-2xl">
            <h1 className="text-[2.35rem] font-bold leading-[1.08] tracking-[-0.03em] text-ink sm:text-[2.75rem] lg:text-[3.1rem]">
              <span className="block font-sans">Complete event services</span>
              <span
                className="mt-1 block font-normal italic text-ink"
                style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}
              >
                from setup to execution
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-body-muted md:text-lg">
              We supply the equipment, coordinate the details, and support guest-facing
              event operations across Dubai and the GCC.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                { icon: Sparkles, label: "On-ground coordination" },
                { icon: TicketCheck, label: "Check-in operations" },
                { icon: BadgeCheck, label: "Badges & reporting" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3 rounded-xl border border-border/70 bg-white/80 px-4 py-3 shadow-sm">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ede9fe]">
                    <Icon className="h-4 w-4 text-primary" strokeWidth={1.9} aria-hidden />
                  </span>
                  <span className="text-sm font-semibold leading-snug text-ink">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <EventGraphic />
        </div>

        <div className="mt-16 lg:mt-20">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">What We Offer</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-ink md:text-4xl">
              Event service offerings
            </h2>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map(({ href, title, desc, icon: Icon, tone }) => (
              <Link
                key={title}
                href={href}
                className="group rounded-2xl border border-[#e5e7eb] bg-white p-7 shadow-[0_18px_60px_rgba(20,19,31,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_24px_70px_rgba(20,19,31,0.1)] sm:p-8"
              >
                <span className={`flex h-14 w-14 items-center justify-center rounded-full ${tone}`}>
                  <Icon className="h-6 w-6 text-ink" strokeWidth={1.75} aria-hidden />
                </span>
                <h3 className="mt-6 text-xl font-bold tracking-tight text-ink transition-colors group-hover:text-primary">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-body-muted">{desc}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-primary">
                  Enquire Now
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2} />
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-16 rounded-2xl border border-[#e5e7eb] bg-white p-7 text-center shadow-[0_18px_60px_rgba(20,19,31,0.06)] sm:p-8">
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-body-muted">
            Serving corporate events, weddings, government functions, hotel events, and
            private occasions across Dubai and the GCC.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {audience.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[#e8e4df] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-body-muted shadow-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
