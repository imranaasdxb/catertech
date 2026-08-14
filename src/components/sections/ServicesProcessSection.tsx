"use client";

import Image from "next/image";
import {
  Check,
  ClipboardCheck,
  FileText,
  MessageSquare,
  type LucideIcon,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import Container from "@/components/layout/PageContainer";
import { cn } from "@/lib/utils";

const STEP_MS = 5000;

type ProcessStep = {
  num: string;
  title: string;
  headline: string;
  description: string;
  Icon: LucideIcon;
  iconRing: string;
  image: string;
  imageAlt: string;
};

const STEPS: ProcessStep[] = [
  {
    num: "01",
    title: "Enquire",
    headline: "Tell us what you need",
    description:
      "Add items to your quote basket or call us with your requirements. Our team captures every detail for hotels, venues, and event planners.",
    Icon: MessageSquare,
    iconRing: "bg-primary",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Client discussing catering equipment requirements",
  },
  {
    num: "02",
    title: "Receive Quote",
    headline: "Get a clear quote fast",
    description:
      "We send you a detailed quote within 10 minutes, with transparent pricing, availability, and delivery options across the UAE.",
    Icon: FileText,
    iconRing: "bg-[#4f46c5]",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Reviewing a business quote document",
  },
  {
    num: "03",
    title: "Confirm",
    headline: "Approve and schedule",
    description:
      "Approve the quote and confirm your delivery date, venue address, and any setup requirements before your event day.",
    Icon: ClipboardCheck,
    iconRing: "bg-[#7c6fd6]",
    image:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Confirming event equipment booking",
  },
  {
    num: "04",
    title: "Delivered",
    headline: "We deliver on time",
    description:
      "We deliver, set up if required, and collect after your event, so your team can focus on the guest experience.",
    Icon: Check,
    iconRing: "bg-accent",
    image:
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Catering equipment delivered and ready for service",
  },
];

export default function ServicesProcessSection() {
  const [active, setActive] = useState(0);
  const [progressKey, setProgressKey] = useState(0);

  const goToStep = useCallback((index: number) => {
    setActive(index);
    setProgressKey((k) => k + 1);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((i) => {
        const next = (i + 1) % STEPS.length;
        setProgressKey((k) => k + 1);
        return next;
      });
    }, STEP_MS);

    return () => window.clearInterval(timer);
  }, []);

  const current = STEPS[active];

  return (
    <section className="relative overflow-hidden bg-white py-16 md:py-24">
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full opacity-70 md:h-[520px] md:w-[520px]"
        style={{
          background:
            "radial-gradient(circle, rgba(180, 120, 220, 0.40) 0%, rgba(240, 225, 255, 0.18) 45%, transparent 70%)",
        }}
        aria-hidden
      />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-20">
          <div className="relative mx-auto w-full max-w-lg lg:mx-0">
            <div
              className="absolute -right-3 top-6 z-0 h-[88%] w-[92%] rounded-2xl border border-[#e8e4df] bg-primary/5"
              aria-hidden
            />
            <div
              className="absolute -right-1.5 top-3 z-1 h-[92%] w-[96%] rounded-2xl border border-[#e8e4df] bg-primary/10"
              aria-hidden
            />
            <div className="relative z-10 overflow-hidden rounded-2xl border border-[#e8e4df] shadow-[0_20px_50px_rgba(50,43,129,0.12)]">
              <div className="absolute inset-0 bg-linear-to-br from-primary/75 via-[#4f46c5]/70 to-accent/75" />
              <div className="relative aspect-5/4 w-full">
                {STEPS.map((step, index) => (
                  <Image
                    key={step.num}
                    src={step.image}
                    alt={step.imageAlt}
                    fill
                    className={cn(
                      "object-cover transition-opacity duration-700",
                      index === active ? "opacity-100" : "opacity-0",
                    )}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority={index === 0}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="min-w-0">
            <span className="inline-block rounded-md bg-[#fff0e6] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
              The process
            </span>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-ink md:text-4xl lg:text-[2.65rem] lg:leading-[1.12]">
              {current.headline}
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-body-muted md:text-lg">
              {current.description}
            </p>
          </div>
        </div>

        <div className="mt-14 lg:mt-16">
          <div className="mb-10 flex w-full gap-1.5 md:mb-12">
            {STEPS.map((step, index) => (
              <div
                key={`bar-${step.num}`}
                className="relative h-0.5 flex-1 overflow-hidden rounded-full bg-[#e8e4df]"
              >
                {index < active ? (
                  <div className="absolute inset-0 rounded-full bg-primary" />
                ) : null}
                {index === active ? (
                  <div
                    key={progressKey}
                    className="process-progress-bar absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-primary to-accent"
                    style={{ animationDuration: `${STEP_MS}ms` }}
                  />
                ) : null}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {STEPS.map((step, index) => {
              const isActive = index === active;
              const Icon = step.Icon;

              return (
                <div
                  key={step.num}
                  className="cursor-pointer text-left lg:text-center"
                  onClick={() => goToStep(index)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      goToStep(index);
                    }
                  }}
                  role="tab"
                  tabIndex={0}
                  aria-selected={isActive}
                >
                  <div
                    className={cn(
                      "mb-4 flex h-10 w-10 items-center justify-center rounded-full text-white lg:mx-auto",
                      step.iconRing,
                      !isActive && "opacity-80",
                    )}
                  >
                    <Icon className="h-4 w-4" strokeWidth={2} aria-hidden />
                  </div>

                  <p
                    className={cn(
                      "text-sm font-semibold tracking-wide",
                      isActive ? "text-ink" : "text-muted",
                    )}
                  >
                    {step.num}. {step.title}
                  </p>

                  <p className="mt-2 min-h-[5.5rem] text-xs leading-relaxed text-body-muted sm:text-sm">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
