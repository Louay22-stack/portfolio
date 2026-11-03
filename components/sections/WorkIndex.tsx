"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/cn";

type Row = {
  slug: string;
  shortTitle: string;
  kicker: string;
  tagline: string;
  period: string;
  categories: Category[];
  metric: { value: string; label: string };
};

export function WorkIndex({ rows, categories }: { rows: Row[]; categories: Category[] }) {
  const [filter, setFilter] = useState<Category | "All">("All");
  const shown = rows.filter((r) => filter === "All" || r.categories.includes(filter));

  return (
    <div>
      <div role="group" aria-label="Filter by discipline" className="flex flex-wrap gap-2">
        {(["All", ...categories] as const).map((c) => {
          const count = c === "All" ? rows.length : rows.filter((r) => r.categories.includes(c)).length;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setFilter(c)}
              aria-pressed={filter === c}
              className={cn(
                "inline-flex h-10 items-center gap-2 border px-4 text-[0.8125rem] transition-colors",
                filter === c ? "border-accent bg-accent text-accent-ink" : "border-line text-muted hover:border-line-strong hover:text-ink",
              )}
            >
              {c}
              <span className="font-mono text-[0.625rem] opacity-70">{count}</span>
            </button>
          );
        })}
      </div>

      <ol className="mt-12 border-t border-line-strong">
        <AnimatePresence initial={false}>
          {shown.map((r) => {
            const n = rows.indexOf(r) + 1;
            return (
              <motion.li
                key={r.slug}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="border-b border-line"
              >
                <Link
                  href={`/work/${r.slug}`}
                  className="group grid gap-4 py-8 md:grid-cols-12 md:items-center md:gap-8 md:py-10"
                >
                  <span className="font-mono text-sm text-accent md:col-span-1">0{n}</span>
                  <span className="md:col-span-5">
                    <span className="block text-2xl font-medium tracking-[-0.02em] transition-colors group-hover:text-accent md:text-3xl">
                      {r.shortTitle}
                    </span>
                    <span className="label mt-2 block">{r.kicker}</span>
                  </span>
                  <span className="text-[0.875rem] leading-relaxed text-muted md:col-span-4">{r.tagline}</span>
                  <span className="flex items-center justify-between gap-4 md:col-span-2 md:flex-col md:items-end">
                    <span className="text-right">
                      <span className="block font-mono text-lg text-ink">{r.metric.value}</span>
                      <span className="block text-[0.6875rem] text-muted">{r.metric.label}</span>
                    </span>
                    <ArrowUpRight aria-hidden className="size-5 text-muted transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
                  </span>
                </Link>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ol>
    </div>
  );
}
