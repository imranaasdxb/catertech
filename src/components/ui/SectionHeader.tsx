interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
}

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "left",
  light = false,
  className = "",
}: SectionHeaderProps) {
  const textAlign = align === "center" ? "text-center items-center" : "text-left items-start";
  const titleColor = light ? "text-white" : "text-charcoal";
  const eyebrowColor = light ? "text-sand-light" : "text-sand";
  const subtitleColor = light ? "text-white/60" : "text-muted";
  const lineColor = light ? "bg-sand-light" : "bg-sand";

  return (
    <div className={`flex flex-col ${textAlign} ${className}`}>
      {eyebrow && (
        <span
          className={`text-xs font-semibold tracking-[0.2em] uppercase mb-4 ${eyebrowColor}`}
        >
          {eyebrow}
        </span>
      )}
      <div className={`w-10 h-0.5 mb-5 ${lineColor}`} />
      <h2
        className={`font-serif text-3xl md:text-4xl lg:text-[2.6rem] leading-tight ${titleColor}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 text-base md:text-lg leading-relaxed max-w-xl ${subtitleColor}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
