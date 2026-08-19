import Image from "next/image";
import { Star } from "lucide-react";

export type TestimonialMarqueeItem = {
  text: string;
  name: string;
  role: string;
  image: string;
};

export const defaultTestimonialsMarquee: TestimonialMarqueeItem[] = [
  {
    text: "Catertech has been our go-to supplier for event equipment for eight years. Quality is consistent and the team delivers on time, every time.",
    name: "Ahmed Al Rashid",
    role: "Events Director, Dubai World Trade Centre",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=faces&q=85",
  },
  {
    text: "We rely on Catertech for banquet equipment. The range is excellent, service is professional, and they truly understand hospitality operations.",
    name: "Sarah Mitchell",
    role: "F&B Manager, Jumeirah Beach Hotel",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=faces&q=85",
  },
  {
    text: "From enquiry to delivery, the process is smooth. Catertech stands apart from other suppliers we have used across the Emirates.",
    name: "Khalid Mansouri",
    role: "Procurement Manager, Rotana Hotels",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=faces&q=85",
  },
  {
    text: "Their logistics team respects venue timelines. We get clear communication, clean handovers, and equipment that arrives stage-ready.",
    name: "Omar Hassan",
    role: "Venue Operations Lead, Madinat Arena",
    image:
      "https://images.unsplash.com/photo-1566492031773-9277d6d5d6c3?w=200&h=200&fit=crop&crop=faces&q=85",
  },
  {
    text: "Scale and flexibility matter for our gala programme. Catertech has scaled with us from intimate dinners to 1,500-guest events without missing a beat.",
    name: "Elena Kostas",
    role: "Programme Director, Premium Catering Group Dubai",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=faces&q=85",
  },
  {
    text: "The chafing dish sets and beverage stations arrived polished and event-ready. Our banquet team trusts Catertech for every major function.",
    name: "Fatima Noor",
    role: "Banquet Captain, Address Downtown",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=faces&q=85",
  },
];

const MARQUEE_REPEATS = 4;

function buildSeamlessTrack(items: TestimonialMarqueeItem[]) {
  const segment = Array.from({ length: MARQUEE_REPEATS }, () => items).flat();
  return [...segment, ...segment];
}

const ROWS = [
  { className: "testimonials-marquee-scroll", offset: 0 },
  { className: "testimonials-marquee-scroll-reverse", offset: 3 },
] as const;

function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: TestimonialMarqueeItem;
  index: number;
}) {
  return (
    <article
      key={`${testimonial.name}-${index}`}
      className="w-[8.5rem] shrink-0 rounded-xl border border-border bg-white p-3 transition-colors duration-300 hover:border-primary/20 min-[420px]:w-[9.75rem] sm:w-[min(100vw-2rem,350px)] sm:p-4"
    >
      <div className="mb-3 flex sm:mb-4" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={14}
            className="fill-accent text-accent"
            strokeWidth={0}
          />
        ))}
      </div>
      <p className="mb-4 text-[11px] leading-relaxed text-body-muted sm:mb-6 sm:text-sm">
        {testimonial.text}
      </p>
      <div className="flex items-center gap-2 sm:gap-3">
        <Image
          src={testimonial.image}
          alt={testimonial.name}
          width={44}
          height={44}
          className="h-8 w-8 rounded-full object-cover sm:h-11 sm:w-11"
        />
        <div className="min-w-0">
          <p className="truncate text-[11px] font-medium text-ink sm:text-sm">
            {testimonial.name}
          </p>
          <p className="line-clamp-2 text-[10px] leading-snug text-body-muted sm:text-sm">
            {testimonial.role}
          </p>
        </div>
      </div>
    </article>
  );
}

type TestimonialsMarqueeProps = {
  items?: TestimonialMarqueeItem[];
};

export default function TestimonialsMarquee({
  items = defaultTestimonialsMarquee,
}: TestimonialsMarqueeProps) {
  return (
    <div className="space-y-6">
      {ROWS.map((row, rowIndex) => {
        const offset = row.offset % items.length;
        const rowItems =
          offset === 0
            ? items
            : [...items.slice(offset), ...items.slice(0, offset)];
        const track = buildSeamlessTrack(rowItems);

        return (
          <div
            key={rowIndex}
            className="testimonials-marquee-row relative overflow-hidden"
          >
            <div
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-28 bg-linear-to-r from-[#f4f6f9] to-transparent"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-28 bg-linear-to-l from-[#f4f6f9] to-transparent"
              aria-hidden
            />

            <div className={`flex w-max gap-3 sm:gap-6 ${row.className}`}>
              {track.map((testimonial, index) => (
                <TestimonialCard
                  key={`${rowIndex}-${testimonial.name}-${index}`}
                  testimonial={testimonial}
                  index={index}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
