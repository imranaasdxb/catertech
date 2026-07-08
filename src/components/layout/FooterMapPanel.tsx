"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { CATER_TECH_LOCATION } from "@/lib/site-location";

const FooterLocationMap = dynamic(
  () => import("@/components/layout/FooterLocationMap"),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full animate-pulse bg-primary/35" aria-hidden />
    ),
  },
);

const COMPANY_NAME = CATER_TECH_LOCATION.companyName;

type FooterMapPanelProps = {
  mapsUrl: string;
  addressLine: string;
};

export default function FooterMapPanel({ mapsUrl, addressLine }: FooterMapPanelProps) {
  return (
    <div className="relative min-h-[200px] sm:min-h-[220px] md:min-h-[240px] lg:min-h-[280px]">
      <div className="absolute inset-0 overflow-hidden rounded-b-2xl ring-1 ring-inset ring-accent/30 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] md:rounded-tl-[3rem] md:rounded-tr-2xl md:rounded-br-2xl md:rounded-bl-none lg:rounded-tl-[4.5rem]">
        <FooterLocationMap mapsUrl={mapsUrl} companyName={COMPANY_NAME} />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-primary/45 via-primary/5 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-primary/15 via-transparent to-transparent" />
      </div>

      <Link
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute right-4 bottom-4 max-w-[220px] rounded-lg border border-accent/55 bg-primary/94 px-3 py-2.5 shadow-lg backdrop-blur-sm transition hover:border-accent hover:bg-primary"
      >
        <div className="flex items-start gap-2">
          <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border border-accent/45 bg-primary-dark/70">
            <MapPin className="size-3.5 text-accent" strokeWidth={1.75} />
          </span>
          <div className="min-w-0">
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-accent">
              Visit our office
            </p>
            <p className="mt-0.5 font-display text-xs leading-snug font-medium text-white">
              {addressLine}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}
