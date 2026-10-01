"use client";

/**
 * Seasonality calendar for Olymp Ex products.
 *
 * Renders one row per format (Fresh / IQF) with the 12 months of the year;
 * filled cells are export-availability months. The current month is
 * emphasised after mount (client-only, so SSR markup never mismatches).
 */

import { useSyncExternalStore } from "react";
import type { Product, ProductFormat } from "@/data/products";
import { MONTH_LETTER, MONTH_SHORT, monthsLabel } from "@/data/products";
import { cn } from "@/lib/utils";

const FORMAT_LABEL: Record<ProductFormat, string> = {
  fresh: "Fresh",
  frozen: "IQF",
};

const FORMAT_ACTIVE_BG: Record<ProductFormat, string> = {
  fresh: "bg-primary",
  frozen: "bg-accent",
};

const FORMAT_ACTIVE_CELL: Record<ProductFormat, string> = {
  fresh: "border-primary/40 bg-primary/10 text-primary",
  frozen: "border-accent/40 bg-accent/10 text-accent",
};

const noSubscribe = () => () => {};

/** Current month 1–12; 0 during SSR/hydration so first paint is deterministic. */
export function useCurrentMonth() {
  return useSyncExternalStore(
    noSubscribe,
    () => new Date().getMonth() + 1,
    () => 0,
  );
}

/** True when any format of the product is in season in the given month. */
export function inSeason(p: Product, month: number): boolean {
  return p.formats.some((f) => p.calendar[f]?.months.includes(month));
}

export function SeasonCalendar({
  product,
  detailed = false,
  className,
}: {
  product: Product;
  detailed?: boolean;
  className?: string;
}) {
  const current = useCurrentMonth();
  const rows = product.formats.filter((f): f is ProductFormat => Boolean(product.calendar[f]));

  if (rows.length === 0) return null;

  if (!detailed) {
    return (
      <div className={className} aria-label="Availability calendar">
        <div className="space-y-1.5">
          {rows.map((f) => {
            const info = product.calendar[f]!;
            return (
              <div key={f} className="flex items-center gap-2">
                <span className="w-8 shrink-0 text-[9px] font-bold tracking-[0.14em] text-muted-foreground uppercase">
                  {FORMAT_LABEL[f]}
                </span>
                <div className="flex flex-1 gap-[3px]">
                  {MONTH_LETTER.map((_, i) => {
                    const m = i + 1;
                    const active = info.months.includes(m);
                    return (
                      <span
                        key={m}
                        className={cn(
                          "h-1.5 flex-1 rounded-[2px]",
                          active ? FORMAT_ACTIVE_BG[f] : "bg-border",
                        )}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-1.5 flex items-center gap-2" aria-hidden>
          <span className="w-8 shrink-0" />
          <div className="flex flex-1 gap-[3px]">
            {MONTH_LETTER.map((l, i) => (
              <span
                key={i}
                className={cn(
                  "flex-1 text-center text-[8px] leading-none",
                  current === i + 1
                    ? "font-bold text-foreground"
                    : "font-medium text-muted-foreground/50",
                )}
              >
                {l}
              </span>
            ))}
          </div>
        </div>
        <span className="sr-only">
          {rows
            .map((f) => `${FORMAT_LABEL[f]}: available ${monthsLabel(product.calendar[f]!.months)}`)
            .join("; ")}
        </span>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {rows.map((f) => {
        const info = product.calendar[f]!;
        return (
          <div key={f}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-xs font-bold tracking-[0.16em] uppercase">
                {f === "frozen" ? "Frozen / IQF" : "Fresh"}
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                {monthsLabel(info.months)}
                {info.peak ? ` · peak ${info.peak}` : ""}
              </span>
            </div>
            <div className="mt-2.5 grid grid-cols-12 gap-1.5">
              {MONTH_SHORT.map((label, i) => {
                const m = i + 1;
                const active = info.months.includes(m);
                return (
                  <div
                    key={m}
                    className={cn(
                      "rounded-md border py-2 text-center text-[10px] font-semibold",
                      active
                        ? FORMAT_ACTIVE_CELL[f]
                        : "border-border bg-muted/40 text-muted-foreground/50",
                      current === m && "ring-2 ring-foreground/30 ring-offset-1 ring-offset-card",
                    )}
                    title={`${label}: ${active ? "in season" : "out of season"}`}
                  >
                    {label}
                  </div>
                );
              })}
            </div>
            <span className="sr-only">
              {f === "frozen" ? "Frozen" : "Fresh"}: available {monthsLabel(info.months)}.
            </span>
          </div>
        );
      })}
    </div>
  );
}
