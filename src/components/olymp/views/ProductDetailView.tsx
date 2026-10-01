"use client";

import { ArrowLeft, ArrowRight, Globe, Snowflake, Thermometer, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section, Eyebrow } from "@/components/olymp/Section";
import { Reveal } from "@/components/olymp/Reveal";
import { FormatBadge, InSeasonPill } from "@/components/olymp/ProductCard";
import { ProductGrid } from "@/components/olymp/ProductGrid";
import { SeasonCalendar, inSeason, useCurrentMonth } from "@/components/olymp/SeasonCalendar";
import { FinalCta } from "@/components/olymp/CTA";
import { getProduct, products } from "@/data/products";
import { productImage } from "@/data/product-images";
import { ALink } from "@/lib/router";
import { useI18n } from "@/i18n";
import { localizedName } from "@/i18n/product-names";

export default function ProductDetailView({ slug }: { slug: string }) {
  const { t, locale } = useI18n();
  const product = getProduct(slug);
  const currentMonth = useCurrentMonth();

  if (!product) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-background px-4">
        <div className="max-w-md text-center">
          <h1 className="text-7xl font-extrabold text-gradient-brand">404</h1>
          <h2 className="mt-4 text-xl font-semibold text-foreground">{t("detail.notFoundTitle")}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{t("detail.notFoundText")}</p>
          <div className="mt-6">
            <Button asChild variant="hero">
              <ALink to="/products">{t("detail.browseAll")}</ALink>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const name = localizedName(product.slug, product.name, locale);
  const related = products
    .filter((p) => p.slug !== product.slug && p.category === product.category)
    .slice(0, 3);
  const img = productImage(product.slug, product.formats);
  const inSeasonNow = currentMonth > 0 && inSeason(product, currentMonth);

  return (
    <>
      <header className="border-b border-border bg-surface">
        <div className="container-x py-14 md:py-20">
          <ALink
            to="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="size-4 rtl:-scale-x-100" aria-hidden /> {t("detail.backToAll")}
          </ALink>
          <div className="mt-10 grid items-center gap-12 lg:grid-cols-2">
            <div>
              <Eyebrow>
                {product.category === "fruit" ? t("common.fruit") : t("common.vegetable")}
              </Eyebrow>
              <h1 className="mt-6 text-4xl font-extrabold md:text-6xl">{name}</h1>
              {product.latin ? (
                <p className="mt-3 font-[family-name:var(--font-display)] text-lg italic text-muted-foreground">
                  {product.latin}
                </p>
              ) : null}
              <div className="mt-6 flex flex-wrap items-center gap-2">
                {product.formats.map((f) => (
                  <FormatBadge key={f} format={f} />
                ))}
                {inSeasonNow ? <InSeasonPill /> : null}
              </div>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
                {product.detail}
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button asChild variant="hero" size="lg">
                  <ALink to="/contact">
                    {t("common.requestQuote")} <ArrowRight aria-hidden />
                  </ALink>
                </Button>
              </div>
            </div>
            <Reveal className="overflow-hidden border border-border shadow-soft">
              <img
                src={img}
                alt={t("detail.imgAlt", { name })}
                width={1280}
                height={960}
                loading="lazy"
                className="aspect-[4/3] h-full w-full object-cover"
              />
            </Reveal>
          </div>
        </div>
      </header>

      <Section>
        <div className="grid gap-px border border-border bg-border md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: t("detail.statSeasonality"), value: product.season },
            { label: t("detail.statRegions"), value: product.regions },
            { label: t("detail.statVarieties"), value: product.varieties.join(", ") },
            { label: t("detail.statOrigin"), value: t("common.egyptOrigin") },
          ].map((s) => (
            <div key={s.label} className="bg-card p-7">
              <p className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-muted-foreground">
                {s.label}
              </p>
              <p className="mt-3 text-sm font-semibold">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Egypt trade profile: volumes, world standing, biggest markets */}
        {product.trade ? (
          <div className="mt-14 border border-border bg-surface p-8 md:p-10">
            <div className="flex items-center gap-3">
              <Globe className="size-5 text-primary" aria-hidden />
              <h2 className="text-xl font-bold">{t("detail.tradeTitle")}</h2>
            </div>
            <div className="mt-8 grid gap-10 lg:grid-cols-3">
              <div>
                <p className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-muted-foreground">
                  {t("detail.tradeVolume")}
                </p>
                <p className="mt-3 text-2xl font-extrabold text-gradient-brand">
                  {product.trade.volume}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t("detail.tradeYear", { year: product.trade.year })}
                </p>
              </div>
              <div>
                <p className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-muted-foreground">
                  {t("detail.tradeStanding")}
                </p>
                <p className="mt-3 text-base font-bold">{product.trade.headline}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {product.trade.share}
                </p>
              </div>
              <div>
                <p className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-muted-foreground">
                  {t("detail.tradeImporters")}
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {product.trade.topImporters.map((c, i) => (
                    <li
                      key={c}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold"
                    >
                      {i === 0 ? (
                        <span className="text-[0.6rem] font-extrabold tracking-wide text-primary">
                          #1
                        </span>
                      ) : null}
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="mt-8 border-t border-border pt-4 text-xs text-muted-foreground/80">
              {t("detail.tradeSource")}
            </p>
          </div>
        ) : null}

        {/* Availability calendar + cold chain */}
        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          <div className="border border-border p-8">
            <h2 className="text-xl font-bold">{t("detail.calendarTitle")}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{t("detail.calendarDesc")}</p>
            <SeasonCalendar product={product} detailed className="mt-6" />
            <p className="mt-6 text-xs text-muted-foreground/80">{t("detail.calendarNote")}</p>
          </div>
          <div className="border border-border p-8">
            <h2 className="text-xl font-bold">{t("detail.coldTitle")}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{t("detail.coldDesc")}</p>
            <div className="mt-6 space-y-4">
              {product.formats.map((f) => {
                const info = product.calendar[f];
                if (!info) return null;
                return (
                  <div key={f} className="rounded-xl border border-border bg-surface p-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-2 text-sm font-bold">
                        {f === "fresh" ? (
                          <Thermometer className="size-4 text-primary" aria-hidden />
                        ) : (
                          <Snowflake className="size-4 text-accent" aria-hidden />
                        )}
                        {f === "fresh" ? t("common.fresh") : t("common.frozenIqf")}
                      </span>
                      <span className="text-lg font-extrabold">{info.tempC}</span>
                    </div>
                    <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-xs sm:grid-cols-3">
                      <div>
                        <dt className="text-muted-foreground">{t("detail.fahrenheit")}</dt>
                        <dd className="mt-0.5 font-semibold">{info.tempF}</dd>
                      </div>
                      {info.ventilation ? (
                        <div>
                          <dt className="text-muted-foreground">{t("detail.ventilation")}</dt>
                          <dd className="mt-0.5 font-semibold">{info.ventilation}</dd>
                        </div>
                      ) : null}
                      {info.rh ? (
                        <div>
                          <dt className="text-muted-foreground">{t("detail.humidity")}</dt>
                          <dd className="mt-0.5 font-semibold">{info.rh}</dd>
                        </div>
                      ) : null}
                      {info.shelfLife ? (
                        <div>
                          <dt className="text-muted-foreground">{t("detail.shelfLife")}</dt>
                          <dd className="mt-0.5 font-semibold">{info.shelfLife}</dd>
                        </div>
                      ) : null}
                      {product.trade?.transit[f] ? (
                        <div className="col-span-2 sm:col-span-3">
                          <dt className="text-muted-foreground">{t("detail.maxTransit")}</dt>
                          <dd className="mt-0.5 font-semibold">{product.trade.transit[f]}</dd>
                        </div>
                      ) : null}
                      {info.transport ? (
                        <div className="col-span-2 sm:col-span-3">
                          <dt className="text-muted-foreground">{t("detail.transport")}</dt>
                          <dd className="mt-0.5 font-semibold">{info.transport}</dd>
                        </div>
                      ) : null}
                    </dl>
                    {info.note ? (
                      <p className="mt-4 flex items-start gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
                        <Wind className="mt-0.5 size-3.5 shrink-0 text-accent" aria-hidden />
                        {info.note}
                      </p>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <div className="border border-border p-8">
            <h2 className="text-xl font-bold">{t("detail.packagingTitle")}</h2>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              {product.packaging.map((p) => (
                <li key={p} className="flex items-center gap-3">
                  <span className="inline-block h-1 w-5 bg-primary" aria-hidden />
                  {p}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs text-muted-foreground/80">{t("detail.packagingNote")}</p>
          </div>
        </div>
      </Section>

      <Section tone="surface">
        <h2 className="text-2xl font-extrabold md:text-3xl">{t("detail.related")}</h2>
        <ProductGrid products={related} className="mt-10" />
      </Section>

      <FinalCta />
    </>
  );
}
