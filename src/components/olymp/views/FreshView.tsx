"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section, SectionHeader, PageHero } from "@/components/olymp/Section";
import { Reveal } from "@/components/olymp/Reveal";
import { ProductCard } from "@/components/olymp/ProductCard";
import { LaneGrid } from "@/components/olymp/Logistics";
import { FinalCta } from "@/components/olymp/CTA";
import { ALink } from "@/lib/router";
import { products } from "@/data/products";

const pillars = [
  { title: "Pre-cooling", text: "Field heat removed shortly after harvest to protect firmness and shelf life." },
  { title: "Grading", text: "Calibre, colour and defect grading against the agreed buyer specification." },
  { title: "Packing", text: "Punnets, flow-packs, cartons and private-label presentation." },
  { title: "Dispatch", text: "Air freight for short-shelf-life lines, reefer sea freight for volume." },
];

export default function FreshView() {
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
              src="/images/fresh-produce.jpg"
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
                <Reveal
                  key={p.title}
                  delay={i * 70}
                  className="rounded-xl border border-border bg-card p-6"
                >
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
            <ALink to="/products">
              All products <ArrowRight aria-hidden />
            </ALink>
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
