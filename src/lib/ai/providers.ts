/**
 * AI provider registry for the OlympEx consensus engine.
 *
 * Five providers, each declaring candidate models per role. Only providers
 * whose API key is configured are used; per-call timeouts and fallback
 * chains make the engine resilient to dead keys, regional blocks and
 * deprecated models (all three were observed during reconnaissance — see
 * tool-results/ai-recon/REPORT.md).
 *
 * NOTE: z-ai/zai-org models are deliberately excluded (project rule).
 */

export type ProviderId = "nvidia" | "google" | "groq" | "openrouter" | "hf";

export interface ModelSpec {
  model: string;
  /** Extra body params, e.g. { chat_template_kwargs: { thinking: false } }. */
  extra?: Record<string, unknown>;
}

export interface ProviderConfig {
  id: ProviderId;
  label: string;
  /** OpenAI-compatible chat-completions base URL. */
  baseUrl: string;
  envKey: string;
  /** Candidate responder models, tried in order (first live wins per provider). */
  responders: ModelSpec[];
  /** Candidate synthesizer models, tried in order. */
  synthesizers: ModelSpec[];
}

export const PROVIDERS: ProviderConfig[] = [
  {
    id: "nvidia",
    label: "NVIDIA NIM",
    baseUrl: "https://integrate.api.nvidia.com/v1",
    envKey: "NVIDIA_API_KEY",
    responders: [
      { model: "nvidia/nemotron-3.5-bolt-e4b" },
      { model: "openai/gpt-oss-20b" },
    ],
    synthesizers: [
      {
        model: "nvidia/nemotron-3-ultra-550b-a55b",
        extra: { chat_template_kwargs: { thinking: false } },
      },
      { model: "nvidia/nemotron-3.5-bolt-e4b" },
    ],
  },
  {
    id: "google",
    label: "Google AI Studio",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai",
    envKey: "GOOGLE_AI_API_KEY",
    responders: [{ model: "gemini-2.5-flash" }, { model: "gemini-2.0-flash" }],
    synthesizers: [{ model: "gemini-2.5-flash" }],
  },
  {
    id: "groq",
    label: "Groq",
    baseUrl: "https://api.groq.com/openai/v1",
    envKey: "GROQ_API_KEY",
    responders: [
      { model: "llama-3.3-70b-versatile" },
      { model: "openai/gpt-oss-120b" },
    ],
    synthesizers: [{ model: "openai/gpt-oss-120b" }, { model: "llama-3.3-70b-versatile" }],
  },
  {
    id: "openrouter",
    label: "OpenRouter",
    baseUrl: "https://openrouter.ai/api/v1",
    envKey: "OPENROUTER_API_KEY",
    responders: [
      { model: "meta-llama/llama-3.3-70b-instruct" },
      { model: "deepseek/deepseek-chat-v3.1" },
      { model: "qwen/qwen3-32b" },
    ],
    synthesizers: [{ model: "deepseek/deepseek-chat-v3.1" }],
  },
  {
    id: "hf",
    label: "Hugging Face",
    baseUrl: "https://router.huggingface.co/v1",
    envKey: "HF_API_KEY",
    responders: [
      { model: "meta-llama/Llama-3.3-70B-Instruct" },
      { model: "Qwen/Qwen3-32B" },
    ],
    synthesizers: [{ model: "openai/gpt-oss-120b" }, { model: "meta-llama/Llama-3.3-70B-Instruct" }],
  },
];

/** Providers that have a key configured in this environment. */
export function configuredProviders(): ProviderConfig[] {
  return PROVIDERS.filter((p) => {
    const v = process.env[p.envKey];
    return typeof v === "string" && v.length > 8;
  });
}

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface CallResult {
  ok: boolean;
  content: string;
  error?: string;
  ms: number;
}

/**
 * One OpenAI-compatible chat completion with a hard timeout.
 * Never throws — failures return { ok: false } for graceful degradation.
 */
export async function callModel(
  provider: ProviderConfig,
  spec: ModelSpec,
  messages: ChatMessage[],
  opts: { maxTokens?: number; temperature?: number; timeoutMs?: number } = {},
): Promise<CallResult> {
  const started = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), opts.timeoutMs ?? 15_000);
  try {
    const res = await fetch(`${provider.baseUrl}/chat/completions`, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env[provider.envKey]}`,
      },
      body: JSON.stringify({
        model: spec.model,
        messages,
        max_tokens: opts.maxTokens ?? 400,
        temperature: opts.temperature ?? 0.3,
        ...(spec.extra ?? {}),
      }),
    });
    const ms = Date.now() - started;
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      let msg = `HTTP ${res.status}`;
      try {
        const j = JSON.parse(body);
        msg = j?.error?.message || j?.message || msg;
      } catch {
        /* keep HTTP status */
      }
      return { ok: false, content: "", error: msg.slice(0, 140), ms };
    }
    const data = await res.json();
    const content: string =
      data?.choices?.[0]?.message?.content?.toString().trim() ?? "";
    if (!content) {
      return { ok: false, content: "", error: "empty content", ms: Date.now() - started };
    }
    return { ok: true, content, ms: Date.now() - started };
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e);
    return {
      ok: false,
      content: "",
      error: (err.includes("abort") ? "timeout" : err).slice(0, 140),
      ms: Date.now() - started,
    };
  } finally {
    clearTimeout(timer);
  }
}
