"use client";

import { Droplets, Recycle, Users, Sun } from "lucide-react";
import { Section, SectionHeader, PageHero } from "@/components/olymp/Section";
import { Reveal } from "@/components/olymp/Reveal";
import { FinalCta } from "@/components/olymp/CTA";

const pillars = [
  { icon: Users, title: "Grower partnerships", text: "Multi-season agreements that give farms planning certainty instead of spot-market churn." },
  { icon: Droplets, title: "Water efficiency", text: "Preference for growers applying drip irrigation and monitored water budgets." },
  { icon: Recycle, title: "Packaging review", text: "Ongoing move toward recyclable, reduced-material and right-sized formats." },
  { icon: Sun, title: "Energy in the chain", text: "Cold-store scheduling and load consolidation to reduce energy per shipped tonne." },
];

export default function SustainabilityView() {
  return (
    <>
      <PageHero
        eyebrow="Sustainability"
        title="Responsible sourcing is how the supply stays reliable"
        description="Long-term relationships with growers, careful use of water and packaging, and accurate planning that keeps good produce out of the waste stream."
      />

      <Section>
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeader
              eyebrow="Our commitments"
              title="Four areas we hold ourselves to"
              description="Practical commitments rather than broad claims — each one is visible in how we buy, pack and ship."
            />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:col-span-7">
            {pillars.map((p, i) => (
              <Reveal
                key={p.title}
                delay={i * 70}
                className="rounded-xl border border-border bg-card p-7"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-accent/25 bg-accent/5 text-accent">
                  <p.icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-5 text-base font-bold text-brand-ink">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
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
              alt="Irrigated Egyptian farmland in neat cultivated rows"
              width={1600}
              height={900}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </Reveal>
          <div>
            <SectionHeader
              eyebrow="Community"
              title="Value that stays in the growing regions"
              description="Fair, timely settlement with contracted farms, seasonal employment in pack houses, and technical feedback that helps growers meet export grade more consistently."
            />
          </div>
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
