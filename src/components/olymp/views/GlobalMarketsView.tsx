"use client";

import { Section, SectionHeader, PageHero } from "@/components/olymp/Section";
import { Reveal } from "@/components/olymp/Reveal";
import { LaneGrid, JourneyTimeline } from "@/components/olymp/Logistics";
import { FinalCta, ExportDiagram } from "@/components/olymp/CTA";
import { EGYPT_TRADE_STATS } from "@/data/products";
import { useI18n } from "@/i18n";
import type { DictKey } from "@/i18n/locales/en";

const freightKeys: [DictKey, DictKey][] = [
  ["markets.f1t", "markets.f1d"],
  ["markets.f2t", "markets.f2d"],
  ["markets.f3t", "markets.f3d"],
  ["markets.f4t", "markets.f4d"],
];

export default function GlobalMarketsView() {
  const { t } = useI18n();

  return (
    <>
      <PageHero
        eyebrow={t("markets.heroEyebrow")}
        title={t("markets.heroTitle")}
        description={t("markets.heroDesc")}
      />

      <Section>
        <SectionHeader
          eyebrow={t("markets.statsEyebrow")}
          title={t("markets.statsTitle")}
          description={t("markets.statsDesc")}
        />
        <div className="mt-14 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {EGYPT_TRADE_STATS.map((s, i) => (
            <Reveal
              key={s.value}
              delay={i * 60}
              className="bg-card p-7"
            >
              <p className="text-4xl font-extrabold text-gradient-brand">{s.value}</p>
              <p className="mt-3 text-sm font-bold">
                {t(`markets.stat${i + 1}l` as DictKey)}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {t(`markets.stat${i + 1}n` as DictKey)}
              </p>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 text-xs text-muted-foreground/80">{t("markets.statsSource")}</p>
      </Section>

      <Section>
        <SectionHeader
          eyebrow={t("markets.lanesEyebrow")}
          title={t("markets.lanesTitle")}
          description={t("markets.lanesDesc")}
        />
        <LaneGrid className="mt-14" />
      </Section>

      <Section tone="surface">
        <JourneyTimeline />
      </Section>

      <Section>
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <SectionHeader
              eyebrow={t("markets.freightEyebrow")}
              title={t("markets.freightTitle")}
              description={t("markets.freightDesc")}
            />
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {freightKeys.map(([tk, dk], i) => (
                <Reveal
                  key={tk}
                  delay={i * 70}
                  className="rounded-xl border border-border bg-card p-6"
                >
                  <h3 className="text-base font-bold text-brand-ink">{t(tk)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(dk)}</p>
                </Reveal>
              ))}
            </div>
          </div>
          <Reveal className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-surface">
            <div className="grid-motif absolute inset-0 opacity-70" aria-hidden />
            <ExportDiagram />
          </Reveal>
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
