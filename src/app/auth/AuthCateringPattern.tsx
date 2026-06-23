/** Decorative catering-equipment silhouettes for the auth brand panel. */
export function AuthCateringPattern({
  variant = "light",
}: {
  variant?: "light" | "dark" | "warm";
}) {
  const stroke = "currentColor";
  const sw = 1.35;
  const iconTone =
    variant === "warm"
      ? "text-admin-accent/18"
      : variant === "dark"
        ? "text-white/11"
        : "text-admin-accent/14";
  const dotOpacity = variant === "light" ? 0.28 : 0.22;

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${iconTone}`}
    >
      {/* Chef hat */}
      <svg
        viewBox="0 0 64 64"
        className="absolute left-[6%] top-[8%] h-14 w-14 -rotate-12"
        fill="none"
      >
        <path
          d="M12 38c0-10 8-18 20-18s20 8 20 18"
          stroke={stroke}
          strokeWidth={sw}
          strokeLinecap="round"
        />
        <path
          d="M8 38h48"
          stroke={stroke}
          strokeWidth={sw}
          strokeLinecap="round"
        />
        <path
          d="M14 38v8c0 4 36 4 36 0v-8"
          stroke={stroke}
          strokeWidth={sw}
          strokeLinejoin="round"
        />
        <path
          d="M22 20c2-6 8-10 10-10s8 4 10 10"
          stroke={stroke}
          strokeWidth={sw}
          strokeLinecap="round"
        />
      </svg>

      {/* Chafing dish / bain-marie */}
      <svg
        viewBox="0 0 64 64"
        className="absolute right-[10%] top-[14%] h-16 w-16 rotate-6"
        fill="none"
      >
        <rect
          x="10"
          y="22"
          width="44"
          height="22"
          rx="3"
          stroke={stroke}
          strokeWidth={sw}
        />
        <path d="M16 22V18h32v4" stroke={stroke} strokeWidth={sw} />
        <path
          d="M20 44v6M32 44v6M44 44v6"
          stroke={stroke}
          strokeWidth={sw}
          strokeLinecap="round"
        />
        <path
          d="M28 52c0 2 8 2 8 0"
          stroke={stroke}
          strokeWidth={sw}
          strokeLinecap="round"
        />
      </svg>

      {/* Fork & knife */}
      <svg
        viewBox="0 0 64 64"
        className="absolute left-[18%] top-[38%] h-12 w-12 rotate-[18deg]"
        fill="none"
      >
        <path
          d="M22 8v20c0 4-2 6-2 10v18"
          stroke={stroke}
          strokeWidth={sw}
          strokeLinecap="round"
        />
        <path
          d="M18 8v14M22 8v14M26 8v14"
          stroke={stroke}
          strokeWidth={sw}
          strokeLinecap="round"
        />
        <path
          d="M42 8v48"
          stroke={stroke}
          strokeWidth={sw}
          strokeLinecap="round"
        />
        <path
          d="M36 8c0 8 12 8 12 16v8"
          stroke={stroke}
          strokeWidth={sw}
          strokeLinejoin="round"
        />
      </svg>

      {/* Commercial mixer bowl */}
      <svg
        viewBox="0 0 64 64"
        className="absolute right-[6%] top-[42%] h-[4.5rem] w-[4.5rem] -rotate-6"
        fill="none"
      >
        <path
          d="M32 6v10"
          stroke={stroke}
          strokeWidth={sw}
          strokeLinecap="round"
        />
        <ellipse cx="32" cy="16" rx="6" ry="3" stroke={stroke} strokeWidth={sw} />
        <path
          d="M14 28c0-10 40-10 40 0v18c0 8-40 8-40 0V28z"
          stroke={stroke}
          strokeWidth={sw}
          strokeLinejoin="round"
        />
        <path
          d="M20 52h24"
          stroke={stroke}
          strokeWidth={sw}
          strokeLinecap="round"
        />
      </svg>

      {/* Coffee urn */}
      <svg
        viewBox="0 0 64 64"
        className="absolute left-[4%] bottom-[28%] h-14 w-14 rotate-3"
        fill="none"
      >
        <path
          d="M18 18h28v30c0 6-28 6-28 0V18z"
          stroke={stroke}
          strokeWidth={sw}
          strokeLinejoin="round"
        />
        <path d="M46 26h6c4 0 6 4 6 8s-2 8-6 8h-6" stroke={stroke} strokeWidth={sw} />
        <path d="M24 12h16" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        <path d="M28 8h8" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      </svg>

      {/* Serving tray */}
      <svg
        viewBox="0 0 64 64"
        className="absolute right-[22%] bottom-[32%] h-11 w-11 -rotate-[14deg]"
        fill="none"
      >
        <ellipse cx="32" cy="36" rx="24" ry="8" stroke={stroke} strokeWidth={sw} />
        <path
          d="M12 36c0-12 40-12 40 0"
          stroke={stroke}
          strokeWidth={sw}
        />
        <path
          d="M8 36h48"
          stroke={stroke}
          strokeWidth={sw}
          strokeLinecap="round"
        />
      </svg>

      {/* Refrigerator */}
      <svg
        viewBox="0 0 64 64"
        className="absolute left-[12%] bottom-[10%] h-16 w-16 rotate-2"
        fill="none"
      >
        <rect
          x="16"
          y="8"
          width="32"
          height="48"
          rx="2"
          stroke={stroke}
          strokeWidth={sw}
        />
        <path d="M16 28h32" stroke={stroke} strokeWidth={sw} />
        <path
          d="M26 18v4M26 38v4"
          stroke={stroke}
          strokeWidth={sw}
          strokeLinecap="round"
        />
      </svg>

      {/* Plate stack */}
      <svg
        viewBox="0 0 64 64"
        className="absolute right-[14%] bottom-[12%] h-12 w-12 -rotate-8"
        fill="none"
      >
        <ellipse cx="32" cy="40" rx="22" ry="6" stroke={stroke} strokeWidth={sw} />
        <ellipse cx="32" cy="34" rx="20" ry="5" stroke={stroke} strokeWidth={sw} />
        <ellipse cx="32" cy="28" rx="18" ry="4.5" stroke={stroke} strokeWidth={sw} />
      </svg>

      {/* Wine glass */}
      <svg
        viewBox="0 0 64 64"
        className="absolute left-[42%] top-[22%] h-10 w-10 rotate-12"
        fill="none"
      >
        <path
          d="M24 12h16l-4 18c-1 4-7 4-8 0L24 12z"
          stroke={stroke}
          strokeWidth={sw}
          strokeLinejoin="round"
        />
        <path d="M32 30v16" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        <path d="M24 50h16" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      </svg>

      {/* GN pan / insert */}
      <svg
        viewBox="0 0 64 64"
        className="absolute left-[38%] bottom-[22%] h-11 w-11 -rotate-3"
        fill="none"
      >
        <rect
          x="12"
          y="20"
          width="40"
          height="24"
          rx="2"
          stroke={stroke}
          strokeWidth={sw}
        />
        <path d="M12 26h40" stroke={stroke} strokeWidth={sw} />
        <path
          d="M20 20v-4h24v4"
          stroke={stroke}
          strokeWidth={sw}
          strokeLinejoin="round"
        />
      </svg>

      {/* Bell / service call */}
      <svg
        viewBox="0 0 64 64"
        className="absolute right-[38%] top-[52%] h-9 w-9 rotate-[22deg]"
        fill="none"
      >
        <path
          d="M32 10c-10 0-14 8-14 16v8l-4 6h36l-4-6v-8c0-8-4-16-14-16z"
          stroke={stroke}
          strokeWidth={sw}
          strokeLinejoin="round"
        />
        <path
          d="M26 48c0 3 4 6 6 6s6-3 6-6"
          stroke={stroke}
          strokeWidth={sw}
          strokeLinecap="round"
        />
      </svg>

      {/* Soft dot grid for depth */}
      <svg className="absolute inset-0 h-full w-full opacity-40" fill="none">
        <defs>
          <pattern
            id="auth-dot-grid"
            width="28"
            height="28"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1" fill="currentColor" opacity={dotOpacity} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#auth-dot-grid)" />
      </svg>
    </div>
  );
}
