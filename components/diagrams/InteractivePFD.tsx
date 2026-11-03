"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

// Source: pfd/README.md §3–4 and pfd/PFD_Biogas.png (DWSIM 10.2.11, Peng-Robinson)
type Comp = { CH4?: number; CO2?: number; H2O?: number; O2?: number; N2?: number };
type Stream = { id: string; desc: string; T: number; P: number; F: number; phase: string; x: Comp };
type Unit = { id: string; name: string; fn: string; duty?: { tag: string; kw: number; dir: "removed" | "added" } };

const STREAMS: Record<string, Stream> = {
  S1: { id: "S1", desc: "Raw biogas", T: 37, P: 1.05, F: 4.46, phase: "V", x: { CH4: 0.58, CO2: 0.36, H2O: 0.06 } },
  S2: { id: "S2", desc: "Cooled gas", T: 5, P: 1.05, F: 4.46, phase: "V+L", x: { CH4: 0.58, CO2: 0.36, H2O: 0.06 } },
  S3: { id: "S3", desc: "Dry gas", T: 5, P: 1.05, F: 4.221, phase: "V", x: { CH4: 0.613, CO2: 0.38, H2O: 0.007 } },
  S4: { id: "S4", desc: "Condensate", T: 5, P: 1.05, F: 0.239, phase: "L", x: { H2O: 1 } },
  S3b: { id: "S3b", desc: "Warmed gas", T: 25, P: 1.05, F: 4.221, phase: "V", x: { CH4: 0.613, CO2: 0.38, H2O: 0.007 } },
  S5: { id: "S5", desc: "Air", T: 25, P: 1.05, F: 28.3, phase: "V", x: { O2: 0.21, N2: 0.79 } },
  S6: { id: "S6", desc: "Mixed gas", T: 25, P: 1.05, F: 32.52, phase: "V", x: { CH4: 0.0795, CO2: 0.0494, H2O: 0.0009, O2: 0.1827, N2: 0.6875 } },
  S7: { id: "S7", desc: "Hot flue gas", T: 800, P: 1.05, F: 32.52, phase: "V", x: { CH4: 0.0008, CO2: 0.1281, H2O: 0.1584, O2: 0.0252, N2: 0.6875 } },
  S8: { id: "S8", desc: "Cooled flue gas", T: 120, P: 1.05, F: 32.52, phase: "V", x: { CH4: 0.0008, CO2: 0.1281, H2O: 0.1584, O2: 0.0252, N2: 0.6875 } },
};

const UNITS: Record<string, Unit> = {
  "E-101": { id: "E-101", name: "Cooler", fn: "Cools biogas from 37 °C to 5 °C so the water condenses.", duty: { tag: "Q-101", kw: 4.08, dir: "removed" } },
  "V-101": { id: "V-101", name: "Gas–liquid separator", fn: "Splits the dry gas (S3) from the condensate (S4)." },
  "E-102": { id: "E-102", name: "Heater", fn: "Warms the dry gas from 5 °C to 25 °C.", duty: { tag: "Q-102", kw: 0.84, dir: "added" } },
  "M-101": { id: "M-101", name: "Mixer", fn: "Mixes the warmed gas (S3b) with combustion air (S5)." },
  "R-101": { id: "R-101", name: "Conversion reactor", fn: "CH₄ + 2 O₂ → CO₂ + 2 H₂O at 99% conversion; outlet fixed at 800 °C.", duty: { tag: "Q-R101", kw: 331.9, dir: "removed" } },
  "E-103": { id: "E-103", name: "Flue-gas cooler", fn: "Cools the flue gas from 800 °C to 120 °C: the recoverable heat.", duty: { tag: "Q-103", kw: 212.3, dir: "removed" } },
};

const COMP_COLORS: Record<keyof Comp, string> = {
  CH4: "#c8a26b",
  CO2: "#5f7a86",
  H2O: "#7fb6a8",
  O2: "#b9c6cc",
  N2: "#46545d",
};

const Y = 150;

type Sel = string;

function Hit({
  id, sel, set, label, children,
}: { id: string; sel: Sel; set: (s: Sel) => void; label: string; children: React.ReactNode }) {
  const active = sel === id;
  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={label}
      aria-pressed={active}
      onMouseEnter={() => set(id)}
      onFocus={() => set(id)}
      onClick={() => set(id)}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), set(id))}
      className="cursor-pointer outline-none"
      data-active={active || undefined}
    >
      {children}
    </g>
  );
}

