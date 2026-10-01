"use client";

import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { PageHero, Section } from "@/components/olymp/Section";
import { Reveal } from "@/components/olymp/Reveal";
import { ProductCard } from "@/components/olymp/ProductCard";
import { FinalCta } from "@/components/olymp/CTA";
import { MONTH_LETTER, MONTH_SHORT, monthsLabel, products } from "@/data/products";
import { cn } from "@/lib/utils";

const filters = [
  { id: "all", label: "All products" },
  { id: "fresh", label: "Fresh" },
  { id: "frozen", label: "Frozen / IQF" },
  { id: "fruit", label: "Fruits" },
  { id: "vegetable", label: "Vegetables" },
] as const;

type FormatFilter = (typeof filters)[number]["id"];

/** Does the product ship in `month` for the formats in scope of the filter? */
function availableIn(month: number, p: (typeof products)[number], scope: FormatFilter) {
  if (scope === "fresh" || scope === "frozen") {
    return p.calendar[scope]?.months.includes(month) ?? false;
  }
  return p.formats.some((f) => p.calendar[f]?.months.includes(month));
}

/** Client-side CSV export of the full catalogue with availability + temperatures. */
function downloadCatalogueCsv() {
  const esc = (v: string) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
  const header = [
    "Product",
    "Category",
    "Formats",
    "Season",
    "Fresh — months",
    "Fresh — temperature",
    "Fresh — humidity",
    "Fresh — shelf life",
    "IQF — months",
    "IQF — temperature",
    "IQF — shelf life",
    "Varieties",
    "Growing regions",
    "Packaging",
  ];
  const rows = products.map((p) => [
    p.name,
    p.category,
    p.formats.join(" / "),
    p.season,
    p.calendar.fresh ? monthsLabel(p.calendar.fresh.months) : "",
    p.calendar.fresh?.tempC ?? "",
    p.calendar.fresh?.rh ?? "",
    p.calendar.fresh?.shelfLife ?? "",
    p.calendar.frozen ? monthsLabel(p.calendar.frozen.months) : "",
    p.calendar.frozen?.tempC ?? "",
    p.calendar.frozen?.shelfLife ?? "",
    p.varieties.join("; "),
    p.regions,
    p.packaging.join("; "),
  ]);
  const csv = [header, ...rows].map((r) => r.map(esc).join(",")).join("\r\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "olymp-ex-product-catalogue.csv";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function ProductsView() {
  const [active, setActive] = useState<FormatFilter>("all");
  const [month, setMonth] = useState<number | null>(null);

  const list = useMemo(
    () =>
      products.filter((p) => {
        if (active === "fresh" || active === "frozen") {
          if (!p.formats.includes(active)) return false;
        } else if (active !== "all" && p.category !== active) {
          return false;
        }
        if (month !== null && !availableIn(month, p, active)) return false;
        return true;
      }),
    [active, month],
  );

  return (
    <>
      <PageHero
        eyebrow="Product portfolio"
        title="Egyptian produce, specified for international buyers"
        description={`Every line carries its Egyptian export window and cold-chain temperature — ${products.length} fresh and frozen programmes compiled from export-trade and postharvest references.`}
      />

      <Section>
        <div className="flex flex-col gap-5 border-b border-border pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div
            role="group"
            aria-label="Filter products by format and category"
            className="flex flex-wrap gap-2"
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
          <button
            type="button"
            onClick={downloadCatalogueCsv}
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-md border border-border px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-primary lg:self-auto"
          >
            <Download className="size-4" aria-hidden />
            Download catalogue (CSV)
          </button>
        </div>

        <div
          role="group"
          aria-label="Filter products by availability month"
          className="mt-6 flex flex-wrap items-center gap-2"
        >
          <span className="mr-1 text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
            Available in
          </span>
          <button
            type="button"
            onClick={() => setMonth(null)}
            aria-pressed={month === null}
            className={cn(
              "rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors",
              month === null
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:border-foreground hover:text-foreground",
            )}
          >
            Any
          </button>
          {MONTH_LETTER.map((letter, i) => {
            const m = i + 1;
            const selected = month === m;
            return (
              <button
                key={m}
                type="button"
                title={MONTH_SHORT[i]}
                aria-pressed={selected}
                aria-label={MONTH_SHORT[i]}
                onClick={() => setMonth(selected ? null : m)}
                className={cn(
                  "size-8 rounded-md border text-xs font-bold transition-colors",
                  selected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-primary hover:text-primary",
                )}
              >
                {letter}
              </button>
            );
          })}
        </div>

        <p className="mt-6 text-sm text-muted-foreground" aria-live="polite">
          Showing {list.length} of {products.length} lines
          {month !== null ? ` available in ${MONTH_SHORT[month - 1]}` : ""}
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {list.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 6) * 50}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>

        <p className="mt-10 max-w-3xl text-xs text-muted-foreground/80">
          Seasonality and temperatures are compiled from Egyptian export-trade sources and
          standard postharvest references, cross-checked against reefer setpoints used by
          Egyptian exporters. Destination-specific cold-treatment protocols are confirmed per
          programme.
        </p>
      </Section>

      <FinalCta />
    </>
  );
}
