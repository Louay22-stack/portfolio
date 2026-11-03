import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function ChartFrame({
  children,
  caption,
  source,
  legend,
  className,
}: {
  children: ReactNode;
  caption?: string;
  source?: string;
  legend?: ReactNode;
  className?: string;
}) {
  return (
    <figure className={cn("corners border border-line bg-bg-deep/50 p-5 md:p-8", className)}>
      {legend && <div className="mb-5 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[0.6875rem] text-muted">{legend}</div>}
      {children}
      {(caption || source) && (
        <figcaption className="mt-6 border-t border-line pt-4">
          {caption && <p className="text-[0.875rem] leading-relaxed text-muted">{caption}</p>}
          {source && (
            <p className="mt-2 font-mono text-[0.625rem] [overflow-wrap:anywhere] text-muted/70">
              Source · {source}
            </p>
          )}
        </figcaption>
      )}
    </figure>
  );
}

export function LegendItem({ color, label, shape = "dot" }: { color: string; label: string; shape?: "dot" | "line" | "ring" }) {
  return (
    <span className="inline-flex items-center gap-2">
      {shape === "dot" && <span className="size-2 rounded-full" style={{ background: color }} />}
      {shape === "ring" && <span className="size-2 rounded-full border" style={{ borderColor: color }} />}
      {shape === "line" && <span className="h-0.5 w-4" style={{ background: color }} />}
      {label}
    </span>
  );
}

export const C = {
  signal: "#7fb6a8",
  accent: "#c8a26b",
  muted: "#8c9aa3",
  line: "rgba(255,255,255,0.08)",
  lineStrong: "rgba(255,255,255,0.16)",
  ink: "#e7ecee",
  slate: "#5f7a86",
} as const;
