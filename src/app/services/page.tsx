import Link from "next/link";

const SERVICES = [
  {
    href: "/services/catering-equipment",
    title: "Catering Equipment",
    description: "Chafing dishes, serving trays, beverage equipment, uniforms and catering accessories for every event scale.",
    items: ["Chafing Dishes", "Serving Trays", "Beverage Urns", "Catering Uniforms", "Display Stands"],
  },
  {
    href: "/services/event-rental",
    title: "Event Equipment Rental",
    description: "Tables, chairs, linen, staging, décor and AV equipment for corporate events, weddings and private functions.",
    items: ["Banquet Tables", "Chiavari Chairs", "Table Linen", "Stage Risers", "LED Panels"],
  },
  {
    href: "/services/kitchen-equipment",
    title: "Kitchen Equipment",
    description: "Commercial-grade ovens, refrigeration, food prep and dishwashing equipment for professional kitchens.",
    items: ["Convection Ovens", "Refrigeration Units", "Food Prep Equipment", "Dishwashers", "Cooking Ranges"],
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-40 pb-24 bg-navy">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-sand block mb-4">Our Services</span>
          <div className="w-10 h-0.5 bg-sand mb-6" />
          <h1 className="font-serif text-5xl md:text-6xl text-white leading-tight max-w-2xl">
            Complete Equipment Solutions for UAE Events &amp; Hospitality
          </h1>
        </div>
      </section>

      {/* Services */}
      <section className="bg-offwhite py-24">
        <div className="max-w-7xl mx-auto px-5 md:px-8 space-y-8">
          {SERVICES.map((s, i) => (
            <div key={i} className="bg-white border border-border hover:border-sand/30 hover:shadow-md transition-all p-8 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              <div className="md:col-span-2">
                <span className="font-serif text-3xl text-sand/20 font-bold block mb-3">0{i + 1}</span>
                <h2 className="font-serif text-2xl text-charcoal mb-3">{s.title}</h2>
                <p className="text-muted text-sm leading-relaxed mb-5">{s.description}</p>
                <Link href={s.href} className="text-sand text-xs font-semibold tracking-widest uppercase flex items-center gap-2 hover:text-sand-dark transition-colors">
                  Explore {s.title} →
                </Link>
              </div>
              <div>
                <p className="text-xs text-muted tracking-widest uppercase mb-3">Includes</p>
                <ul className="space-y-2">
                  {s.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-charcoal">
                      <span className="w-1 h-1 bg-sand rounded-full shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How We Work */}
      <section className="bg-navy py-24">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-sand block mb-4">The Process</span>
            <div className="w-10 h-0.5 bg-sand mx-auto mb-6" />
            <h2 className="font-serif text-3xl text-white">How We Work</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Enquire", desc: "Submit a quote request or call us with your requirements." },
              { step: "02", title: "Quote", desc: "We send you a detailed quote within 4 business hours." },
              { step: "03", title: "Confirm", desc: "Approve the quote and confirm delivery date and address." },
              { step: "04", title: "Deliver", desc: "We deliver, set up if needed, and collect after your event." },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <span className="font-serif text-4xl text-sand/30 font-bold block mb-4">{s.step}</span>
                <h4 className="text-white font-semibold text-sm mb-2 tracking-wider">{s.title}</h4>
                <p className="text-white/40 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
