import { systemPrompt } from "@/lib/chat/knowledge";
import { profile, siteUrl } from "@/content/profile";

export const maxDuration = 60;

const ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = "anthropic/claude-opus-5.5";
const MAX_MESSAGES = 20;
const MAX_USER_CHARS = 1000;
const MAX_ASSISTANT_CHARS = 6000;
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 10 * 60 * 1000;

type ChatMessage = { role: "user" | "assistant"; content: string };

/**
 * Best-effort limit per server instance, to slow down casual abuse.
 * The hard cost ceiling is the credit limit on the OpenRouter key.
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

function parseMessages(body: unknown): ChatMessage[] | null {
  const list = (body as { messages?: unknown } | null)?.messages;
  if (!Array.isArray(list) || list.length === 0 || list.length > MAX_MESSAGES) return null;

  const messages: ChatMessage[] = [];
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

type Chunk = {
  error?: { code?: number | string; message?: string };
  choices?: { delta?: { content?: string | null }; finish_reason?: string | null }[];
};

/** Yield each JSON event of an OpenRouter stream, skipping keep-alive comments. */
async function* readEvents(body: ReadableStream<Uint8Array>): AsyncGenerator<Chunk> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) return;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const raw of lines) {
      const line = raw.trim();
      if (!line.startsWith("data:")) continue;
      const data = line.slice(5).trim();
      if (data === "[DONE]") return;
      yield JSON.parse(data) as Chunk;
    }
  }
}

const fail = (status: number, error: string) => Response.json({ error }, { status });

export async function POST(req: Request) {
  if (!sameOrigin(req)) return fail(403, "forbidden");

  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return fail(503, "not_configured");

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (rateLimited(ip)) return fail(429, "rate_limited");

  const messages = parseMessages(await req.json().catch(() => null));
  if (!messages) return fail(400, "invalid_request");

  const upstream = await fetch(ENDPOINT, {
    method: "POST",
    signal: req.signal,
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "HTTP-Referer": siteUrl,
      "X-OpenRouter-Title": "Louay Ouhibi portfolio",
    },
    body: JSON.stringify({
      model: process.env.OPENROUTER_MODEL || DEFAULT_MODEL,
      stream: true,
      max_tokens: 2048,
      reasoning: { effort: "low" },
      messages: [
        { role: "system", content: [{ type: "text", text: systemPrompt, cache_control: { type: "ephemeral" } }] },
        ...messages,
      ],
    }),
  }).catch((error: unknown) => {
    console.error("chat: could not reach OpenRouter", error);
    return null;
  });

  if (!upstream?.ok || !upstream.body) {
    if (upstream) console.error(`chat: OpenRouter error ${upstream.status}: ${(await upstream.text()).slice(0, 300)}`);
    return fail(502, "upstream_error");
  }

  const source = upstream.body;
  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        let answered = false;
        let declined = false;
        for await (const chunk of readEvents(source)) {
          if (chunk.error) throw new Error(`${chunk.error.code}: ${chunk.error.message}`);
          const choice = chunk.choices?.[0];
          if (choice?.finish_reason === "content_filter") declined = true;
          if (choice?.delta?.content) {
            answered = true;
            controller.enqueue(encoder.encode(choice.delta.content));
          }
        }
        if (declined || !answered) {
          const notice = `I can't answer that one here. Please ask Louay directly at ${profile.email}.`;
          controller.enqueue(encoder.encode(answered ? `\n\n${notice}` : notice));
        }
        controller.close();
      } catch (error) {
        console.error("chat: stream failed", error);
        controller.error(error);
      }
    },
    cancel() {
      return source.cancel();
    },
  });

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}
