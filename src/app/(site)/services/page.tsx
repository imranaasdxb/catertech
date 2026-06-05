"use client";

import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container";
import ServicesProcessSection from "@/components/sections/ServicesProcessSection";
import WaterRiseCta from "@/components/ui/WaterRiseCta";
import { SERVICES_LIST } from "@/lib/services";

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <section className="relative overflow-hidden bg-white pt-32 pb-14 md:pt-40 md:pb-20">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full opacity-70 md:h-[520px] md:w-[520px]"
          style={{
            background:
              "radial-gradient(circle, rgba(180, 120, 220, 0.40) 0%, rgba(240, 225, 255, 0.18) 45%, transparent 70%)",
          }}
          aria-hidden
        />

        <Container className="relative z-10">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
            Our services
          </p>
          <h1 className="mt-4 max-w-3xl text-[2.35rem] font-bold leading-[1.08] tracking-[-0.03em] text-ink sm:text-[2.75rem] lg:text-[3.1rem]">
            <span className="block font-sans">
              Complete equipment solutions
            </span>
            <span
              className="mt-1 block font-normal italic text-ink"
              style={{
                fontFamily: 'Georgia, "Times New Roman", Times, serif',
              }}
            >
              for UAE events &amp; hospitality
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-body-muted md:text-lg">
            From a single chafing dish to full event production, Catertech has
            supplied hotels, venues and event companies across the UAE since
            2005.
          </p>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-white pb-20 md:pb-28">
        <Container>
          <h2 className="text-3xl font-bold tracking-tight text-ink md:text-4xl lg:text-[2.75rem] lg:leading-[1.12]">
            Four ways we can help you
          </h2>

          <div className="mt-12 grid w-full grid-cols-1 gap-6 md:mt-16 md:grid-cols-2 md:gap-8">
            {SERVICES_LIST.map((service, index) => (
              <article
                key={service.slug}
                className="flex h-full w-full overflow-hidden rounded-3xl border border-[#e8e4df] bg-white shadow-[0_12px_48px_rgba(50,43,129,0.07)]"
              >
                <div className="flex w-full flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-5 md:p-6">
                  <div className="flex min-w-0 flex-1 flex-col justify-center">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-2 text-lg font-bold leading-snug tracking-tight text-ink">
                      {service.title}
                    </h3>
                    <p className="mt-1 text-xs font-medium text-accent">
                      {service.tagline}
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-body-muted">
                      {service.description}
                    </p>

                    <WaterRiseCta
                      href={`/services/${service.slug}`}
                      size="sm"
                      className="mt-4 w-fit"
                    >
                      View details
                    </WaterRiseCta>
                  </div>

                  <div className="flex w-full shrink-0 items-center justify-center sm:w-[40%] sm:max-w-[200px]">
                    <div className="w-full rounded-2xl bg-[#f5f2ee] p-2.5 shadow-[0_12px_32px_rgba(50,43,129,0.08)] md:p-3">
                      <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-white">
                        <Image
                          src={service.image}
                          alt={service.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 220px"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <ServicesProcessSection />

      <section className="border-t border-[#e8e4df] bg-[#faf9f7] py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
              Ready to start?
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-ink md:text-4xl">
              Let&apos;s discuss your requirements
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-body-muted md:text-base">
              Add services and products to your quote basket, or contact our
              team directly. We respond to every enquiry within 4 business
              hours.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/trade/rfq"
                className="inline-flex items-center gap-2 rounded-full border border-[#e8e4df] bg-white px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-ink transition-colors hover:border-primary hover:text-primary"
              >
                Request a quote
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-primary bg-primary px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-primary-dark"
              >
                Contact us
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
