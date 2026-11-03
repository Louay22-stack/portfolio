import checks from "@/content/data/biogas-level3-checks.json";
import sensitivity from "@/content/data/biogas-sensitivity.json";
import { C, LegendItem } from "./ChartFrame";

const fmt = (v: number) => (Math.abs(v) < 1 ? v.toFixed(4) : v.toFixed(3));

export function BiogasValidation() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] font-mono text-[0.75rem]">
        <caption className="sr-only">DWSIM results compared to hand calculations</caption>
        <thead>
          <tr className="text-muted">
            <th scope="col" className="py-2 text-left font-normal">Check</th>
            <th scope="col" className="py-2 text-right font-normal">DWSIM</th>
            <th scope="col" className="py-2 text-right font-normal">Hand calc</th>
            <th scope="col" className="py-2 text-right font-normal">Deviation</th>
          </tr>
        </thead>
        <tbody>
          {checks.map((c) => (
            <tr key={c.item} className="border-t border-line">
              <th scope="row" className="py-2.5 pr-4 text-left font-sans font-normal text-ink">
                {c.item.replace("CH4", "CH₄").replace("O2", "O₂").replace("CO2", "CO₂").replace("H2O", "H₂O").replace("N2", "N₂")}
              </th>
              <td className="py-2.5 text-right">{fmt(c.dwsim)} <span className="text-muted">{c.unit}</span></td>
              <td className="py-2.5 text-right">{fmt(c.hand)}</td>
              <td className="py-2.5 text-right">
                <span className="inline-flex items-center gap-1.5 text-signal">
                  <span aria-hidden>✓</span>
                  {c.deviation}
                </span>
              </td>
            </tr>
          ))}
          <tr className="border-t border-line-strong">
            <th scope="row" className="py-3 pr-4 text-left font-sans font-medium text-ink">Energy balance (Q-R101 + Q-103)</th>
            <td className="py-3 text-right text-accent">544.2 <span className="text-muted">kW</span></td>
            <td className="py-3 text-right text-accent">≈ 544</td>
            <td className="py-3 text-right text-signal">✓ closes</td>
          </tr>
          <tr className="border-t border-line">
            <th scope="row" className="py-3 pr-4 text-left font-sans font-normal text-ink">Mass balance across R-101</th>
            <td className="py-3 text-right">929.137 <span className="text-muted">kg/h</span></td>
            <td className="py-3 text-right">929.137</td>
            <td className="py-3 text-right text-signal">✓ 0.000%</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function BiogasSensitivity() {
  const rows = [...sensitivity].sort((a, b) => a.ch4 - b.ch4);
  const max = 5;
  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[0.6875rem] text-muted">
        <LegendItem color={C.signal} label="Q-101 cooler duty (kW)" />
        <LegendItem color={C.slate} label="Q-102 heater duty (kW)" />
        <span>Zero-based axis, 0 → 5 kW</span>
      </div>
      <ul className="space-y-4">
        {rows.map((r) => (
          <li key={r.case} className="grid grid-cols-[5.5rem_1fr] items-center gap-4 md:grid-cols-[8rem_1fr]">
            <span className="font-mono text-[0.75rem] text-muted">
              x CH₄ <span className="text-ink">{r.ch4.toFixed(2)}</span>
              {r.case === "Base" && <span className="ml-1 text-accent">base</span>}
            </span>
            <span className="space-y-1">
              <span className="flex items-center gap-3">
                <span className="h-3 bg-signal" style={{ width: `${(r.q101 / max) * 100}%` }} />
                <span className="font-mono text-[0.75rem] text-ink">{r.q101.toFixed(3)}</span>
              </span>
              <span className="flex items-center gap-3">
                <span className="h-1.5" style={{ width: `${(r.q102 / max) * 100}%`, background: C.slate }} />
                <span className="font-mono text-[0.6875rem] text-muted">{r.q102.toFixed(3)}</span>
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
