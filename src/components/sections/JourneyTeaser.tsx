import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";

const MILESTONES = [
  { year: "2005", event: "Founded in Dubai with a focus on catering equipment supply" },
  { year: "2010", event: "Expanded into event equipment rental for UAE events market" },
  { year: "2015", event: "Launched kitchen equipment division for commercial kitchens" },
  { year: "2020", event: "Opened second warehouse in Ras Al Khaimah" },
  { year: "2025", event: "Launched full event management and digital services" },
];

export default function JourneyTeaser() {
  return (
    <section className="bg-offwhite py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <SectionHeader
            eyebrow="Our Story"
            title="Twenty Years Building UAE's Hospitality"
            subtitle="From a small trading company to UAE's trusted equipment partner."
          />
          <Link
            href="/about/journey"
            className="text-sand text-sm font-medium tracking-wider hover:text-sand-dark transition-colors shrink-0 flex items-center gap-2"
          >
            See Full Story
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Timeline — desktop horizontal, mobile vertical */}
        <div className="hidden md:block relative">
          {/* Connecting line */}
          <div className="absolute top-5 left-0 right-0 h-px bg-border" />

          <div className="grid grid-cols-5 gap-4">
            {MILESTONES.map((m, i) => (
              <div key={i} className="relative pt-10 group">
                {/* Dot */}
                <div className="absolute top-0 left-0 w-10 h-10 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-border border-2 border-border group-hover:bg-sand group-hover:border-sand transition-all duration-300" />
                </div>

                <span className="font-serif text-3xl text-sand/30 font-bold block mb-2 group-hover:text-sand/60 transition-colors">
                  {m.year}
                </span>
                <p className="text-muted text-xs leading-relaxed">
                  {m.event}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile vertical */}
        <div className="md:hidden relative pl-6 border-l border-border space-y-10">
          {MILESTONES.map((m, i) => (
            <div key={i} className="relative">
              <div className="absolute -left-[29px] top-1 w-2.5 h-2.5 rounded-full bg-sand" />
              <span className="font-serif text-2xl text-sand block mb-1">{m.year}</span>
              <p className="text-muted text-sm leading-relaxed">{m.event}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
