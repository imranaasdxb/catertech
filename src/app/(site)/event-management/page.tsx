import Link from "next/link";

const SERVICES = [
  {
    href: "/event-management/media",
    title: "Photography & Videography",
    desc: "Professional event photography and videography packages including reels and highlight videos.",
    icon: "📸",
  },
  {
    href: "#",
    title: "Event Report",
    desc: "Post-event report with attendance, photo summary, and branded PDF document.",
    icon: "📋",
  },
  {
    href: "/event-management/checkin",
    title: "Event Check-in / Check-out",
    desc: "Staff-managed or self-serve guest check-in system with real-time attendance tracking.",
    icon: "✓",
  },
  {
    href: "/event-management/badges",
    title: "Badge & QR Generator",
    desc: "Branded badges with unique QR code per guest, scanned at entry for check-in.",
    icon: "◈",
  },
  {
    href: "#",
    title: "Event Management",
    desc: "Full on-ground event management and coordination services across Dubai and GCC.",
    icon: "◉",
  },
];

export default function EventManagementPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-40 pb-24 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `repeating-linear-gradient(-45deg, #C4A265 0px, #C4A265 1px, transparent 0px, transparent 60px)` }} />
        <div className="relative max-w-7xl mx-auto px-5 md:px-8">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-sand block mb-4">Event Management</span>
          <div className="w-10 h-0.5 bg-sand mb-6" />
          <h1 className="font-serif text-5xl md:text-6xl text-white leading-tight max-w-2xl">
            Complete Event Services — From Equipment to Execution
          </h1>
          <p className="text-white/50 text-lg mt-5 max-w-lg">
            We supply the equipment. We manage the event.
          </p>
        </div>
      </section>

      {/* Service Cards */}
      <section className="bg-offwhite py-24">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-sand block mb-4">What We Offer</span>
            <div className="w-10 h-0.5 bg-sand mx-auto mb-6" />
            <h2 className="font-serif text-3xl text-charcoal">Event Service Offerings</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((s, i) => (
              <Link key={i} href={s.href} className="group bg-white border border-border hover:border-sand/40 hover:shadow-md transition-all p-8 block">
                <span className="text-3xl block mb-5">{s.icon}</span>
                <h3 className="font-serif text-lg text-charcoal mb-3 group-hover:text-sand transition-colors">{s.title}</h3>
                <p className="text-muted text-sm leading-relaxed mb-5">{s.desc}</p>
                <span className="text-sand text-xs font-semibold tracking-widest uppercase flex items-center gap-1.5">
                  Enquire Now →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="bg-cream py-16">
        <div className="max-w-7xl mx-auto px-5 md:px-8 text-center">
          <p className="text-muted text-sm mb-6 max-w-xl mx-auto">
            Serving corporate events, weddings, government functions &amp; private events across Dubai and GCC
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {["Corporate", "Wedding", "Government", "Hotel", "Private"].map((tag) => (
              <span key={tag} className="text-xs tracking-widest uppercase text-charcoal border border-border px-5 py-2 bg-white">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
