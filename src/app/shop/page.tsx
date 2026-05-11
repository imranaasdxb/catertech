export default function ShopPage() {
  return (
    <>
      <section className="pt-40 pb-24 bg-navy">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-sand block mb-4">Browse & Rent</span>
          <div className="w-10 h-0.5 bg-sand mb-6" />
          <h1 className="font-serif text-5xl md:text-6xl text-white leading-tight max-w-2xl">
            Equipment Catalogue
          </h1>
          <p className="text-white/50 text-lg mt-4 max-w-lg">
            Browse, filter and add to cart. We'll process your order as an RFQ.
          </p>
        </div>
      </section>

      <section className="bg-offwhite py-16">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="flex items-center justify-center py-20 border border-border bg-white">
            <div className="text-center">
              <div className="w-10 h-0.5 bg-sand mx-auto mb-6" />
              <h2 className="font-serif text-2xl text-charcoal mb-3">Product Catalogue Coming Soon</h2>
              <p className="text-muted text-sm max-w-md">
                We're building out our full product catalogue. In the meantime, 
                contact us directly for availability and pricing.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
