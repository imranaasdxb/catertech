import Container from "@/components/layout/PageContainer";
import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight, Shield } from "lucide-react";

type LegalPageLayoutProps = {
  title: string;
  description: string;
  lastUpdated: string;
  children: ReactNode;
};

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="scroll-mt-[calc(var(--header-height)+1rem)]">
      <h2 className="font-display text-xl font-semibold leading-snug text-ink md:text-2xl">
        <span className="block border-l-4 border-accent pl-4">{title}</span>
      </h2>
      <div className="mt-4 space-y-4 text-[15px] leading-[1.8] text-body-muted md:text-base">
        {children}
      </div>
    </section>
  );
}

export default function LegalPageLayout({
  title,
  description,
  lastUpdated,
  children,
}: LegalPageLayoutProps) {
  return (
    <>
      <section className="relative overflow-hidden bg-bg-warm pt-[var(--header-height)]">
        <div
          className="pointer-events-none absolute -right-20 top-8 h-72 w-72 rounded-full opacity-60 md:h-96 md:w-96"
          style={{
            background:
              "radial-gradient(circle, rgba(201, 168, 76, 0.22) 0%, rgba(245, 240, 232, 0.05) 55%, transparent 72%)",
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full opacity-50"
          style={{
            background:
              "radial-gradient(circle, rgba(27, 43, 75, 0.08) 0%, transparent 70%)",
          }}
          aria-hidden
        />

        <Container className="relative z-10 py-10 md:py-14 lg:py-16">
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex flex-wrap items-center gap-1.5 text-xs font-medium text-body-muted"
          >
            <Link href="/" className="transition-colors hover:text-primary">
              Home
            </Link>
            <ChevronRight className="size-3.5 opacity-50" aria-hidden />
            <span className="text-ink">{title}</span>
          </nav>

          <div className="max-w-3xl">
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-accent-dark">
              <Shield className="size-3.5" strokeWidth={2} aria-hidden />
              Legal
            </p>
            <h1 className="mt-3 font-display text-[2rem] font-semibold leading-[1.1] tracking-tight text-ink sm:text-[2.35rem] md:text-[2.75rem]">
              {title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-body-muted md:text-lg">
              {description}
            </p>
            <p className="mt-5 inline-flex rounded-full border border-accent/35 bg-accent-soft px-3.5 py-1.5 text-xs font-semibold text-accent-dark">
              Last updated: {lastUpdated}
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-offwhite pb-16 pt-8 md:pb-24 md:pt-10">
        <Container>
          <article className="mx-auto max-w-3xl rounded-2xl border border-border bg-white p-6 shadow-[0_12px_40px_rgba(27,43,75,0.06)] sm:p-8 md:p-10 lg:p-12">
            <div className="space-y-10 md:space-y-12">{children}</div>
          </article>
        </Container>
      </section>
    </>
  );
}
