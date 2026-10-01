"use client";

import { PageHero, Section } from "@/components/olymp/Section";
import { ProductExplorer } from "@/components/olymp/ProductExplorer";
import { FinalCta } from "@/components/olymp/CTA";
import { products } from "@/data/products";
import { useI18n } from "@/i18n";

/**
 * Full catalogue — one thin composition over the shared ProductExplorer,
 * so this page and the fresh/frozen pages expose exactly the same
 * listing capabilities (filters, month availability, CSV export).
 */
export default function ProductsView() {
  const { t } = useI18n();

  return (
    <>
      <PageHero
        eyebrow={t("products.heroEyebrow")}
        title={t("products.heroTitle")}
        description={t("products.heroDesc", { count: products.length })}
      />

      <Section>
        <ProductExplorer scope="all" />
      </Section>

      <FinalCta />
    </>
  );
}
