type PatternVariant = "catering" | "grid" | "plates" | "diamond";

const PATTERN_CLASS: Record<PatternVariant, string> = {
  catering: "section-pattern-catering",
  grid: "section-pattern-grid",
  plates: "section-pattern-plates",
  diamond: "section-pattern-diamond",
};

interface SectionPatternProps {
  variant?: PatternVariant;
  className?: string;
  opacity?: "soft" | "medium";
}

export default function SectionPattern({
  variant = "catering",
  className = "",
  opacity = "soft",
}: SectionPatternProps) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${PATTERN_CLASS[variant]} ${
        opacity === "soft" ? "section-pattern-soft" : "section-pattern-medium"
      } ${className}`}
    />
  );
}
