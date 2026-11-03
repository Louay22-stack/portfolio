import type { Block, Metric } from "@/lib/types";
import { Viz } from "@/components/viz/registry";
import { ChartFrame } from "@/components/viz/ChartFrame";
import { Gallery } from "./Gallery";

export function MetricCard({ m, large }: { m: Metric; large?: boolean }) {
  return (
    <div className="flex h-full flex-col bg-bg p-5 md:p-6">
      <p className={`font-mono tracking-tight text-ink ${large ? "text-4xl md:text-5xl" : "text-3xl"}`}>{m.value}</p>
      <p className="mt-3 text-[0.875rem] font-medium">{m.label}</p>
      {m.detail && <p className="mt-1 text-[0.8125rem] leading-snug text-muted">{m.detail}</p>}
      <p className="mt-auto pt-4 font-mono text-[0.5625rem] [overflow-wrap:anywhere] text-muted/60" title={m.source}>
        src · {m.source}
      </p>
    </div>
  );
}

export function BlockView({ block }: { block: Block }) {
  switch (block.kind) {
    case "lead":
      return <p className="text-xl leading-snug tracking-[-0.01em] text-ink md:text-[1.625rem] md:leading-[1.3]">{block.text}</p>;
    case "p":
      return <p className="max-w-[68ch] text-[0.9875rem] leading-[1.75] text-muted">{block.text}</p>;
    case "list":
      return (
        <ul className="max-w-[72ch] space-y-3">
          {block.items.map((it, i) => (
            <li key={i} className="grid grid-cols-[2.25rem_1fr] text-[0.9875rem] leading-[1.7] text-muted">
              <span className="pt-[0.2rem] font-mono text-[0.6875rem] text-accent">{String(i + 1).padStart(2, "0")}</span>
              <span>{it}</span>
            </li>
          ))}
        </ul>
      );
    case "metrics":
      return (
        <div className="grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-3">
          {block.items.map((m) => (
            <MetricCard key={m.label} m={m} />
          ))}
        </div>
      );
    case "table":
      return (
        <div>
          {block.caption && <p className="label mb-3">{block.caption}</p>}
          <div className="overflow-x-auto border-t border-line-strong">
            <table className="w-full min-w-[520px] text-[0.875rem]">
              <thead>
                <tr>
                  {block.head.map((h) => (
                    <th key={h} scope="col" className="py-3 pr-4 text-left font-mono text-[0.6875rem] font-normal tracking-wider text-muted uppercase">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((r, i) => (
                  <tr key={i} className="border-t border-line align-top">
                    {r.map((c, j) => (
                      <td key={j} className={`py-3 pr-4 ${j === 0 ? "text-ink" : "text-muted"}`}>
                        {c}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {block.source && <p className="mt-3 font-mono text-[0.625rem] [overflow-wrap:anywhere] text-muted/70">Source · {block.source}</p>}
        </div>
      );
    case "viz":
      return (
        <ChartFrame caption={block.caption} source={block.source}>
          <Viz id={block.id} />
        </ChartFrame>
      );
    case "callout":
      return (
        <aside className="border-l-2 border-accent bg-bg-elev/50 px-6 py-5">
          <p className="label text-accent">{block.title}</p>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink">{block.text}</p>
        </aside>
      );
    case "figures":
      return <Gallery items={block.items} />;
  }
}
