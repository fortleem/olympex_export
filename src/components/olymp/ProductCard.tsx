"use client";

import { ArrowUpRight, Snowflake, Thermometer } from "lucide-react";
import type { Product } from "@/data/products";
import { Badge } from "@/components/ui/badge";
import { ALink } from "@/lib/router";
import { SeasonCalendar, inSeason, useCurrentMonth } from "@/components/olymp/SeasonCalendar";

export function FormatBadge({ format }: { format: "fresh" | "frozen" }) {
  return (
    <Badge
      variant="outline"
      className={
        format === "fresh"
          ? "border-primary/30 bg-primary/5 text-primary"
          : "border-accent/30 bg-accent/5 text-accent"
      }
    >
      {format === "fresh" ? "Fresh" : "Frozen / IQF"}
    </Badge>
  );
}

function InSeasonPill() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
      <span className="relative flex size-1.5" aria-hidden>
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
        <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
      </span>
      In season now
    </span>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const currentMonth = useCurrentMonth();
  const inSeasonNow = currentMonth > 0 && inSeason(product, currentMonth);

  return (
    <article className="group relative flex h-full flex-col justify-between border border-border bg-card p-6 transition-all duration-500 hover:-translate-y-1 hover:border-primary/40 hover:shadow-elevated md:p-7">
      <div
        className="field-motif pointer-events-none absolute inset-x-0 top-0 h-1 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden
      />
      <div>
        <div className="flex flex-wrap items-center gap-2">
          {product.formats.map((f) => (
            <FormatBadge key={f} format={f} />
          ))}
          {inSeasonNow ? <InSeasonPill /> : null}
        </div>
        <h3 className="mt-5 text-xl font-bold">
          <ALink
            to="/products/$slug"
            params={{ slug: product.slug }}
            className="after:absolute after:inset-0"
          >
            {product.name}
          </ALink>
        </h3>
        {product.latin ? (
          <p className="mt-1 font-[family-name:var(--font-display)] text-sm italic text-muted-foreground">
            {product.latin}
          </p>
        ) : null}
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{product.summary}</p>

        <div className="mt-6 border-t border-border pt-5">
          <p className="text-[0.65rem] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            Availability
          </p>
          <SeasonCalendar product={product} className="mt-3" />
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-xs">
            {product.formats.map((f) => {
              const info = product.calendar[f];
              if (!info) return null;
              return (
                <span key={f} className="inline-flex items-center gap-1.5">
                  {f === "fresh" ? (
                    <Thermometer className="size-3.5 text-primary" aria-hidden />
                  ) : (
                    <Snowflake className="size-3.5 text-accent" aria-hidden />
                  )}
                  <span className="text-muted-foreground">
                    {f === "fresh" ? "Fresh" : "IQF"}:
                  </span>
                  <span className="font-semibold">{info.tempC}</span>
                  <span className="text-muted-foreground/70">{info.tempF}</span>
                </span>
              );
            })}
          </div>
        </div>
      </div>

      <dl className="mt-6 space-y-2.5 border-t border-border pt-5 text-xs">
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Season</dt>
          <dd className="text-right font-semibold">{product.season}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Regions</dt>
          <dd className="text-right font-semibold">{product.regions}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Packaging</dt>
          <dd className="text-right font-semibold">{product.packaging[0]}</dd>
        </div>
      </dl>

      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
        View specification
        <ArrowUpRight
          className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden
        />
      </span>
    </article>
  );
}
