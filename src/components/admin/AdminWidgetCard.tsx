import Link from "next/link";
import { cn } from "@/lib/utils";

const GRADIENT_VARIANTS = [
  {
    gradient: "from-admin-accent/25 via-admin-surface to-admin-accent-soft/30",
    blurTop: "bg-admin-accent/30",
    blurBottom: "bg-admin-accent-soft/35",
    iconTone: "text-admin-accent",
  },
  {
    gradient: "from-admin-accent-tint via-admin-surface to-admin-accent/15",
    blurTop: "bg-admin-accent-soft/35",
    blurBottom: "bg-admin-accent/20",
    iconTone: "text-admin-accent-strong",
  },
  {
    gradient: "from-admin-accent-soft/35 via-admin-surface to-admin-nav-hover",
    blurTop: "bg-admin-accent/25",
    blurBottom: "bg-admin-muted/15",
    iconTone: "text-admin-ink",
  },
  {
    gradient: "from-admin-nav-hover via-admin-surface to-admin-accent/20",
    blurTop: "bg-admin-accent-tint/80",
    blurBottom: "bg-admin-accent-soft/30",
    iconTone: "text-admin-accent",
  },
] as const;

export type AdminWidgetCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  href: string;
  icon: React.ReactNode;
  variant?: number;
};

export function AdminWidgetCard({
  title,
  value,
  subtitle,
  href,
  icon,
  variant = 0,
}: AdminWidgetCardProps) {
  const style = GRADIENT_VARIANTS[variant % GRADIENT_VARIANTS.length];

  return (
    <Link
      href={href}
      className={cn(
        "group relative flex min-h-[160px] flex-col overflow-hidden rounded-[24px] border border-white/50 p-5 shadow-sm",
        "bg-gradient-to-br transition-all duration-300 ease-out",
        "hover:-translate-y-1 hover:shadow-lg",
        style.gradient,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full blur-2xl",
          style.blurTop,
        )}
      />
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute -bottom-10 -left-10 h-28 w-28 rounded-full blur-2xl",
          style.blurBottom,
        )}
      />

      <div className="relative flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-admin-muted">{title}</p>
        <span
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/40 bg-white/45 backdrop-blur-sm",
            style.iconTone,
          )}
        >
          <span className="flex size-[18px] items-center justify-center [&_svg]:size-[18px]">
            {icon}
          </span>
        </span>
      </div>

      <div className="relative mt-auto pt-6">
        <p className="text-3xl font-semibold tabular-nums tracking-tight text-admin-ink md:text-4xl">
          {value}
        </p>
        {subtitle ? (
          <p className="mt-1 text-xs text-admin-muted">{subtitle}</p>
        ) : null}
      </div>
    </Link>
  );
}

/** Alias for dashboard stat widgets */
export const StatCard = AdminWidgetCard;
