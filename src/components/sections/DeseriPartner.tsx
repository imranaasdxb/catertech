import Container from "@/components/Container";

export default function DeseriPartner() {
  return (
    <section className="bg-cream py-16">
      <Container>
        <div className="border border-border bg-white p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Label */}
          <div className="shrink-0">
            <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-muted block mb-2">
              Technology Partner
            </span>
            <div className="w-8 h-0.5 bg-sand" />
          </div>

          {/* Content */}
          <div className="flex-1 max-w-lg">
            <h3 className="font-serif text-2xl text-charcoal mb-3">
              Deseri &amp; Smart Electronics
            </h3>
            <p className="text-muted text-sm leading-relaxed">
              We partner with Deseri &amp; Smart Electronics to deliver premium LED display
              systems and professional audio-visual solutions for events across UAE.
              Their technology elevates every event we equip.
            </p>
          </div>

          {/* CTA */}
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 border border-sand text-sand text-xs font-semibold tracking-widest uppercase px-6 py-3 hover:bg-sand hover:text-white transition-all duration-200 flex items-center gap-2"
          >
            Visit Website
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
            </svg>
          </a>
        </div>
      </Container>
    </section>
  );
}
