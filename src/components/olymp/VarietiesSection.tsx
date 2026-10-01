"use client";

import { Sprout } from "lucide-react";
import type { Product } from "@/data/products";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n";

/**
 * Varieties & season windows — every commercial subtype of a product line
 * rendered as a compact card with its own 12-month window strip.
 *
 * Windows are the harvest/packing window of each subtype, so they may extend
 * beyond the format calendar above (cold-stored and IQF lines ship on from
 * stock). Months render through the i18n layer (localized labels); subtype
 * names, tags and details stay canonical English trade data, like all
 * product copy.
 */
export function VarietiesSection({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  const { t, monthShort, monthsLabel } = useI18n();

  if (product.subtypes.length === 0) return null;

  // Fresh-crop windows read in brand green; frozen-only lines in accent.
  const barActive = product.formats.includes("fresh") ? "bg-primary" : "bg-accent";

  return (
    <div className={cn("border border-border bg-surface p-8 md:p-10", className)}>
      <div className="flex items-center gap-3">
        <Sprout className="size-5 text-primary" aria-hidden />
        <h2 className="text-xl font-bold">{t("detail.varietiesTitle")}</h2>
      </div>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{t("detail.varietiesDesc")}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {product.subtypes.map((s) => (
          <article key={s.name} className="flex flex-col rounded-xl border border-border bg-card p-5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-bold">{s.name}</h3>
              {s.tag ? (
                <span className="inline-flex shrink-0 items-center rounded-full border border-primary/25 bg-primary/5 px-2 py-0.5 text-[0.6rem] font-bold tracking-wide text-primary uppercase">
                  {s.tag}
                </span>
              ) : null}
            </div>
            <div className="mt-4 flex gap-[3px]" aria-hidden>
              {monthShort.map((label, i) => {
                const m = i + 1;
                const active = s.months.includes(m);
                return (
                  <span
                    key={m}
                    title={label}
                    className={cn("h-2 flex-1 rounded-[3px]", active ? barActive : "bg-border")}
                  />
                );
              })}
            </div>
            <p className="mt-3 text-xs font-semibold text-foreground/80">
              {monthsLabel(s.months)}
              {s.peak ? ` · ${t("cal.peak")} ${s.peak}` : ""}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{s.detail}</p>
            <span className="sr-only">
              {`${t("cal.availableSr")} ${monthsLabel(s.months)}${s.peak ? `. ${t("cal.peak")} ${s.peak}.` : ""}`}
            </span>
          </article>
        ))}
      </div>

      <p className="mt-8 border-t border-border pt-4 text-xs text-muted-foreground/80">
        {product.formats.includes("frozen")
          ? t("detail.varietiesNote")
          : t("detail.varietiesNoteFresh")}
      </p>
    </div>
  );
}
