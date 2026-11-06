"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ArrowUp, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { profile } from "@/content/profile";
import { cn } from "@/lib/cn";
import { LouAI, type Mood } from "./LouAI";

const GREETING = "Hello recruiter, what an excellent choice!";
const INTRO = "I'm LouAI, Louay's robot lab assistant. I've read every project on this site so you don't have to. Ask me anything about Louay's work, skills or availability.";
const QUIPS = [
  "Careful, I'm calibrated.",
  "That tickles my sensors.",
  "Poking is not a question.",
  "Still smarter than a spreadsheet.",
];
const QUIP_MS = 2800;
const SUGGESTIONS = [
  "What does Louay do, in simple terms?",
  "Which project should I look at first?",
  "Is Louay available, and where?",
  "What tools does Louay use?",
];
const MAX_CHARS = 1000;
const MAX_HISTORY = 20;
const GREETING_DELAY_MS = 900;
const GREETING_VISIBLE_MS = 12000;

type Message = { role: "user" | "assistant"; content: string; failed?: boolean };

/** The API needs a recent slice of real turns that starts with the visitor. */
function toHistory(messages: Message[]) {
  const turns = messages.filter((m) => !m.failed && m.content).slice(-MAX_HISTORY);
  while (turns[0]?.role === "assistant") turns.shift();
  return turns.map(({ role, content }) => ({ role, content }));
}

const LINKS = /(https?:\/\/[^\s)]*[^\s).,]|[\w.+-]+@[\w-]+(?:\.[\w-]+)+|(?<![\w/.])\/(?:work\/[a-z-]+|work|about)\b)/g;

/** Answers are plain text; turn URLs, emails and site paths into links. */
function withLinks(text: string): ReactNode[] {
  const link = "text-accent underline underline-offset-2";
  return text.split(LINKS).map((part, i) => {
    if (i % 2 === 0) return part;
    if (part.startsWith("/")) return <Link key={i} href={part} className={link}>{part}</Link>;
    const href = part.startsWith("http") ? part : `mailto:${part}`;
    return <a key={i} href={href} target="_blank" rel="noopener noreferrer" className={link}>{part}</a>;
  });
}

function Bubble({ role, children }: { role: Message["role"]; children: ReactNode }) {
  return (
    <div
      className={cn(
        "max-w-[88%] px-3.5 py-2.5 text-[0.875rem] leading-relaxed [overflow-wrap:anywhere] whitespace-pre-wrap",
        role === "user" ? "ml-auto bg-accent text-accent-ink" : "border border-line bg-bg-elev/60 text-ink",
      )}
    >
      {children}
    </div>
  );
}