function StreamLine({ id, d, sel, set, lx, ly, interactive }: { id: string; d: string; sel: Sel; set: (s: Sel) => void; lx: number; ly: number; interactive: boolean }) {
  const s = STREAMS[id];
  const active = sel === id;
  const body = (
    <>
      <path d={d} fill="none" stroke="transparent" strokeWidth="16" />
      <path d={d} fill="none" stroke={active ? "#e7ecee" : "rgba(231,236,238,0.35)"} strokeWidth="1.4" />
      <path d={d} fill="none" stroke="#7fb6a8" strokeWidth="1.4" className="stream-flow" opacity={active ? 1 : 0.7} />
      <text x={lx} y={ly} fontSize="12" fontFamily="var(--font-mono)" fill={active ? "#c8a26b" : "#8c9aa3"} textAnchor="middle">{id}</text>
    </>
  );
  if (!interactive) return <g>{body}</g>;
  return <Hit id={id} sel={sel} set={set} label={`Stream ${id}: ${s.desc}, ${s.T} °C, ${s.F} kmol/h`}>{body}</Hit>;
}

function Energy({ x, y1, y2, tag, kw, into = false }: { x: number; y1: number; y2: number; tag: string; kw: number; into?: boolean }) {
  const tipY = into ? y2 : y1;
  const dir = into ? 1 : -1;
  return (
    <g>
      <line x1={x} x2={x} y1={y1} y2={y2} stroke="#c8a26b" strokeOpacity="0.7" strokeWidth="1.2" strokeDasharray="3 4" />
      <path d={`M${x - 4},${tipY - dir * 7} L${x},${tipY} L${x + 4},${tipY - dir * 7}`} fill="none" stroke="#c8a26b" strokeWidth="1.2" />
      <text x={x} y={Math.min(y1, y2) - 18} fontSize="11.5" fontFamily="var(--font-mono)" fill="#c8a26b" textAnchor="middle">{tag}</text>
      <text x={x} y={Math.min(y1, y2) - 5} fontSize="11" fontFamily="var(--font-mono)" fill="#8c9aa3" textAnchor="middle">{kw} kW</text>
    </g>
  );
}

function UnitShape({ id, sel, set, interactive, children, tx, ty }: { id: string; sel: Sel; set: (s: Sel) => void; interactive: boolean; children: React.ReactNode; tx: number; ty: number }) {
  const u = UNITS[id];
  const active = sel === id;
  const body = (
    <>
      <g
        stroke={active ? "#c8a26b" : "rgba(231,236,238,0.75)"}
        fill={active ? "rgba(200,162,107,0.08)" : "#1f272d"}
        strokeWidth="1.4"
        style={{ transition: "stroke 0.3s, fill 0.3s" }}
      >
        {children}
      </g>
      <text x={tx} y={ty} fontSize="12" fontFamily="var(--font-mono)" fill={active ? "#c8a26b" : "#e7ecee"} textAnchor="middle">{u.id}</text>
      <text x={tx} y={ty + 15} fontSize="11" fill="#8c9aa3" textAnchor="middle">{u.name}</text>
    </>
  );
  if (!interactive) return <g>{body}</g>;
  return <Hit id={id} sel={sel} set={set} label={`Unit ${u.id}: ${u.name}`}>{body}</Hit>;
}

function Exchanger({ cx }: { cx: number }) {
  return (
    <>
      <circle cx={cx} cy={Y} r="28" />
      <path d={`M${cx + 16},${Y - 16} L${cx - 12},${Y} L${cx + 16},${Y + 16}`} fill="none" />
    </>
  );
}

