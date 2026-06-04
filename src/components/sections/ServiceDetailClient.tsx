"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Clock, Shield, Truck } from "lucide-react";
import { useState } from "react";
import Container from "@/components/Container";
import WaterRiseCta from "@/components/ui/WaterRiseCta";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import type { ServiceData } from "@/lib/services";

export default function ServiceDetailClient({ service }: { service: ServiceData }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({
      id: service.cartId,
      name: service.title,
      category: "Services",
      price: "Quote Required",
      image: service.image,
      type: "service",
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <section className="relative overflow-hidden bg-white pt-32 pb-12 md:pt-40 md:pb-16">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full opacity-70 md:h-[520px] md:w-[520px]"
          style={{
            background:
              "radial-gradient(circle at center, rgba(255, 183, 140, 0.45) 0%, rgba(255, 220, 190, 0.2) 45%, transparent 70%)",
          }}
          aria-hidden
        />

        <Container className="relative z-10">
          <nav
            className="mb-8 flex flex-wrap items-center gap-2 text-sm text-body-muted"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="transition-colors hover:text-primary">
              Home
            </Link>
            <span aria-hidden>/</span>
            <Link href="/services" className="transition-colors hover:text-primary">
              Services
            </Link>
            <span aria-hidden>/</span>
            <span className="text-ink">{service.title}</span>
          </nav>

          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-20">
            <div className="min-w-0">
              <span className="inline-block rounded-md bg-[#fff0e6] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
                {service.tagline}
              </span>
              <h1 className="mt-5 text-[2.35rem] font-bold leading-[1.08] tracking-[-0.03em] text-ink sm:text-[2.75rem] lg:text-[3rem]">
                {service.title}
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-body-muted md:text-lg">
                {service.description}
              </p>
            </div>

            <div className="flex w-full justify-center lg:justify-end">
              <div className="w-full max-w-lg rounded-2xl bg-[#f5f2ee] p-3 shadow-[0_20px_50px_rgba(50,43,129,0.1)] md:p-4">
                <div className="relative aspect-4/3 overflow-hidden rounded-xl bg-white">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 560px"
                  />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-[#e8e4df] bg-[#faf9f7] py-16 md:py-20">
        <Container>
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1fr_340px] lg:gap-14">
            <div className="min-w-0">
              <h2 className="text-2xl font-bold tracking-tight text-ink md:text-3xl">
                About this service
              </h2>
              <p className="mt-5 text-base leading-[1.8] text-body-muted">
                {service.longDescription}
              </p>

              <h3 className="mt-12 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                What&apos;s included
              </h3>
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {service.includes.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-xl border border-[#e8e4df] bg-white px-4 py-3.5"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-soft">
                      <Check className="h-3.5 w-3.5 text-primary" strokeWidth={2.5} />
                    </span>
                    <span className="text-sm font-medium text-ink">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:sticky lg:top-28">
              <div className="rounded-3xl border border-[#e8e4df] bg-white p-6 shadow-[0_12px_48px_rgba(50,43,129,0.07)] md:p-7">
                <h3 className="text-xl font-bold text-ink">
                  Interested in {service.title}?
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-body-muted">
                  Add this service to your quote basket and we&apos;ll send a detailed
                  proposal within 4 business hours.
                </p>

                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={added}
                  className={cn(
                    "btn-brand mt-6 w-full min-h-10 rounded-xl px-5 py-2.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] sm:min-h-11",
                    added && "border-green-200 bg-green-50 text-green-700",
                    added && "[&_.btn-brand__arrow]:hidden",
                  )}
                >
                  <span className="btn-brand__content justify-center gap-2">
                    {added ? "Added to quote basket" : "Add to quote basket"}
                    {!added ? (
                      <span className="btn-brand__arrow h-7 w-7 sm:h-8 sm:w-8" aria-hidden>
                        <ArrowRight className="size-3.5 sm:size-4" strokeWidth={2} />
                      </span>
                    ) : null}
                  </span>
                </button>

                <div className="mt-4">
                  <WaterRiseCta href="/trade/rfq" size="md" className="w-full justify-center">
                    Request quote directly
                  </WaterRiseCta>
                </div>

                <ul className="mt-6 space-y-3 border-t border-[#e8e4df] pt-6">
                  <li className="flex items-center gap-2.5 text-xs text-body-muted">
                    <Clock className="h-4 w-4 shrink-0 text-accent" strokeWidth={1.75} />
                    Response within 4 business hours
                  </li>
                  <li className="flex items-center gap-2.5 text-xs text-body-muted">
                    <Shield className="h-4 w-4 shrink-0 text-accent" strokeWidth={1.75} />
                    Quality assured since 2005
                  </li>
                  <li className="flex items-center gap-2.5 text-xs text-body-muted">
                    <Truck className="h-4 w-4 shrink-0 text-accent" strokeWidth={1.75} />
                    UAE-wide delivery available
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <div className="border-t border-[#e8e4df] bg-white py-10 md:py-12">
        <Container>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-semibold text-ink transition-colors hover:text-primary"
          >
            <span aria-hidden>←</span>
            Back to all services
          </Link>
        </Container>
      </div>
    </div>
  );
}
