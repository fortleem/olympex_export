"use client";

import { ArrowLeft, ArrowRight, Snowflake, Thermometer, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section, Eyebrow } from "@/components/olymp/Section";
import { Reveal } from "@/components/olymp/Reveal";
import { FormatBadge, ProductCard } from "@/components/olymp/ProductCard";
import { SeasonCalendar, inSeason, useCurrentMonth } from "@/components/olymp/SeasonCalendar";
import { FinalCta } from "@/components/olymp/CTA";
import { getProduct, products } from "@/data/products";
import { ALink } from "@/lib/router";

export default function ProductDetailView({ slug }: { slug: string }) {
  const product = getProduct(slug);
  const currentMonth = useCurrentMonth();

  if (!product) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-background px-4">
        <div className="max-w-md text-center">
          <h1 className="text-7xl font-extrabold text-gradient-brand">404</h1>
          <h2 className="mt-4 text-xl font-semibold text-foreground">Product not found</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The product you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="mt-6">
            <Button asChild variant="hero">
              <ALink to="/products">Browse all products</ALink>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const related = products
    .filter((p) => p.slug !== product.slug && p.category === product.category)
    .slice(0, 3);
  const img = product.formats.includes("fresh")
    ? "/images/fresh-produce.jpg"
    : "/images/frozen-produce.jpg";
  const inSeasonNow = currentMonth > 0 && inSeason(product, currentMonth);

  return (
    <>
      <header className="border-b border-border bg-surface">
        <div className="container-x py-14 md:py-20">
          <ALink
            to="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="size-4" aria-hidden /> All products
          </ALink>
          <div className="mt-10 grid items-center gap-12 lg:grid-cols-2">
            <div>
              <Eyebrow>{product.category === "fruit" ? "Fruit" : "Vegetable"}</Eyebrow>
              <h1 className="mt-6 text-4xl font-extrabold md:text-6xl">{product.name}</h1>
              {product.latin ? (
                <p className="mt-3 font-[family-name:var(--font-display)] text-lg italic text-muted-foreground">
                  {product.latin}
                </p>
              ) : null}
              <div className="mt-6 flex flex-wrap items-center gap-2">
                {product.formats.map((f) => (
                  <FormatBadge key={f} format={f} />
                ))}
                {inSeasonNow ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                    <span className="relative flex size-1.5" aria-hidden>
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                      <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
                    </span>
                    In season now
                  </span>
                ) : null}
              </div>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
                {product.detail}
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button asChild variant="hero" size="lg">
                  <ALink to="/contact">
                    Request a Quote <ArrowRight aria-hidden />
                  </ALink>
                </Button>
              </div>
            </div>
            <Reveal className="overflow-hidden border border-border shadow-soft">
              <img
                src={img}
                alt={`${product.name} handling at export standard`}
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
            { label: "Seasonality", value: product.season },
            { label: "Growing regions", value: product.regions },
            { label: "Varieties", value: product.varieties.join(", ") },
            { label: "Origin", value: "Egypt — Nile Delta & Valley" },
          ].map((s) => (
            <div key={s.label} className="bg-card p-7">
              <p className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-muted-foreground">
                {s.label}
              </p>
              <p className="mt-3 text-sm font-semibold">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Availability calendar + cold chain */}
        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          <div className="border border-border p-8">
            <h2 className="text-xl font-bold">Availability calendar</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Egyptian export window by month — the current month is outlined.
            </p>
            <SeasonCalendar product={product} detailed className="mt-6" />
            <p className="mt-6 text-xs text-muted-foreground/80">
              Windows reflect Egyptian export practice; exact shipments are confirmed per
              programme and destination.
            </p>
          </div>
          <div className="border border-border p-8">
            <h2 className="text-xl font-bold">Cold-chain specification</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Optimal storage and transport temperatures per format.
            </p>
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
                        {f === "fresh" ? "Fresh" : "Frozen / IQF"}
                      </span>
                      <span className="text-lg font-extrabold">{info.tempC}</span>
                    </div>
                    <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-xs sm:grid-cols-3">
                      <div>
                        <dt className="text-muted-foreground">Fahrenheit</dt>
                        <dd className="mt-0.5 font-semibold">{info.tempF}</dd>
                      </div>
                      {info.rh ? (
                        <div>
                          <dt className="text-muted-foreground">Humidity</dt>
                          <dd className="mt-0.5 font-semibold">{info.rh}</dd>
                        </div>
                      ) : null}
                      {info.shelfLife ? (
                        <div>
                          <dt className="text-muted-foreground">Shelf life</dt>
                          <dd className="mt-0.5 font-semibold">{info.shelfLife}</dd>
                        </div>
                      ) : null}
                      {info.transport ? (
                        <div className="col-span-2 sm:col-span-3">
                          <dt className="text-muted-foreground">Transport</dt>
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
            <h2 className="text-xl font-bold">Packaging options</h2>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              {product.packaging.map((p) => (
                <li key={p} className="flex items-center gap-3">
                  <span className="inline-block h-1 w-5 bg-primary" aria-hidden />
                  {p}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs text-muted-foreground/80">
              Packaging shown is representative; private-label and buyer-specific formats are
              available on request.
            </p>
          </div>
        </div>
      </Section>

      <Section tone="surface">
        <h2 className="text-2xl font-extrabold md:text-3xl">Related lines</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {related.map((p, i) => (
            <Reveal key={p.slug} delay={i * 60}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
