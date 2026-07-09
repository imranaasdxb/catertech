import Container from "@/components/Container";
import { PARTNERS, type PartnerEntry } from "@/lib/partners";
import { ArrowUpRight, Globe2, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Partners | Catertech",
  description:
    "Catertech partner network: AAS Information Technology and TrueScale.",
};

function PartnerSection({
  partner,
  index,
}: {
  partner: PartnerEntry;
  index: number;
}) {
  const isReversed = index % 2 === 1;
  const isGold = partner.accent === "gold";

  return (
    <section
      className={`relative overflow-hidden border-t border-[#e8e4df] py-16 md:py-24 ${
        index % 2 === 0 ? "bg-[#faf8f4]" : "bg-white"
      }`}
    >
      <div
        className={`pointer-events-none absolute ${isReversed ? "-left-24" : "-right-24"} top-1/2 size-80 -translate-y-1/2 rounded-full blur-3xl ${
          isGold ? "bg-accent/10" : "bg-[#c21722]/8"
        }`}
        aria-hidden
      />

      <Container>
        <div
          className={`grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-20 ${
            isReversed ? "lg:[&>*:first-child]:order-2" : ""
          }`}
        >
          {/* Logo panel */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div
              className="pointer-events-none absolute -inset-4 rounded-[2rem] border border-[#e8e4df]/80"
              aria-hidden
            />
            <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[1.75rem] border border-[#e8e4df] bg-white p-10 shadow-[0_24px_70px_rgba(27,43,75,0.09)] md:p-12 lg:aspect-[4/3.5]">
              <div
                className={`absolute inset-x-0 top-0 h-1.5 ${
                  isGold
                    ? "bg-linear-to-r from-transparent via-accent to-transparent"
                    : "bg-linear-to-r from-transparent via-[#e85d3b] to-transparent"
                }`}
                aria-hidden
              />
              <Image
                src={partner.logo}
                alt={partner.logoAlt}
                className="h-auto max-h-[72%] w-auto max-w-[78%] object-contain"
                sizes="(max-width: 1024px) 320px, 420px"
                priority={index === 0}
              />
            </div>
            <p className="mt-5 text-center text-[10px] font-bold uppercase tracking-[0.22em] text-body-muted lg:text-left">
              Partner {String(index + 1).padStart(2, "0")}
            </p>
          </div>

          {/* Content panel */}
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
              {partner.category}
            </p>
            <h2 className="mt-4 font-display text-[2rem] font-medium leading-[1.08] tracking-tight text-ink sm:text-[2.35rem] lg:text-[2.6rem]">
              {partner.name}
            </h2>
            <p
              className="mt-3 text-lg italic text-ink/75"
              style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}
            >
              {partner.tagline}
            </p>
            <p className="mt-6 text-base leading-relaxed text-body-muted md:text-[17px] md:leading-[1.8]">
              {partner.description}
            </p>

            {partner.services && partner.services.length > 0 ? (
              <div className="mt-8">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                  Core services
                </p>
                <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {partner.services.map((service) => (
                    <li
                      key={service}
                      className="flex items-center gap-3 rounded-xl border border-[#e8e4df] bg-white/80 px-4 py-3.5 text-sm font-medium text-ink shadow-[0_4px_18px_rgba(27,43,75,0.04)]"
                    >
                      <span
                        className={`size-1.5 shrink-0 rounded-full ${
                          isGold ? "bg-accent" : "bg-[#e85d3b]"
                        }`}
                        aria-hidden
                      />
                      {service}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href={partner.website}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-brand inline-flex rounded-xl px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.14em]"
              >
                <span className="btn-brand__content gap-2">
                  Visit website
                  <span className="btn-brand__arrow h-8 w-8" aria-hidden>
                    <ArrowUpRight className="size-4" strokeWidth={2} />
                  </span>
                </span>
              </a>
              <span className="text-sm text-body-muted">{partner.websiteLabel}</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default function PartnersPage() {
  return (
    <main className="bg-[#faf8f4]">
      {/* Hero — soft cream */}
      <section className="relative overflow-hidden border-b border-[#e8e4df] bg-[#faf8f4] pt-32 pb-16 md:pt-40 md:pb-24">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 100% 0%, rgba(201,168,76,0.14) 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 0% 100%, rgba(27,43,75,0.05) 0%, transparent 50%)",
          }}
          aria-hidden
        />

        <Container className="relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#e8e4df] bg-white px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.24em] text-primary shadow-[0_4px_20px_rgba(27,43,75,0.05)]">
              <Globe2 className="size-3.5 text-accent" strokeWidth={1.75} aria-hidden />
              Our network
            </p>
            <h1 className="mt-6 font-display text-[2.5rem] font-medium leading-[1.06] tracking-tight text-ink sm:text-[3rem] lg:text-[3.4rem]">
              Partners we trust
              <span
                className="mt-2 block font-normal italic text-ink/80"
                style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}
              >
                to power what we deliver
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-body-muted md:text-lg">
              Catertech collaborates with specialist technology and marketing partners
              across the UAE. Explore their work and visit their websites directly.
            </p>

            <div className="mx-auto mt-10 flex max-w-lg flex-wrap items-center justify-center gap-3">
              {PARTNERS.map((partner) => (
                <span
                  key={partner.id}
                  className="rounded-full border border-[#e8e4df] bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink shadow-sm"
                >
                  {partner.name}
                </span>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Full-width partner sections */}
      {PARTNERS.map((partner, index) => (
        <PartnerSection key={partner.id} partner={partner} index={index} />
      ))}

      {/* CTA */}
      <section className="border-t border-[#e8e4df] bg-white py-16 md:py-24">
        <Container>
          <div className="relative overflow-hidden rounded-3xl border border-[#e8e4df] bg-[#faf8f4] px-8 py-10 md:px-12 md:py-14">
            <div
              className="pointer-events-none absolute -right-8 -top-8 size-40 rounded-full bg-accent/12 blur-3xl"
              aria-hidden
            />
            <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-12">
              <div className="max-w-2xl">
                <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
                  <Sparkles className="size-4 text-accent" strokeWidth={1.6} aria-hidden />
                  Become a partner
                </p>
                <h2 className="mt-3 font-display text-2xl font-medium tracking-tight text-ink md:text-3xl">
                  Interested in joining our network?
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-body-muted md:text-base">
                  We welcome enquiries from technology providers, marketing agencies and
                  specialist suppliers who share our standards for hospitality and events
                  across the Gulf.
                </p>
              </div>
              <Link
                href="/contact"
                className="btn-brand inline-flex shrink-0 rounded-xl px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.14em]"
              >
                <span className="btn-brand__content gap-2">
                  Discuss a partnership
                  <span className="btn-brand__arrow h-8 w-8" aria-hidden>
                    <ArrowUpRight className="size-4" strokeWidth={2} />
                  </span>
                </span>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
