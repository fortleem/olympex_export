import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionHeader, PageHero } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { FinalCta } from "./index";
import fieldsImg from "@/assets/egypt-fields.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Olymp Ex — Egyptian Agritrade Export Company" },
      {
        name: "description",
        content:
          "Olymp Ex pairs Egypt's agricultural heritage with modern export discipline, serving importers and distributors as a dependable trading partner.",
      },
      { property: "og:title", content: "About Olymp Ex" },
      {
        property: "og:description",
        content: "Egypt's agricultural heritage, run with modern export discipline.",
      },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

function About() {
  return (
    <>
      <PageHero
        eyebrow="About Olymp Ex"
        title="A modern Egyptian gateway for premium agricultural products"
        description="Olymp Ex exists to make Egyptian produce easy to buy internationally: clearly specified, consistently handled and delivered against commitments."
      />

      <Section>
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionHeader
              eyebrow="Our position"
              title="A trading partner, not a farm gate"
              description="We operate between Egyptian growing regions and international buyers. That means variety selection, grading standards, packing formats, cold chain and documentation are handled as one coordinated process rather than passed between disconnected parties."
            />
            <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground">
              <p>
                Egypt has cultivated the Nile basin for millennia. What has changed is the
                discipline around it: irrigation, variety science, post-harvest handling and
                temperature control now decide whether fruit arrives in condition.
              </p>
              <p>
                Olymp Ex is built around that modern layer. We commit to programmes ahead of the
                season, hold suppliers to written specifications, and keep buyers informed when
                conditions change — because credibility in trade is built on accurate information,
                not optimistic promises.
              </p>
            </div>
          </div>
          <Reveal className="lg:col-span-5">
            <img
              src={fieldsImg}
              alt="Irrigated agricultural fields in Egypt"
              width={1600}
              height={900}
              loading="lazy"
              className="h-full w-full border border-border object-cover"
            />
          </Reveal>
        </div>
      </Section>

      <Section tone="surface">
        <SectionHeader eyebrow="What we stand for" title="Principles that shape every shipment" />
        <div className="mt-14 grid gap-px border border-border bg-border md:grid-cols-2 xl:grid-cols-4">
          {[
            { t: "Precision", d: "Specifications are written, agreed and checked — not assumed." },
            { t: "Provenance", d: "Every lot is tied back to its source and handling record." },
            { t: "Partnership", d: "Multi-season relationships with growers and buyers alike." },
            { t: "Perspective", d: "Egyptian roots, international standards and expectations." },
          ].map((v, i) => (
            <Reveal key={v.t} delay={i * 70} className="bg-card p-8">
              <span className="font-[family-name:var(--font-display)] text-3xl text-border">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-5 text-lg font-bold">{v.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.d}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
