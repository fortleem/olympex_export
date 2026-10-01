"use client";

import { ArrowUpRight, Globe, Snowflake, Thermometer } from "lucide-react";
import type { Product } from "@/data/products";
import { shortTransit } from "@/data/products";
import { Badge } from "@/components/ui/badge";
import { ALink } from "@/lib/router";
import { SeasonCalendar, inSeason, useCurrentMonth } from "@/components/olymp/SeasonCalendar";
import { useI18n } from "@/i18n";
import { localizedName } from "@/i18n/product-names";

export function FormatBadge({ format }: { format: "fresh" | "frozen" }) {
  const { t } = useI18n();
  return (
    <Badge
      variant="outline"
      className={
        format === "fresh"
          ? "border-primary/30 bg-primary/5 text-primary"
          : "border-accent/30 bg-accent/5 text-accent"
      }
    >
      {format === "fresh" ? t("common.fresh") : t("common.frozenIqf")}
    </Badge>
  );
}

/** Live "In season now" pill — shared by product cards and detail headers. */
export function InSeasonPill() {
  const { t } = useI18n();
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
      <span className="relative flex size-1.5" aria-hidden>
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
        <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
      </span>
      {t("card.inSeason")}
    </span>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const { t, locale } = useI18n();
  const currentMonth = useCurrentMonth();
  const inSeasonNow = currentMonth > 0 && inSeason(product, currentMonth);
  const name = localizedName(product.slug, product.name, locale);

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
            {name}
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
            {t("card.availability")}
          </p>
          <SeasonCalendar product={product} className="mt-3" />
          {/* Cold-chain chips: temperature (°C/°F), humidity, shelf life and max transit per format */}
          <div className="mt-4 space-y-1.5">
            {product.formats.map((f) => {
              const info = product.calendar[f];
              if (!info) return null;
              const transit = product.trade?.transit[f];
              return (
                <p key={f} className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs">
                  {f === "fresh" ? (
                    <Thermometer className="size-3.5 shrink-0 text-primary" aria-hidden />
                  ) : (
                    <Snowflake className="size-3.5 shrink-0 text-accent" aria-hidden />
                  )}
                  <span className="font-semibold text-foreground/80">
                    {f === "fresh" ? t("common.fresh") : t("common.iqf")}:
                  </span>
                  <span className="font-semibold">{info.tempC}</span>
                  <span className="text-muted-foreground/70">{info.tempF}</span>
                  {info.rh ? (
                    <span className="text-muted-foreground">
                      · {t("card.rh")} {info.rh}
                    </span>
                  ) : null}
                  {info.shelfLife ? (
                    <span className="text-muted-foreground">
                      · {t("card.keeps")} {info.shelfLife}
                    </span>
                  ) : null}
                  {transit ? (
                    <span className="text-muted-foreground">
                      · {t("card.transit")} {shortTransit(transit)}
                    </span>
                  ) : null}
                </p>
              );
            })}
          </div>
          {/* Egypt trade profile: export volume + world standing */}
          {product.trade ? (
            <p className="mt-3 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs">
              <Globe className="size-3.5 shrink-0 text-primary" aria-hidden />
              <span className="text-muted-foreground">{t("card.egyptExports")}</span>{" "}
              <span className="font-semibold text-foreground/85">{product.trade.volume}</span>{" "}
              <span className="text-muted-foreground">— {product.trade.headline}</span>
            </p>
          ) : null}
        </div>
      </div>

      <dl className="mt-6 space-y-2.5 border-t border-border pt-5 text-xs">
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">{t("card.season")}</dt>
          <dd className="text-end font-semibold">{product.season}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">{t("card.regions")}</dt>
          <dd className="text-end font-semibold">{product.regions}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">{t("card.packaging")}</dt>
          <dd className="text-end font-semibold">{product.packaging[0]}</dd>
        </div>
      </dl>

      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
        {t("common.viewSpecification")}
        <ArrowUpRight
          className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:group-hover:-translate-x-0.5"
          aria-hidden
        />
      </span>
    </article>
  );
}
