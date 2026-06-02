"use client";

import Container from "@/components/Container";
import { LogoCloud, type Logo } from "@/components/ui/logo-cloud-3";

/** Matches partner strip edge fades (#F6F6F6 + white) */
const PARTNERS_BG = "#F6F6F6";

const CLIENTS = [
  "Marriott Hotels",
  "Jumeirah Group",
  "InterContinental",
  "Rotana Hotels",
  "DWTC",
  "Emaar Hospitality",
  "Accor Hotels",
  "Al Habtoor Group",
  "Radisson Blu",
  "Four Seasons",
  "Hyatt",
  "Hilton",
];

const logos: Logo[] = CLIENTS.map((name) => ({
  alt: name,
  label: name,
}));

export default function ClientLogos() {
  return (
    <section
      className="client-logos-map relative w-full overflow-x-hidden py-10 sm:py-12 md:py-14"
      style={{ backgroundColor: PARTNERS_BG }}
      aria-label="Partner brands"
    >
      <Container className="relative z-10">
        <div className="relative mx-auto max-w-3xl px-1 text-center sm:px-0">
          <h2 className="mb-4 text-base font-medium leading-snug tracking-tight text-ink sm:mb-5 sm:text-lg md:text-2xl lg:text-3xl">
            <span className="text-body-muted">Trusted by leading hospitality brands.</span>
            <br className="hidden sm:inline" />
            <span className="sm:hidden"> </span>
            <span className="font-semibold text-ink">Partners across Dubai &amp; the UAE.</span>
          </h2>

          <div className="mx-auto my-4 h-px max-w-sm bg-border mask-[linear-gradient(to_right,transparent,black,transparent)] sm:my-5" />
        </div>
      </Container>

      <LogoCloud logos={logos} />

      <Container className="relative z-10 mt-4 sm:mt-5">
        <div className="mx-auto max-w-3xl">
          <div className="h-px bg-border mask-[linear-gradient(to_right,transparent,black,transparent)]" />
        </div>
      </Container>
    </section>
  );
}
