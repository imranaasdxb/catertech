import Container from "@/components/Container";

export default function DeseriPartner() {
  return (
    <section className="bg-white py-16">
      <Container>
        <div className="flex flex-col items-start justify-between gap-8 rounded-2xl border border-border/60 bg-surface-card p-8 md:flex-row md:items-center md:p-12">
          <div className="shrink-0">
            <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
              Technology Partner
            </span>
            <div className="h-0.5 w-8 bg-ink/15" />
          </div>

          <div className="max-w-lg flex-1">
            <h3 className="font-serif mb-3 text-2xl text-charcoal">
              Deseri &amp; Smart Electronics
            </h3>
            <p className="text-sm leading-relaxed text-body-muted">
              We partner with Deseri &amp; Smart Electronics to deliver premium LED display systems
              and professional audio-visual solutions for events across UAE. Their technology elevates
              every event we equip.
            </p>
          </div>

          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-brand shrink-0 rounded-xl px-6 py-3 text-xs font-semibold uppercase tracking-widest"
          >
            <span className="btn-brand__content gap-2">
              Visit Website
              <span className="btn-brand__arrow h-6 w-6">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                </svg>
              </span>
            </span>
          </a>
        </div>
      </Container>
    </section>
  );
}
