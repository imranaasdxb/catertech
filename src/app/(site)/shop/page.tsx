import Container from "@/components/Container";
import ShopCatalogueClient from "@/components/shop/ShopCatalogueClient";
import { getCataloguePresetData } from "@/lib/catalogue-presets";

export default async function ShopPage() {
  const catalogueData = await getCataloguePresetData();

  return (
    <>
      <section className="relative overflow-hidden bg-white pt-32 pb-20 md:pt-40 md:pb-24">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full opacity-70 md:h-[520px] md:w-[520px]"
          style={{
            background:
              "radial-gradient(circle, rgba(180, 120, 220, 0.40) 0%, rgba(240, 225, 255, 0.18) 45%, transparent 70%)",
          }}
          aria-hidden
        />

        <Container className="relative z-10">
          <h1 className="max-w-3xl text-[2.35rem] font-bold leading-[1.08] tracking-[-0.03em] text-ink sm:text-[2.75rem] lg:text-[3.1rem]">
            <span className="block font-sans">Equipment catalogue</span>
            <span
              className="mt-1 block font-normal italic text-ink"
              style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}
            >
              ready to browse
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-body-muted md:text-lg">
            Explore catering, kitchen and events inventory with live search and tab-aware
            filters. Open any tile for variants, finishes and RFQ-ready quoting.
          </p>
        </Container>
      </section>

      <ShopCatalogueClient {...catalogueData} />
    </>
  );
}
