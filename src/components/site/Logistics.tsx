import { Clock, Sprout, HandHeart, Warehouse, ClipboardCheck, Ship, Route as RouteIcon } from "lucide-react";
import { Reveal } from "./Reveal";
import { lanes, journeySteps } from "@/data/logistics";
import { cn } from "@/lib/utils";

const stepIcons = {
  grow: Sprout,
  harvest: HandHeart,
  process: Warehouse,
  certify: ClipboardCheck,
  ship: Ship,
} as const;

/** Destination lane cards — region, gateway ports and indicative transit. */
export function LaneGrid({ className }: { className?: string }) {
  return (
    <div className={cn("grid gap-6 sm:grid-cols-2 xl:grid-cols-4", className)}>
      {lanes.map((lane, i) => (
        <Reveal
          key={lane.region}
          delay={i * 80}
          className="rounded-2xl border border-border bg-card p-8 text-center transition-shadow duration-500 hover:shadow-elevated"
        >
          <span className="text-3xl leading-none" aria-hidden>
            {lane.flag}
          </span>
          <h3 className="mt-5 text-lg font-bold text-brand-ink">{lane.region}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{lane.ports}</p>
          <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent">
            <Clock className="size-4" aria-hidden />
            {lane.transit}
          </p>
        </Reveal>
      ))}
    </div>
  );
}

/** "Farm to Port in 5 Precision Steps" — numbered connected timeline. */
export function JourneyTimeline() {
  return (
    <div className="text-center">
      <Reveal>
        <span className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-4 py-2 text-[0.7rem] font-bold tracking-[0.22em] uppercase text-accent">
          <RouteIcon className="size-4" aria-hidden />
          The Journey
        </span>
        <h2 className="mx-auto mt-7 max-w-3xl text-3xl leading-[1.08] font-extrabold md:text-[2.75rem]">
          Farm to Port in <span className="text-primary">5 Precision</span>{" "}
          <span className="text-accent">Steps</span>
        </h2>
      </Reveal>

      <ol className="mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
        {journeySteps.map((step, i) => {
          const Icon = stepIcons[step.icon];
          return (
            <Reveal as="li" key={step.title} delay={i * 90} className="relative">
              <div className="flex items-center justify-center">
                <span className="relative z-10 inline-flex h-16 w-16 items-center justify-center rounded-full border-2 border-accent/60 bg-background font-[family-name:var(--font-display)] text-lg font-bold text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {i < journeySteps.length - 1 ? (
                  <span
                    className="absolute left-1/2 hidden h-px w-full lg:block"
                    style={{ background: "var(--gradient-accent-line)", opacity: 0.35 }}
                    aria-hidden
                  />
                ) : null}
              </div>
              <Icon className="mx-auto mt-8 size-6 text-primary" aria-hidden />
              <h3 className="mt-4 text-lg font-bold text-brand-ink">{step.title}</h3>
              <p className="mx-auto mt-2 max-w-[16rem] text-sm leading-relaxed text-muted-foreground">
                {step.text}
              </p>
            </Reveal>
          );
        })}
      </ol>
    </div>
  );
}