export function PFDDrawing({ sel, set, interactive }: { sel: Sel; set: (s: Sel) => void; interactive: boolean }) {
  const p = { sel, set, interactive };
  return (
    <svg viewBox="0 0 1000 330" className="w-full" role={interactive ? "group" : "img"} aria-label="Process flow diagram: biogas cooler E-101, separator V-101, heater E-102, mixer M-101, combustion reactor R-101 and flue-gas cooler E-103">
      {/* material streams */}
      <StreamLine id="S1" d={`M10,${Y} L72,${Y}`} lx={36} ly={Y - 10} {...p} />
      <StreamLine id="S2" d={`M128,${Y} L206,${Y}`} lx={168} ly={Y - 10} {...p} />
      <StreamLine id="S4" d={`M230,${Y + 42} L230,${Y + 100}`} lx={248} ly={Y + 80} {...p} />
      <StreamLine id="S3" d={`M254,${Y - 20} L300,${Y - 20} L300,${Y} L332,${Y}`} lx={290} ly={Y - 30} {...p} />
      <StreamLine id="S3b" d={`M388,${Y} L462,${Y}`} lx={425} ly={Y - 10} {...p} />
      <StreamLine id="S5" d={`M490,${Y + 110} L490,${Y + 28}`} lx={508} ly={Y + 84} {...p} />
      <StreamLine id="S6" d={`M518,${Y} L608,${Y}`} lx={563} ly={Y - 10} {...p} />
      <StreamLine id="S7" d={`M652,${Y} L752,${Y}`} lx={702} ly={Y - 10} {...p} />
      <StreamLine id="S8" d={`M808,${Y} L985,${Y}`} lx={895} ly={Y - 10} {...p} />
      {/* arrowheads */}
      {[72, 206, 332, 462, 608, 752, 985].map((x) => (
        <path key={x} d={`M${x - 7},${Y - 4} L${x},${Y} L${x - 7},${Y + 4}`} fill="none" stroke="#7fb6a8" strokeWidth="1.4" />
      ))}
      <path d={`M226,${Y + 93} L230,${Y + 100} L234,${Y + 93}`} fill="none" stroke="#7fb6a8" strokeWidth="1.4" />
      <path d={`M486,${Y + 35} L490,${Y + 28} L494,${Y + 35}`} fill="none" stroke="#7fb6a8" strokeWidth="1.4" />

      {/* energy streams */}
      <Energy x={100} y1={74} y2={122} tag="Q-101" kw={4.08} />
      <Energy x={360} y1={74} y2={122} tag="Q-102" kw={0.84} into />
      <Energy x={630} y1={54} y2={100} tag="Q-R101" kw={331.9} />
      <Energy x={780} y1={74} y2={122} tag="Q-103" kw={212.3} />

      {/* units */}
      <UnitShape id="E-101" tx={100} ty={Y + 52} {...p}><Exchanger cx={100} /></UnitShape>
      <UnitShape id="V-101" tx={230} ty={Y + 128} {...p}>
        <rect x={208} y={Y - 42} width="44" height="84" rx="12" />
        <line x1={208} x2={252} y1={Y + 20} y2={Y + 20} strokeDasharray="2 3" />
      </UnitShape>
      <UnitShape id="E-102" tx={360} ty={Y + 52} {...p}><Exchanger cx={360} /></UnitShape>
      <UnitShape id="M-101" tx={490} ty={Y + 128} {...p}>
        <rect x={462} y={Y - 28} width="56" height="56" />
        <path d={`M470,${Y - 20} L510,${Y + 20} M510,${Y + 20} L510,${Y + 8}`} fill="none" />
      </UnitShape>
      <UnitShape id="R-101" tx={630} ty={Y + 72} {...p}>
        <rect x={608} y={Y - 50} width="44" height="100" rx="10" />
        <rect x={608} y={Y - 22} width="44" height="44" fill="url(#hatch)" />
      </UnitShape>
      <UnitShape id="E-103" tx={780} ty={Y + 52} {...p}><Exchanger cx={780} /></UnitShape>

      <defs>
        <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="rgba(231,236,238,0.45)" strokeWidth="1" />
        </pattern>
      </defs>
    </svg>
  );
}

