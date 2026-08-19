import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { ProductCard } from "@/components/site/ProductCard";
import { products } from "@/data/products";
import { cn } from "@/lib/utils";
import { FinalCta } from "./index";

export const Route = createFileRoute("/products/")({
  head: () => ({
    meta: [
      { title: "Products — Egyptian Fresh & Frozen Produce | Olymp Ex" },
      {
        name: "description",
        content:
          "Browse Olymp Ex export lines: strawberries, grapes, citrus, pomegranates, onions, potatoes, green beans, peas and IQF vegetable blends from Egypt.",
      },
      { property: "og:title", content: "Products — Olymp Ex" },
      {
        property: "og:description",
        content: "Egyptian fresh and IQF frozen fruits and vegetables, packed to specification.",
      },
      { property: "og:url", content: "/products" },
    ],
    links: [{ rel: "canonical", href: "/products" }],
  }),
  component: Products,
});

const filters = [
  { id: "all", label: "All products" },
  { id: "fresh", label: "Fresh" },
  { id: "frozen", label: "Frozen / IQF" },
  { id: "fruit", label: "Fruits" },
  { id: "vegetable", label: "Vegetables" },
] as const;

function Products() {
  const [active, setActive] = useState<(typeof filters)[number]["id"]>("all");

  const list = useMemo(
    () =>
      products.filter((p) => {
        if (active === "all") return true;
        if (active === "fresh" || active === "frozen") return p.formats.includes(active);
        return p.category === active;
      }),
    [active],
  );

  return (
    <>
      <PageHero
        eyebrow="Product portfolio"
        title="Egyptian produce, specified for international buyers"
        description="Representative lines with editable placeholders for origin, format, seasonality, packaging and availability. Confirmed data is issued per programme."
      />

      <Section>
        <div
          role="group"
          aria-label="Filter products"
          className="flex flex-wrap gap-2 border-b border-border pb-6"
        >
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setActive(f.id)}
              aria-pressed={active === f.id}
              className={cn(
                "rounded-md border px-4 py-2 text-sm font-semibold transition-colors",
                active === f.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-primary hover:text-primary",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <p className="mt-6 text-sm text-muted-foreground" aria-live="polite">
          Showing {list.length} of {products.length} lines
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {list.map((p, i) => (
            <Reveal key={p.slug} delay={i * 50}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
