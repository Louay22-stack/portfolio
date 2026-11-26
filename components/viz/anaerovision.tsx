import { ArrowDown } from "lucide-react";
import { C } from "./ChartFrame";

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
    model: "ANN classifier",
    lines: ["Inhibited / stable", "Accuracy 91.2%"],
  },
  {
    tag: "T3",
    title: "Inhibition type",
    model: "Tuned Random Forest",
    lines: ["Ammonia · LCFA · VFA · salinity · other", "Accuracy 92.7%"],
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
