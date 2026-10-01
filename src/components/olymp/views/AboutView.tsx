"use client";

import { Section, SectionHeader, PageHero } from "@/components/olymp/Section";
import { Reveal } from "@/components/olymp/Reveal";
import { FinalCta } from "@/components/olymp/CTA";
import { useI18n } from "@/i18n";

export default function AboutView() {
  const { t } = useI18n();

  return (
    <>
      <PageHero
        eyebrow={t("about.heroEyebrow")}
        title={t("about.heroTitle")}
        description={t("about.heroDesc")}
      />

      <Section>
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionHeader
              eyebrow={t("about.posEyebrow")}
              title={t("about.posTitle")}
              description={t("about.posDesc")}
            />
            <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground">
              <p>{t("about.p1")}</p>
              <p>{t("about.p2")}</p>
            </div>
          </div>
          <Reveal className="lg:col-span-5">
            <img
              src="/images/egypt-fields.jpg"
              alt={t("alt.aboutFields")}
              width={1600}
              height={900}
              loading="lazy"
              className="h-full w-full border border-border object-cover"
            />
          </Reveal>
        </div>
      </Section>

      <Section tone="surface">
        <SectionHeader
          eyebrow={t("about.valuesEyebrow")}
          title={t("about.valuesTitle")}
        />
        <div className="mt-14 grid gap-px border border-border bg-border md:grid-cols-2 xl:grid-cols-4">
          {(
            [
              ["about.v1t", "about.v1d"],
              ["about.v2t", "about.v2d"],
              ["about.v3t", "about.v3d"],
              ["about.v4t", "about.v4d"],
            ] as const
          ).map(([tk, dk], i) => (
            <Reveal key={tk} delay={i * 70} className="bg-card p-8">
              <span className="font-[family-name:var(--font-display)] text-3xl text-border">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-5 text-lg font-bold">{t(tk)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(dk)}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
