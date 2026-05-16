import Link from "next/link";

export default function TradePage() {
  return (
    <>
      <section className="pt-40 pb-24 bg-navy">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-sand block mb-4">Trade & Corporate</span>
          <div className="w-10 h-0.5 bg-sand mb-6" />
          <h1 className="font-serif text-5xl md:text-6xl text-white leading-tight max-w-2xl">
            Corporate & Trade Accounts
          </h1>
          <p className="text-white/50 text-lg mt-4 max-w-lg">
            Volume pricing, dedicated account management and flexible payment terms for trade clients.
          </p>
        </div>
      </section>

      <section className="bg-offwhite py-24">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Quick Enquiry */}
            <Link href="/trade/enquiry" className="group bg-white border border-border hover:border-sand/40 hover:shadow-md transition-all p-10 block text-center">
              <div className="w-14 h-14 border border-sand/30 mx-auto mb-6 flex items-center justify-center group-hover:bg-sand group-hover:border-sand transition-all duration-200">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-sand group-hover:text-white transition-colors">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
              </div>
              <h2 className="font-serif text-xl text-charcoal mb-3 group-hover:text-sand transition-colors">Quick Enquiry</h2>
              <p className="text-muted text-sm leading-relaxed mb-6">
                Send us a quick message about your requirements. We'll reply within 4 hours.
              </p>
              <span className="text-sand text-xs font-semibold tracking-widest uppercase flex items-center justify-center gap-2">
                Submit Enquiry →
              </span>
            </Link>

            {/* Request a Quote */}
            <Link href="/trade/rfq" className="group bg-navy border border-navy hover:border-sand/40 hover:shadow-md transition-all p-10 block text-center">
              <div className="w-14 h-14 border border-sand/30 mx-auto mb-6 flex items-center justify-center group-hover:bg-sand group-hover:border-sand transition-all duration-200">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-sand">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <h2 className="font-serif text-xl text-white mb-3">Request a Quote</h2>
              <p className="text-white/50 text-sm leading-relaxed mb-6">
                Submit a formal RFQ with line items, quantities and specifications.
              </p>
              <span className="text-sand text-xs font-semibold tracking-widest uppercase flex items-center justify-center gap-2">
                Start RFQ →
              </span>
            </Link>
          </div>

          {/* Industries */}
          <div className="mt-20 text-center">
            <p className="text-xs tracking-[0.2em] uppercase text-muted mb-6">Industries We Serve</p>
            <div className="flex flex-wrap justify-center gap-3">
              {["Hotels & Resorts", "Event Companies", "Restaurants & Cafés", "Government & Municipality", "Hospitals & Healthcare", "Catering Companies", "Wedding Planners", "Corporate Offices"].map((ind) => (
                <span key={ind} className="text-xs tracking-wider text-charcoal border border-border px-4 py-2 hover:border-sand/40 transition-colors cursor-default">
                  {ind}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
