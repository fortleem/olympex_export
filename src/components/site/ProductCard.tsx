import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/data/products";
import { Badge } from "@/components/ui/badge";

export function FormatBadge({ format }: { format: "fresh" | "frozen" }) {
  return (
    <Badge
      variant="outline"
      className={
        format === "fresh"
          ? "border-primary/30 bg-primary/5 text-primary"
          : "border-accent/30 bg-accent/5 text-accent"
      }
    >
      {format === "fresh" ? "Fresh" : "Frozen / IQF"}
    </Badge>
  );
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group relative flex h-full flex-col justify-between border border-border bg-card p-6 transition-all duration-500 hover:-translate-y-1 hover:border-primary/40 hover:shadow-elevated md:p-7">
      <div
        className="field-motif pointer-events-none absolute inset-x-0 top-0 h-1 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden
      />
      <div>
        <div className="flex flex-wrap items-center gap-2">
          {product.formats.map((f) => (
            <FormatBadge key={f} format={f} />
          ))}
        </div>
        <h3 className="mt-5 text-xl font-bold">
          <Link to="/products/$slug" params={{ slug: product.slug }} className="after:absolute after:inset-0">
            {product.name}
          </Link>
        </h3>
        {product.latin ? (
          <p className="mt-1 font-[family-name:var(--font-display)] text-sm italic text-muted-foreground">
            {product.latin}
          </p>
        ) : null}
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{product.summary}</p>
      </div>

      <dl className="mt-6 space-y-2.5 border-t border-border pt-5 text-xs">
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Origin</dt>
          <dd className="text-right font-semibold">{product.origin}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Season</dt>
          <dd className="text-right font-semibold">{product.season}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Packaging</dt>
          <dd className="text-right font-semibold">{product.packaging[0]}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Availability</dt>
          <dd className="text-right font-semibold text-accent">{product.availability}</dd>
        </div>
      </dl>

      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
        View specification
        <ArrowUpRight
          className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden
        />
      </span>
    </article>
  );
}
