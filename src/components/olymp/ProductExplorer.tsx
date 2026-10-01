"use client";

import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import {
  monthsLabel,
  products,
  freshProducts,
  frozenProducts,
  type Product,
  type ProductFormat,
  type FormatInfo,
} from "@/data/products";
import { ProductGrid } from "@/components/olymp/ProductGrid";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n";
import type { DictKey } from "@/i18n/locales/en";

/**
 * The single product-listing experience for the whole site.
 *
 * Scope "all" powers the /products catalogue (format + category filters);
 * scopes "fresh" / "frozen" power the format pages. Every scope gets the
 * same month-of-availability filter, live count and full-column CSV export,
 * so product data is never fragmented across sections with different
 * capabilities.
 *
 * The CSV export intentionally stays in English: it is a data deliverable
 * for trade use, not part of the localized page chrome.
 */

export type ExplorerScope = "all" | "fresh" | "frozen";

type CatalogueFilter = "all" | "fresh" | "frozen" | "fruit" | "vegetable";

const catalogueFilters: { id: CatalogueFilter; key: DictKey }[] = [
  { id: "all", key: "explorer.fAll" },
  { id: "fresh", key: "explorer.fFresh" },
  { id: "frozen", key: "explorer.fFrozen" },
  { id: "fruit", key: "explorer.fFruit" },
  { id: "vegetable", key: "explorer.fVegetable" },
];

const categoryFilters: { id: CatalogueFilter; key: DictKey }[] = [
  { id: "all", key: "explorer.fAll" },
  { id: "fruit", key: "explorer.fFruit" },
  { id: "vegetable", key: "explorer.fVegetable" },
];

const csvScopeName: Record<ExplorerScope, string> = {
  all: "catalogue",
  fresh: "fresh-catalogue",
  frozen: "frozen-catalogue",
};

/** Pull a display value out of a format spec; month arrays get labelled. */
function specCell(info: FormatInfo | undefined, key: keyof FormatInfo): string {
  if (!info) return "";
  const v = info[key];
  if (Array.isArray(v)) return monthsLabel(v);
  return v ?? "";
}

