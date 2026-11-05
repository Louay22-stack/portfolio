import type { PlainSummary } from "@/lib/types";
import { cn } from "@/lib/cn";

/** The same questions, in the same order, for every project. */
export function ProjectBrief({
  plain,
  withWhy,
  className,
}: { plain: PlainSummary; withWhy?: boolean; className?: string }) {
  const rows = [
    ["The problem", plain.problem],
    [plain.didLabel ?? "What I did", plain.did],
    ["The result", plain.result],
    ...(withWhy ? [["Why it matters", plain.why]] : []),
  ];

  return (
    <dl className={cn("border-t border-line", className)}>
      {rows.map(([label, text]) => (
        <div key={label} className="grid gap-1.5 border-b border-line py-4 md:grid-cols-[8.5rem_1fr] md:gap-6">
          <dt className="label pt-1 text-accent">{label}</dt>
          <dd className="text-[0.9375rem] leading-relaxed text-ink/90">{text}</dd>
        </div>
      ))}
    </dl>
  );
}
