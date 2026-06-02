import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const SIZE = {
  sm: {
    root: "rounded-md px-2.5 py-1.5",
    label: "gap-1.5 text-[9px] tracking-wide",
    arrowCircle: "h-5 w-5",
    arrow: "size-2.5",
    svg: 10,
  },
  md: {
    root: "min-h-10 rounded-xl px-5 py-2.5 text-[0.68rem] tracking-[0.14em] sm:min-h-11 sm:px-6 sm:text-[0.72rem]",
    label: "gap-2",
    arrowCircle: "h-7 w-7 sm:h-8 sm:w-8",
    arrow: "size-3.5 sm:size-4",
    svg: null,
  },
  lg: {
    root: "rounded-xl px-8 py-3.5",
    label: "gap-2.5 text-sm tracking-widest",
    arrowCircle: "h-8 w-8",
    arrow: "size-4",
    svg: 14,
  },
} as const;

type WaterRiseCtaProps = {
  href?: string;
  as?: "link" | "span";
  size?: keyof typeof SIZE;
  className?: string;
  children: ReactNode;
  showArrow?: boolean;
};

function WaterRiseCtaArrow({ size }: { size: keyof typeof SIZE }) {
  const s = SIZE[size];

  return (
    <span className={cn("btn-brand__arrow", s.arrowCircle)} aria-hidden>
      {size === "md" ? (
        <ArrowRight className={s.arrow} strokeWidth={2} />
      ) : (
        <svg
          width={s.svg!}
          height={s.svg!}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={size === "sm" ? 2.5 : 2}
          className={s.arrow}
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      )}
    </span>
  );
}

export default function WaterRiseCta({
  href,
  as = "link",
  size = "md",
  className,
  children,
  showArrow = true,
}: WaterRiseCtaProps) {
  const s = SIZE[size];
  const rootClass = cn(
    "btn-brand font-semibold uppercase",
    s.root,
    className,
  );

  const inner = (
    <span className={cn("btn-brand__content", s.label)}>
      {children}
      {showArrow ? <WaterRiseCtaArrow size={size} /> : null}
    </span>
  );

  if (as === "span") {
    return <span className={rootClass}>{inner}</span>;
  }

  return (
    <Link href={href ?? "#"} className={rootClass}>
      {inner}
    </Link>
  );
}

/** Trade / journey CTAs with circular arrow badge */
export function BrandCtaWithIcon({
  href,
  className,
  children,
  iconClassName = "h-10 w-10",
}: {
  href: string;
  className?: string;
  children: ReactNode;
  iconClassName?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "btn-brand gap-3 rounded-xl py-3 pl-6 pr-3 text-sm font-semibold",
        className,
      )}
    >
      <span className="btn-brand__content gap-2">{children}</span>
      <span className={cn("btn-brand__arrow", iconClassName)}>
        <ArrowRight className="size-4" strokeWidth={2.25} />
      </span>
    </Link>
  );
}
