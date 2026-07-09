"use client";

import Container from "@/components/Container";
import { ArrowRight, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { useId, useState } from "react";

const FAQ_ITEMS = [
  {
    question: "What services does Catertech provide?",
    answer:
      "Catertech provides food catering, event management, corporate event planning, service crew supply, seminar arrangements, furniture & linen rental, kitchen equipment rental, and catering equipment rental across the UAE.",
  },
  {
    question: "Which types of events do you cater for?",
    answer:
      "We cater for corporate events, weddings, private parties, exhibitions, conferences, seminars, government events, outdoor functions, and social gatherings of all sizes.",
  },
  {
    question: "Do you provide catering equipment on rent?",
    answer:
      "Yes. We offer a wide range of catering and kitchen equipment for rent, including chafing dishes, cooking stations, serving equipment, tables, chairs, and other event essentials.",
  },
  {
    question: "Can I rent equipment without booking catering services?",
    answer:
      "Absolutely. You can rent catering, kitchen, furniture, and event equipment independently based on your requirements.",
  },
  {
    question: "Which locations do you serve?",
    answer:
      "We serve clients across Dubai, Abu Dhabi, Sharjah, Ajman, Ras Al Khaimah, Fujairah, Umm Al Quwain, and other UAE locations, depending on the project requirements.",
  },
  {
    question: "Do you provide complete event management?",
    answer:
      "Yes. From planning and venue setup to catering, staffing, rentals, and execution, we manage every aspect of your event.",
  },
  {
    question: "Can you customize the menu?",
    answer:
      "Yes. Our chefs can create customized menus based on your event type, cuisine preference, dietary requirements, and budget.",
  },
  {
    question: "Do you provide professional event staff?",
    answer:
      "Yes. We supply trained chefs, waiters, stewards, bartenders (where applicable), cleaners, supervisors, and event support staff.",
  },
  {
    question: "How far in advance should I book?",
    answer:
      "We recommend booking at least 1–2 weeks in advance. For large events, weddings, or peak seasons, booking earlier is advisable.",
  },
  {
    question: "How can I request a quotation?",
    answer:
      "Simply fill out our enquiry form, call us, WhatsApp us, or email us with your event details. Our team will provide a customized quotation based on your requirements.",
  },
  {
    question: "Do you offer on-site cooking services?",
    answer:
      "Yes. We can arrange live cooking stations and complete on-site kitchen setups where required.",
  },
  {
    question: "Why choose Catertech?",
    answer:
      "With years of experience, professional event specialists, premium-quality equipment, customized solutions, and reliable service, Catertech delivers memorable events while ensuring exceptional quality and customer satisfaction.",
  },
] as const;

function FaqItem({
  index,
  question,
  answer,
  isOpen,
  onToggle,
}: {
  index: number;
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const panelId = useId();
  const buttonId = useId();

  return (
    <article
      className={`overflow-hidden rounded-2xl border bg-white transition-[border-color,box-shadow] duration-300 ${
        isOpen
          ? "border-accent/45 shadow-[0_14px_44px_rgba(27,43,75,0.09)]"
          : "border-[#e8e4df] shadow-[0_4px_18px_rgba(27,43,75,0.03)] hover:border-[#d8d2c8]"
      }`}
    >
      <h3>
        <button
          id={buttonId}
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex w-full cursor-pointer items-start gap-4 px-5 py-5 text-left sm:px-6 sm:py-6"
        >
          <span
            className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors duration-300 sm:size-10 ${
              isOpen ? "bg-primary text-white" : "bg-primary-soft text-primary"
            }`}
          >
            {String(index + 1).padStart(2, "0")}
          </span>

          <span className="flex min-w-0 flex-1 items-center justify-between gap-4">
            <span className="text-base font-semibold leading-snug text-ink sm:text-[17px]">
              {question}
            </span>
            <span
              className={`flex size-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300 sm:size-10 ${
                isOpen
                  ? "rotate-0 border-primary bg-primary text-white"
                  : "border-[#e8e4df] bg-[#faf8f4] text-body-muted"
              }`}
              aria-hidden
            >
              {isOpen ? (
                <Minus className="size-4" strokeWidth={2.25} />
              ) : (
                <Plus className="size-4" strokeWidth={2.25} />
              )}
            </span>
          </span>
        </button>
      </h3>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none"
        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div
            className={`border-t px-5 pb-5 pt-4 transition-opacity duration-500 sm:px-6 sm:pb-6 sm:pl-[4.75rem] motion-reduce:transition-none ${
              isOpen ? "opacity-100" : "opacity-0"
            } ${isOpen ? "border-accent/25" : "border-transparent"}`}
          >
            <p className="text-sm leading-relaxed text-body-muted sm:text-[15px] sm:leading-[1.8]">
              {answer}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Faqs() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      className="border-t border-[#e8e4df] bg-[#faf8f4] py-16 md:py-24"
      aria-labelledby="site-faqs-heading"
    >
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:gap-14 xl:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
              Good to know
            </p>
            <h2
              id="site-faqs-heading"
              className="mt-4 font-display text-3xl font-medium leading-[1.12] tracking-tight text-ink md:text-4xl"
            >
              Frequently Asked Questions
            </h2>
            <p className="mt-5 text-base leading-relaxed text-body-muted">
              Quick answers about our catering, equipment rental, event management,
              and service coverage across the UAE.
            </p>
            <Link
              href="/contact"
              className="btn-brand mt-8 inline-flex min-h-11 rounded-xl px-6 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.14em]"
            >
              <span className="btn-brand__content gap-2">
                Talk to our team
                <span className="btn-brand__arrow h-8 w-8" aria-hidden>
                  <ArrowRight className="size-4" strokeWidth={2} />
                </span>
              </span>
            </Link>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {FAQ_ITEMS.map((item, index) => (
              <FaqItem
                key={item.question}
                index={index}
                question={item.question}
                answer={item.answer}
                isOpen={openIndex === index}
                onToggle={() =>
                  setOpenIndex((current) => (current === index ? null : index))
                }
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
