/**
 * SVG UAE map backdrop — not used in TrustBar for now.
 * TrustBar uses `@/assets/uaemap.png` instead; keep this file to switch back later.
 */
import { UAE_EMIRATE_PATHS, UAE_VIEWBOX } from "@/components/sections/uae-map-paths";

const BRAND_PURPLE = "#322b81";
const BRAND_RED = "#c21722";
const MAP_STROKE = "rgba(50, 43, 129, 0.38)";
const MAP_FILL = "rgba(50, 43, 129, 0.09)";
const CITY_LABEL = "#6b7280";

type CityMarker = {
  name: string;
  x: number;
  y: number;
  hub?: "purple" | "red";
};

/** Label positions tuned to @svg-maps/uae viewBox (760×613). */
const CITIES: CityMarker[] = [
  { name: "Abu Dhabi", x: 198, y: 448 },
  { name: "Al Ain", x: 348, y: 388 },
  { name: "Dubai", x: 542, y: 312, hub: "purple" },
  { name: "Sharjah", x: 608, y: 242 },
  { name: "Ajman", x: 598, y: 162 },
  { name: "Umm Al Quwain", x: 624, y: 112 },
  { name: "Ras Al Khaimah", x: 692, y: 172, hub: "red" },
  { name: "Fujairah", x: 708, y: 292 },
  { name: "Khor Fakkan", x: 738, y: 262 },
];

type UaeMapBackdropProps = {
  className?: string;
};

export default function UaeMapBackdrop({ className = "" }: UaeMapBackdropProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 bottom-0 top-16 flex items-end justify-center overflow-visible sm:top-20 [mask-image:linear-gradient(to_bottom,transparent_0%,#000_6%,#000_92%,transparent_100%)] ${className}`.trim()}
      aria-hidden
    >
      <svg
        viewBox={`0 0 ${UAE_VIEWBOX.width} ${UAE_VIEWBOX.height}`}
        className="h-auto w-full max-w-none"
        style={{ maxHeight: "min(56vh, 440px)", minWidth: "100%" }}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
      >
        <g>
          {UAE_EMIRATE_PATHS.map((emirate) => (
            <path
              key={emirate.id}
              d={emirate.d}
              fill={MAP_FILL}
              stroke={MAP_STROKE}
              strokeWidth={1.45}
              strokeDasharray="5 6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </g>
        <g>
          {CITIES.map((city) => {
            const isHub = Boolean(city.hub);
            const dotFill =
              city.hub === "purple"
                ? BRAND_PURPLE
                : city.hub === "red"
                  ? BRAND_RED
                  : "rgba(50, 43, 129, 0.42)";
            return (
              <g key={city.name} opacity={0.92}>
                <circle
                  cx={city.x}
                  cy={city.y}
                  r={isHub ? 5 : 3.25}
                  fill={dotFill}
                  opacity={isHub ? 1 : 0.75}
                />
                <text
                  x={city.x}
                  y={city.y + (isHub ? 17 : 14)}
                  textAnchor="middle"
                  fill={CITY_LABEL}
                  style={{
                    fontSize: isHub ? 11 : 9.5,
                    fontWeight: isHub ? 600 : 500,
                    letterSpacing: "0.04em",
                  }}
                >
                  {city.name}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
