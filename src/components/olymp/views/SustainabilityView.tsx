"use client";

import { Droplets, Recycle, Users, Sun } from "lucide-react";
import { Section, SectionHeader, PageHero } from "@/components/olymp/Section";
import { Reveal } from "@/components/olymp/Reveal";
import { FinalCta } from "@/components/olymp/CTA";
import { useI18n } from "@/i18n";
import type { DictKey } from "@/i18n/locales/en";

const pillars: { icon: typeof Users; tk: DictKey; dk: DictKey }[] = [
  { icon: Users, tk: "sustain.p1t", dk: "sustain.p1d" },
  { icon: Droplets, tk: "sustain.p2t", dk: "sustain.p2d" },
  { icon: Recycle, tk: "sustain.p3t", dk: "sustain.p3d" },
  { icon: Sun, tk: "sustain.p4t", dk: "sustain.p4d" },
];

export default function SustainabilityView() {
  const { t } = useI18n();

  return (
    <>
      <PageHero
        eyebrow={t("sustain.heroEyebrow")}
        title={t("sustain.heroTitle")}
        description={t("sustain.heroDesc")}
      />

      <Section>
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeader
              eyebrow={t("sustain.commitEyebrow")}
              title={t("sustain.commitTitle")}
              description={t("sustain.commitDesc")}
            />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:col-span-7">
            {pillars.map((p, i) => (
              <Reveal
                key={p.tk}
                delay={i * 70}
                className="h-full rounded-xl border border-border bg-card p-7"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-accent/25 bg-accent/5 text-accent">
                  <p.icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-5 text-base font-bold text-brand-ink">{t(p.tk)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(p.dk)}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <Section tone="surface">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal className="overflow-hidden rounded-2xl border border-border shadow-soft">
            <img
              src="/images/egypt-fields.jpg"
              alt={t("alt.sustainFields")}
              width={1600}
              height={900}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </Reveal>
          <div>
            <SectionHeader
              eyebrow={t("sustain.communityEyebrow")}
              title={t("sustain.communityTitle")}
              description={t("sustain.communityDesc")}
            />
          </div>
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