/** Full-column CSV export of a product list (UTF-8 BOM, Excel-friendly). */
export function downloadCatalogueCsv(list: Product[], scope: ExplorerScope) {
  const esc = (v: string) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
  const header = [
    "Product",
    "Category",
    "Formats",
    "Season",
    "Fresh — availability months",
    "Fresh — peak",
    "Fresh — temperature °C",
    "Fresh — temperature °F",
    "Fresh — ventilation",
    "Fresh — humidity",
    "Fresh — shelf life",
    "Fresh — transport",
    "Fresh — note",
    "IQF — availability months",
    "IQF — peak",
    "IQF — temperature °C",
    "IQF — temperature °F",
    "IQF — ventilation",
    "IQF — humidity",
    "IQF — shelf life",
    "IQF — transport",
    "IQF — note",
    "Egypt — export volume",
    "Egypt — volume year",
    "Egypt — world standing",
    "Egypt — share of world trade",
    "Egypt — top importers",
    "Fresh — max transit",
    "IQF — max transit",
    "Varieties",
    "Variety season windows",
    "Variety details",
    "Growing regions",
    "Packaging",
  ];
  const rows = list.map((p) => [
    p.name,
    p.category,
    p.formats.join(" / "),
    p.season,
    specCell(p.calendar.fresh, "months"),
    specCell(p.calendar.fresh, "peak"),
    specCell(p.calendar.fresh, "tempC"),
    specCell(p.calendar.fresh, "tempF"),
    specCell(p.calendar.fresh, "ventilation"),
    specCell(p.calendar.fresh, "rh"),
    specCell(p.calendar.fresh, "shelfLife"),
    specCell(p.calendar.fresh, "transport"),
    specCell(p.calendar.fresh, "note"),
    specCell(p.calendar.frozen, "months"),
    specCell(p.calendar.frozen, "peak"),
    specCell(p.calendar.frozen, "tempC"),
    specCell(p.calendar.frozen, "tempF"),
    specCell(p.calendar.frozen, "ventilation"),
    specCell(p.calendar.frozen, "rh"),
    specCell(p.calendar.frozen, "shelfLife"),
    specCell(p.calendar.frozen, "transport"),
    specCell(p.calendar.frozen, "note"),
    p.trade?.volume ?? "",
    p.trade?.year ?? "",
    p.trade?.headline ?? "",
    p.trade?.share ?? "",
    p.trade?.topImporters.join("; ") ?? "",
    p.trade?.transit.fresh ?? "",
    p.trade?.transit.frozen ?? "",
    p.subtypes.map((s) => s.name).join("; "),
    p.subtypes
      .map((s) => `${s.name}: ${monthsLabel(s.months)}${s.peak ? ` (peak ${s.peak})` : ""}`)
      .join("; "),
    p.subtypes.map((s) => `${s.name}: ${s.detail}`).join("; "),
    p.regions,
    p.packaging.join("; "),
  ]);
  const csv = [header, ...rows].map((r) => r.map(esc).join(",")).join("\r\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `olymp-ex-${csvScopeName[scope]}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function ProductExplorer({ scope = "all" }: { scope?: ExplorerScope }) {
  const { t, monthShort } = useI18n();
  const [active, setActive] = useState<CatalogueFilter>("all");
  const [month, setMonth] = useState<number | null>(null);

  /** Base list: everything, or just the lines of the scoped format. */
  const base = useMemo<Product[]>(
    () => (scope === "fresh" ? freshProducts : scope === "frozen" ? frozenProducts : products),
    [scope],
  );

  /** Which format the month filter should test against, if narrowed. */
  const monthFormat: ProductFormat | null =
    scope === "fresh" || scope === "frozen"
      ? scope
      : active === "fresh" || active === "frozen"
        ? active
        : null;

  const list = useMemo(
    () =>
      base.filter((p) => {
        if (scope === "all") {
          if (active === "fresh" || active === "frozen") {
            if (!p.formats.includes(active)) return false;
          } else if (active !== "all" && p.category !== active) {
            return false;
          }
        } else if (active !== "all" && p.category !== active) {
          return false;
        }
        if (month !== null) {
          const inMonth = monthFormat
            ? (p.calendar[monthFormat]?.months.includes(month) ?? false)
            : p.formats.some((f) => p.calendar[f]?.months.includes(month));
          if (!inMonth) return false;
        }
        return true;
      }),
    [base, active, month, monthFormat, scope],
  );

  const filterSet = scope === "all" ? catalogueFilters : categoryFilters;

  return (
    <div>
      {/* Format / category filters + CSV export */}
      <div className="flex flex-col gap-5 border-b border-border pb-6 lg:flex-row lg:items-center lg:justify-between">
        <div
          role="group"
          aria-label={
            scope === "all"
              ? t("explorer.filterAria")
              : t("explorer.filterAriaScope", {
                  scope: scope === "fresh" ? t("explorer.scopeFresh") : t("explorer.scopeFrozen"),
                })
          }
          className="flex flex-wrap gap-2"
        >
          {filterSet.map((f) => (
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
              {t(f.key)}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => downloadCatalogueCsv(base, scope)}
          title={t("explorer.downloadTitle", {
            count: base.length,
            scope:
              scope === "all"
                ? t("explorer.downloadScopeAll")
                : scope === "fresh"
                  ? t("explorer.downloadScopeFresh")
                  : t("explorer.downloadScopeFrozen"),
          })}
          className="inline-flex shrink-0 items-center gap-2 self-start rounded-md border border-border px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-primary lg:self-auto"
        >
          <Download className="size-4" aria-hidden />
          {t("explorer.download")}
        </button>
      </div>

      {/* Month-of-availability filter */}
      <div
        role="group"
        aria-label={t("explorer.availableIn")}
        className="mt-6 flex flex-wrap items-center gap-2"
      >
        <span className="me-1 text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
          {t("explorer.availableIn")}
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
          {t("explorer.any")}
        </button>
        {monthShort.map((label, i) => {
          const m = i + 1;
          const selected = month === m;
          return (
            <button
              key={m}
              type="button"
              title={label}
              aria-pressed={selected}
              aria-label={label}
              onClick={() => setMonth(selected ? null : m)}
              className={cn(
                "size-8 rounded-md border text-xs font-bold transition-colors",
                selected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-primary hover:text-primary",
              )}
            >
              {label.slice(0, 1)}
            </button>
          );
        })}
      </div>

      <p className="mt-6 text-sm text-muted-foreground" aria-live="polite">
        {t("explorer.showing", { shown: list.length, total: base.length })}
        {month !== null ? t("explorer.showingMonth", { month: monthShort[month - 1] }) : ""}
      </p>

      <ProductGrid products={list} className="mt-8" />

      {list.length === 0 ? (
        <p className="mt-8 rounded-xl border border-dashed border-border bg-surface p-10 text-center text-sm text-muted-foreground">
          {t("explorer.noMatch")}
        </p>
      ) : null}

      <p className="mt-10 max-w-3xl text-xs text-muted-foreground/80">
        {t("explorer.sourceNote")}
      </p>
    </div>
  );
}
