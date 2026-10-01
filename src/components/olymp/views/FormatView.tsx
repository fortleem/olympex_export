"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section, SectionHeader, PageHero } from "@/components/olymp/Section";
import { Reveal } from "@/components/olymp/Reveal";
import { ProductExplorer } from "@/components/olymp/ProductExplorer";
import { LaneGrid } from "@/components/olymp/Logistics";
import { FinalCta } from "@/components/olymp/CTA";
import { ALink } from "@/lib/router";
import { freshProducts, frozenProducts } from "@/data/products";
import { useI18n } from "@/i18n";
import type { DictKey } from "@/i18n/locales/en";

/**
 * Shared template for the Fresh-produce and Frozen-produce pages.
 *
 * The two pages used to be ~95% duplicated code; they are now one layout
 * driven by a format ("fresh" | "frozen") with all copy resolved from the
 * active locale dictionary. Both pages embed the full ProductExplorer, so
 * the month-availability filter and CSV export work everywhere products
 * are listed — no more fragmenting the catalogue across sections.
 */

export type FormatPageProps = {
  format: "fresh" | "frozen";
  /** Dictionary key prefix: "fresh" or "frozen". */
  prefix: "fresh" | "frozen";
};

export function FormatView({ format, prefix }: FormatPageProps) {
  const { t } = useI18n();
  const count = format === "fresh" ? freshProducts.length : frozenProducts.length;
  const p = prefix as "fresh" | "frozen";

  const heroImg =
    format === "fresh"
      ? { src: "/images/fresh-produce.jpg", alt: t("alt.freshImg"), width: 1280, height: 960 }
      : { src: "/images/frozen-produce.jpg", alt: t("alt.frozenImg"), width: 800, height: 1200 };

  const pillars = ([1, 2, 3, 4] as const).map((n) => ({
    title: t(`${p}.p${n}t` as DictKey),
    text: t(`${p}.p${n}d` as DictKey),
  }));

  const imageBlock = (
    <Reveal className="overflow-hidden rounded-2xl border border-border shadow-soft">
      <img
        src={heroImg.src}
        alt={heroImg.alt}
        width={heroImg.width}
        height={heroImg.height}
        loading="lazy"
        className="aspect-[4/3] h-full w-full object-cover"
      />
    </Reveal>
  );
  const pillarsBlock = (
    <div>
      <SectionHeader
        eyebrow={t(`${p}.handlingEyebrow` as DictKey)}
        title={t(`${p}.handlingTitle` as DictKey)}
      />
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {pillars.map((pillar, i) => (
          <Reveal
            key={pillar.title}
            delay={i * 70}
            className="rounded-xl border border-border bg-card p-6"
          >
            <h3 className="text-base font-bold text-brand-ink">{pillar.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{pillar.text}</p>
          </Reveal>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <PageHero
        eyebrow={t(`${p}.heroEyebrow` as DictKey)}
        title={t(`${p}.heroTitle` as DictKey)}
        description={t(`${p}.heroDesc` as DictKey)}
      />

      <Section>
        <div className="grid items-center gap-14 lg:grid-cols-2">
          {format === "fresh" ? (
            <>
              {imageBlock}
              {pillarsBlock}
            </>
          ) : (
            <>
              {pillarsBlock}
              {imageBlock}
            </>
          )}
        </div>
      </Section>

      <Section tone="surface">
        <SectionHeader
          eyebrow={t(`${p}.linesEyebrow` as DictKey)}
          title={t(`${p}.linesTitle` as DictKey, { count })}
          description={t(`${p}.linesDesc` as DictKey)}
        />
        <div className="mt-14">
          <ProductExplorer scope={format} />
        </div>
        <Reveal className="mt-10">
          <Button asChild variant="outline">
            <ALink to="/products">
              {t("common.allProducts")} <ArrowRight aria-hidden />
            </ALink>
          </Button>
        </Reveal>
      </Section>

      <Section>
        <SectionHeader
          eyebrow={t(`${p}.logEyebrow` as DictKey)}
          title={t(`${p}.logTitle` as DictKey)}
          description={t(`${p}.logDesc` as DictKey)}
        />
        <LaneGrid className="mt-14" />
      </Section>

      <FinalCta />
    </>
  );
}
