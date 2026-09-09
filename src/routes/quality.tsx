import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, FileCheck2, Thermometer, ScanLine } from "lucide-react";
import { Section, SectionHeader, PageHero } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { JourneyTimeline } from "@/components/site/Logistics";
import { FinalCta } from "./index";
import coldChainImg from "@/assets/cold-chain.jpg";

export const Route = createFileRoute("/quality")({
  head: () => ({
    meta: [
      { title: "Quality & Traceability — Olymp Ex Egypt" },
      {
        name: "description",
        content:
          "Grower-level traceability, lot identification, laboratory testing, inspection and phytosanitary clearance across every Olymp Ex consignment.",
      },
      { property: "og:title", content: "Quality & Traceability — Olymp Ex" },
      {
        property: "og:description",
        content: "Lot-level traceability, testing and documentation on every shipment.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/quality" }],
  }),
  component: Quality,
});

const controls = [
  { icon: ScanLine, title: "Lot traceability", text: "Every pallet carries a lot code linking back to farm, harvest date and pack line." },
  { icon: ShieldCheck, title: "Inspection", text: "Incoming and outgoing inspection on condition, maturity and defect tolerance." },
  { icon: Thermometer, title: "Temperature records", text: "Pre-cooling and container temperature logged and available on request." },
  { icon: FileCheck2, title: "Documentation", text: "Phytosanitary, certificate of origin, EUR.1 and lab reports issued per shipment." },
];

const standards = [
  "GlobalG.A.P. contracted farms",
  "HACCP-based pack-house controls",
  "Residue and microbiological testing",
  "Third-party inspection on request",
  "Phytosanitary clearance",
  "Private-label spec compliance",
];

function Quality() {
  return (
    <>
      <PageHero
        eyebrow="Quality & traceability"
        title="Verified at every handover — not asserted at the end"
        description="Quality is designed into the chain: contracted farms, disciplined pack-house controls, laboratory verification and documentation that clears customs without friction."
      />

      <Section>
        <JourneyTimeline />
      </Section>

      <Section tone="surface">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal className="overflow-hidden rounded-2xl border border-border shadow-soft">
            <img
              src={coldChainImg}
              alt="Temperature-controlled cold store with palletised Egyptian export produce"
              width={1600}
              height={1000}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </Reveal>
          <div>
            <SectionHeader eyebrow="Controls" title="Four systems behind each consignment" />
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {controls.map((c, i) => (
                <Reveal key={c.title} delay={i * 70} className="rounded-xl border border-border bg-card p-6">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-primary/25 bg-primary/5 text-primary">
                    <c.icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="mt-5 text-base font-bold text-brand-ink">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.text}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeader
          eyebrow="Standards"
          title="Certification framework"
          description="Standards referenced across our sourcing and packing base. Certificates are supplied per programme."
        />
        <ul className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {standards.map((s, i) => (
            <Reveal as="li" key={s} delay={i * 50} className="bg-card p-7">
              <span className="inline-block h-1 w-8 bg-primary" aria-hidden />
              <p className="mt-4 text-sm font-semibold text-brand-ink">{s}</p>
            </Reveal>
          ))}
        </ul>
      </Section>

      <FinalCta />
    </>
  );
}
