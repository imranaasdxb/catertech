import Container from "@/components/Container";
import { MailCheck, MessageSquareText, Timer } from "lucide-react";
import { EnquiryForm } from "./EnquiryForm";

function EnquiryGraphic() {
  return (
    <div className="relative mx-auto w-full max-w-[360px]" aria-hidden>
      <div className="absolute -right-8 top-4 h-24 w-24 rounded-full bg-accent-soft blur-2xl" />
      <svg viewBox="0 0 360 300" className="relative h-auto w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="58" y="74" width="228" height="146" rx="30" fill="#F8F7F7" stroke="#E5E1DA" />
        <path d="m82 104 90 58 90-58" stroke="#322B81" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" opacity=".22" />
        <rect x="94" y="188" width="104" height="14" rx="7" fill="#D8D4CC" />
        <rect x="94" y="166" width="148" height="14" rx="7" fill="#D8D4CC" />
        <g>
          <animateTransform attributeName="transform" type="translate" values="0 0;0 -8;0 0" dur="4.4s" repeatCount="indefinite" />
          <circle cx="270" cy="82" r="34" fill="#FFFFFF" stroke="#E5E1DA" />
          <path d="m256 82 9 9 20-22" stroke="#C21722" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <g>
          <animateTransform attributeName="transform" type="translate" values="0 0;8 0;0 0" dur="5s" repeatCount="indefinite" />
          <rect x="43" y="202" width="90" height="48" rx="18" fill="#FFFFFF" stroke="#E5E1DA" />
          <path d="M66 226h44" stroke="#322B81" strokeWidth="8" strokeLinecap="round" opacity=".2" />
        </g>
      </svg>
    </div>
  );
}

export default function EnquiryPage() {
  return (
    <section className="relative overflow-hidden bg-white pt-32 pb-20 md:pt-40 md:pb-28">
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full opacity-70 md:h-[520px] md:w-[520px]"
        style={{
          background:
            "radial-gradient(circle, rgba(180, 120, 220, 0.40) 0%, rgba(240, 225, 255, 0.18) 45%, transparent 70%)",
        }}
        aria-hidden
      />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
          <div className="max-w-xl">
            <h1 className="text-[2.35rem] font-bold leading-[1.08] tracking-[-0.03em] text-ink sm:text-[2.75rem] lg:text-[3.1rem]">
              <span className="block font-sans">Quick trade</span>
              <span
                className="mt-1 block font-normal italic text-ink"
                style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}
              >
                enquiry
              </span>
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-body-muted md:text-lg">
              Share the basics and our team will respond within four business hours.
            </p>

            <div className="mt-8 space-y-5">
              {[
                { icon: MessageSquareText, title: "Tell us what you need", tone: "bg-[#fef9c3]" },
                { icon: Timer, title: "Fast team review", tone: "bg-[#dbeafe]" },
                { icon: MailCheck, title: "Reply sent to your inbox", tone: "bg-accent-soft" },
              ].map(({ icon: Icon, title, tone }) => (
                <div key={title} className="flex items-center gap-4">
                  <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${tone}`}>
                    <Icon className="h-5 w-5 text-ink" strokeWidth={1.75} aria-hidden />
                  </span>
                  <p className="text-base font-bold text-ink">{title}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-center lg:justify-start">
              <EnquiryGraphic />
            </div>
          </div>

          <div className="lg:pt-2">
            <EnquiryForm />
          </div>
        </div>
      </Container>
    </section>
  );
}
