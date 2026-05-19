import Container from "@/components/Container";
import ShopCatalogueClient from "@/components/shop/ShopCatalogueClient";

export default function ShopPage() {
  return (
    <>
      <section className="pt-40 pb-24 bg-navy">
        <Container>
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-sand block mb-4">
            Browse & Rent
          </span>
          <div className="w-10 h-0.5 bg-sand mb-6" />
          <h1 className="font-serif text-5xl md:text-6xl text-white leading-tight max-w-2xl">
            Equipment Catalogue
          </h1>
          <p className="text-white/50 text-lg mt-4 max-w-xl leading-relaxed">
            Explore catering, kitchen and events inventory with live search and tab-aware filters — open any tile for variants, finishes and RFQ-ready quoting.
          </p>
        </Container>
      </section>

      <ShopCatalogueClient />
    </>
  );
}
