import Link from "next/link";

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-40 pb-24 bg-navy">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-sand block mb-4">About Us</span>
          <div className="w-10 h-0.5 bg-sand mb-6" />
          <h1 className="font-serif text-5xl md:text-6xl text-white leading-tight max-w-2xl">
            Dubai's Equipment Partner Since 2005
          </h1>
        </div>
      </section>

      {/* Intro */}
      <section className="bg-offwhite py-24">
        <div className="max-w-7xl mx-auto px-5 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-sand block mb-4">Who We Are</span>
            <div className="w-10 h-0.5 bg-sand mb-6" />
            <h2 className="font-serif text-3xl md:text-4xl text-charcoal leading-tight mb-6">
              Building UAE's Hospitality Infrastructure
            </h2>
            <p className="text-muted leading-relaxed mb-5">
              Catertech was founded in Dubai in 2005 with a single purpose: to supply the 
              UAE's growing hospitality and events industry with reliable, high-quality equipment.
            </p>
            <p className="text-muted leading-relaxed mb-8">
              Today we serve over 500 corporate clients including leading hotels, event management 
              companies, restaurants and government institutions across Dubai, RAK and the wider UAE.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/about/journey" className="bg-sand text-white text-xs font-semibold tracking-widest uppercase px-7 py-4 hover:bg-sand-dark transition-colors">
                Our Journey
              </Link>
              <Link href="/contact" className="border border-sand text-sand text-xs font-semibold tracking-widest uppercase px-7 py-4 hover:bg-sand hover:text-white transition-colors">
                Get in Touch
              </Link>
            </div>
          </div>

          {/* Values */}
          <div className="grid grid-cols-1 gap-6">
            {[
              { title: "Reliability", desc: "20 years of on-time delivery and consistent product quality for UAE's demanding events market." },
              { title: "Range", desc: "From chafing dishes to commercial ovens — single-source supply for all your equipment needs." },
              { title: "Service", desc: "Dedicated account managers, responsive support and flexible terms for corporate clients." },
            ].map((v) => (
              <div key={v.title} className="flex gap-5 p-6 bg-white border border-border hover:border-sand/30 transition-colors">
                <div className="w-1 bg-sand shrink-0" />
                <div>
                  <h4 className="font-serif text-lg text-charcoal mb-2">{v.title}</h4>
                  <p className="text-muted text-sm leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-cream py-24">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-sand block mb-4">Why Catertech</span>
            <div className="w-10 h-0.5 bg-sand mx-auto mb-6" />
            <h2 className="font-serif text-3xl md:text-4xl text-charcoal">Six Reasons Clients Choose Us</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { n: "01", t: "20+ Years Experience", d: "Deep understanding of UAE's hospitality and events industry requirements." },
              { n: "02", t: "Full-Range Supply", d: "Catering, kitchen, and event equipment all from one trusted supplier." },
              { n: "03", t: "Same-Day Delivery", d: "Emergency and same-day delivery available across Dubai and RAK." },
              { n: "04", t: "Volume Pricing", d: "Competitive rates for trade accounts and bulk orders." },
              { n: "05", t: "Arabic & English", d: "Full bilingual service — our team speaks Arabic and English fluently." },
              { n: "06", t: "After-Sales Support", d: "Equipment replacements, warranty handling and maintenance referrals." },
            ].map((item) => (
              <div key={item.n} className="bg-white border border-border p-7 hover:border-sand/30 hover:shadow-sm transition-all">
                <span className="font-serif text-3xl text-sand/30 font-bold block mb-3">{item.n}</span>
                <h4 className="text-charcoal font-semibold text-sm mb-2">{item.t}</h4>
                <p className="text-muted text-sm leading-relaxed">{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
