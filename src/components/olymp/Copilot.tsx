"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Bot, MessageCircle, Send, Sparkles, X, AlertTriangle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n";
import { localizedName } from "@/i18n/product-names";
import { getProduct } from "@/data/products";
import { localAnswer } from "@/lib/catalogue-search";
import { ALink } from "@/lib/router";

/**
 * OlympEx Trade Copilot — floating AI assistant.
 *
 * Frontend of the consensus engine: buyers ask in any of the six site
 * languages; up to three independent models answer and a synthesizer merges
 * them (badge shows the live consensus). When no AI provider is reachable
 * the widget degrades to instant local catalogue search — never a dead bot.
 */

interface ConsensusMeta {
  voices: number;
  models: { provider: string; model: string; role: string }[];
  elapsedMs: number;
}

interface Msg {
  role: "user" | "assistant";
  content: string;
  meta?: ConsensusMeta;
  fallback?: boolean;
  products?: string[];
  error?: boolean;
}

/** Minimal safe markdown: **bold**, "- " bullets, line breaks. No HTML injection. */
function RichText({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="space-y-1.5">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-1" />;
        const bullet = line.trimStart().startsWith("- ");
        const body = bullet ? line.trimStart().slice(2) : line;
        const parts = body.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
        const rendered = parts.map((p, j) =>
          p.startsWith("**") && p.endsWith("**") ? (
            <strong key={j} className="font-semibold">
              {p.slice(2, -2)}
            </strong>
          ) : (
            <span key={j}>{p}</span>
          ),
        );
        return bullet ? (
          <div key={i} className="flex gap-1.5">
            <span aria-hidden className="text-primary">•</span>
            <div className="min-w-0 flex-1">{rendered}</div>
          </div>
        ) : (
          <p key={i}>{rendered}</p>
        );
      })}
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex gap-1 py-1" aria-hidden>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="size-1.5 animate-pulse rounded-full bg-muted-foreground/70"
          style={{ animationDelay: `${i * 180}ms` }}
        />
      ))}
    </div>
  );
}

