"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type Props = {
  sections: { id: string; title: string }[];
  next: { href: string; title: string };
};

/** Reading position sits this far down the viewport. */
const READ_LINE = 0.35;

/**
 * Case-study contents drawn as a mini process line: sections are unit
 * operations on a vertical stream, and a flow dot travels down it in step
 * with scrolling. Below xl it collapses to a thin progress bar.
 * Underneath it stays a plain ordered list of links.
 */
export function SectionNav({ sections, next }: Props) {
  const [active, setActive] = useState(-1); // -1 = before first section; sections.length = at outlet
  const list = useRef<HTMLOListElement>(null);
  const nodes = useRef<(HTMLSpanElement | null)[]>([]);
  const fill = useRef<HTMLSpanElement>(null);
  const dot = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const els = sections.map((s) => document.getElementById(s.id));
    let stops: number[] = []; // node centres (px, relative to the list) incl. outlet
    let raf = 0;
    let lastActive = -2;

    const measure = () => {
      const base = list.current?.getBoundingClientRect().top ?? 0;
      stops = nodes.current.map((n) => {
        if (!n) return 0;
        const r = n.getBoundingClientRect();
        return r.top - base + r.height / 2;
      });
    };

    const update = () => {
      raf = 0;
      if (!stops.length) measure();
      const pos = window.scrollY + window.innerHeight * READ_LINE;
      const tops = els.map((el) => (el ? el.getBoundingClientRect().top + window.scrollY : 0));
      const last = els[els.length - 1];
      const end = last ? last.getBoundingClientRect().bottom + window.scrollY : 0;
      const bounds = [...tops, end];

      // continuous position c: i + fraction between stop i and stop i+1
      let c = -1;
      if (pos >= bounds[0]) {
        c = sections.length;
        for (let i = 0; i < bounds.length - 1; i++) {
          if (pos < bounds[i + 1]) {
            c = i + (pos - bounds[i]) / Math.max(1, bounds[i + 1] - bounds[i]);
            break;
          }
        }
      }

      const idx = c < 0 ? -1 : Math.min(sections.length, Math.floor(c));
      if (idx !== lastActive) {
        lastActive = idx;
        setActive(idx);
      }

      // dot position: glide between stops, or snap to the active node
      const cc = reduce.matches ? Math.max(0, idx) : Math.max(0, c);
      const i = Math.min(stops.length - 1, Math.floor(cc));
      const f = cc - i;
      const y = i >= stops.length - 1 ? stops[stops.length - 1] : stops[i] + (stops[i + 1] - stops[i]) * f;
      const y0 = stops[0] ?? 0;
      if (dot.current) dot.current.style.transform = `translate(-50%, ${y - 4}px)`;
      if (fill.current) fill.current.style.height = `${Math.max(0, (c < 0 ? y0 : y) - y0)}px`;
      if (bar.current) bar.current.style.transform = `scaleX(${Math.min(1, Math.max(0, c / sections.length))})`;
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      onScroll();
    };

    measure();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    const ro = new ResizeObserver(onResize);
    if (list.current) ro.observe(list.current);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [sections]);

  const atOutlet = active >= sections.length;

  return (
    <>
      {/* Desktop: mini flow line */}
      <nav aria-label="Case study sections" className="sticky top-28 hidden xl:block">
        <p className="label mb-6">Contents · process line</p>
        <ol ref={list} className="relative">
          {/* stream: dashed (ahead) + solid fill (read) */}
          <span
            aria-hidden
            className="absolute top-[11px] bottom-[11px] left-[7px] w-px bg-[repeating-linear-gradient(to_bottom,var(--line-strong)_0_4px,transparent_4px_8px)]"
          />
          <span ref={fill} aria-hidden className="absolute top-[11px] left-[7px] w-px bg-signal" style={{ height: 0 }} />
          {/* flow dot */}
          <span
            ref={dot}
            aria-hidden
            className="absolute top-0 left-[7.5px] z-10 size-2 rounded-full bg-accent shadow-[0_0_10px_2px_rgba(200,162,107,0.55)]"
          />

          {sections.map((s, i) => {
            const state = i < active ? "done" : i === active ? "current" : "ahead";
            return (
              <li key={s.id} className="relative pb-[18px] last:pb-[18px]">
                <a
                  href={`#${s.id}`}
                  aria-current={state === "current" ? "location" : undefined}
                  className="group flex items-start gap-4"
                >
                  <span
                    ref={(el) => {
                      nodes.current[i] = el;
                    }}
                    aria-hidden
                    className={cn(
                      "relative z-[5] mt-[5px] grid size-[15px] shrink-0 place-items-center rounded-full border transition-colors duration-500",
                      state === "done" && "border-signal bg-signal",
                      state === "current" && "border-accent bg-bg",
                      state === "ahead" && "border-line-strong bg-bg group-hover:border-muted",
                    )}
                  >
                    {state === "current" && (
                      <>
                        <span className="size-[5px] rounded-full bg-accent" />
                        <span className="absolute inset-[-5px] rounded-full border border-accent/50 motion-safe:animate-ping" />
                      </>
                    )}
                  </span>
                  <span className="flex items-baseline gap-3">
                    <span
                      className={cn(
                        "font-mono text-[0.625rem] transition-colors",
                        state === "current" ? "text-accent" : state === "done" ? "text-signal" : "text-muted/60",
                      )}
                    >
                      /{String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "text-[0.8125rem] leading-snug transition-colors",
                        state === "current" ? "text-ink" : state === "done" ? "text-muted" : "text-muted/70 group-hover:text-ink",
                      )}
                    >
                      {s.title}
                    </span>
                  </span>
                </a>
              </li>
            );
          })}

          {/* outlet → next case study */}
          <li className="relative">
            <Link href={next.href} className="group flex items-start gap-4">
              <span
                ref={(el) => {
                  nodes.current[sections.length] = el;
                }}
                aria-hidden
                className={cn(
                  "relative z-[5] mt-[3px] grid h-[15px] w-[15px] shrink-0 place-items-center transition-colors duration-500",
                  atOutlet ? "text-accent" : "text-line-strong group-hover:text-muted",
                )}
              >
                <svg viewBox="0 0 15 15" className="size-[15px]">
                  <path d="M3 4 L7.5 11 L12 4" fill="none" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </span>
              <span className="font-mono text-[0.625rem] leading-[1.6rem] tracking-[0.12em] uppercase">
                <span className={atOutlet ? "text-accent" : "text-muted/60"}>Out ·</span>{" "}
                <span className="text-muted transition-colors group-hover:text-ink">Next: {next.title} →</span>
              </span>
            </Link>
          </li>
        </ol>
      </nav>

      {/* Below xl: thin progress bar under the top navigation */}
      <div aria-hidden className="pointer-events-none fixed inset-x-0 top-16 z-[41] h-0.5 bg-line md:top-20 xl:hidden">
        <span ref={bar} className="block h-full origin-left bg-signal" style={{ transform: "scaleX(0)" }} />
      </div>
    </>
  );
}
