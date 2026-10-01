"use client";

import { PageHero, Section } from "@/components/olymp/Section";
import { ProductExplorer } from "@/components/olymp/ProductExplorer";
import { FinalCta } from "@/components/olymp/CTA";
import { products } from "@/data/products";

/**
 * Full catalogue — one thin composition over the shared ProductExplorer,
 * so this page and the fresh/frozen pages expose exactly the same
 * listing capabilities (filters, month availability, CSV export).
 */
export default function ProductsView() {
  return (
    <>
      <PageHero
        eyebrow="Product portfolio"
        title="Egyptian produce, specified for international buyers"
        description={`Every line carries its Egyptian export window, cold-chain temperature, ventilation and humidity — ${products.length} fresh and frozen programmes compiled from export-trade and postharvest references.`}
      />

      <Section>
        <ProductExplorer scope="all" />
      </Section>

      <FinalCta />
    </>
  );
}
