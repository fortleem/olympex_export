"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section, SectionHeader, PageHero } from "@/components/olymp/Section";
import { Reveal } from "@/components/olymp/Reveal";
import { ProductExplorer } from "@/components/olymp/ProductExplorer";
import { LaneGrid } from "@/components/olymp/Logistics";
import { FinalCta } from "@/components/olymp/CTA";
import { ALink } from "@/lib/router";
import { freshProducts, frozenProducts } from "@/data/products";

/**
 * Shared template for the Fresh-produce and Frozen-produce pages.
 *
 * The two pages used to be ~95% duplicated code; they are now one layout
 * with per-format copy. Both pages embed the full ProductExplorer, so the
 * month-availability filter and CSV export work everywhere products are
 * listed — no more fragmenting the catalogue across sections.
 */

export interface FormatViewProps {
  /** Which format this page presents (locks the explorer scope). */
  format: "fresh" | "frozen";
  /** PageHero copy. */
  hero: { eyebrow: string; title: string; description: string };
  /** "How we handle …" section copy. */
  handling: { eyebrow: string; title: string };
  /** Four capability pillars under the handling header. */
  pillars: { title: string; text: string }[];
  /** Feature image beside the pillars. */
  image: { src: string; alt: string; width: number; height: number };
  /** Side the image sits on — "left" or "right" of the pillars. */
  imageSide?: "left" | "right";
  /** Section header above the explorer. */
  lines: { eyebrow: string; title: string; description: string };
  /** Logistics section copy. */
  logistics: { eyebrow: string; title: string; description: string };
}

export function FormatView({
  format,
  hero,
  handling,
  pillars,
  image,
  imageSide = "left",
  lines,
  logistics,
}: FormatViewProps) {
  const count = format === "fresh" ? freshProducts.length : frozenProducts.length;
  const imageBlock = (
    <Reveal className="overflow-hidden rounded-2xl border border-border shadow-soft">
      <img
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        loading="lazy"
        className="aspect-[4/3] h-full w-full object-cover"
      />
    </Reveal>
  );
  const pillarsBlock = (
    <div>
      <SectionHeader eyebrow={handling.eyebrow} title={handling.title} />
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
  );

  return (
    <>
      <PageHero eyebrow={hero.eyebrow} title={hero.title} description={hero.description} />

      <Section>
        <div className="grid items-center gap-14 lg:grid-cols-2">
          {imageSide === "left" ? (
            <>
              {imageBlock}
              {pillarsBlock}
            </>
          ) : (
            <>
              {pillarsBlock}
              {imageBlock}
            </>
          )}
        </div>
      </Section>

      <Section tone="surface">
        <SectionHeader
          eyebrow={lines.eyebrow}
          title={lines.title.replace("{count}", String(count))}
          description={lines.description}
        />
        <div className="mt-14">
          <ProductExplorer scope={format} />
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
          eyebrow={logistics.eyebrow}
          title={logistics.title}
          description={logistics.description}
        />
        <LaneGrid className="mt-14" />
      </Section>

      <FinalCta />
    </>
  );
}
