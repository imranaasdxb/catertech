"use client";

import { useState, useEffect } from "react";
import SectionHeader from "@/components/ui/SectionHeader";

const TESTIMONIALS = [
  {
    quote:
      "Catertech has been our go-to supplier for all event equipment for the past 8 years. Their quality is consistent and their team always delivers on time.",
    name: "Ahmed Al Rashid",
    company: "Dubai World Trade Centre",
    role: "Events Director",
  },
  {
    quote:
      "We rely on Catertech exclusively for our banquet equipment. The range is excellent, service is professional, and they truly understand the hospitality industry.",
    name: "Sarah Mitchell",
    company: "Jumeirah Beach Hotel",
    role: "F&B Manager",
  },
  {
    quote:
      "From initial enquiry to delivery, the process is smooth and professional. Catertech stands apart from other suppliers in UAE.",
    name: "Khalid Mansouri",
    company: "Rotana Hotels",
    role: "Procurement Manager",
  },
];

function StarRating() {
  return (
    <div className="flex gap-0.5 mb-5">
      {[...Array(5)].map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#C4A265">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-offwhite py-24">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: header */}
          <div>
            <SectionHeader
              eyebrow="Client Testimonials"
              title={"What Our Clients\nSay About Us"}
              subtitle="Trusted by Dubai's leading hotels, event venues, and catering companies for over two decades."
            />

            {/* Dot nav */}
            <div className="flex items-center gap-3 mt-8">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`transition-all duration-200 ${
                    i === active
                      ? "w-6 h-1.5 bg-sand"
                      : "w-1.5 h-1.5 bg-border hover:bg-sand/40"
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right: testimonial card */}
          <div className="relative min-h-[260px]">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className={`absolute inset-0 transition-all duration-500 ${
                  i === active
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4 pointer-events-none"
                }`}
              >
                <div className="bg-white border border-border p-8 h-full flex flex-col justify-between">
                  {/* Quote mark */}
                  <div>
                    <span className="font-serif text-6xl text-sand/20 leading-none block -mb-2">
                      "
                    </span>
                    <StarRating />
                    <p className="text-charcoal text-base leading-relaxed">
                      {t.quote}
                    </p>
                  </div>
                  {/* Author */}
                  <div className="flex items-center gap-4 mt-6 pt-6 border-t border-border">
                    <div className="w-10 h-10 bg-cream flex items-center justify-center flex-shrink-0">
                      <span className="text-sand font-serif font-bold text-sm">
                        {t.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-charcoal text-sm font-semibold">{t.name}</p>
                      <p className="text-muted text-xs">
                        {t.role} · {t.company}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
