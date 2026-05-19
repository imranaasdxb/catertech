import Link from "next/link";
import Container from "@/components/Container";
import SectionHeader from "@/components/ui/SectionHeader";

const SERVICES = [
  {
    title: "Catering Equipment",
    description:
      "Chafing dishes, serving trays, beverage equipment, uniforms and everything your catering operation needs.",
    href: "/services/catering-equipment",
    bg: "from-[#2C1A0E] to-[#1A1008]",
    accent: "Explore Range",
  },
  {
    title: "Event Equipment Rental",
    description:
      "Tables, chairs, linen, staging, décor and display solutions for corporate events, weddings and private functions.",
    href: "/services/event-rental",
    bg: "from-[#0E1A2C] to-[#081018]",
    accent: "Explore Range",
  },
  {
    title: "Kitchen Equipment",
    description:
      "Commercial ovens, refrigeration, food prep and dishwashing equipment for professional kitchen setups.",
    href: "/services/kitchen-equipment",
    bg: "from-[#1A200E] to-[#101508]",
    accent: "Explore Range",
  },
  {
    title: "Event Management",
    description:
      "Full-service coordination — venue styling, equipment logistics, on-site management and post-event collection.",
    href: "/services/event-management",
    bg: "from-[#1A1030] to-[#0D0818]",
    accent: "Explore Range",
  },
];

export default function ServicesSection() {
  return (
    <section className="bg-offwhite py-24">
      <Container>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <SectionHeader
            eyebrow="What We Offer"
            title={"Our Core\nService Areas"}
            subtitle="Comprehensive supply solutions for hospitality, events and food service industries across UAE."
          />
          <Link
            href="/services"
            className="text-sand text-sm font-medium tracking-wider hover:text-sand-dark transition-colors shrink-0 flex items-center gap-2"
          >
            All Services
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {SERVICES.map((service, i) => (
            <Link
              key={i}
              href={service.href}
              className="group relative overflow-hidden aspect-[4/5] block"
            >
              {/* BG */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${service.bg} transition-transform duration-700 group-hover:scale-105`}
              />

              {/* Pattern overlay */}
              <div className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `repeating-linear-gradient(45deg, #C4A265 0px, #C4A265 1px, transparent 0px, transparent 50%)`,
                  backgroundSize: "20px 20px",
                }}
              />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <span className="text-sand text-xs font-semibold tracking-[0.2em] uppercase mb-3 opacity-80">
                  0{i + 1}
                </span>
                <h3 className="font-serif text-2xl text-white mb-3 leading-tight">
                  {service.title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed mb-6 line-clamp-3">
                  {service.description}
                </p>
                {/* CTA */}
                <div className="flex items-center gap-2 text-sand text-xs font-semibold tracking-widest uppercase translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  {service.accent}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
                {/* Bottom line */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sand scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