export function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [greeting, setGreeting] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const reduce = useReducedMotion();
  const launcher = useRef<HTMLButtonElement>(null);
  const field = useRef<HTMLInputElement>(null);
  const log = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);
  const [hovered, setHovered] = useState(false);
  const [quip, setQuip] = useState<string | null>(null);
  const pokes = useRef(0);
  const quipTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Greet the visitor when the portfolio opens.
  useEffect(() => {
    const show = setTimeout(() => setGreeting(true), GREETING_DELAY_MS);
    const hide = setTimeout(() => setGreeting(false), GREETING_DELAY_MS + GREETING_VISIBLE_MS);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, []);

  useEffect(() => {
    if (open) field.current?.focus();
    else if (wasOpen.current) launcher.current?.focus();
    wasOpen.current = open;
  }, [open]);

  useEffect(() => {
    log.current?.scrollTo({ top: log.current.scrollHeight });
  }, [messages, open]);

  const openChat = () => {
    setGreeting(false);
    setOpen(true);
  };

  const closeChat = () => setOpen(false);

  const updateLast = (patch: (m: Message) => Message) =>
    setMessages((list) => [...list.slice(0, -1), patch(list[list.length - 1])]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;

    const asked: Message[] = [...messages, { role: "user", content }];
    setMessages([...asked, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: toHistory(asked) }),
      });
      if (res.status === 429) {
        updateLast((m) => ({ ...m, failed: true, content: `That's a lot of questions! Please try again in a few minutes, or write to Louay at ${profile.email}.` }));
        return;
      }
      if (!res.ok || !res.body) throw new Error(`chat failed: ${res.status}`);

      const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        updateLast((m) => ({ ...m, content: m.content + value.replaceAll("**", "") }));
      }
    } catch {
      updateLast((m) => ({
        ...m,
        failed: true,
        content: `${m.content ? `${m.content}\n\n` : ""}My circuits need a moment, sorry. You can reach Louay directly at ${profile.email}.`,
      }));
    } finally {
      setBusy(false);
      field.current?.focus();
    }
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void send(input);
  };

  const poke = () => {
    setQuip(QUIPS[pokes.current++ % QUIPS.length]);
    clearTimeout(quipTimer.current);
    quipTimer.current = setTimeout(() => setQuip(null), QUIP_MS);
  };

  const last = messages[messages.length - 1];
  const mood: Mood = busy
    ? last?.content ? "talking" : "thinking"
    : last?.failed ? "oops"
    : quip ? "wink"
    : input ? "listening"
    : "idle";

  const fade = reduce ? { opacity: 0 } : { opacity: 0, y: 12 };

  return (
    <div className="print:hidden max-md:in-data-[menu-open]:hidden">
      {/* Greeting and launcher */}
      <div className={cn("fixed right-3 bottom-3 z-50 flex flex-col items-end gap-2 md:right-6 md:bottom-5", open && "hidden")}>
        <AnimatePresence>
          {greeting && (
            <motion.div
              initial={fade}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="relative mr-2 flex max-w-[17rem] items-start gap-2 border border-line-strong bg-bg-elev py-3 pr-2 pl-4 shadow-xl"
            >
              <button type="button" onClick={openChat} className="text-left">
                <span className="label block text-accent normal-case">LouAI</span>
                <span className="mt-1 block text-[0.9375rem] leading-snug text-ink">{GREETING}</span>
              </button>
              <button
                type="button"
                onClick={() => setGreeting(false)}
                aria-label="Dismiss greeting"
                className="-mt-1 grid size-8 shrink-0 place-items-center text-muted hover:text-ink"
              >
                <X aria-hidden className="size-4" />
              </button>
              <span aria-hidden className="absolute right-10 -bottom-[7px] size-3 rotate-45 border-r border-b border-line-strong bg-bg-elev" />
            </motion.div>
          )}
        </AnimatePresence>
        <button
          ref={launcher}
          type="button"
          onClick={openChat}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          aria-label="Chat with LouAI"
          className="group flex flex-col items-center transition-transform duration-300 hover:-translate-y-1"
        >
          <LouAI mood={greeting || hovered ? "wink" : "idle"} wave={greeting || hovered} className="h-[5.5rem] w-auto md:h-28" />
          <span className="mt-0.5 bg-accent px-2.5 py-1 font-mono text-[0.6875rem] font-medium tracking-wide text-accent-ink shadow-lg">
            Ask LouAI
          </span>
        </button>
      </div>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Chat with LouAI, Louay's AI assistant"
            initial={fade}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onKeyDown={(e) => e.key === "Escape" && closeChat()}
            className="fixed inset-x-3 bottom-3 z-50 flex h-[min(36rem,calc(100dvh-1.5rem))] flex-col border border-line-strong bg-bg shadow-2xl md:inset-x-auto md:right-6 md:bottom-6 md:w-[24rem]"
          >
            <header className="flex items-center justify-between gap-2 border-b border-line py-2 pr-2 pl-3">
              <div className="flex min-w-0 items-center gap-3">
                <button type="button" onClick={poke} aria-label="Poke LouAI" className="shrink-0 transition-transform hover:scale-105 active:scale-95">
                  <LouAI mood={mood} headOnly className="h-12 w-auto" />
                </button>
                <div className="min-w-0">
                  <p className="text-sm font-medium">LouAI</p>
                  <p aria-live="polite" className={quip ? "text-[0.75rem] text-accent" : "label"}>
                    {quip ?? "AI assistant"}
                  </p>
                </div>
              </div>
              <button type="button" onClick={closeChat} aria-label="Close chat" className="grid size-10 place-items-center text-muted hover:text-ink">
                <X aria-hidden className="size-5" />
              </button>
            </header>

            <div ref={log} role="log" aria-live="polite" className="flex-1 space-y-3 overflow-y-auto overscroll-contain p-4">
              <Bubble role="assistant">{GREETING}</Bubble>
              <Bubble role="assistant">{INTRO}</Bubble>
              {messages.length === 0 && (
                <div className="flex flex-col items-start gap-2 pt-1">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => void send(s)}
                      className="border border-line px-3 py-2 text-left text-[0.8125rem] text-muted transition-colors hover:border-accent hover:text-ink"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
              {messages.map((m, i) =>
                m.content ? (
                  <Bubble key={i} role={m.role}>
                    {m.role === "assistant" ? withLinks(m.content) : m.content}
                  </Bubble>
                ) : (
                  <p key={i} className="label animate-pulse normal-case">
                    LouAI is thinking
                  </p>
                ),
              )}
            </div>

            <form onSubmit={onSubmit} className="border-t border-line p-3">
              <div className="flex gap-2">
                <input
                  ref={field}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  maxLength={MAX_CHARS}
                  aria-label="Your question"
                  placeholder="Ask a question"
                  className="h-11 min-w-0 flex-1 border border-line bg-bg-deep/60 px-3 text-base text-ink outline-none placeholder:text-muted focus:border-accent md:text-sm"
                />
                <button
                  type="submit"
                  disabled={busy || !input.trim()}
                  aria-label="Send"
                  className="grid size-11 shrink-0 place-items-center bg-accent text-accent-ink transition-opacity disabled:opacity-40"
                >
                  <ArrowUp aria-hidden className="size-4" />
                </button>
              </div>
              <p className="mt-2 text-[0.6875rem] leading-snug text-muted">
                AI-generated from this portfolio and may contain mistakes. Please confirm key details with Louay.
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
