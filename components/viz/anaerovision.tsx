import { ArrowDown } from "lucide-react";
import task1 from "@/content/data/av-task1-comparison.json";
import preds from "@/content/data/av-task1-test-predictions.json";
import sweep from "@/content/data/av-task2-ann-threshold-sweep.json";
import importance from "@/content/data/av-task3-feature-importance.json";
import classReport from "@/content/data/av-task3-class-report.json";
import { C, LegendItem } from "./ChartFrame";

/* ───────────────────────── Pipeline ───────────────────────── */

const stages = [
  {
    tag: "IN",
    title: "Process conditions",
    model: "9 inputs",
    lines: ["Substrate · reactor type", "T · pH · HRT · OLR · ISR", "TAN · VFA"],
  },
  {
    tag: "T1",
    title: "Methane yield",
    model: "Tuned ANN regressor",
    lines: ["mL CH₄ / g VS", "Test R² 0.909"],
  },
  {
    tag: "T2",
    title: "Inhibition risk",
    model: "ANN classifier · threshold 0.14",
    lines: ["Inhibited / stable", "Recall 86.2% on unseen substrates"],
  },
  {
    tag: "T3",
    title: "Inhibition type",
    model: "Tuned Random Forest",
    lines: ["Ammonia · LCFA · VFA · salinity · other", "Confidence ≥ 0.60 likely · 0.45–0.60 possible · lower: uncertain"],
  },
];

