"use client";

import Image from "next/image";
import { useEffect, useState, type FC } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const SQRT_5000 = Math.sqrt(5000);

export type StaggerTestimonialItem = {
  tempId: number;
  testimonial: string;
  by: string;
  imgSrc: string;
};

export const defaultStaggerTestimonials: StaggerTestimonialItem[] = [
  {
    tempId: 0,
    testimonial:
      "Catertech has been our go-to supplier for event equipment for eight years. Quality is consistent and the team delivers on time, every time.",
    by: "Ahmed Al Rashid, Events Director at Dubai World Trade Centre",
    imgSrc:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=320&h=320&fit=crop&crop=faces&q=85",
  },
  {
    tempId: 1,
    testimonial:
      "We rely on Catertech for banquet equipment—the range is excellent, service is professional, and they truly understand hospitality operations.",
    by: "Sarah Mitchell, F&B Manager at Jumeirah Beach Hotel",
    imgSrc:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=320&h=320&fit=crop&crop=faces&q=85",
  },
  {
    tempId: 2,
    testimonial:
      "From enquiry to delivery, the process is smooth. Catertech stands apart from other suppliers we have used across the Emirates.",
    by: "Khalid Mansouri, Procurement Manager at Rotana Hotels",
    imgSrc:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=320&h=320&fit=crop&crop=faces&q=85",
  },
  {
    tempId: 3,
    testimonial:
      "Their logistics team respects venue timelines—we get clear communication, clean handovers, and equipment that arrives stage-ready.",
    by: "Omar Hassan, Venue Operations Lead at Madinat Arena",
    imgSrc:
      "https://images.unsplash.com/photo-1566492031773-9277d6d5d6c3?w=320&h=320&fit=crop&crop=faces&q=85",
  },
  {
    tempId: 4,
    testimonial:
      "Scale and flexibility matter for our gala programme. Catertech has scaled with us from intimate dinners to 1,500-guest events without missing a beat.",
    by: "Elena Kostas, Programme Director at Premium Catering Group Dubai",
    imgSrc:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=320&h=320&fit=crop&crop=faces&q=85",
  },
  {
    tempId: 5,
    testimonial:
      "The chafing dish sets and beverage stations arrived polished and event-ready. Our banquet team trusts Catertech for every major function.",
    by: "Fatima Noor, Banquet Captain at Address Downtown",
    imgSrc:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=320&h=320&fit=crop&crop=faces&q=85",
  },
  {
    tempId: 6,
    testimonial:
      "Kitchen upgrades were commissioned, delivered and installed without disrupting service. Catertech understood our operational constraints.",
    by: "James Porter, Executive Chef at Marina Hospitality Group",
    imgSrc:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=320&h=320&fit=crop&crop=faces&q=85",
  },
  {
    tempId: 7,
    testimonial:
      "For corporate galas, their rental fleet and on-site coordination remove stress from our events team. Highly recommended across the UAE.",
    by: "Layla Karim, Corporate Events Lead at Emirates Business Centre",
    imgSrc:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=320&h=320&fit=crop&crop=faces&q=85",
  },
];

interface TestimonialCardProps {
  position: number;
  testimonial: StaggerTestimonialItem;
  handleMove: (steps: number) => void;
  cardSize: number;
}

const TestimonialCard: FC<TestimonialCardProps> = ({
  position,
  testimonial,
  handleMove,
  cardSize,
}) => {
  const isCenter = position === 0;
  const name = testimonial.by.split(",")[0];

  return (
    <div
      onClick={() => handleMove(position)}
      className={cn(
        "absolute left-1/2 top-1/2 cursor-pointer border-2 p-6 sm:p-8 transition-all duration-500 ease-in-out",
        isCenter
          ? "z-10 border-primary bg-primary text-white"
          : "z-0 border-border bg-white text-ink hover:border-primary/50",
      )}
      style={{
        width: cardSize,
        height: cardSize,
        clipPath:
          "polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)",
        transform: `
          translate(-50%, -50%)
          translateX(${(cardSize / 1.5) * position}px)
          translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
        boxShadow: isCenter ? "0px 8px 0px 4px #d8d4cc" : "0px 0px 0px 0px transparent",
      }}
    >
      <span
        className="absolute block origin-top-right rotate-45 bg-border"
        style={{
          right: -2,
          top: 48,
          width: SQRT_5000,
          height: 2,
        }}
      />
      <div
        className="relative mb-4 h-14 w-12 overflow-hidden bg-surface-card"
        style={{ boxShadow: "3px 3px 0px #ffffff" }}
      >
        <Image
          src={testimonial.imgSrc}
          alt={name}
          fill
          className="object-cover object-top"
          sizes="48px"
        />
      </div>
      <h3
        className={cn(
          "text-base font-medium sm:text-xl",
          isCenter ? "!text-white" : "!text-ink",
        )}
      >
        &ldquo;{testimonial.testimonial}&rdquo;
      </h3>
      <p
        className={cn(
          "absolute bottom-6 left-6 right-6 mt-2 text-sm italic sm:bottom-8 sm:left-8 sm:right-8",
          isCenter ? "text-white/85" : "text-body-muted",
        )}
      >
        — {testimonial.by}
      </p>
    </div>
  );
};

interface StaggerTestimonialsProps {
  items?: StaggerTestimonialItem[];
  className?: string;
}

export const StaggerTestimonials: FC<StaggerTestimonialsProps> = ({
  items = defaultStaggerTestimonials,
  className,
}) => {
  const [cardSize, setCardSize] = useState(365);
  const [testimonialsList, setTestimonialsList] = useState(items);

  useEffect(() => {
    setTestimonialsList(items);
  }, [items]);

  const handleMove = (steps: number) => {
    const newList = [...testimonialsList];
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift();
        if (!item) return;
        newList.push({ ...item, tempId: Math.random() });
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop();
        if (!item) return;
        newList.unshift({ ...item, tempId: Math.random() });
      }
    }
    setTestimonialsList(newList);
  };

  useEffect(() => {
    const updateSize = () => {
      const { matches } = window.matchMedia("(min-width: 640px)");
      setCardSize(matches ? 365 : 290);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div
      className={cn("relative w-full overflow-hidden", className)}
      style={{ height: 600 }}
    >
      {testimonialsList.map((testimonial, index) => {
        const position =
          testimonialsList.length % 2
            ? index - (testimonialsList.length + 1) / 2
            : index - testimonialsList.length / 2;

        return (
          <TestimonialCard
            key={testimonial.tempId}
            testimonial={testimonial}
            handleMove={handleMove}
            position={position}
            cardSize={cardSize}
          />
        );
      })}

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        <button
          type="button"
          onClick={() => handleMove(-1)}
          className={cn(
            "flex h-14 w-14 items-center justify-center text-2xl transition-colors",
            "border-2 border-border bg-white text-ink hover:bg-primary hover:text-white",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2",
          )}
          aria-label="Previous testimonial"
        >
          <ChevronLeft />
        </button>
        <button
          type="button"
          onClick={() => handleMove(1)}
          className={cn(
            "flex h-14 w-14 items-center justify-center text-2xl transition-colors",
            "border-2 border-border bg-white text-ink hover:bg-primary hover:text-white",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2",
          )}
          aria-label="Next testimonial"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};
