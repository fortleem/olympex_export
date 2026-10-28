/**
 * The OlympEx consensus engine.
 *
 * A buyer question is answered by up to three independent responder models
 * (parallel, per-provider candidates), then merged by a stronger synthesizer
 * model into one authoritative answer. Degrades gracefully: 3 → 2 → 1
 * responders, synthesizer fallback chain, and a single-model mode when only
 * one voice is live. Answers are grounded in the verified OlympEx catalogue
 * (44 lines, subtypes, cold-chain, trade stats) and the Egyptian market
 * intelligence base — the models merge and phrase, they don't invent data.
 */

import { products, type Product } from "@/data/products";
import { MARKET_INTEL_DIGEST } from "@/data/market-intel";
import { localizedName } from "@/i18n/product-names";
import {
  callModel,
  configuredProviders,
  type ChatMessage,
  type ProviderConfig,
  type ModelSpec,
} from "./providers";

export interface ModelRun {
  provider: string;
  model: string;
  role: "responder" | "synthesizer";
  ok: boolean;
  ms: number;
  error?: string;
}

export interface ConsensusResult {
  mode: "consensus" | "single" | "none";
  answer: string;
  /** Product slugs referenced by the answer (from the [PRODUCTS: …] tail). */
  productSlugs: string[];
  models: ModelRun[];
  elapsedMs: number;
}

/* ------------------------------------------------------------------ */
/* Grounding                                                           */
/* ------------------------------------------------------------------ */

