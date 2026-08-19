import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section, Eyebrow } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { FormatBadge, ProductCard } from "@/components/site/ProductCard";
import { getProduct, products } from "@/data/products";
import { FinalCta } from "./index";
import freshImg from "@/assets/fresh-produce.jpg";
import frozenImg from "@/assets/frozen-produce.jpg";

export const Route = createFileRoute("/products/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return { meta: [{ title: "Product not found — Olymp Ex" }, { name: "robots", content: "noindex" }] };
    }
    const p = loaderData.product;
    const title = `${p.name} from Egypt — Olymp Ex`;
    return {
      meta: [
        { title },
        { name: "description", content: p.summary },
        { property: "og:title", content: title },
        { property: "og:description", content: p.summary },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `/products/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/products/${params.slug}` }],
    };
  },
  component: ProductDetail,
});

function ProductDetail() {
  const { product } = Route.useLoaderData();
  const related = products.filter((p) => p.slug !== product.slug).slice(0, 3);
  const img = product.formats.includes("fresh") ? freshImg : frozenImg;

  return (
    <>
      <header className="border-b border-border bg-surface">
        <div className="container-x py-14 md:py-20">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="size-4" aria-hidden /> All products
          </Link>
          <div className="mt-10 grid items-center gap-12 lg:grid-cols-2">
            <div>
              <Eyebrow>{product.category === "fruit" ? "Fruit" : "Vegetable"}</Eyebrow>
              <h1 className="mt-6 text-4xl font-extrabold md:text-6xl">{product.name}</h1>
              {product.latin ? (
                <p className="mt-3 font-[family-name:var(--font-display)] text-lg italic text-muted-foreground">
                  {product.latin}
                </p>
              ) : null}
              <div className="mt-6 flex flex-wrap gap-2">
                {product.formats.map((f) => (
                  <FormatBadge key={f} format={f} />
                ))}
              </div>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
                {product.detail}
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button asChild variant="hero" size="lg">
                  <Link to="/contact">
                    Request a Quote <ArrowRight aria-hidden />
                  </Link>
                </Button>
              </div>
            </div>
            <Reveal className="overflow-hidden border border-border shadow-soft">
              <img
                src={img}
                alt={`${product.name} handling at export standard`}
                width={1280}
                height={960}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </Reveal>
          </div>
        </div>
      </header>

      <Section>
        <div className="grid gap-px border border-border bg-border md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Origin", value: product.origin },
            { label: "Seasonality", value: product.season },
            { label: "Availability", value: product.availability },
            { label: "Varieties", value: product.varieties.join(", ") },
          ].map((s) => (
            <div key={s.label} className="bg-card p-7">
              <p className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-muted-foreground">
                {s.label}
              </p>
              <p className="mt-3 text-sm font-semibold">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          <div className="border border-border p-8">
            <h2 className="text-xl font-bold">Packaging options</h2>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              {product.packaging.map((p) => (
                <li key={p} className="flex items-center gap-3">
                  <span className="inline-block h-1 w-5 bg-primary" aria-hidden />
                  {p}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs text-muted-foreground/80">
              Packaging shown is representative; private-label and buyer-specific formats are
              available on request.
            </p>
          </div>
          <div className="border border-border p-8">
            <h2 className="text-xl font-bold">Handling specification</h2>
            <dl className="mt-5 space-y-4 text-sm">
              {product.specs.map((s) => (
                <div key={s.label} className="flex justify-between gap-6 border-b border-border pb-3">
                  <dt className="text-muted-foreground">{s.label}</dt>
                  <dd className="text-right font-semibold">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Section>

      <Section tone="surface">
        <h2 className="text-2xl font-extrabold md:text-3xl">Related lines</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {related.map((p, i) => (
            <Reveal key={p.slug} delay={i * 60}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
