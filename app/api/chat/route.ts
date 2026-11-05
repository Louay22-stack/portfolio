import Anthropic from "@anthropic-ai/sdk";
import { systemPrompt } from "@/lib/chat/knowledge";
import { profile } from "@/content/profile";

export const maxDuration = 60;

const MODEL = "claude-opus-5-5";
const MAX_MESSAGES = 20;
const MAX_USER_CHARS = 1000;
const MAX_ASSISTANT_CHARS = 6000;
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 10 * 60 * 1000;

/**
 * Best-effort limit per server instance, to slow down casual abuse.
 * The hard cost ceiling is the spend limit on the Anthropic account.
 */
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) return true;
  if (hits.size > 5000) hits.clear();
  hits.set(ip, [...recent, now]);
  return false;
}

function sameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host === req.headers.get("host");
  } catch {
    return false;
  }
}

function parseMessages(body: unknown): Anthropic.Beta.BetaMessageParam[] | null {
  const list = (body as { messages?: unknown } | null)?.messages;
  if (!Array.isArray(list) || list.length === 0 || list.length > MAX_MESSAGES) return null;

  const messages: Anthropic.Beta.BetaMessageParam[] = [];
  for (const m of list as { role?: unknown; content?: unknown }[]) {
    const { role, content } = m ?? {};
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") return null;
    const limit = role === "user" ? MAX_USER_CHARS : MAX_ASSISTANT_CHARS;
    if (!content.trim() || content.length > limit) return null;
    messages.push({ role, content });
  }
  if (messages[0].role !== "user" || messages[messages.length - 1].role !== "user") return null;
  return messages;
}

const fail = (status: number, error: string) => Response.json({ error }, { status });

export async function POST(req: Request) {
  if (!sameOrigin(req)) return fail(403, "forbidden");
  if (!process.env.ANTHROPIC_API_KEY) return fail(503, "not_configured");

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (rateLimited(ip)) return fail(429, "rate_limited");

  const messages = parseMessages(await req.json().catch(() => null));
  if (!messages) return fail(400, "invalid_request");

  const stream = new Anthropic().beta.messages.stream(
    {
      model: MODEL,
      max_tokens: 2048,
      betas: ["server-side-fallback-2026-07-01"],
      // Microbiology vocabulary can trip the biology safety classifier by
      // mistake; this retries a declined request on another model.
      fallbacks: "default",
      output_config: { effort: "low" },
      system: [{ type: "text", text: systemPrompt, cache_control: { type: "ephemeral" } }],
      messages,
    },
    { signal: req.signal },
  );

  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        let answered = false;
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            answered = true;
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        const final = await stream.finalMessage();
        if (final.stop_reason === "refusal") {
          const notice = `I can't answer that one here. Please ask Louay directly at ${profile.email}.`;
          controller.enqueue(encoder.encode(answered ? `\n\n${notice}` : notice));
        }
        controller.close();
      } catch (error) {
        if (error instanceof Anthropic.AuthenticationError) console.error("chat: invalid Anthropic API key");
        else if (error instanceof Anthropic.RateLimitError) console.error("chat: Anthropic rate limit reached");
        else if (error instanceof Anthropic.APIError) console.error(`chat: Anthropic API error ${error.status}: ${error.message}`);
        else console.error("chat: stream failed", error);
        controller.error(error);
      }
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}
