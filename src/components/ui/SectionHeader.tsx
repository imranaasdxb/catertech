interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  subtitleClassName?: string;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
}

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  subtitleClassName = "",
  align = "left",
  light = false,
  className = "",
}: SectionHeaderProps) {
  const textAlign = align === "center" ? "text-center items-center" : "text-left items-start";
  const titleColor = light ? "text-white" : "text-ink";
  const eyebrowColor = light ? "text-white/70" : "text-muted";
  const subtitleColor = light ? "text-white/65" : "text-body-muted";
  const lineColor = light ? "bg-white/40" : "bg-ink/15";

  return (
    <div className={`flex flex-col ${textAlign} ${className}`}>
      {eyebrow && (
        <span
          className={`mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] ${eyebrowColor}`}
        >
          {eyebrow}
        </span>
      )}
      <div className={`mb-5 h-0.5 w-10 ${lineColor}`} />
      <h2
        className={`font-display text-3xl leading-tight md:text-4xl lg:text-[2.6rem] ${titleColor}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 max-w-xl text-base leading-relaxed md:text-lg ${subtitleColor} ${subtitleClassName}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
