import Link from "next/link";

export default function TradeCTASection() {
  return (
    <section className="bg-navy py-24 relative overflow-hidden">
      {/* Subtle diagonal lines */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `repeating-linear-gradient(-45deg, #C4A265 0px, #C4A265 1px, transparent 0px, transparent 60px)`,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text side */}
          <div>
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-sand mb-4 block">
              Trade & Corporate
            </span>
            <div className="w-10 h-0.5 bg-sand mb-6" />
            <h2 className="font-serif text-4xl md:text-5xl text-white leading-tight mb-6">
              Supplying Hotels,
              <br />
              Venues &amp; F&amp;B Brands
            </h2>
            <p className="text-white/50 text-base leading-relaxed mb-8 max-w-md">
              Corporate and trade accounts get access to our full catalogue,
              volume pricing, and dedicated account management. Submit an
              enquiry or request a formal quote for your project.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/trade/enquiry"
                className="bg-sand hover:bg-sand-dark text-white text-xs font-semibold tracking-widest uppercase px-7 py-4 transition-colors duration-200"
              >
                Submit an Enquiry
              </Link>
              <Link
                href="/trade/rfq"
                className="border border-white/25 hover:border-white text-white text-xs font-semibold tracking-widest uppercase px-7 py-4 transition-colors duration-200 hover:bg-white/5"
              >
                Request Full Quote
              </Link>
            </div>

            {/* Industries */}
            <div className="mt-10 flex flex-wrap gap-2">
              {["Hotels", "Event Companies", "Restaurants", "Government", "Catering Firms", "Hospitals"].map((ind) => (
                <span
                  key={ind}
                  className="text-[10px] tracking-wider uppercase text-white/40 border border-white/10 px-3 py-1.5"
                >
                  {ind}
                </span>
              ))}
            </div>
          </div>

          {/* Visual side */}
          <div className="hidden lg:block">
            <div className="relative">
              {/* Stat card stack */}
              <div className="relative space-y-4">
                {[
                  { label: "Enquiry Response", value: "Within 4 Hours", icon: "⚡" },
                  { label: "Minimum Order Value", value: "No Minimum", icon: "✓" },
                  { label: "Delivery Coverage", value: "All UAE Emirates", icon: "📍" },
                  { label: "Payment Terms", value: "Flexible for Trade", icon: "◈" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="bg-white/5 border border-white/10 px-6 py-5 flex items-center gap-5 hover:bg-white/8 transition-colors"
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <p className="text-white/40 text-xs tracking-wider uppercase mb-0.5">
                        {item.label}
                      </p>
                      <p className="text-white font-medium text-sm">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Corner accent */}
              <div className="absolute -top-4 -right-4 w-24 h-24 border border-sand/20" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
