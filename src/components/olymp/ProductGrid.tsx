"use client";

import type { Product } from "@/data/products";
import { Reveal } from "@/components/olymp/Reveal";
import { ProductCard } from "@/components/olymp/ProductCard";
import { cn } from "@/lib/utils";

/**
 * The one product-card grid used everywhere products are listed —
 * homepage featured lines, the catalogue explorer, the fresh/frozen
 * format pages and related lines on detail pages.
 */
export function ProductGrid({
  products,
  className,
  reveal = true,
}: {
  products: Product[];
  className?: string;
  /** Set false when cards sit inside an already-revealing container. */
  reveal?: boolean;
}) {
  if (products.length === 0) return null;
  return (
    <div className={cn("grid gap-6 md:grid-cols-2 xl:grid-cols-3", className)}>
      {products.map((p, i) =>
        reveal ? (
          <Reveal key={p.slug} delay={(i % 6) * 60} className="h-full">
            <ProductCard product={p} />
          </Reveal>
        ) : (
          <ProductCard key={p.slug} product={p} />
        ),
      )}
    </div>
  );
}
