import { cn } from "@/lib/utils";

/**
 * Olymp Ex brand mark — summit ("Olymp") rendered as a solid slate-blue peak
 * with an inner light cleft, a purple crescent cresting the summit, and a
 * curved brush stroke at the base representing the Nile / cultivated land.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-label="Olymp Ex mark"
      className={cn("h-9 w-9", className)}
    >
      <defs>
        <linearGradient id="olymp-peak" x1="6" y1="56" x2="52" y2="8" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--brand-slate-deep)" />
          <stop offset="100%" stopColor="var(--brand-slate)" />
        </linearGradient>
      </defs>

      {/* summit */}
      <path
        d="M31 6 L55 52 H7 Z"
        fill="url(#olymp-peak)"
      />
      {/* inner cleft */}
      <path d="M31 20 L40 45 H22 Z" fill="var(--background)" fillOpacity="0.92" />

      {/* crescent cresting the peak */}
      <path
        d="M31.5 5.5 a7.5 7.5 0 1 0 7.2 9.4 a6 6 0 1 1 -7.2 -9.4 Z"
        fill="var(--brand-violet)"
      />

      {/* base stroke */}
      <path
        d="M6 58 C 18 50, 46 50, 58 58"
        fill="none"
        stroke="var(--brand-slate)"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Logo({
  className,
  inverted = false,
}: {
  className?: string;
  inverted?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <LogoMark className="h-10 w-10 shrink-0" />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "text-[1.3rem] font-extrabold tracking-[0.02em] uppercase",
            inverted ? "text-primary-foreground" : "text-brand-ink",
          )}
        >
          Olymp <span className="text-gradient-brand">Ex</span>
        </span>
        <span
          className={cn(
            "mt-1.5 text-[0.58rem] font-medium tracking-[0.42em] uppercase",
            inverted ? "text-primary-foreground/70" : "text-brand-slate",
          )}
        >
          Egyptian Agritrade
        </span>
      </span>
    </span>
  );
}
