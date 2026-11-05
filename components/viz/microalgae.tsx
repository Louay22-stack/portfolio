import growth from "@/content/data/microalgae-growth.json";
import { C } from "./ChartFrame";

const MAX_RATE = 1.2;

export function MicroalgaeGrowth() {
  const best = Math.max(...growth.map((g) => g.rate));
  return (
    <div className="w-full">
      <p className="mb-5 font-mono text-[0.6875rem] text-muted">Maximum growth rate, per day · Zero-based axis, 0 → 1.2</p>
      <ul className="space-y-4">
        {growth.map((g) => (
          <li key={g.id}>
            <div className="flex items-baseline justify-between gap-4 text-[0.8125rem]">
              <span className="text-ink">{g.label}</span>
              <span className="font-mono text-muted">{g.rate.toFixed(2)}</span>
            </div>
            <div className="mt-1.5 h-2 bg-line">
              <div
                className="h-full"
                style={{ width: `${(g.rate / MAX_RATE) * 100}%`, background: g.rate === best ? C.accent : C.signal }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
