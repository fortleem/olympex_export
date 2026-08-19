import { cn } from "@/lib/utils";

/**
 * Olymp Ex wordmark.
 * Mark concept: a geometric summit (Olymp) formed from two stacked chevrons —
 * the lower one in agricultural green (provenance), the upper in purple
 * (global trade) — inside a precise square field motif representing export grids.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      role="img"
      aria-label="Olymp Ex mark"
      className={cn("h-9 w-9", className)}
    >
      <defs>
        <linearGradient id="olymp-mark" x1="0" y1="40" x2="40" y2="0">
          <stop offset="0%" stopColor="oklch(0.35 0.093 152)" />
          <stop offset="55%" stopColor="oklch(0.53 0.132 148)" />
          <stop offset="100%" stopColor="oklch(0.46 0.166 300)" />
        </linearGradient>
      </defs>
      <rect
        x="0.75"
        y="0.75"
        width="38.5"
        height="38.5"
        rx="3"
        fill="none"
        stroke="url(#olymp-mark)"
        strokeOpacity="0.35"
        strokeWidth="1.5"
      />
      <path
        d="M8 27.5 20 12l12 15.5"
        fill="none"
        stroke="url(#olymp-mark)"
        strokeWidth="3"
        strokeLinecap="square"
      />
      <path
        d="M13.5 30.5 20 22l6.5 8.5"
        fill="none"
        stroke="oklch(0.46 0.166 300)"
        strokeWidth="2"
        strokeLinecap="square"
        opacity="0.75"
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
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="h-8 w-8 shrink-0" />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "text-[1.15rem] font-extrabold tracking-[0.16em] uppercase",
            inverted ? "text-primary-foreground" : "text-foreground",
          )}
        >
          Olymp<span className="text-primary"> Ex</span>
        </span>
        <span
          className={cn(
            "mt-1 text-[0.55rem] font-medium tracking-[0.34em] uppercase",
            inverted ? "text-primary-foreground/70" : "text-muted-foreground",
          )}
        >
          Egyptian Agritrade
        </span>
      </span>
    </span>
  );
}
