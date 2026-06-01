"use client";

import Container from "@/components/Container";
import { LogoCloud, type Logo } from "@/components/ui/logo-cloud-3";

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
    <section className="relative overflow-x-hidden bg-white py-14 md:py-16">
      <Container className="relative z-10">
        <div className="relative mx-auto max-w-3xl text-center">
          <h2 className="mb-5 text-xl font-medium tracking-tight text-ink md:text-3xl">
            <span className="text-body-muted">Trusted by leading hospitality brands.</span>
            <br />
            <span className="font-semibold text-ink">Partners across Dubai &amp; the UAE.</span>
          </h2>

          <div className="mx-auto my-5 h-px max-w-sm bg-border mask-[linear-gradient(to_right,transparent,black,transparent)]" />
        </div>
      </Container>

      <LogoCloud logos={logos} />

      <Container className="relative z-10 mt-5">
        <div className="mx-auto max-w-3xl">
          <div className="h-px bg-border mask-[linear-gradient(to_right,transparent,black,transparent)]" />
        </div>
      </Container>
    </section>
  );
}