const STOP = new Set([
  "the", "a", "an", "of", "for", "and", "or", "to", "in", "on", "is", "are",
  "what", "when", "which", "how", "can", "i", "we", "you", "do", "does", "it",
  "with", "from", "about", "please", "tell", "me", "my", "our", "best", "need",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .split(/\s+/)
    .flatMap(stripArabicPrefix)
    .filter((w) => w.length > 2 && !STOP.has(w));
}

/** Arabic agglutination: prefixes like لل، وال، بال، كال، فال، ال fuse onto
 *  nouns — strip them so «للفراولة» matches «الفراولة». */
function stripArabicPrefix(w: string): string[] {
  const variants = [w];
  const m = w.match(/^(?:وال|بال|كال|فال|لل|ال)?(.+)$/u);
  if (m && m[1] !== w && m[1].length > 2) variants.push(m[1]);
  return variants;
}

/** Localized product names in all site languages — so Arabic/French/…/Chinese
 *  questions score against the catalogue as well as English ones. */
const ALL_LOCALES = ["en", "ar", "fr", "de", "es", "zh"] as const;

function localizedHaystack(p: Product): string {
  return ALL_LOCALES.map((l) => localizedName(p.slug, p.name, l)).join(" ");
}

/** Score a product against the query tokens (name, slugs, subtypes, trade). */
function scoreProduct(p: Product, tokens: string[]): number {
  const haystack = [
    p.name,
    localizedHaystack(p),
    p.slug.replace(/-/g, " "),
    p.latin ?? "",
    p.regions,
    ...p.subtypes.map((s) => `${s.name} ${s.tag ?? ""} ${s.detail}`),
    p.trade?.headline ?? "",
  ]
    .join(" ")
    .toLowerCase();
  let score = 0;
  for (const tok of tokens) {
    if (p.name.toLowerCase().includes(tok)) score += 3;
    else if (localizedHaystack(p).toLowerCase().includes(tok)) score += 3;
    else if (p.slug.includes(tok.replace(/\s/g, "-"))) score += 3;
    else if (haystack.includes(tok)) score += 1;
  }
  return score;
}

/** Compact one-line spec of a product for the grounding context. */
function productLine(p: Product): string {
  const fresh = p.calendar.fresh;
  const frozen = p.calendar.frozen;
  const parts = [
    `${p.name} (${p.slug}) [${p.formats.join("+")}]`,
    `season: ${p.season}`,
  ];
  if (p.formats.includes("fresh") && fresh) {
    parts.push(
      `fresh: ${fresh.tempC}, RH ${fresh.rh ?? "n/a"}, shelf ${fresh.shelfLife ?? "n/a"}${
        fresh.ventilation ? `, vents ${fresh.ventilation}` : ""
      }`,
    );
  }
  if (p.formats.includes("frozen") && frozen) {
    parts.push(`IQF: ${frozen.tempC}, shelf ${frozen.shelfLife ?? "n/a"}`);
  }
  if (p.subtypes.length) {
    parts.push(`varieties: ${p.subtypes.map((s) => s.name).join(", ")}`);
  }
  if (p.trade) {
    parts.push(
      `Egypt trade: ${p.trade.volume} (${p.trade.year}), ${p.trade.headline}, top importers ${p.trade.topImporters.slice(0, 3).join("/")}`,
    );
  }
  if (p.packaging.length) parts.push(`packaging: ${p.packaging.slice(0, 4).join("; ")}`);
  return parts.join(" | ");
}

/**
 * Build the grounding context for a question: the market-intel digest plus
 * the most relevant catalogue lines (keyword-scored, capped).
 */
export function buildGrounding(question: string): string {
  const tokens = tokenize(question);
  const scored = products
    .map((p) => ({ p, s: scoreProduct(p, tokens) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, 5);
  const lines = scored.length
    ? scored.map((x) => productLine(x.p)).join("\n")
    : products
        .filter((p) => p.featured)
        .slice(0, 4)
        .map((p) => productLine(p))
        .join("\n");
  return `MARKET INTELLIGENCE:\n${MARKET_INTEL_DIGEST}\n\nRELEVANT CATALOGUE LINES (authoritative data — use these figures):\n${lines}`;
}

/** Whether the question touches market-intel topics (always include digest anyway). */
export function relevantProductSlugs(question: string): string[] {
  const tokens = tokenize(question);
  return products
    .map((p) => ({ p, s: scoreProduct(p, tokens) }))
    .filter((x) => x.s >= 3)
    .sort((a, b) => b.s - a.s)
    .slice(0, 3)
    .map((x) => x.p.slug);
}

/* ------------------------------------------------------------------ */
/* Prompts                                                             */
/* ------------------------------------------------------------------ */

const COMPANY = `You are the OlympEx Trade Copilot for Olymp Ex (olymp-ex.com), an Egyptian fresh & frozen produce exporter in Cairo (info@olymp-ex.com, +20 122 704 1884). 44 export lines: fresh (citrus, grapes, pomegranates, strawberries, mangoes, vegetables…) and frozen/IQF (strawberries, vegetables, fries…). Buyers are importers, distributors and food-service buyers worldwide.`;

function responderPrompt(grounding: string, language: string): ChatMessage[] {
  return [
    {
      role: "system",
      content: `${COMPANY}
Answer the buyer's question using ONLY facts from the context below (plus general, non-specific trade knowledge clearly flagged as general). Be concise (max 120 words), commercial and precise. Use bullet points when listing. If the context lacks the answer, say what OlympEx can confirm on request — never invent figures.

CONTEXT:
${grounding}`,
    },
    {
      role: "system",
      content: `Write your answer in ${language}. Keep product names and technical terms (variety names, °C, Incoterms codes) in English.`,
    },
  ];
}

function synthesizerPrompt(
  grounding: string,
  language: string,
  answers: { model: string; content: string }[],
): ChatMessage[] {
  return [
    {
      role: "system",
      content: `${COMPANY}
You are the synthesis layer of a consensus engine: ${answers.length} advisor models answered the buyer's question independently. Merge them into ONE authoritative answer (max 150 words): keep only facts consistent with the CONTEXT, prefer specifics (months, temperatures, transit days, varieties), resolve conflicts using the CONTEXT as ground truth, and drop anything unsupported. Commercial, confident tone; bullet points when listing. No preamble.

End your answer with a final line exactly like "[PRODUCTS: slug1, slug2]" listing up to 3 relevant product slugs from the context (omit the line if none apply).

CONTEXT (ground truth):
${grounding}`,
    },
    {
      role: "system",
      content: `Write the final answer in ${language}. Keep product names and technical terms in English.`,
    },
    ...answers.map((a, i) => ({
      role: "user" as const,
      content: `[Advisor ${i + 1} — ${a.model}]:\n${a.content}`,
    })),
  ];
}

/* ------------------------------------------------------------------ */
/* Engine                                                              */
/* ------------------------------------------------------------------ */

const LANGUAGES: Record<string, string> = {
  en: "English",
  ar: "Arabic (Egyptian-friendly Modern Standard)",
  fr: "French",
  de: "German",
  es: "Spanish",
  zh: "Simplified Chinese",
};

/** Auth-class failures (bad key, no credits, region block) — the model is useless for a while. */
function isAuthError(error?: string): boolean {
  return !!error && /HTTP 40[139]|Forbidden|credits|region|UNAUTHENTICATED/i.test(error);
}

/** Auth-class failures blacklist a model for 5 minutes (dead key, no credits, region block). */
const deadUntil = new Map<string, number>();

function isDead(provider: string, model: string): boolean {
  const until = deadUntil.get(`${provider}:${model}`);
  return typeof until === "number" && until > Date.now();
}

function markDead(provider: string, model: string, error?: string) {
  if (isAuthError(error)) {
    deadUntil.set(`${provider}:${model}`, Date.now() + 5 * 60_000);
  }
}

interface Voice {
  run: ModelRun;
  content: string | null;
}

/** Ask one (provider, model) pair the real question. */
async function askResponder(
  provider: ProviderConfig,
  spec: ModelSpec,
  grounding: string,
  language: string,
  question: string,
  history: ChatMessage[],
): Promise<Voice> {
  const msgs = [
    ...responderPrompt(grounding, language),
    ...history.slice(-6),
    { role: "user" as const, content: question },
  ];
  const result = await callModel(provider, spec, msgs, {
    maxTokens: 350,
    temperature: 0.3,
    timeoutMs: 15_000,
  });
  if (!result.ok) markDead(provider.id, spec.model, result.error);
  return {
    run: {
      provider: provider.label,
      model: spec.model,
      role: "responder",
      ok: result.ok,
      ms: result.ms,
      error: result.error,
    },
    content: result.ok ? result.content : null,
  };
}

/**
 * Two-phase probeless responder fan-out.
 *
 * Phase 1 fires the FIRST model of every configured provider in parallel —
 * maximum provider diversity. If fewer than `target` voices answered (dead
 * keys, regional blocks, timeouts), phase 2 fills the panel with the NEXT
 * models of the providers that proved alive — so a single live provider
 * still yields a multi-model consensus, per the project brief.
 */
async function fanOutResponders(
  providers: ProviderConfig[],
  target: number,
  grounding: string,
  language: string,
  question: string,
  history: ChatMessage[],
  runs: ModelRun[],
): Promise<{ model: string; content: string }[]> {
  const collect = (voices: Voice[]) => {
    const out: { model: string; content: string }[] = [];
    for (const v of voices) {
      runs.push(v.run);
      if (v.content) out.push({ model: v.run.model, content: v.content });
    }
    return out;
  };

  // Phase 1 — first live candidate per provider. Auth-class errors (dead
  // key, no credits, region block) fail every model of a provider — stop
  // early; transient errors (timeout, empty) try the next candidate.
  const phase1: Voice[] = await Promise.all(
    providers.map(async (p) => {
      for (const spec of p.responders) {
        if (isDead(p.id, spec.model)) continue;
        const v = await askResponder(p, spec, grounding, language, question, history);
        if (v.run.ok) return v;
        if (isAuthError(v.run.error)) return v;
        runs.push(v.run); // transient failure — try the provider's next model
      }
      return { run: { provider: p.label, model: "-", role: "responder" as const, ok: false, ms: 0, error: "no live model" }, content: null };
    }),
  );
  const voices = collect(phase1).slice(0, target);
  if (voices.length >= target) return voices;

  // Phase 2 — next models of the providers that answered.
  const alive = providers.filter((p) =>
    phase1.some((v) => v.run.ok && v.run.provider === p.label),
  );
  const need = target - voices.length;
  const phase2Candidates: { provider: ProviderConfig; spec: ModelSpec }[] = []
  for (const p of alive) {
    for (const spec of p.responders.slice(1)) {
      if (!isDead(p.id, spec.model) && !voices.some((v) => v.model === spec.model)) {
        phase2Candidates.push({ provider: p, spec });
      }
    }
  }
  const phase2: Voice[] = await Promise.all(
    phase2Candidates.slice(0, need + 1).map(({ provider, spec }) =>
      askResponder(provider, spec, grounding, language, question, history),
    ),
  );
  return [...voices, ...collect(phase2)].slice(0, target);
}

/**
 * Run the consensus pipeline for one buyer question.
 * History (previous turns) is passed through to responders and synthesizer.
 */
export async function runConsensus(
  question: string,
  history: ChatMessage[],
  locale: string,
): Promise<ConsensusResult> {
  const started = Date.now();
  const language = LANGUAGES[locale] ?? "English";
  const grounding = buildGrounding(question);
  const providers = configuredProviders();
  const runs: ModelRun[] = [];

  if (providers.length === 0) {
    return { mode: "none", answer: "", productSlugs: [], models: [], elapsedMs: 0 };
  }

  // 1) Responders — two-phase probeless fan-out (provider-diverse; falls
  //    back to multiple models of the live providers).
  const voices = await fanOutResponders(
    providers,
    3,
    grounding,
    language,
    question,
    history,
    runs,
  );

  // 2) Single-voice short-circuit: no synthesis needed.
  if (voices.length === 1) {
    const answer = voices[0].content;
    return {
      mode: "single",
      answer,
      productSlugs: parseProductSlugs(answer).length
        ? parseProductSlugs(answer)
        : relevantProductSlugs(question),
      models: runs,
      elapsedMs: Date.now() - started,
    };
  }

  if (voices.length === 0) {
    // 3) Last resort: try a synthesizer directly as a single voice.
    for (const provider of providers) {
      for (const spec of provider.synthesizers) {
        const result = await callModel(
          provider,
          spec,
          [
            ...responderPrompt(grounding, language),
            ...history.slice(-6),
            { role: "user", content: question },
          ],
          { maxTokens: 350, temperature: 0.3, timeoutMs: 20_000 },
        );
        runs.push({
          provider: provider.label,
          model: spec.model,
          role: "synthesizer",
          ok: result.ok,
          ms: result.ms,
          error: result.error,
        });
        if (result.ok) {
          return {
            mode: "single",
            answer: result.content,
            productSlugs: parseProductSlugs(result.content),
            models: runs,
            elapsedMs: Date.now() - started,
          };
        }
      }
    }
    return { mode: "none", answer: "", productSlugs: [], models: runs, elapsedMs: Date.now() - started };
  }

  // 4) Synthesis — first working synthesizer across the provider chain.
  for (const provider of providers) {
    for (const spec of provider.synthesizers) {
      const result = await callModel(
        provider,
        spec,
        synthesizerPrompt(grounding, language, voices),
        { maxTokens: 450, temperature: 0.3, timeoutMs: 25_000 },
      );
      runs.push({
        provider: provider.label,
        model: spec.model,
        role: "synthesizer",
        ok: result.ok,
        ms: result.ms,
        error: result.error,
      });
      if (result.ok) {
        return {
          mode: "consensus",
          answer: result.content,
          productSlugs: parseProductSlugs(result.content),
          models: runs,
          elapsedMs: Date.now() - started,
        };
      }
    }
  }

  // 5) Synthesizers all failed — fall back to the first voice verbatim.
  return {
    mode: "single",
    answer: voices[0].content,
    productSlugs: parseProductSlugs(voices[0].content),
    models: runs,
    elapsedMs: Date.now() - started,
  };
}

/** Parse the "[PRODUCTS: slug1, slug2]" tail protocol. */
export function parseProductSlugs(answer: string): string[] {
  const m = answer.match(/\[PRODUCTS:\s*([a-z0-9-,\s]+)\]/i);
  if (!m) return [];
  const valid = new Set(products.map((p) => p.slug));
  return m[1]
    .split(/[,\s]+/)
    .map((s) => s.trim().toLowerCase())
    .filter((s) => s && valid.has(s))
    .slice(0, 3);
}

/** Strip the machine-readable tail from display copy. */
export function stripProductTail(answer: string): string {
  return answer.replace(/\s*\[PRODUCTS:[^\]]*\]\s*/gi, "\n").trim();
}
