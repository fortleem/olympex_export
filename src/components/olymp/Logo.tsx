import { cn } from "@/lib/utils";

/**
 * Olymp Ex brand mark — vectorised from the client-supplied logo asset
 * (B1gOK.jpg): three hollow pyramids with swoosh legs that taper to sharp
 * pointed feet. Geometry follows the asset 1:1 — dominant centre pyramid
 * (tallest), left pyramid at ~66% height, right at ~67%; the centre's right
 * flank carries the asset's signature white wedge cut, the right pyramid
 * keeps its short echo leg, and the left pyramid's inner leg tucks behind
 * the navy leg exactly like the asset's braided overlap.
 *
 * Colouring per the client's request: one pyramid light green, one purple —
 * left pyramid light green, dominant centre pyramid stays brand navy, right
 * pyramid purple.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 521 253"
      role="img"
      aria-label="Olymp Ex mark"
      className={cn("h-10 w-auto", className)}
    >
      {/* left pyramid — light green */}
      <g fill="var(--brand-leaf)">
        {/* solid apex tip */}
        <path d="M138 85L123 103L153 103Z" />
        {/* outer leg — swoosh tapering to a sharp foot */}
        <path d="M123 103L140 103L34 232L6 246Z" />
        {/* inner leg — tucks behind the navy leg (braided overlap) */}
        <path d="M145 103L162 103L152 170Z" />
      </g>

      {/* centre pyramid — navy (dominant) */}
      <g fill="var(--brand-navy)">
        {/* solid apex tip */}
        <path d="M261 1L245 28L277 28Z" />
        {/* left leg — swoosh tapering to a sharp foot */}
        <path d="M245 28L261 28L125 220L92 243Z" />
        {/* right flank — solid mass with the asset's white wedge cut */}
        <path
          fillRule="evenodd"
          d="M261 28L277 28L424 248L232 246L297 134L269 98ZM316 190L240 243L391 243Z"
        />
      </g>

      {/* right pyramid — purple */}
      <g fill="var(--brand-grape)">
        {/* solid apex tip */}
        <path d="M380 83L365 103L395 103Z" />
        {/* short echo leg tapering to a point, as in the asset */}
        <path d="M359 105L378 105L361 125Z" />
        {/* blade leg — angular bent wedge swooshing to a sharp foot */}
        <path d="M388 106L406 106L515 243L511 243L410 173Z" />
      </g>
    </svg>
  );
}

/**
 * Full lock-up. The mark is the client-supplied logo asset (three hollow
 * pyramids — light green / navy / purple); the wordmark keeps the site's
 * existing logo text colours — "OLYMP EX" in classical inscriptional
 * capitals (Cinzel), Olymp in brand ink, Ex in brand slate — with the
 * "Egyptian Agritrade" descriptor below.
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
      <LogoMark className="h-10 w-auto shrink-0" />
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
