"use client";

import { ArrowRight, Snowflake, Leaf, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section, SectionHeader, Eyebrow } from "@/components/olymp/Section";
import { Reveal } from "@/components/olymp/Reveal";
import { ProductGrid } from "@/components/olymp/ProductGrid";
import { JourneyTimeline, LaneGrid } from "@/components/olymp/Logistics";
import { FinalCta } from "@/components/olymp/CTA";
import { ALink } from "@/lib/router";
import { featuredProducts } from "@/data/products";
import { useI18n } from "@/i18n";
import type { DictKey } from "@/i18n/locales/en";

const trustKeys: DictKey[] = [
  "home.trust1",
  "home.trust2",
  "home.trust3",
  "home.trust4",
  "home.trust5",
];

export default function HomeView() {
  const { t } = useI18n();
  const featured = featuredProducts;

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-background">
        <div className="grid-motif pointer-events-none absolute inset-0 opacity-60" aria-hidden />
        <div
          className="pointer-events-none absolute top-1/3 -left-40 h-[32rem] w-[32rem] rounded-full opacity-[0.12] blur-3xl rtl:-right-40 rtl:-left-auto"
          style={{ background: "var(--gradient-brand)" }}
          aria-hidden
        />
        <div className="container-x relative grid items-center gap-14 py-16 lg:grid-cols-2 lg:gap-8 lg:py-24">
          <Reveal className="is-revealed max-w-2xl">
            <Eyebrow>{t("home.heroEyebrow")}</Eyebrow>
            <h1 className="mt-7 text-[2.6rem] leading-[1.02] font-extrabold sm:text-6xl xl:text-7xl">
              {t("home.heroTitle1")}
              <br />
              <span className="text-gradient-brand">{t("home.heroTitle2")}</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground">
              {t("home.heroLead")}
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild variant="hero" size="lg">
                <ALink to="/contact">
                  {t("common.requestQuote")}
                  <ArrowRight aria-hidden />
                </ALink>
              </Button>
              <Button asChild variant="outline" size="lg">
                <ALink to="/products">{t("common.exploreProducts")}</ALink>
              </Button>
            </div>

            <dl className="mt-14 grid max-w-xl grid-cols-2 gap-x-8 gap-y-6 border-t border-border pt-8 sm:grid-cols-4">
              {(
                [
                  ["home.stat1l", "home.stat1v"],
                  ["home.stat2l", "home.stat2v"],
                  ["home.stat3l", "home.stat3v"],
                  ["home.stat4l", "home.stat4v"],
                ] as const
              ).map(([lk, vk]) => (
                <div key={lk}>
                  <dt className="text-[0.65rem] font-semibold tracking-[0.18em] uppercase text-muted-foreground">
                    {t(lk)}
                  </dt>
                  <dd className="mt-1.5 text-sm font-bold">{t(vk)}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <div className="relative">
            <div className="relative overflow-hidden border border-border bg-surface shadow-elevated">
              <img
                src="/images/hero-produce.jpg"
                alt={t("alt.hero")}
                width={1920}
                height={1280}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-4 hidden w-64 border border-border bg-background/90 p-5 shadow-soft backdrop-blur-md sm:block lg:-left-10 rtl:-right-4 rtl:left-auto rtl:lg:-right-10 rtl:lg:left-auto">
              <p className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-accent">
                {t("home.cardEyebrow")}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t("home.cardText")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <div className="border-y border-border bg-surface">
        <div className="container-x flex flex-wrap items-center justify-between gap-6 py-6">
          {trustKeys.map((key) => (
            <span
              key={key}
              className="inline-flex items-center gap-2.5 text-xs font-semibold tracking-[0.12em] uppercase text-muted-foreground"
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
              {t(key)}
            </span>
          ))}
        </div>
      </div>

      {/* FEATURED CATEGORIES */}
      <Section>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeader
            eyebrow={t("home.portfolioEyebrow")}
            title={t("home.portfolioTitle")}
            description={t("home.portfolioDesc")}
          />
          <Button asChild variant="outline">
            <ALink to="/products">
              {t("common.allProducts")} <ArrowRight aria-hidden />
            </ALink>
          </Button>
        </div>
        <ProductGrid products={featured} className="mt-14" />
      </Section>

      {/* FROM EGYPT TO THE WORLD */}
      <Section tone="surface">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal className="relative overflow-hidden border border-border shadow-soft">
            <img
              src="/images/egypt-fields.jpg"
              alt={t("alt.egyptFields")}
              width={1600}
              height={900}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-[1.2s] hover:scale-[1.04]"
            />
          </Reveal>
          <div>
            <SectionHeader
              eyebrow={t("home.originEyebrow")}
              title={t("home.originTitle")}
              description={t("home.originDesc")}
            />
            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              {(
                [
                  ["home.op1t", "home.op1d"],
                  ["home.op2t", "home.op2d"],
                  ["home.op3t", "home.op3d"],
                  ["home.op4t", "home.op4d"],
                ] as const
              ).map(([tk, dk], i) => (
                <Reveal key={tk} delay={i * 80}>
                  <h3 className="text-base font-bold">{t(tk)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(dk)}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* FARM TO PORT JOURNEY */}
      <Section>
        <JourneyTimeline />
      </Section>

      {/* FRESH VS FROZEN */}
      <Section tone="surface">
        <SectionHeader
          eyebrow={t("home.capsEyebrow")}
          title={t("home.capsTitle")}
          align="center"
        />
        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {[
            {
              img: "/images/fresh-produce.jpg",
              icon: Leaf,
              title: t("home.freshTitle"),
              alt: t("alt.freshImg"),
              text: t("home.freshText"),
              to: "/fresh-produce",
              points: [t("home.freshP1"), t("home.freshP2"), t("home.freshP3")],
            },
            {
              img: "/images/frozen-produce.jpg",
              icon: Snowflake,
              title: t("home.frozenTitle"),
              alt: t("alt.frozenImg"),
              text: t("home.frozenText"),
              to: "/frozen-produce",
              points: [t("home.frozenP1"), t("home.frozenP2"), t("home.frozenP3")],
            },
          ].map((c, i) => (
            <Reveal key={c.title} delay={i * 100}>
              <article className="group flex h-full flex-col overflow-hidden border border-border bg-card transition-shadow duration-500 hover:shadow-elevated">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img
                    src={c.img}
                    alt={c.title}
                    width={1280}
                    height={960}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1.1s] group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-8">
                  <span className="inline-flex h-11 w-11 items-center justify-center border border-accent/25 bg-accent/5 text-accent">
                    <c.icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="mt-6 text-2xl font-bold">{c.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.text}</p>
                  <ul className="mt-6 space-y-2 text-sm">
                    {c.points.map((p) => (
                      <li key={p} className="flex items-center gap-2.5 text-muted-foreground">
                        <span className="inline-block h-1 w-4 bg-primary" aria-hidden />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 pt-2">
                    <Button asChild variant="outline">
                      <ALink to={c.to}>
                        {t("common.learnMore")} <ArrowRight aria-hidden />
                      </ALink>
                    </Button>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* MARKETS */}
      <Section>
        <SectionHeader
          eyebrow={t("home.marketsEyebrow")}
          title={t("home.marketsTitle")}
          description={t("home.marketsDesc")}
          align="center"
        />
        <LaneGrid className="mt-14" />
        <Reveal className="mt-12 text-center">
          <Button asChild variant="outline">
            <ALink to="/global-markets">
              {t("home.exportCapability")} <ArrowRight aria-hidden />
            </ALink>
          </Button>
        </Reveal>
      </Section>

      {/* SUSTAINABILITY */}
      <Section tone="surface">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeader
              eyebrow={t("home.sustainEyebrow")}
              title={t("home.sustainTitle")}
              description={t("home.sustainDesc")}
            />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:col-span-7">
            {(
              [
                ["home.sp1t", "home.sp1d"],
                ["home.sp2t", "home.sp2d"],
                ["home.sp3t", "home.sp3d"],
                ["home.sp4t", "home.sp4d"],
              ] as const
            ).map(([tk, dk], i) => (
              <Reveal key={tk} delay={i * 70} className="border border-border bg-card p-7">
                <h3 className="text-base font-bold">{t(tk)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(dk)}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* TESTIMONIALS */}
      <Section>
        <SectionHeader
          eyebrow={t("home.voicesEyebrow")}
          title={t("home.voicesTitle")}
          description={t("home.voicesDesc")}
          align="center"
        />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {(
            [
              ["home.v1q", "home.v1w"],
              ["home.v2q", "home.v2w"],
              ["home.v3q", "home.v3w"],
            ] as const
          ).map(([qk, wk], i) => (
            <Reveal key={wk} delay={i * 80} className="border border-border bg-card p-8">
              <Quote className="size-6 text-accent" aria-hidden />
              <blockquote className="mt-5 text-base leading-relaxed">{t(qk)}</blockquote>
              <footer className="mt-6 border-t border-border pt-5 text-xs">
                <p className="font-semibold">{t(wk)}</p>
                <p className="mt-1 text-muted-foreground">{t("home.vWhere")}</p>
              </footer>
            </Reveal>
          ))}
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
