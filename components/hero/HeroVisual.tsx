"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { ReactorPoster } from "./ReactorPoster";
import type { MorphBus } from "./ReactorCanvas";

const ReactorCanvas = dynamic(() => import("./ReactorCanvas"), { ssr: false });

function canRender3D() {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
  if (nav.connection?.saveData) return false;
  if ((nav.hardwareConcurrency ?? 8) <= 4) return false;
  if (nav.deviceMemory !== undefined && nav.deviceMemory < 4) return false;
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Morph (reactor → data cloud) only where the hero fits one desktop viewport. */
const MORPH_MQ = "(min-width: 80rem) and (min-height: 640px)";

/**
 * Poster first (LCP). On capable devices the WebGL bioreactor fades in; on
 * wide screens the hero is pinned and scrolling dissolves the reactor into
 * the AnaeroVision dataset.
 */
export function HeroVisual({ className }: { className?: string }) {
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const bus = useRef<MorphBus>({ target: 0, el: null });

  useEffect(() => {
    const start = () => setEnabled(canRender3D());
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    if (w.requestIdleCallback) w.requestIdleCallback(start, { timeout: 1500 });
    else setTimeout(start, 400);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    const mq = window.matchMedia(MORPH_MQ);
    const pin = wrap.current?.closest<HTMLElement>(".hero-pin");
    bus.current.el = pin ?? wrap.current;
    let raf = 0;

    const measure = () => {
      raf = 0;
      if (!pin || root.dataset.heroMorph !== "1") {
        bus.current.target = 0;
        return;
      }
      const r = pin.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      bus.current.target = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    const apply = () => {
      if (mq.matches) root.dataset.heroMorph = "1";
      else delete root.dataset.heroMorph;
      measure();
    };

    apply();
    mq.addEventListener("change", apply);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      mq.removeEventListener("change", apply);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
      delete root.dataset.heroMorph;
    };
  }, [enabled]);

  return (
    <div ref={wrap} className={cn("relative", className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[-20%] rounded-full bg-[radial-gradient(closest-side,rgba(143,160,170,0.18),transparent)]"
      />
      <ReactorPoster
        className={cn("absolute inset-0 h-full w-full transition-opacity duration-1000", ready ? "opacity-0" : "opacity-100")}
      />
      {enabled && (
        <div className={cn("absolute inset-0 transition-opacity duration-1000", ready ? "opacity-100" : "opacity-0")}>
          <ReactorCanvas bus={bus} onReady={() => setTimeout(() => setReady(true), 120)} />
        </div>
      )}

      {/* Caption: ML loop (fades as the reactor dissolves) */}
      <p
        className="absolute inset-x-0 -bottom-2 text-center font-mono text-[0.625rem] tracking-[0.12em] text-muted uppercase"
        style={{ opacity: "var(--solid)" }}
      >
        <span className="text-signal">Process data</span> → <span className="text-signal">ML model</span> →{" "}
        <span className="text-accent">optimised operating conditions</span>
      </p>

      {/* Caption + legend: data cloud */}
      <div
        aria-hidden={!enabled}
        className="pointer-events-none absolute inset-x-0 -bottom-2 flex flex-col items-center gap-1.5 text-center font-mono text-[0.625rem] tracking-[0.1em] text-muted uppercase"
        style={{ opacity: "var(--cloud)" }}
      >
        <span className="text-ink">AnaeroVision dataset · 1,500 digestion records</span>
        <span className="flex gap-4">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-[#d9a75f]" /> Inhibited · 281
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-signal" /> Stable · 1,219
          </span>
        </span>
      </div>
    </div>
  );
}
