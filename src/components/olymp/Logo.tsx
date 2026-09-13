import { cn } from "@/lib/utils";

/**
 * Olymp Ex brand mark — three mountain peaks rendered as overlapping
 * pyramids: a dominant centre summit in solid slate flanked by two lighter
 * receding peaks, a violet pennant cresting the main summit, and a curved
 * stroke beneath representing the Nile / cultivated land.
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
        <linearGradient id="olymp-peak" x1="12" y1="52" x2="52" y2="4" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--brand-slate-deep)" />
          <stop offset="100%" stopColor="var(--brand-slate)" />
        </linearGradient>
      </defs>

      {/* receding left pyramid */}
      <path d="M4 52 L22 16 L40 52 Z" fill="var(--brand-slate)" fillOpacity="0.38" />
      {/* receding right pyramid */}
      <path d="M26 52 L44 14 L60 52 Z" fill="var(--brand-slate)" fillOpacity="0.62" />
      {/* dominant centre pyramid */}
      <path d="M12 52 L32 4 L52 52 Z" fill="url(#olymp-peak)" />

      {/* violet pennant cresting the summit */}
      <path d="M33 5 C 38 0 47 0 53 7 C 47 12 38 11 33 5 Z" fill="var(--brand-violet)" />

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

/**
 * Full lock-up. The wordmark reads "OLYMP EX" in English, set in Cinzel —
 * classical inscriptional capitals that give the logo its Greek-antiquity
 * character — with the "Egyptian Agritrade" descriptor in the site's Latin
 * face.
 */
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
            "font-[family-name:var(--font-logo)] text-[1.4rem] tracking-[0.04em] uppercase",
            inverted ? "text-primary-foreground" : "text-brand-ink",
          )}
        >
          Olymp <span className={inverted ? "" : "text-brand-slate"}>Ex</span>
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
