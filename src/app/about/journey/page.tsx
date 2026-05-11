const MILESTONES = [
  { year: "2005", title: "Founded in Dubai", desc: "Catertech was established in Dubai with a focus on catering equipment supply for the UAE's growing hospitality sector.", side: "right" },
  { year: "2007", title: "First Major Hotel Contract", desc: "Secured our first major contract supplying catering equipment to a 5-star Dubai hotel group.", side: "left" },
  { year: "2010", title: "Event Equipment Division", desc: "Expanded into event equipment rental — tables, chairs, linen and staging for UAE events.", side: "right" },
  { year: "2012", title: "500th Corporate Client", desc: "Reached the milestone of 500 registered corporate clients across UAE.", side: "left" },
  { year: "2015", title: "Kitchen Equipment Launch", desc: "Launched commercial kitchen equipment division serving restaurants and institutional kitchens.", side: "right" },
  { year: "2017", title: "RAK Expansion", desc: "Opened our second warehouse and operations centre in Ras Al Khaimah.", side: "left" },
  { year: "2019", title: "1000+ Events Served", desc: "Reached the milestone of having supplied over 1,000 events across UAE.", side: "right" },
  { year: "2021", title: "Digital Transformation", desc: "Launched online catalogue and digital RFQ system for corporate clients.", side: "left" },
  { year: "2023", title: "Deseri Partnership", desc: "Formed strategic partnership with Deseri & Smart Electronics for LED and AV solutions.", side: "right" },
  { year: "2025", title: "Event Management Services", desc: "Launched full event management, photography, check-in and badge generation services.", side: "left" },
];

export default function JourneyPage() {
  return (
    <>
      <section className="pt-40 pb-24 bg-navy">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-sand block mb-4">Our Story</span>
          <div className="w-10 h-0.5 bg-sand mb-6" />
          <h1 className="font-serif text-5xl md:text-6xl text-white leading-tight max-w-2xl">
            Twenty Years in the Making
          </h1>
          <p className="text-white/50 text-lg mt-4 max-w-lg">
            From a small trading company in 2005 to UAE's trusted equipment partner.
          </p>
        </div>
      </section>

      <section className="bg-offwhite py-24">
        <div className="max-w-4xl mx-auto px-5 md:px-8">
          <div className="relative">
            {/* Center line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2" />

            <div className="space-y-0">
              {MILESTONES.map((m, i) => (
                <div key={i} className={`relative md:grid md:grid-cols-2 gap-12 mb-16 ${m.side === "right" ? "" : ""}`}>
                  {/* Left */}
                  <div className={`${m.side === "right" ? "md:text-right" : "md:order-2 md:text-left"} pb-8 md:pb-0`}>
                    {m.side === "right" ? (
                      <div>
                        <span className="font-serif text-5xl text-sand/20 font-bold block mb-2">{m.year}</span>
                        <h3 className="font-serif text-xl text-charcoal mb-2">{m.title}</h3>
                        <p className="text-muted text-sm leading-relaxed">{m.desc}</p>
                      </div>
                    ) : (
                      <div className="hidden md:block" />
                    )}
                  </div>

                  {/* Center dot */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-4 w-4 h-4 bg-white border-2 border-sand rounded-full z-10" />

                  {/* Right */}
                  <div className={`${m.side === "left" ? "md:text-left" : "md:order-2"}`}>
                    {m.side === "left" ? (
                      <div>
                        <span className="font-serif text-5xl text-sand/20 font-bold block mb-2">{m.year}</span>
                        <h3 className="font-serif text-xl text-charcoal mb-2">{m.title}</h3>
                        <p className="text-muted text-sm leading-relaxed">{m.desc}</p>
                      </div>
                    ) : (
                      <div className="hidden md:block" />
                    )}
                  </div>

                  {/* Mobile layout */}
                  <div className="md:hidden pl-6 border-l-2 border-sand/30 relative">
                    <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 bg-sand rounded-full" />
                    <span className="font-serif text-3xl text-sand/30 font-bold block mb-1">{m.year}</span>
                    <h3 className="font-serif text-lg text-charcoal mb-1">{m.title}</h3>
                    <p className="text-muted text-sm leading-relaxed">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
