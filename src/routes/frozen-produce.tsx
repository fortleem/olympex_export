import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section, SectionHeader, PageHero } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { ProductCard } from "@/components/site/ProductCard";
import { LaneGrid } from "@/components/site/Logistics";
import { products } from "@/data/products";
import { FinalCta } from "./index";
import frozenImg from "@/assets/frozen-produce.jpg";

export const Route = createFileRoute("/frozen-produce")({
  head: () => ({
    meta: [
      { title: "IQF Frozen Produce from Egypt — Olymp Ex" },
      {
        name: "description",
        content:
          "IQF frozen Egyptian fruits and vegetables in whole, sliced, diced and blended formats for industry, retail and food service, held at −18°C throughout.",
      },
      { property: "og:title", content: "IQF Frozen Produce from Egypt — Olymp Ex" },
      {
        property: "og:description",
        content: "Whole, sliced, diced and blended IQF formats packed to retail or bulk spec.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/frozen-produce" }],
  }),
  component: FrozenProduce,
});

const pillars = [
  { title: "Blanch & freeze", text: "Controlled blanching and IQF tunnels to lock colour, texture and sweetness." },
  { title: "Formats", text: "Whole, halved, sliced, diced and custom multi-way blends." },
  { title: "Packing", text: "400g / 1kg retail bags, 10kg bulk and private-label programmes." },
  { title: "Chain", text: "−18°C maintained from tunnel to reefer, with temperature logging." },
];

function FrozenProduce() {
  const frozen = products.filter((p) => p.formats.includes("frozen"));
  return (
    <>
      <PageHero
        eyebrow="Frozen produce"
        title="IQF programmes built for industrial consistency"
        description="Frozen supply is judged on repeatability. Our IQF lines are specified, graded and packed so every pallet in a programme behaves the same way in your process."
      />

      <Section>
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <SectionHeader eyebrow="How we handle frozen" title="From tunnel to reefer without a gap" />
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {pillars.map((p, i) => (
                <Reveal key={p.title} delay={i * 70} className="rounded-xl border border-border bg-card p-6">
                  <h3 className="text-base font-bold text-brand-ink">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
                </Reveal>
              ))}
            </div>
          </div>
          <Reveal className="overflow-hidden rounded-2xl border border-border shadow-soft">
            <img
              src={frozenImg}
              alt="Individually quick frozen Egyptian fruit and vegetables"
              width={1280}
              height={960}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </Reveal>
        </div>
      </Section>

      <Section tone="surface">
        <SectionHeader eyebrow="Frozen lines" title="Available in IQF format" />
        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {frozen.map((p, i) => (
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
          title="Where frozen consignments go"
          description="Indicative transit windows from Egyptian gateways."
        />
        <LaneGrid className="mt-14" />
      </Section>

      <FinalCta />
    </>
  );
}