function CompositionBar({ x }: { x: Comp }) {
  const entries = (Object.keys(COMP_COLORS) as (keyof Comp)[]).filter((k) => x[k]);
  return (
    <div>
      <div className="flex h-2 w-full overflow-hidden bg-line">
        {entries.map((k) => (
          <span key={k} style={{ width: `${x[k]! * 100}%`, background: COMP_COLORS[k] }} />
        ))}
      </div>
      <ul className="mt-3 grid grid-cols-3 gap-x-3 gap-y-1.5 font-mono text-[0.6875rem] sm:grid-cols-5">
        {entries.map((k) => (
          <li key={k} className="flex items-center gap-1.5 text-muted">
            <span className="size-1.5 rounded-full" style={{ background: COMP_COLORS[k] }} />
            {k.replace("4", "₄").replace("2", "₂")} <span className="text-ink">{x[k]! >= 0.999 ? "≈1" : x[k]!.toFixed(3)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Detail({ sel }: { sel: Sel }) {
  const s = STREAMS[sel];
  const u = UNITS[sel];
  if (s) {
    return (
      <div aria-live="polite">
        <p className="label">Stream</p>
        <p className="mt-2 text-xl font-medium">
          <span className="font-mono text-accent">{s.id}</span> · {s.desc}
        </p>
        <dl className="mt-5 grid grid-cols-4 gap-4 font-mono">
          {[
            ["T", `${s.T} °C`],
            ["P", `${s.P} bar`],
            ["Flow", `${s.F} kmol/h`],
            ["Phase", s.phase],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-[0.625rem] tracking-widest text-muted uppercase">{k}</dt>
              <dd className="mt-1 text-[0.875rem] text-ink">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="label mt-6 mb-3">Mole fractions</p>
        <CompositionBar x={s.x} />
      </div>
    );
  }
  return (
    <div aria-live="polite">
      <p className="label">Unit</p>
      <p className="mt-2 text-xl font-medium">
        <span className="font-mono text-accent">{u.id}</span> · {u.name}
      </p>
      <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted">{u.fn}</p>
      {u.duty && (
        <div className="mt-6 flex items-baseline gap-3 font-mono">
          <span className="text-[0.75rem] text-muted">{u.duty.tag}</span>
          <span className="text-3xl tracking-tight text-ink">{u.duty.kw} kW</span>
          <span className="text-[0.75rem] text-muted">heat {u.duty.dir}</span>
        </div>
      )}
    </div>
  );
}

export function InteractivePFD() {
  const [sel, setSel] = useState<Sel>("R-101");
  return (
    <div>
      <div className="-mx-5 overflow-x-auto px-5 md:mx-0 md:px-0">
        <div className="min-w-[720px]">
          <PFDDrawing sel={sel} set={setSel} interactive />
        </div>
      </div>
      <p className="mt-2 font-mono text-[0.625rem] text-muted md:hidden">← Scroll the diagram · tap a unit or stream</p>
      <div className="mt-6 grid gap-6 border-t border-line pt-6 md:grid-cols-[1fr_auto]">
        <Detail sel={sel} />
        <div className="flex flex-wrap content-start gap-1.5 md:max-w-[240px] md:justify-end">
          {[...Object.keys(UNITS), ...Object.keys(STREAMS)].map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setSel(id)}
              aria-pressed={sel === id}
              className={cn(
                "border px-2 py-1 font-mono text-[0.6875rem] transition-colors",
                sel === id ? "border-accent text-accent" : "border-line text-muted hover:text-ink",
              )}
            >
              {id}
            </button>
          ))}
        </div>
      </div>
      <details className="mt-6 border-t border-line pt-4">
        <summary className="label cursor-pointer hover:text-ink">Full stream table</summary>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] font-mono text-[0.75rem]">
            <thead>
              <tr className="text-muted">
                <th scope="col" className="py-2 text-left font-normal">Stream</th>
                {Object.keys(STREAMS).map((k) => <th key={k} scope="col" className="py-2 text-right font-normal">{k}</th>)}
              </tr>
            </thead>
            <tbody>
              {([
                ["T (°C)", (s: Stream) => s.T],
                ["P (bar)", (s: Stream) => s.P],
                ["Flow (kmol/h)", (s: Stream) => s.F],
                ["x CH₄", (s: Stream) => s.x.CH4 ?? "–"],
                ["x CO₂", (s: Stream) => s.x.CO2 ?? "–"],
                ["x H₂O", (s: Stream) => (s.x.H2O === 1 ? "≈1" : s.x.H2O ?? "–")],
                ["x O₂", (s: Stream) => s.x.O2 ?? "–"],
                ["x N₂", (s: Stream) => s.x.N2 ?? "–"],
              ] as const).map(([label, fn]) => (
                <tr key={label} className="border-t border-line">
                  <th scope="row" className="py-2 text-left font-normal text-muted">{label}</th>
                  {Object.values(STREAMS).map((s) => <td key={s.id} className="py-2 text-right">{String(fn(s))}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}

export function PFDCover() {
  return <PFDDrawing sel="" set={() => {}} interactive={false} />;
}
