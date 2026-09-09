import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionHeader, PageHero } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { LaneGrid, JourneyTimeline } from "@/components/site/Logistics";
import { freightModes } from "@/data/logistics";
import { FinalCta, ExportDiagram } from "./index";

export const Route = createFileRoute("/global-markets")({
  head: () => ({
    meta: [
      { title: "Global Markets & Logistics — Olymp Ex Egypt" },
      {
        name: "description",
        content:
          "Reefer sea freight and air freight from Alexandria, Sokhna and Cairo to the EU, Gulf & MENA, UK, Asia and the Americas with indicative transit times.",
      },
      { property: "og:title", content: "Global Markets & Logistics — Olymp Ex" },
      {
        property: "og:description",
        content: "Destination lanes, transit times and export documentation from Egypt.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/global-markets" }],
  }),
  component: GlobalMarkets,
});

function GlobalMarkets() {
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
                <Reveal key={f.title} delay={i * 70} className="rounded-xl border border-border bg-card p-6">
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
