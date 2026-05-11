const CLIENTS = [
  "Marriott Hotels",
  "Jumeirah Group",
  "InterContinental",
  "Rotana Hotels",
  "DWTC",
  "Emaar Hospitality",
  "Accor Hotels",
  "Al Habtoor Group",
  "Radisson Blu",
  "Four Seasons",
  "Hyatt",
  "Hilton",
];

export default function ClientLogos() {
  const doubled = [...CLIENTS, ...CLIENTS];

  return (
    <section className="bg-cream py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 md:px-8 mb-10">
        <p className="text-center text-xs tracking-[0.25em] uppercase text-muted font-medium">
          Trusted by Leading Hospitality Brands
        </p>
      </div>

      {/* Marquee */}
      <div className="relative overflow-hidden">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-cream to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-cream to-transparent z-10 pointer-events-none" />

        <div className="marquee-track flex items-center gap-0 whitespace-nowrap" style={{ width: "max-content" }}>
          {doubled.map((name, i) => (
            <div
              key={i}
              className="inline-flex items-center justify-center px-10 py-3 mx-2 border border-border/60 bg-white/60 hover:border-sand/40 hover:bg-white transition-all duration-200 group cursor-default"
              style={{ minWidth: 180 }}
            >
              <span className="text-muted group-hover:text-charcoal text-xs font-medium tracking-widest uppercase transition-colors duration-200 select-none">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
