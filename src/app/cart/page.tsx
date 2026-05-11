import Link from "next/link";

export default function CartPage() {
  return (
    <>
      <section className="pt-40 pb-16 bg-navy">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <h1 className="font-serif text-4xl text-white">Your Cart</h1>
        </div>
      </section>
      <section className="bg-offwhite py-24">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="flex items-center justify-center py-20 bg-white border border-border">
            <div className="text-center">
              <svg className="mx-auto mb-5 text-border" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              <h2 className="font-serif text-xl text-charcoal mb-3">Your cart is empty</h2>
              <p className="text-muted text-sm mb-6">Add products from our catalogue to get started.</p>
              <Link href="/shop" className="bg-sand text-white text-xs font-semibold tracking-widest uppercase px-7 py-3 hover:bg-sand-dark transition-colors">
                Browse Catalogue
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
