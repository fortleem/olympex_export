import { cn } from "@/lib/utils";

/**
 * Olymp Ex brand mark — modelled on the supplied brand asset: a solid
 * slate-blue peak (reads as a capital "Α") with a notch rising from the base,
 * a violet pennant cresting the summit toward the upper right, and a curved
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
        <linearGradient id="olymp-peak" x1="6" y1="56" x2="52" y2="8" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--brand-slate-deep)" />
          <stop offset="100%" stopColor="var(--brand-slate)" />
        </linearGradient>
      </defs>

      {/* peak */}
      <path d="M32 5 L55 52 H9 Z" fill="url(#olymp-peak)" />
      {/* notch rising from the base — reads as a capital Α */}
      <path d="M32 31 L44 52 H20 Z" fill="var(--background)" fillOpacity="0.92" />

      {/* violet pennant cresting the summit */}
      <path d="M33 8 C 39 1 49 2 55 9 C 49 15 39 14 33 8 Z" fill="var(--brand-violet)" />

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
 * Full lock-up. The wordmark is set in Greek letterforms — ΩΛΥΜΠ ΕΞ — in
 * classical Greek Didot, the brand's Greek-style signature, with the
 * "Egyptian Agritrade" descriptor kept in the site's Latin face.
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
        <span className="sr-only">Olymp Ex</span>
        <span
          aria-hidden
          className={cn(
            "font-[family-name:var(--font-greek)] text-[1.5rem] tracking-[0.02em]",
            inverted ? "text-primary-foreground" : "text-brand-ink",
          )}
        >
          ΩΛΥΜΠ <span className={inverted ? "text-primary-foreground/60" : "text-brand-slate"}>ΕΞ</span>
        </span>
        <span
          aria-hidden
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
