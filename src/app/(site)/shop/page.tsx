import { Suspense } from "react";
import shopBgDesktop from "@/assets/shopbg2.png";
import shopBgMobile from "@/assets/shopbgmobile.png";
import shopBgTablet from "@/assets/shopbgtablet.png";
import Container from "@/components/Container";
import ShopCatalogueClient from "@/components/shop/ShopCatalogueClient";
import { getCatalogueProductData } from "@/lib/catalogue-presets";
import Image from "next/image";

export const revalidate = 60;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await searchParams;
  const catalogueData = await getCatalogueProductData();

  return (
    <>
      <section className="relative overflow-x-hidden bg-[#f5f0e8]">
        <div className="h-[var(--header-height)] shrink-0" aria-hidden />

        <div className="relative w-full min-w-0 overflow-hidden">
          {/* Mobile — native aspect ratio, edge-to-edge fill */}
          <div className="relative aspect-[780/360] w-full md:hidden">
            <Image
              src={shopBgMobile}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>

          {/* Tablet — native aspect ratio, edge-to-edge fill */}
          <div className="relative hidden aspect-[768/140] w-full md:block lg:hidden">
            <Image
              src={shopBgTablet}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>

          {/* Desktop / laptop */}
          <div className="relative hidden h-[375px] w-full lg:block">
            <Image
              src={shopBgDesktop}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-contain object-center"
            />
          </div>

          <Container className="pointer-events-none absolute inset-0 z-10 flex items-center">
            <div className="pointer-events-auto min-w-0 max-w-3xl py-4 md:py-5">
              <h1 className="break-words text-[1.65rem] font-bold leading-[1.08] tracking-[-0.03em] text-white sm:text-[2.35rem] lg:text-[2.75rem]">
                <span className="block font-sans ">Equipment catalogue</span>
                <span
                  className="mt-1 block font-normal italic "
                  style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}
                >
                  ready to browse
                </span>
              </h1>
              <p className="mt-3 max-w-xl break-words text-sm font-medium leading-relaxed text-white md:mt-4 md:text-base">
                Explore catering, kitchen and events inventory with live search and tab-aware
                filters. Open any tile for variants, finishes and RFQ-ready quoting.
              </p>
            </div>
          </Container>
        </div>
      </section>

      <Suspense fallback={<div className="min-h-[40vh] bg-offwhite" aria-hidden />}>
        <ShopCatalogueClient {...catalogueData} />
      </Suspense>
    </>
  );
}
