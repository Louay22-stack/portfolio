"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/cn";

export type Mood = "idle" | "wink" | "listening" | "thinking" | "talking" | "oops";

/* The site's signal and accent colours, with the signal lifted slightly so it reads as a glow. */
const SAGE = "#8fcdbb";
const GOLD = "#c8a26b";
const LEAF = "#9ccf9f";
const SHELL = "#283239";

/** Where LouAI looks when he is not following the cursor (-1 to 1). */
const FIXED_GAZE: Partial<Record<Mood, [number, number]>> = {
  listening: [0, 1],
  thinking: [-0.7, -0.9],
  talking: [0, 0],
  oops: [0, 0.4],
};

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function Molecule({ x, y, delay, color }: { x: number; y: number; delay: string; color: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="louai-float" style={{ animationDelay: delay }}>
        <path d="M0 0 L7 -4 M0 0 L1 8" stroke={color} strokeWidth="1.2" opacity="0.7" />
        <circle r="2.8" fill={color} />
        <circle cx="7" cy="-4" r="1.9" fill={GOLD} />
        <circle cx="1" cy="8" r="1.9" fill={LEAF} />
      </g>
    </g>
  );
}

export function LouAI({
  mood = "idle",
  wave = false,
  headOnly = false,
  className,
}: { mood?: Mood; wave?: boolean; headOnly?: boolean; className?: string }) {
  const id = useId().replace(/\W/g, "");
  const root = useRef<SVGSVGElement>(null);
  const head = useRef<SVGGElement>(null);
  const eyes = useRef<SVGGElement>(null);
  const [blink, setBlink] = useState(false);

  // Eyes and head follow the cursor unless the mood fixes his gaze.
  useEffect(() => {
    const look = (x: number, y: number) => {
      if (eyes.current) eyes.current.style.transform = `translate(${x * 4}px, ${y * 3}px)`;
      if (head.current) head.current.style.transform = `translate(${x * 1.5}px, ${y}px) rotate(${x * 3}deg)`;
    };

    const fixed = FIXED_GAZE[mood];
    if (fixed) return look(...fixed);
    if (prefersReducedMotion()) return look(0, 0);

    let frame = 0;
    const onMove = (e: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const box = root.current?.getBoundingClientRect();
        if (!box?.width) return;
        const dx = e.clientX - (box.left + box.width / 2);
        const dy = e.clientY - (box.top + box.height * 0.35);
        const dist = Math.hypot(dx, dy) || 1;
        const reach = Math.min(1, dist / 220);
        look((dx / dist) * reach, (dy / dist) * reach);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, [mood]);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      timer = setTimeout(() => {
        setBlink(true);
        timer = setTimeout(() => {
          setBlink(false);
          schedule();
        }, 130);
      }, 2200 + Math.random() * 3800);
    };
    schedule();
    return () => clearTimeout(timer);
  }, []);

  const metal = `url(#${id}m)`;
  const glow = `url(#${id}g)`;
  const eyeHeight = blink ? 2 : mood === "thinking" ? 10 : 14;

  return (
    <svg
      ref={root}
      viewBox={headOnly ? "2 -12 116 92" : "0 -12 120 148"}
      aria-hidden
      className={cn("overflow-visible", className)}
    >
      <defs>
        <radialGradient id={`${id}m`} cx="35%" cy="22%" r="85%">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.45" stopColor="#eef3f6" />
          <stop offset="0.8" stopColor="#c8ced1" />
          <stop offset="1" stopColor="#939da3" />
        </radialGradient>
        <radialGradient id={`${id}v`} cx="50%" cy="35%" r="80%">
          <stop offset="0" stopColor="#283239" />
          <stop offset="1" stopColor="#12171a" />
        </radialGradient>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.22" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <filter id={`${id}g`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="1.6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {!headOnly && (
        <>
          <ellipse className="louai-shadow" cx="60" cy="130" rx="27" ry="4" fill="#000" opacity="0.35" />
          <Molecule x={4} y={6} delay="0s" color={SAGE} />
          <Molecule x={110} y={74} delay="-1.6s" color={SAGE} />
          <Molecule x={3} y={82} delay="-3s" color={LEAF} />
        </>
      )}

      <g className={headOnly ? undefined : "louai-bob"}>
        {!headOnly && (
          <>
            {/* Right arm */}
            <path d="M83 92 Q94 96 96 106" fill="none" stroke="#b9c1c5" strokeWidth="8" strokeLinecap="round" />
            <circle cx="96" cy="108" r="5.5" fill={metal} />

            {/* Left arm */}
            <g className={wave ? "louai-wave" : undefined}>
              <path d="M37 92 Q26 96 24 106" fill="none" stroke="#ccd3d6" strokeWidth="8" strokeLinecap="round" />
              <circle cx="24" cy="108" r="5.5" fill={metal} />
            </g>

            {/* Body */}
            <path d="M60 76 C80 76 88 92 86 104 C84 118 72 124 60 124 C48 124 36 118 34 104 C32 92 40 76 60 76Z" fill={metal} />
            <path d="M42 112 Q60 124 78 112" fill="none" stroke={GOLD} strokeWidth="1.2" opacity="0.55" />

            {/* Chest badge */}
            <g filter={glow}>
              <rect x="45" y="93" width="27" height="15" rx="4" fill="#161c20" stroke={SAGE} strokeWidth="1.3" />
              <text x="58.5" y="103.6" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="8" fontWeight="700" fill={SAGE}>
                7050
              </text>
            </g>

            {/* DNA detail */}
            <g transform="translate(1.5 0)" fill="none" stroke={LEAF} strokeWidth="1.3" strokeLinecap="round">
              <path d="M75 92 C81 96 73 100 79 104 C83 107 77 110 79 113" />
              <path d="M79 92 C73 96 81 100 75 104 C72 107 77 110 75 113" />
              <path d="M75.5 97.5 H78.5 M75.5 108 H78.5" opacity="0.8" />
            </g>

            {/* Neck */}
            <rect x="49" y="70" width="22" height="10" rx="5" fill={SHELL} />
            <rect x="49" y="74" width="22" height="2" fill={GOLD} filter={glow} />
          </>
        )}

        <g ref={head} className="louai-head">
          {/* Head and visor */}
          <rect x="16" y="10" width="88" height="66" rx="31" fill={metal} />
          <ellipse cx="42" cy="17" rx="17" ry="3.5" fill="#fff" opacity="0.85" />
          <rect x="25" y="21" width="70" height="45" rx="21" fill={`url(#${id}v)`} />
          <path d="M31 36 C33 26 42 24 52 24 H68 C78 24 87 26 89 36 C70 30 50 30 31 36Z" fill={`url(#${id}s)`} />
          <ellipse cx="34" cy="53" rx="5" ry="3" fill={GOLD} opacity="0.3" />
          <ellipse cx="86" cy="53" rx="5" ry="3" fill={GOLD} opacity="0.3" />

          {/* Headphones */}
          <path d="M12 38 C12 -9 108 -9 108 38" fill="none" stroke={SHELL} strokeWidth="6" strokeLinecap="round" />
          <path d="M12 38 C12 -9 108 -9 108 38" fill="none" stroke={GOLD} strokeWidth="1.4" strokeLinecap="round" />
          <rect x="4" y="29" width="17" height="31" rx="8.5" fill={SHELL} stroke={GOLD} strokeWidth="1.5" />
          <rect x="99" y="29" width="17" height="31" rx="8.5" fill={SHELL} stroke={GOLD} strokeWidth="1.5" />
          <circle cx="11" cy="44.5" r="2.6" fill={GOLD} filter={glow} />
          <circle cx="109" cy="44.5" r="2.6" fill={GOLD} filter={glow} />

          {/* Antenna */}
          <path d="M60 11 Q60 2 67 -2" fill="none" stroke="#a3adb2" strokeWidth="2.5" strokeLinecap="round" />
          <circle className={mood === "thinking" ? "louai-pulse" : undefined} cx="68" cy="-3" r="4" fill={SAGE} filter={glow} />

          {/* Face */}
          <g ref={eyes} className="louai-eyes" filter={glow}>
            {mood === "oops" ? (
              <g fill="none" stroke={SAGE} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M41 35 L49 41 L41 47" />
                <path d="M79 35 L71 41 L79 47" />
              </g>
            ) : (
              <>
                <rect x="41" y={41 - eyeHeight / 2} width="10" height={eyeHeight} rx={blink ? 1 : 5} fill={SAGE} />
                {mood === "wink" ? (
                  <path d="M68 43 Q74 36 80 43" fill="none" stroke={SAGE} strokeWidth="3.4" strokeLinecap="round" />
                ) : (
                  <rect x="69" y={41 - eyeHeight / 2} width="10" height={eyeHeight} rx={blink ? 1 : 5} fill={SAGE} />
                )}
              </>
            )}
          </g>
          <g filter={glow}>
            {mood === "talking" ? (
              <ellipse className="louai-talk" cx="60" cy="55" rx="6" ry="4.5" fill={SAGE} />
            ) : mood === "thinking" ? (
              <path d="M52 56 q4 -3 8 0 t8 0" fill="none" stroke={SAGE} strokeWidth="2.8" strokeLinecap="round" />
            ) : mood === "oops" ? (
              <circle cx="60" cy="56" r="3" fill="none" stroke={SAGE} strokeWidth="2.6" />
            ) : (
              <path d="M47 53 Q59 63 74 49" fill="none" stroke={SAGE} strokeWidth="3" strokeLinecap="round" />
            )}
          </g>
        </g>
      </g>
    </svg>
  );
}
