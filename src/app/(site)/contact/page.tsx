import Container from "@/components/Container";
import { ContactForm } from "./ContactForm";

export default function ContactPage() {
  return (
    <>
      <section className="pt-40 pb-24 bg-navy">
        <Container>
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-sand block mb-4">Contact</span>
          <div className="w-10 h-0.5 bg-sand mb-6" />
          <h1 className="font-serif text-5xl md:text-6xl text-white leading-tight max-w-2xl">
            Let&apos;s Talk About Your Requirements
          </h1>
        </Container>
      </section>

      <section className="bg-offwhite py-24">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-sand block mb-4">Get In Touch</span>
              <div className="w-10 h-0.5 bg-sand mb-6" />
              <h2 className="font-serif text-3xl text-charcoal mb-8">We&apos;re Here to Help</h2>

              <div className="space-y-6">
                {[
                  { label: "Phone", value: "+971 4 XXX XXXX", href: "tel:+97142000000" },
                  { label: "Email", value: "info@catertech.ae", href: "mailto:info@catertech.ae" },
                  { label: "WhatsApp", value: "+971 4X XXX XXXX", href: "https://wa.me/971400000000" },
                  { label: "Address", value: "Dubai, United Arab Emirates", href: null },
                ].map((item) => (
                  <div key={item.label} className="flex gap-5 p-5 bg-white border border-border hover:border-sand/30 transition-colors">
                    <div className="w-1 bg-sand shrink-0" />
                    <div>
                      <p className="text-[10px] text-muted tracking-widest uppercase mb-1">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="text-charcoal font-medium text-sm hover:text-sand transition-colors">
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-charcoal font-medium text-sm">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 aspect-video bg-cream border border-border flex items-center justify-center">
                <p className="text-muted text-sm tracking-wider">Map Embed Placeholder</p>
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-sand block mb-4">Send a Message</span>
              <div className="w-10 h-0.5 bg-sand mb-6" />
              <h2 className="font-serif text-3xl text-charcoal mb-8">Contact Form</h2>

              <ContactForm />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
