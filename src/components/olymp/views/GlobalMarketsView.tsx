"use client";

import { Section, SectionHeader, PageHero } from "@/components/olymp/Section";
import { Reveal } from "@/components/olymp/Reveal";
import { LaneGrid, JourneyTimeline } from "@/components/olymp/Logistics";
import { FinalCta, ExportDiagram } from "@/components/olymp/CTA";
import { freightModes } from "@/data/logistics";

export default function GlobalMarketsView() {
  return (
    <>
      <PageHero
        eyebrow="Global markets"
        title="Egyptian origin, connected to the world's buying centres"
        description="Olymp Ex ships from Egypt's main gateways into Europe, the Gulf, the United Kingdom, Asia and the Americas. Transit windows below are indicative and confirmed per booking."
      />

      <Section>
        <SectionHeader
          eyebrow="Logistics"
          title="Destination lanes & indicative transit"
          description="Core lanes we operate against, with the gateway ports most frequently used for each region."
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
              eyebrow="Freight & paperwork"
              title="Routing, temperature and documentation handled together"
              description="One commercial team coordinates the booking, the cold chain and the shipping set, so your clearance is not waiting on a missing certificate."
            />
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {freightModes.map((f, i) => (
                <Reveal
                  key={f.title}
                  delay={i * 70}
                  className="rounded-xl border border-border bg-card p-6"
                >
                  <h3 className="text-base font-bold text-brand-ink">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
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
