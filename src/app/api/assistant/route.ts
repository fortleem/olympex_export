import { NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit, pruneRateLimits, clientIp } from "@/lib/rate-limit";
import { PROVIDERS, configuredProviders, callModel } from "@/lib/ai/providers";
import { runConsensus, stripProductTail } from "@/lib/ai/consensus";

export const runtime = "nodejs";

/* ------------------------------------------------------------------ */
/* GET /api/assistant — copilot status (which providers are configured) */
/* ------------------------------------------------------------------ */

export async function GET(req: Request) {
  const probe = new URL(req.url).searchParams.get("probe") === "1";
  const configured = configuredProviders();

  const providers = await Promise.all(
    PROVIDERS.map(async (p) => {
      const hasKey = configured.some((c) => c.id === p.id);
      let live: boolean | null = null;
      let error: string | null = null;
      if (hasKey && probe) {
        const spec = p.responders[0];
        const r = await callModel(
          p,
          spec,
          [
            { role: "system", content: "Reply with the single word: ready" },
            { role: "user", content: "ready?" },
          ],
          { maxTokens: 8, temperature: 0, timeoutMs: 8_000 },
        );
        live = r.ok;
        error = r.ok ? null : r.error ?? "failed";
      }
      return { id: p.id, label: p.label, hasKey, live, error };
    }),
  );

  return NextResponse.json({
    copilot: configured.length > 0,
    providers,
    probedAt: probe ? new Date().toISOString() : null,
  });
}

/* ------------------------------------------------------------------ */
/* POST /api/assistant — consensus chat                                */
/* ------------------------------------------------------------------ */

const MessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(2_000),
});

const BodySchema = z.object({
  messages: z.array(MessageSchema).min(1).max(12),
  locale: z.enum(["en", "ar", "fr", "de", "es", "zh"]).default("en"),
});

export async function POST(req: Request) {
  // Payload cap — same policy as the quote API.
  const contentLength = Number(req.headers.get("content-length") ?? 0);
  if (contentLength > 24_000) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }

  // Rate limit: 10 copilot messages per minute per IP (AI calls cost money).
  const ip = clientIp(req);
  const rl = rateLimit(`assistant:${ip}`, 10, 60_000);
  pruneRateLimits();
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many messages — please wait a moment." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.issues.slice(0, 3) },
      { status: 400 },
    );
  }

  const { messages, locale } = parsed.data;
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUser) {
    return NextResponse.json({ error: "No user message" }, { status: 400 });
  }

  // No keys configured → tell the client to use local catalogue search.
  if (configuredProviders().length === 0) {
    return NextResponse.json({ mode: "fallback" });
  }

  const history = messages.slice(0, -1).map((m) => ({
    role: m.role,
    content: m.content,
  }));

  try {
    const result = await runConsensus(lastUser.content, history, locale);
    if (result.mode === "none") {
      // All providers failed (dead keys / regional blocks / timeouts).
      return NextResponse.json({
        mode: "fallback",
        diagnostics: result.models.map((m) => ({
          provider: m.provider,
          model: m.model,
          error: m.error,
        })),
      });
    }
    return NextResponse.json({
      mode: result.mode,
      answer: stripProductTail(result.answer),
      products: result.productSlugs,
      consensus: {
        voices: result.models.filter((m) => m.role === "responder" && m.ok).length,
        models: result.models
          .filter((m) => m.ok)
          .map((m) => ({ provider: m.provider, model: m.model, role: m.role })),
        elapsedMs: result.elapsedMs,
      },
    });
  } catch (e) {
    console.error("[assistant] consensus error:", e);
    return NextResponse.json(
      { error: "The copilot hit an unexpected error — please try again." },
      { status: 500 },
    );
  }
}
