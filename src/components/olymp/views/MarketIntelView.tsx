"use client";

import { Ship, CalendarDays, FileText, BadgeCheck, LineChart, Sparkles, Anchor, MoonStar } from "lucide-react";
import { Section, SectionHeader, PageHero } from "@/components/olymp/Section";
import { Reveal } from "@/components/olymp/Reveal";
import { useI18n } from "@/i18n";
import { PORTS, HOLIDAYS_2026, INCOTERMS, CERTIFICATIONS, CONTEXT_NOTES } from "@/data/market-intel";

/**
 * Market Intel — the Egyptian-market knowledge base as a buyer-facing hub:
 * export ports, 2026 holiday closures that hit shipping schedules, the
 * Incoterms 2020 buyer reference, certification requirements and currency /
 * logistics context. The same data grounds the AI Trade Copilot.
 */
export default function MarketIntelView() {
  const { t } = useI18n();

  const openCopilot = () => {
    window.dispatchEvent(new CustomEvent("olympex:copilot"));
  };

  return (
    <>
      <PageHero
        eyebrow={t("intel.heroEyebrow")}
        title={t("intel.heroTitle")}
        description={t("intel.heroDesc")}
      />

      {/* Ports */}
      <Section>
        <SectionHeader
          eyebrow={t("intel.portsEyebrow")}
          title={t("intel.portsTitle")}
          description={t("intel.portsDesc")}
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {PORTS.map((p, i) => (
            <Reveal key={p.name} delay={i * 60} className="h-full">
              <article className="flex h-full flex-col rounded-2xl border border-border bg-background p-6 shadow-soft">
                <div className="flex items-center gap-3">
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Anchor className="size-5" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-semibold">{p.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {p.location} · {p.sea}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm font-medium text-foreground/90">{p.type}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.note}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Holidays 2026 */}
      <Section tone="surface">
        <SectionHeader
          eyebrow={t("intel.holidaysEyebrow")}
          title={t("intel.holidaysTitle")}
          description={t("intel.holidaysDesc")}
        />
        <Reveal className="mt-10 overflow-hidden rounded-2xl border border-border bg-background shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[36rem] text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-start">
                  <th scope="col" className="px-5 py-3 text-start text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {t("intel.colDate")}
                  </th>
                  <th scope="col" className="px-5 py-3 text-start text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {t("intel.colHoliday")}
                  </th>
                  <th scope="col" className="px-5 py-3 text-start text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {t("intel.colImpact")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {HOLIDAYS_2026.map((h) => (
                  <tr key={h.name} className="border-b border-border/60 last:border-0">
                    <td className="whitespace-nowrap px-5 py-3.5 font-medium">{h.date}</td>
                    <td className="px-5 py-3.5">
                      {h.name}
                      {!h.fixed && (
                        <span className="ms-2 inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[0.65rem] font-medium text-accent-deep">
                          <MoonStar className="size-3" aria-hidden />
                          {t("intel.lunar")}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">{h.impact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
        <p className="mt-4 text-xs text-muted-foreground">{t("intel.holidaysNote")}</p>
      </Section>

      {/* Incoterms */}
      <Section>
        <SectionHeader
          eyebrow={t("intel.incotermsEyebrow")}
          title={t("intel.incotermsTitle")}
          description={t("intel.incotermsDesc")}
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {INCOTERMS.map((term, i) => (
            <Reveal key={term.code} delay={i * 30} className="h-full">
              <article className="h-full rounded-xl border border-border bg-background p-5">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="text-lg font-extrabold tracking-wide text-gradient-brand">{term.code}</h3>
                  <p className="text-[0.7rem] font-medium uppercase tracking-wider text-muted-foreground">
                    {t("intel.risk")}: {term.risk}
                  </p>
                </div>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{term.buyer}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Certifications */}
      <Section tone="surface">
        <SectionHeader
          eyebrow={t("intel.certsEyebrow")}
          title={t("intel.certsTitle")}
          description={t("intel.certsDesc")}
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {CERTIFICATIONS.map((c, i) => (
            <Reveal key={c.name} delay={i * 50} className="h-full">
              <article className="flex h-full flex-col rounded-2xl border border-border bg-background p-6 shadow-soft">
                <div className="flex items-center gap-3">
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent-deep">
                    <BadgeCheck className="size-5" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-semibold">{c.name}</h3>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{c.who}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{c.detail}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Currency & logistics context */}
      <Section>
        <SectionHeader
          eyebrow={t("intel.contextEyebrow")}
          title={t("intel.contextTitle")}
          description={t("intel.contextDesc")}
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {CONTEXT_NOTES.map((n, i) => (
            <Reveal key={n.title} delay={i * 60} className="h-full">
              <article className="flex h-full gap-4 rounded-2xl border border-border bg-background p-6">
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {i % 2 === 0 ? <LineChart className="size-5" aria-hidden /> : <Ship className="size-5" aria-hidden />}
                </span>
                <div>
                  <h3 className="font-semibold">{n.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{n.detail}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 text-xs text-muted-foreground">{t("intel.contextNote")}</p>
      </Section>

      {/* Copilot CTA */}
      <Section tone="surface">
        <Reveal>
          <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-background p-10 text-center shadow-soft">
            <span
              className="mx-auto inline-flex size-12 items-center justify-center rounded-2xl text-primary-foreground shadow-soft"
              style={{ background: "var(--gradient-brand)" }}
            >
              <Sparkles className="size-6" aria-hidden />
            </span>
            <h2 className="mt-5 text-2xl font-bold tracking-tight">{t("intel.ctaTitle")}</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
              {t("intel.ctaDesc")}
            </p>
            <button
              type="button"
              onClick={openCopilot}
              className="mt-7 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-all hover:bg-primary-deep"
            >
              <Sparkles className="size-4" aria-hidden />
              {t("intel.ctaButton")}
            </button>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
