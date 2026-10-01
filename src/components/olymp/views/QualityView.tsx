"use client";

import { ShieldCheck, FileCheck2, Thermometer, ScanLine } from "lucide-react";
import { Section, SectionHeader, PageHero } from "@/components/olymp/Section";
import { Reveal } from "@/components/olymp/Reveal";
import { JourneyTimeline } from "@/components/olymp/Logistics";
import { FinalCta } from "@/components/olymp/CTA";
import { useI18n } from "@/i18n";
import type { DictKey } from "@/i18n/locales/en";

const controls: { icon: typeof ScanLine; tk: DictKey; dk: DictKey }[] = [
  { icon: ScanLine, tk: "quality.c1t", dk: "quality.c1d" },
  { icon: ShieldCheck, tk: "quality.c2t", dk: "quality.c2d" },
  { icon: Thermometer, tk: "quality.c3t", dk: "quality.c3d" },
  { icon: FileCheck2, tk: "quality.c4t", dk: "quality.c4d" },
];

const standardKeys: DictKey[] = [
  "quality.s1",
  "quality.s2",
  "quality.s3",
  "quality.s4",
  "quality.s5",
  "quality.s6",
];

export default function QualityView() {
  const { t } = useI18n();

  return (
    <>
      <PageHero
        eyebrow={t("quality.heroEyebrow")}
        title={t("quality.heroTitle")}
        description={t("quality.heroDesc")}
      />

      <Section>
        <JourneyTimeline />
      </Section>

      <Section tone="surface">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal className="overflow-hidden rounded-2xl border border-border shadow-soft">
            <img
              src="/images/cold-chain.jpg"
              alt={t("alt.coldChain")}
              width={1600}
              height={1000}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </Reveal>
          <div>
            <SectionHeader
              eyebrow={t("quality.controlsEyebrow")}
              title={t("quality.controlsTitle")}
            />
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {controls.map((c, i) => (
                <Reveal
                  key={c.tk}
                  delay={i * 70}
                  className="rounded-xl border border-border bg-card p-6"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-primary/25 bg-primary/5 text-primary">
                    <c.icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="mt-5 text-base font-bold text-brand-ink">{t(c.tk)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(c.dk)}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeader
          eyebrow={t("quality.standEyebrow")}
          title={t("quality.standTitle")}
          description={t("quality.standDesc")}
        />
        <ul className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {standardKeys.map((key, i) => (
            <Reveal as="li" key={key} delay={i * 50} className="bg-card p-7">
              <span className="inline-block h-1 w-8 bg-primary" aria-hidden />
              <p className="mt-4 text-sm font-semibold text-brand-ink">{t(key)}</p>
            </Reveal>
          ))}
        </ul>
      </Section>

      <FinalCta />
    </>
  );
}
