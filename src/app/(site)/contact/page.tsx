import Container from "@/components/layout/PageContainer";
import { Mail, Phone } from "lucide-react";
import { ContactForm } from "./ContactForm";
import { ContactIllustration } from "./ContactIllustration";

const CONTACT = {
  email: "info@catertech.ae",
  phone: "+971 4 XXX XXXX",
  phoneHref: "tel:+97142000000",
};

export default function ContactPage() {
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
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-8 xl:gap-10">
          <div className="max-w-xl">
            <h1 className="text-[2.35rem] font-bold leading-[1.08] tracking-[-0.03em] text-ink sm:text-[2.75rem] lg:text-[3.1rem]">
              <span className="block font-sans">Don&apos;t hesitate to talk</span>
              <span
                className="mt-1 block font-normal italic text-ink"
                style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}
              >
                with us
              </span>
            </h1>

            <p className="mt-5 max-w-md text-base leading-relaxed text-body-muted md:text-lg">
              Relax, we are ready to support hotels, caterers, and event teams across
              the UAE. Submit the form and our team will respond within 10 minutes.
            </p>

            <div className="mt-8 flex justify-center lg:justify-start">
              <ContactIllustration />
            </div>
          </div>

          <div className="lg:pt-2">
            <ul className="mb-10 space-y-6">
              <li className="flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#fef9c3]">
                  <Mail className="h-5 w-5 text-ink" strokeWidth={1.75} aria-hidden />
                </span>
                <div>
                  <p className="text-sm text-body-muted">Email</p>
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="text-base font-bold text-ink transition-colors hover:text-primary"
                  >
                    {CONTACT.email}
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#dbeafe]">
                  <Phone className="h-5 w-5 text-ink" strokeWidth={1.75} aria-hidden />
                </span>
                <div>
                  <p className="text-sm text-body-muted">Phone</p>
                  <a
                    href={CONTACT.phoneHref}
                    className="text-base font-bold text-ink transition-colors hover:text-primary"
                  >
                    {CONTACT.phone}
                  </a>
                </div>
              </li>
            </ul>

            <ContactForm />
          </div>
        </div>
      </Container>
    </section>
  );
}
