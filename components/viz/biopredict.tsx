import benchmarks from "@/content/data/bp-benchmarks.json";
import env from "@/content/data/bp-environmental.json";
import production from "@/content/data/bp-production.json";
import strains from "@/content/data/bp-strains.json";
import results from "@/content/data/bp-model-results.json";
import { C, LegendItem } from "./ChartFrame";

const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;

/* ───────────────────────── Footprint small multiples (log scale) ───────────────────────── */

export function BPFootprint() {
  const scp = {
    protein_source: "SCP (6-strain mean)",
    water_use_L_per_kg_protein: mean(env.map((e) => e.water_use_L_per_kg_protein)),
    land_use_m2_per_kg_protein: mean(env.map((e) => e.land_use_m2_per_kg_protein)),
    ghg_emissions_kg_co2eq_per_kg: mean(env.map((e) => e.ghg_emissions_kg_co2eq_per_kg)),
    energy_use_kwh_per_kg: mean(env.map((e) => e.energy_use_kwh_per_kg)),
  };
  const all = [...benchmarks, scp];
  const metrics = [
    { key: "water_use_L_per_kg_protein", label: "Water", unit: "L/kg" },
    { key: "land_use_m2_per_kg_protein", label: "Land", unit: "m²/kg" },
    { key: "ghg_emissions_kg_co2eq_per_kg", label: "GHG", unit: "kg CO₂e/kg" },
    { key: "energy_use_kwh_per_kg", label: "Energy", unit: "kWh/kg" },
  ] as const;

  const fmt = (v: number) =>
    v >= 100 ? Math.round(v).toLocaleString("en-US") : v >= 1 ? v.toFixed(1) : v < 0.01 ? v.toExponential(0) : v.toFixed(2);

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[0.6875rem] text-muted">
        <LegendItem color={C.accent} label="SCP (synthetic dataset)" />
        <LegendItem color={C.slate} label="Conventional proteins (benchmark table)" />
        <span>Log scale per panel</span>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        {metrics.map((m) => {
          const vals = all.map((a) => a[m.key] as number);
          const lo = Math.log10(Math.min(...vals)) - 0.3;
          const hi = Math.log10(Math.max(...vals));
          const w = (v: number) => `${Math.max(2, ((Math.log10(v) - lo) / (hi - lo)) * 100)}%`;
          return (
            <div key={m.key}>
              <p className="label mb-3">
                {m.label} <span className="normal-case tracking-normal">· {m.unit}</span>
              </p>
              <ul className="space-y-1.5">
                {all.map((a) => {
                  const v = a[m.key] as number;
                  const isScp = a.protein_source.startsWith("SCP");
                  return (
                    <li key={a.protein_source} className="grid grid-cols-[6.5rem_1fr] items-center gap-3 text-[0.75rem]">
                      <span className={isScp ? "text-accent" : "text-muted"}>{isScp ? "SCP" : a.protein_source}</span>
                      <span className="flex items-center gap-2">
                        <span className="h-2" style={{ width: w(v), background: isScp ? C.accent : C.slate }} />
                        <span className="font-mono text-[0.6875rem] text-ink">{fmt(v)}</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ───────────────────────── Strain screening scatter ───────────────────────── */

// Composite ranking from BioPredict/scp_eda_notebook.ipynb §11
const RANK: Record<string, number> = { Strain_6: 1, Strain_3: 2, Strain_2: 3, Strain_5: 4, Strain_4: 5, Strain_1: 6 };

export function BPStrains() {
  const W = 520, H = 320, L = 52, B = 40, T = 16, R = 20;
  const x0 = 0.5, x1 = 1.8, y0 = 2.2, y1 = 3.3;
  const sx = (v: number) => L + ((v - x0) / (x1 - x0)) * (W - L - R);
  const sy = (v: number) => T + (1 - (v - y0) / (y1 - y0)) * (H - T - B);
  const pts = production.map((p) => ({
    id: p.strain_id,
    prod: p.protein_productivity_g_L_h,
    opex: p.total_opex_usd_per_kg,
    protein: strains.find((s) => s.strain_id === p.strain_id)?.protein_content_pct ?? 0,
    rank: RANK[p.strain_id],
  }));
  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[0.6875rem] text-muted">
        <LegendItem color={C.accent} label="Top-2 composite score" />
        <LegendItem color={C.signal} label="Other strains" />
        <span>Bubble size ∝ protein content</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Scatter of protein productivity versus OPEX for six strains; Strain 6 has the highest productivity and Strain 3 the lowest OPEX">
        <rect x={sx(1.2)} y={sy(2.7)} width={sx(x1) - sx(1.2)} height={sy(y0) - sy(2.7)} fill="rgba(200,162,107,0.05)" />
        <text x={sx(x1) - 6} y={sy(y0) - 8} fill={C.accent} fillOpacity="0.7" fontSize="10.5" textAnchor="end" fontFamily="var(--font-mono)">high output · low cost</text>
        {[0.5, 0.9, 1.3, 1.7].map((v) => (
          <g key={v}>
            <line x1={sx(v)} x2={sx(v)} y1={T} y2={H - B} stroke={C.line} />
            <text x={sx(v)} y={H - B + 18} fill={C.muted} fontSize="11" textAnchor="middle" fontFamily="var(--font-mono)">{v.toFixed(1)}</text>
          </g>
        ))}
        {[2.2, 2.6, 3.0].map((v) => (
          <g key={v}>
            <line x1={L} x2={W - R} y1={sy(v)} y2={sy(v)} stroke={C.line} />
            <text x={L - 8} y={sy(v) + 4} fill={C.muted} fontSize="11" textAnchor="end" fontFamily="var(--font-mono)">{v.toFixed(1)}</text>
          </g>
        ))}
        <text x={(W + L) / 2} y={H - 4} fill={C.muted} fontSize="11" textAnchor="middle">Protein productivity (g/L·h)</text>
        <text x={14} y={(H - B) / 2} fill={C.muted} fontSize="11" textAnchor="middle" transform={`rotate(-90 14 ${(H - B) / 2})`}>OPEX ($/kg)</text>
        {pts.map((p) => {
          const top = p.rank <= 2;
          return (
            <g key={p.id}>
              <circle cx={sx(p.prod)} cy={sy(p.opex)} r={4 + (p.protein - 45) / 4} fill={top ? C.accent : C.signal} fillOpacity={top ? 0.85 : 0.45} />
              <text x={sx(p.prod) + 12 + (p.protein - 45) / 4} y={sy(p.opex) + 4} fill={top ? C.ink : C.muted} fontSize="11" fontFamily="var(--font-mono)">
                S{p.id.split("_")[1]} · #{p.rank}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ───────────────────────── Validation dumbbells ───────────────────────── */

export function BPValidation() {
  const targets = Array.from(new Set(results.map((r) => r.Target as string)));
  const x = (v: number) => `${((v + 1) / 2) * 100}%`;
  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[0.6875rem] text-muted">
        <LegendItem color={C.slate} label="5-fold CV on augmented data" shape="ring" />
        <LegendItem color={C.accent} label="Leave-one-out on the 6 real strains" />
        <span>R², axis −1 → 1</span>
      </div>
      <div className="space-y-8">
        {targets.map((t) => (
          <div key={t}>
            <p className="label mb-3 normal-case tracking-normal text-ink">{t.replace("CO₂", "CO₂")}</p>
            <ul className="space-y-2.5">
              {results
                .filter((r) => r.Target === t)
                .map((r) => {
                  const loo = r["LOO R²"] as number;
                  const kf = r["5-Fold R²"] as number;
                  return (
                    <li key={r.Model as string} className="grid grid-cols-[7.5rem_1fr_5.5rem] items-center gap-3 md:grid-cols-[9rem_1fr_7rem]">
                      <span className="text-[0.75rem] text-muted">{r.Model as string}</span>
                      <span className="relative h-5">
                        <span className="absolute top-1/2 right-0 left-0 h-px bg-line" />
                        <span className="absolute top-0 bottom-0 w-px bg-line-strong" style={{ left: "50%" }} />
                        <span
                          className="absolute top-1/2 h-px"
                          style={{ left: x(Math.min(loo, kf)), width: `calc(${x(Math.max(loo, kf))} - ${x(Math.min(loo, kf))})`, background: "rgba(200,162,107,0.35)" }}
                        />
                        <span className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border bg-bg" style={{ left: x(kf), borderColor: C.slate }} />
                        <span className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ left: x(loo), background: C.accent }} />
                      </span>
                      <span className="text-right font-mono text-[0.6875rem]">
                        <span className="text-accent">{loo.toFixed(2)}</span>
                        <span className="text-muted"> / {kf.toFixed(2)}</span>
                      </span>
                    </li>
                  );
                })}
            </ul>
          </div>
        ))}
        <div className="grid grid-cols-[7.5rem_1fr_5.5rem] gap-3 md:grid-cols-[9rem_1fr_7rem]">
          <span />
          <span className="flex justify-between font-mono text-[0.625rem] text-muted">
            <span>−1</span><span>0</span><span>1</span>
          </span>
        </div>
      </div>
    </div>
  );
}
