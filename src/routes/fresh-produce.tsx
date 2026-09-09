import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section, SectionHeader, PageHero } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { ProductCard } from "@/components/site/ProductCard";
import { LaneGrid } from "@/components/site/Logistics";
import { products } from "@/data/products";
import { FinalCta } from "./index";
import freshImg from "@/assets/fresh-produce.jpg";

export const Route = createFileRoute("/fresh-produce")({
  head: () => ({
    meta: [
      { title: "Fresh Produce Export from Egypt — Olymp Ex" },
      {
        name: "description",
        content:
          "Fresh Egyptian fruits and vegetables: rapid pre-cooling, calibre grading and destination-specific packing for retail, wholesale and food-service programmes.",
      },
      { property: "og:title", content: "Fresh Produce Export from Egypt — Olymp Ex" },
      {
        property: "og:description",
        content: "Pre-cooled, calibre-graded Egyptian fresh produce shipped by reefer and air.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/fresh-produce" }],
  }),
  component: FreshProduce,
});

const pillars = [
  { title: "Pre-cooling", text: "Field heat removed shortly after harvest to protect firmness and shelf life." },
  { title: "Grading", text: "Calibre, colour and defect grading against the agreed buyer specification." },
  { title: "Packing", text: "Punnets, flow-packs, cartons and private-label presentation." },
  { title: "Dispatch", text: "Air freight for short-shelf-life lines, reefer sea freight for volume." },
];

function FreshProduce() {
  const fresh = products.filter((p) => p.formats.includes("fresh"));
  return (
    <>
      <PageHero
        eyebrow="Fresh produce"
        title="Harvest condition, held all the way to your warehouse"
        description="Our fresh programmes are built around the shortest possible interval between picking, cooling and loading — the single biggest determinant of arrival quality."
      />

      <Section>
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal className="overflow-hidden rounded-2xl border border-border shadow-soft">
            <img
              src={freshImg}
              alt="Freshly graded Egyptian vegetables being packed for export"
              width={1280}
              height={960}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </Reveal>
          <div>
            <SectionHeader
              eyebrow="How we handle fresh"
              title="Four controls that decide arrival quality"
            />
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {pillars.map((p, i) => (
                <Reveal key={p.title} delay={i * 70} className="rounded-xl border border-border bg-card p-6">
                  <h3 className="text-base font-bold text-brand-ink">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section tone="surface">
        <SectionHeader eyebrow="Fresh lines" title="Available in fresh format" />
        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {fresh.map((p, i) => (
            <Reveal key={p.slug} delay={i * 60}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10">
          <Button asChild variant="outline">
            <Link to="/products">
              All products <ArrowRight aria-hidden />
            </Link>
          </Button>
        </Reveal>
      </Section>

      <Section>
        <SectionHeader
          eyebrow="Logistics"
          title="Where fresh consignments go"
          description="Indicative transit windows from Egyptian gateways."
        />
        <LaneGrid className="mt-14" />
      </Section>

      <FinalCta />
    </>
  );
}
