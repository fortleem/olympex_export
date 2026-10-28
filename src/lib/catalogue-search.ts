/**
 * Local catalogue search — the copilot's fallback brain.
 *
 * Pure functions (usable client- and server-side): when no AI provider is
 * reachable, the copilot answers from the verified catalogue and market-intel
 * base directly. Instant, free, and still useful — the site never shows a
 * dead chatbot.
 */

import { products, monthsLabel, type Product } from "@/data/products";
import { localizedName } from "@/i18n/product-names";
import {
  PORTS,
  HOLIDAYS_2026,
  INCOTERMS,
  CERTIFICATIONS,
  CONTEXT_NOTES,
} from "@/data/market-intel";

const STOP = new Set([
  "the", "a", "an", "of", "for", "and", "or", "to", "in", "on", "is", "are",
  "what", "when", "which", "how", "can", "i", "we", "you", "do", "does", "it",
  "with", "from", "about", "please", "tell", "me", "my", "our", "best", "need",
  "have", "has", "there", "their", "your",
]);

function tokens(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .split(/\s+/)
    .flatMap(stripArabicPrefix)
    .filter((w) => w.length > 2 && !STOP.has(w));
}

/** Arabic agglutination: strip fused prefixes (لل، وال، بال، كال، فال، ال). */
function stripArabicPrefix(w: string): string[] {
  const variants = [w];
  const m = w.match(/^(?:وال|بال|كال|فال|لل|ال)?(.+)$/u);
  if (m && m[1] !== w && m[1].length > 2) variants.push(m[1]);
  return variants;
}

const ALL_LOCALES = ["en", "ar", "fr", "de", "es", "zh"] as const;

function scoreProduct(p: Product, toks: string[]): number {
  const localized = ALL_LOCALES.map((l) => localizedName(p.slug, p.name, l)).join(" ").toLowerCase();
  const hay = [
    p.name,
    localized,
    p.slug.replace(/-/g, " "),
    p.summary,
    p.regions,
    ...p.subtypes.map((s) => `${s.name} ${s.detail}`),
  ]
    .join(" ")
    .toLowerCase();
  let score = 0;
  for (const t of toks) {
    if (p.name.toLowerCase().includes(t)) score += 3;
    else if (localized.includes(t)) score += 3;
    else if (hay.includes(t)) score += 1;
  }
  return score;
}

export interface LocalAnswer {
  /** Markdown-lite answer (bullets with "- ", bold with **…**). */
  answer: string;
  productSlugs: string[];
}

/** Search the catalogue + market intel and compose a grounded answer. */
export function localAnswer(question: string): LocalAnswer {
  const toks = tokens(question);
  const q = question.toLowerCase();

  // Market-intel intents first.
  if (/(incoterm|fob|cif|exw|ddp|dap|إنكوترم|شروط التسليم)/.test(q)) {
    return {
      answer:
        "**Incoterms 2020 — buyer's quick reference**\n\n" +
        INCOTERMS.map((i) => `- **${i.code}** — ${i.buyer} (risk: ${i.risk})`).join("\n") +
        "\n\nOlympEx quotes FOB and CFR most often; ask us for a CIF position per programme.",
      productSlugs: [],
    };
  }
  if (/(holiday|holidays|eid|closure|closed|عطل|إجازة|عيد)/.test(q)) {
    return {
      answer:
        "**Egyptian public holidays 2026 (export operations)**\n\n" +
        HOLIDAYS_2026.map((h) => `- **${h.date}** — ${h.name} (${h.impact})`).join("\n") +
        "\n\nIslamic dates shift with lunar sighting. Plan shipments around the Eids — ports and customs close for multiple days.",
      productSlugs: [],
    };
  }
  if (/(port|ports|alexandria|damietta|sokhna|dekheila|said|ميناء|موانئ)/.test(q)) {
    return {
      answer:
        "**Egyptian export ports**\n\n" +
        PORTS.map((p) => `- **${p.name}** (${p.sea}) — ${p.type}. ${p.note}`).join("\n") +
        "\n\nProgrammes are routed per destination and season — Damietta carries the largest reefer volume; Sokhna is closest to Cairo.",
      productSlugs: [],
    };
  }
  if (/(certif|globalg|global gap|grasp|brc|ifs|haccp|phytosanitary|protocol|شهاد|اعتماد)/.test(q)) {
    return {
      answer:
        "**Certifications for Egyptian produce export**\n\n" +
        CERTIFICATIONS.map((c) => `- **${c.name}** (${c.who}) — ${c.detail}`).join("\n"),
      productSlugs: [],
    };
  }
  if (/(currency|egp|pound|exchange|usd|عملة|جنيه|صرف)/.test(q)) {
    return {
      answer:
        "**Currency & logistics context**\n\n" +
        CONTEXT_NOTES.map((c) => `- **${c.title}** — ${c.detail}`).join("\n"),
      productSlugs: [],
    };
  }

  // Catalogue search.
  const scored = products
    .map((p) => ({ p, s: scoreProduct(p, toks) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, 3);

  if (scored.length === 0) {
    return {
      answer:
        "I can answer from the verified OlympEx catalogue — try asking about:\n\n- A product or variety (e.g. *Wonderful pomegranates*, *Giza Red onions*)\n- Season windows and availability months\n- Cold-chain specs (temperature, humidity, ventilation, shelf life)\n- Max transit times, ports, Incoterms, certifications or Egyptian holidays\n\nOr request a quote and the team will respond with a position.",
      productSlugs: [],
    };
  }

  const lines = scored.map(({ p }) => {
    const bits: string[] = [`**${p.name}** — ${p.season}.`];
    if (p.formats.includes("fresh") && p.calendar.fresh) {
      const f = p.calendar.fresh;
      bits.push(
        `- Fresh: ${f.tempC} (${f.tempF}), RH ${f.rh ?? "n/a"}, shelf life ${f.shelfLife ?? "n/a"}${
          p.trade?.transit.fresh ? `, max transit ${p.trade.transit.fresh}` : ""
        }`,
      );
    }
    if (p.formats.includes("frozen") && p.calendar.frozen) {
      const f = p.calendar.frozen;
      bits.push(`- IQF: ${f.tempC}, shelf life ${f.shelfLife ?? "n/a"}.`);
    }
    if (p.subtypes.length) {
      bits.push(
        `- Varieties: ${p.subtypes
          .map((s) => `${s.name} (${monthsLabel(s.months)})`)
          .join(", ")}.`,
      );
    }
    if (p.trade) {
      bits.push(`- Egypt trade: ${p.trade.volume} — ${p.trade.headline}.`);
    }
    return bits.join("\n");
  });

  return {
    answer: lines.join("\n\n"),
    productSlugs: scored.map((x) => x.p.slug),
  };
}