export function Copilot() {
  const { t, locale, dir } = useI18n();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [fallbackMode, setFallbackMode] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Market Intel CTA opens the copilot.
  useEffect(() => {
    const onOpen = () => {
      setOpen(true);
    };
    window.addEventListener("olympex:copilot", onOpen);
    return () => window.removeEventListener("olympex:copilot", onOpen);
  }, []);

  const scrollDown = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    });
  }, []);

  useEffect(scrollDown, [messages, busy, scrollDown]);

  useEffect(() => {
    if (open) requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  const send = useCallback(
    async (text: string) => {
      const question = text.trim();
      if (!question || busy) return;
      setInput("");
      const next: Msg[] = [...messages, { role: "user", content: question }];
      setMessages(next);
      setBusy(true);

      if (fallbackMode) {
        // Local catalogue search — instant.
        const local = localAnswer(question);
        setMessages([
          ...next,
          {
            role: "assistant",
            content: local.answer,
            products: local.productSlugs,
            fallback: true,
          },
        ]);
        setBusy(false);
        return;
      }

      try {
        const res = await fetch("/api/assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: next.map((m) => ({ role: m.role, content: m.content })),
            locale,
          }),
        });
        if (res.status === 429) {
          setMessages([
            ...next,
            { role: "assistant", content: t("copilot.rateLimited"), error: true },
          ]);
          setBusy(false);
          return;
        }
        const data = await res.json();
        if (data.mode === "fallback") {
          // Switch to local search for the rest of the session.
          setFallbackMode(true);
          const local = localAnswer(question);
          setMessages([
            ...next,
            {
              role: "assistant",
              content: local.answer,
              products: local.productSlugs,
              fallback: true,
            },
          ]);
        } else if (data.answer) {
          setMessages([
            ...next,
            {
              role: "assistant",
              content: data.answer,
              products: data.products ?? [],
              meta: data.consensus,
            },
          ]);
        } else {
          throw new Error(data.error ?? "no answer");
        }
      } catch {
        // Network/server failure → local search keeps the buyer moving.
        const local = localAnswer(question);
        setMessages([
          ...next,
          {
            role: "assistant",
            content: local.answer,
            products: local.productSlugs,
            fallback: true,
          },
        ]);
      }
      setBusy(false);
    },
    [busy, fallbackMode, locale, messages, t],
  );

  const suggestions: string[] = [
    t("copilot.suggestion1"),
    t("copilot.suggestion2"),
    t("copilot.suggestion3"),
    t("copilot.suggestion4"),
  ];

  return (
    <>
      {/* Floating action button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? t("copilot.close") : t("copilot.open")}
        aria-expanded={open}
        className={cn(
          "fixed bottom-5 end-5 z-[60] inline-flex size-14 items-center justify-center rounded-full",
          "bg-primary text-primary-foreground shadow-elevated transition-all duration-300",
          "hover:scale-105 hover:bg-primary-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
          open && "scale-95 opacity-0 pointer-events-none",
        )}
      >
        <MessageCircle className="size-6" aria-hidden />
        <span
          className="absolute -top-0.5 -end-0.5 flex size-4 items-center justify-center rounded-full bg-accent"
          aria-hidden
        >
          <Sparkles className="size-2.5 text-accent-foreground" />
        </span>
      </button>

      {/* Chat panel */}
      {open && (
        <section
          role="dialog"
          aria-label={t("copilot.title")}
          dir={dir}
          className={cn(
            "fixed bottom-5 end-5 z-[60] flex w-[min(24.5rem,calc(100vw-2.5rem))] flex-col",
            "h-[min(37rem,calc(100dvh-6.5rem))] overflow-hidden rounded-2xl border border-border",
            "bg-background shadow-elevated",
          )}
        >
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-border bg-surface px-4 py-3">
            <span className="relative inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Bot className="size-5" aria-hidden />
              <span className="absolute -bottom-0.5 -end-0.5 size-3 rounded-full border-2 border-surface bg-emerald-500" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{t("copilot.title")}</p>
              <p className="truncate text-xs text-muted-foreground">
                {fallbackMode ? t("copilot.catalogueMode") : t("copilot.subtitle")}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t("copilot.close")}
              className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 space-y-4 overflow-y-auto px-4 py-4 [scrollbar-width:thin] max-h-full"
          >
            {messages.length === 0 && (
              <div className="space-y-4">
                <div className="rounded-xl bg-muted/60 p-3.5 text-sm leading-relaxed text-muted-foreground">
                  {t("copilot.intro")}
                </div>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                    m.role === "user"
                      ? "rounded-ee-md bg-primary text-primary-foreground"
                      : "rounded-es-md bg-muted",
                    m.error && "border border-destructive/40 bg-destructive/10 text-foreground",
                  )}
                >
                  <RichText text={m.content} />

                  {/* Related product chips */}
                  {m.role === "assistant" && m.products && m.products.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5 border-t border-border/60 pt-2.5">
                      <span className="w-full text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">
                        {t("copilot.related")}
                      </span>
                      {m.products.map((slug) => {
                        const p = getProduct(slug);
                        if (!p) return null;
                        return (
                          <ALink
                            key={slug}
                            to={`/products/$${"slug"}`}
                            params={{ slug }}
                            onClick={() => setOpen(false)}
                            className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/5 px-2.5 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
                          >
                            {localizedName(slug, p.name, locale)}
                            <ChevronRight className="size-3 rtl:rotate-180" aria-hidden />
                          </ALink>
                        );
                      })}
                    </div>
                  )}

                  {/* Consensus badge */}
                  {m.role === "assistant" && m.meta && (
                    <p className="mt-2 flex flex-wrap items-center gap-x-1.5 text-[0.65rem] text-muted-foreground">
                      <Sparkles className="size-3 text-accent" aria-hidden />
                      {m.meta.voices >= 2
                        ? t("copilot.consensus", { n: m.meta.voices })
                        : t("copilot.single")}
                      <span aria-hidden>·</span>
                      <span className="truncate">
                        {(() => {
                          const ps = m.meta.models
                            .filter((x) => x.role === "responder")
                            .map((x) => x.provider);
                          const unique = [...new Set(ps)];
                          return unique.length === ps.length
                            ? unique.join(" + ")
                            : `${unique.join(" + ")} (${ps.length} models)`;
                        })()}
                      </span>
                      <span aria-hidden>·</span>
                      <span>{(m.meta.elapsedMs / 1000).toFixed(1)}s</span>
                    </p>
                  )}
                  {m.role === "assistant" && m.fallback && (
                    <p className="mt-2 flex items-center gap-1.5 text-[0.65rem] text-muted-foreground">
                      <AlertTriangle className="size-3" aria-hidden />
                      {t("copilot.catalogueNote")}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {busy && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-es-md bg-muted px-4 py-3">
                  <span className="sr-only">{t("copilot.thinking")}</span>
                  <TypingDots />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form
            className="border-t border-border bg-background p-3"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                rows={1}
                maxLength={2000}
                placeholder={t("copilot.placeholder")}
                aria-label={t("copilot.placeholder")}
                className="max-h-24 min-h-10 flex-1 resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                aria-label={t("copilot.send")}
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-all hover:bg-primary-deep disabled:opacity-40"
              >
                <Send className="size-4 rtl:-scale-x-100" aria-hidden />
              </button>
            </div>
            <p className="mt-2 text-[0.65rem] leading-snug text-muted-foreground/80">
              {t("copilot.disclaimer")}
            </p>
          </form>
        </section>
      )}
    </>
  );
}
