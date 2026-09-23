import Link from "next/link";

type LogoProps = {
  variant?: "light" | "dark";
  className?: string;
  href?: string | null;
  showTagline?: boolean;
};

/**
 * Dashlink wordmark, rebuilt as vector from the supplied logo:
 * angular "D" emblem holding the red hub dot, then DASH in navy / LINK in red.
 */
export function BrandLogo({ variant = "light", className = "", href = "/", showTagline = false }: LogoProps) {
  const navy = variant === "light" ? "#0b1f3f" : "#ffffff";
  const red = "#e01b24";

  const mark = (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <svg
        viewBox="0 0 384 96"
        role="img"
        aria-label="Dashlink Integrated Autos"
        className="h-9 w-auto md:h-10"
      >
        <g>
          <path
            d="M8 14 L56 14 C86 14 98 32 98 48 C98 64 86 82 56 82 L8 82 L26 48 Z"
            fill="none"
            stroke={navy}
            strokeWidth="6"
            strokeLinejoin="round"
          />
          <path d="M26 48 L40 22 L58 22 C76 22 81 36 81 48" fill="none" stroke={navy} strokeWidth="6" strokeLinejoin="round" />
          <path d="M26 48 L40 74 L58 74 C76 74 81 60 81 48" fill="none" stroke={navy} strokeWidth="6" strokeLinejoin="round" />
          <path d="M47 48 L81 48" stroke={navy} strokeWidth="6" strokeLinecap="round" />
          <circle cx="40" cy="48" r="11" fill={red} />
        </g>
        <text
          x="118"
          y="66"
          fontFamily="Poppins, sans-serif"
          fontSize="60"
          fontWeight="700"
          letterSpacing="1.5"
          fill={navy}
        >
          DASH
        </text>
        <text
          x="278"
          y="66"
          fontFamily="Poppins, sans-serif"
          fontSize="60"
          fontWeight="700"
          letterSpacing="1.5"
          fill={red}
        >
          LINK
        </text>
      </svg>
      {showTagline ? (
        <span
          className={`hidden text-[10px] font-semibold uppercase leading-tight tracking-[0.22em] lg:block ${
            variant === "light" ? "text-slate-500" : "text-navy-200"
          }`}
        >
          Integrated
          <br />
          Autos
        </span>
      ) : null}
    </span>
  );

  if (!href) return mark;

  return (
    <Link href={href} aria-label="Dashlink Integrated Autos — home" className="shrink-0">
      {mark}
    </Link>
  );
}