export function AnaeroPipeline({ compact = false }: { compact?: boolean }) {
  return (
    <ol className="grid gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] md:items-stretch md:gap-0">
      {stages.map((s, i) => (
        <li key={s.tag} className="contents">
          <div className="corners flex flex-col border border-line bg-bg p-4 md:p-5">
            <span className="font-mono text-[0.6875rem] tracking-widest text-accent">{s.tag}</span>
            <p className="mt-3 text-[0.9375rem] font-medium">{s.title}</p>
            <p className="mt-1 font-mono text-[0.6875rem] text-signal">{s.model}</p>
            {i === 3 && <p className="mt-1 font-mono text-[0.625rem] text-muted">runs only if risk is detected</p>}
            {!compact && (
              <ul className="mt-3 space-y-1 text-[0.75rem] leading-snug text-muted">
                {s.lines.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            )}
          </div>
          {i < stages.length - 1 && (
            <div aria-hidden className="flex items-center justify-center py-1 md:px-2 md:py-0">
              <svg className="hidden h-3 w-10 md:block" viewBox="0 0 40 12">
                <line x1="0" y1="6" x2="34" y2="6" stroke={C.signal} strokeWidth="1.5" className="stream-flow" />
                <path d="M33 2 L39 6 L33 10" fill="none" stroke={C.signal} strokeWidth="1.5" />
              </svg>
              <ArrowDown className="size-4 text-signal md:hidden" />
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}

/* ───────────────────────── Task 1: model comparison ───────────────────────── */

export function Task1Models() {
  const lo = 0.85, hi = 1.0;
  const x = (v: number) => `${((v - lo) / (hi - lo)) * 100}%`;
  const rows = [...task1].sort((a, b) => b.testR2 - a.testR2);
  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[0.6875rem] text-muted">
        <LegendItem color={C.accent} label="Test R²" />
        <LegendItem color={C.muted} label="Train R²" shape="ring" />
        <span>Axis 0.85 → 1.00</span>
      </div>
      <ul className="space-y-4">
        {rows.map((m, i) => (
          <li key={m.model} className="grid grid-cols-[minmax(0,9rem)_1fr_3.5rem] items-center gap-3 md:grid-cols-[12rem_1fr_4rem]">
            <span className={`truncate text-[0.8125rem] ${i === 0 ? "text-ink" : "text-muted"}`}>{m.model}</span>
            <span className="relative h-6">
              <span className="absolute inset-y-1/2 left-0 right-0 h-px bg-line" />
              <span
                className="absolute top-1/2 h-px bg-line-strong"
                style={{ left: x(m.testR2), width: `calc(${x(m.trainR2)} - ${x(m.testR2)})` }}
              />
              <span
                className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-muted bg-bg"
                style={{ left: x(m.trainR2) }}
              />
              <span
                className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{ left: x(m.testR2), background: i === 0 ? C.accent : C.signal }}
              />
            </span>
            <span className={`text-right font-mono text-[0.8125rem] ${i === 0 ? "text-accent" : "text-ink"}`}>{m.testR2.toFixed(3)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-3 grid grid-cols-[minmax(0,9rem)_1fr_3.5rem] gap-3 md:grid-cols-[12rem_1fr_4rem]">
        <span />
        <span className="flex justify-between font-mono text-[0.625rem] text-muted">
          <span>0.85</span><span>0.90</span><span>0.95</span><span>1.00</span>
        </span>
      </div>
    </div>
  );
}

/* ───────────────────────── Task 1: predicted vs actual ───────────────────────── */

export function Task1Scatter() {
  const S = 400, P = 44, max = 700;
  const sx = (v: number) => P + (v / max) * (S - P - 12);
  const sy = (v: number) => S - P - (v / max) * (S - P - 12);
  const ticks = [0, 175, 350, 525, 700];
  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[0.6875rem] text-muted">
        <LegendItem color={C.signal} label="Hold-out record (n = 300)" />
        <LegendItem color={C.accent} label="Perfect prediction" shape="line" />
      </div>
      <svg viewBox={`0 0 ${S} ${S}`} className="mx-auto w-full max-w-[520px]" role="img" aria-label="Scatter plot of predicted versus measured methane yield for 300 hold-out records; points cluster along the diagonal">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={sx(t)} x2={sx(t)} y1={sy(0)} y2={sy(max)} stroke={C.line} />
            <line x1={sx(0)} x2={sx(max)} y1={sy(t)} y2={sy(t)} stroke={C.line} />
            <text x={sx(t)} y={S - P + 18} fill={C.muted} fontSize="11" textAnchor="middle" fontFamily="var(--font-mono)">{t}</text>
            <text x={P - 8} y={sy(t) + 4} fill={C.muted} fontSize="11" textAnchor="end" fontFamily="var(--font-mono)">{t}</text>
          </g>
        ))}
        <line x1={sx(0)} y1={sy(0)} x2={sx(max)} y2={sy(max)} stroke={C.accent} strokeWidth="1.2" strokeDasharray="4 4" />
        {(preds as number[][]).map(([a, p], i) => (
          <circle key={i} cx={sx(a)} cy={sy(p)} r="2.6" fill={C.signal} fillOpacity="0.55" />
        ))}
        <text x={(S + P) / 2} y={S - 4} fill={C.muted} fontSize="11" textAnchor="middle">Measured yield (mL CH₄/g VS)</text>
        <text x={12} y={(S - P) / 2} fill={C.muted} fontSize="11" textAnchor="middle" transform={`rotate(-90 12 ${(S - P) / 2})`}>Predicted</text>
      </svg>
    </div>
  );
}

/* ───────────────────────── Task 2: threshold sweep ───────────────────────── */

export function Task2Threshold() {
  const W = 560, H = 300, L = 40, B = 34, T = 12, R = 12;
  const data = sweep.filter((d) => d.t <= 0.6);
  const sx = (t: number) => L + (t / 0.6) * (W - L - R);
  const sy = (v: number) => T + (1 - v) * (H - T - B);
  const path = (k: "precision" | "recall" | "f1") =>
    data.map((d, i) => `${i ? "L" : "M"}${sx(d.t).toFixed(1)},${sy(d[k]).toFixed(1)}`).join(" ");
  const sel = sweep.find((d) => d.t === 0.14)!;
  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[0.6875rem] text-muted">
        <LegendItem color={C.signal} label="Recall" shape="line" />
        <LegendItem color={C.slate} label="Precision" shape="line" />
        <LegendItem color={C.accent} label="F1" shape="line" />
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`Precision, recall and F1 versus decision threshold. At the selected threshold 0.14: recall ${sel.recall}, precision ${sel.precision}, F1 ${sel.f1}.`}>
        {[0, 0.25, 0.5, 0.75, 1].map((v) => (
          <g key={v}>
            <line x1={L} x2={W - R} y1={sy(v)} y2={sy(v)} stroke={C.line} />
            <text x={L - 8} y={sy(v) + 4} fill={C.muted} fontSize="11" textAnchor="end" fontFamily="var(--font-mono)">{v.toFixed(2)}</text>
          </g>
        ))}
        {[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6].map((t) => (
          <text key={t} x={sx(t)} y={H - B + 18} fill={C.muted} fontSize="11" textAnchor="middle" fontFamily="var(--font-mono)">{t.toFixed(1)}</text>
        ))}
        <text x={(W + L) / 2} y={H - 2} fill={C.muted} fontSize="11" textAnchor="middle">Decision threshold</text>
        <line x1={sx(0.14)} x2={sx(0.14)} y1={T} y2={H - B} stroke={C.accent} strokeDasharray="3 4" />
        <path d={path("precision")} fill="none" stroke={C.slate} strokeWidth="1.8" />
        <path d={path("recall")} fill="none" stroke={C.signal} strokeWidth="1.8" />
        <path d={path("f1")} fill="none" stroke={C.accent} strokeWidth="2.2" />
        <circle cx={sx(0.14)} cy={sy(sel.f1)} r="4" fill={C.accent} />
        <g transform={`translate(${sx(0.19)}, ${sy(0.36)})`}>
          <rect width="150" height="58" fill="#161c20" stroke={C.lineStrong} />
          <text x="10" y="18" fill={C.accent} fontSize="11" fontFamily="var(--font-mono)">t = 0.14 (selected)</text>
          <text x="10" y="34" fill={C.ink} fontSize="11" fontFamily="var(--font-mono)">Recall {(sel.recall * 100).toFixed(1)}%</text>
          <text x="10" y="49" fill={C.ink} fontSize="11" fontFamily="var(--font-mono)">Precision {(sel.precision * 100).toFixed(1)}%</text>
        </g>
      </svg>
    </div>
  );
}

/* ───────────────────────── Task 3: confusion matrix ───────────────────────── */

// Transcribed from rf_task3c_tuned_overall_confusion_matrix.png
// (row totals match the supports in rf_task3c_tuned_overall_classification_report.txt).
const CM_LABELS = ["Ammonia", "LCFA", "Other", "Salinity", "VFA acc."];
const CM = [
  [58, 5, 0, 6, 1],
  [0, 59, 0, 0, 1],
  [0, 0, 16, 0, 0],
  [0, 1, 0, 49, 0],
  [0, 1, 0, 1, 22],
];

export function Task3Confusion() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[460px] border-collapse font-mono text-[0.75rem]">
        <caption className="sr-only">Out-of-fold confusion matrix; rows are true mechanism, columns are predicted mechanism</caption>
        <thead>
          <tr>
            <th scope="col" className="p-2 text-left font-normal text-muted">True ↓ / Pred →</th>
            {CM_LABELS.map((l) => (
              <th key={l} scope="col" className="p-2 text-center font-normal text-muted">{l}</th>
            ))}
            <th scope="col" className="p-2 text-right font-normal text-muted">Recall</th>
          </tr>
        </thead>
        <tbody>
          {CM.map((row, i) => {
            const total = row.reduce((a, b) => a + b, 0);
            return (
              <tr key={CM_LABELS[i]}>
                <th scope="row" className="p-2 text-left font-normal text-ink">{CM_LABELS[i]}</th>
                {row.map((v, j) => {
                  const share = v / total;
                  const diag = i === j;
                  return (
                    <td key={j} className="p-0.5">
                      <div
                        className="grid h-11 place-items-center"
                        style={{
                          background: v === 0 ? "rgba(255,255,255,0.025)" : diag ? `rgba(127,182,168,${0.18 + share * 0.62})` : `rgba(200,162,107,${0.2 + share * 2})`,
                          color: v === 0 ? C.muted : C.ink,
                        }}
                      >
                        {v}
                      </div>
                    </td>
                  );
                })}
                <td className="p-2 text-right text-ink">{((row[i] / total) * 100).toFixed(0)}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="mt-4 font-mono text-[0.6875rem] text-muted">
        Per-class F1: {classReport.map((c) => `${c.label.replace(" accumulation", "").replace(" inhibition", "")} ${c.f1.toFixed(2)}`).join(" · ")}
      </p>
    </div>
  );
}

/* ───────────────────────── Task 3: feature importance ───────────────────────── */

const pretty: Record<string, string> = {
  VFA_mg_L: "VFA (mg/L)",
  TAN_mg_L: "TAN (mg/L)",
  pH: "pH",
  HRT_days: "HRT (d)",
  Temperature_C: "Temperature (°C)",
  Reactor_Type_CSTR: "Reactor: CSTR",
  OLR_gVS_L_day: "OLR (g VS/L·d)",
  "Substrate_Category_Protein-Rich": "Substrate: protein-rich",
  "Substrate_Category_Food Waste": "Substrate: food waste",
  "Substrate_Category_Industrial organic waste": "Substrate: industrial organic",
};

export function Task3Importance() {
  const top = importance.slice(0, 10);
  const max = top[0].importance;
  return (
    <ul className="space-y-2.5">
      {top.map((f, i) => (
        <li key={f.feature} className="grid grid-cols-[minmax(0,10rem)_1fr_3rem] items-center gap-3 md:grid-cols-[13rem_1fr_3.5rem]">
          <span className={`truncate text-[0.8125rem] ${i < 3 ? "text-ink" : "text-muted"}`}>{pretty[f.feature] ?? f.feature}</span>
          <span className="h-2 bg-line">
            <span className="block h-full" style={{ width: `${(f.importance / max) * 100}%`, background: i < 3 ? C.accent : C.signal }} />
          </span>
          <span className="text-right font-mono text-[0.75rem] text-muted">{f.importance.toFixed(3)}</span>
        </li>
      ))}
    </ul>
  );
}
