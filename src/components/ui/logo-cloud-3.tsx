import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

export type Logo = {
  src?: string;
  alt: string;
  width?: number;
  height?: number;
  label?: string;
};

type LogoCloudProps = ComponentProps<"div"> & {
  logos: Logo[];
};

export function LogoCloud({ className, logos, ...props }: LogoCloudProps) {
  return (
    <div
      {...props}
      className={cn(
        "relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2",
        className,
      )}
    >
      <div className="logo-cloud-edge logo-cloud-edge-left" aria-hidden>
        <div className="logo-cloud-edge-shadow" />
        <div className="logo-cloud-edge-blur" />
        <div className="logo-cloud-edge-fade" />
      </div>

      <div className="logo-cloud-edge logo-cloud-edge-right" aria-hidden>
        <div className="logo-cloud-edge-shadow" />
        <div className="logo-cloud-edge-blur" />
        <div className="logo-cloud-edge-fade" />
      </div>

      <div className="overflow-hidden py-5 md:py-6">
        <InfiniteSlider gap={28} reverse speed={90} speedOnHover={30}>
          {logos.map((logo) =>
            logo.src ? (
              <img
                alt={logo.alt}
                className="pointer-events-none h-4 shrink-0 select-none md:h-5"
                height={logo.height || "auto"}
                key={`logo-${logo.alt}`}
                loading="lazy"
                src={logo.src}
                width={logo.width || "auto"}
              />
            ) : (
              <span
                key={`logo-${logo.alt}`}
                className="inline-flex w-[clamp(9.5rem,18vw,12.5rem)] shrink-0 select-none items-center justify-center rounded-xl border border-border/50 bg-surface-card px-4 py-3 text-center text-[10px] font-semibold uppercase leading-snug tracking-[0.14em] text-body-muted sm:text-[11px] sm:tracking-[0.16em]"
              >
                {logo.label ?? logo.alt}
              </span>
            ),
          )}
        </InfiniteSlider>
      </div>
    </div>
  );
}
