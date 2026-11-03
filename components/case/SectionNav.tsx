"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

/** Sticky section index for case studies; highlights the section in view. */
export function SectionNav({ sections }: { sections: { id: string; title: string }[] }) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [sections]);

  return (
    <nav aria-label="Case study sections" className="sticky top-28">
      <p className="label mb-5">Contents</p>
      <ol className="space-y-2.5">
        {sections.map((s, i) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              aria-current={active === s.id ? "true" : undefined}
              className={cn(
                "flex items-baseline gap-3 text-[0.8125rem] transition-colors",
                active === s.id ? "text-ink" : "text-muted hover:text-ink",
              )}
            >
              <span className={cn("font-mono text-[0.625rem]", active === s.id ? "text-accent" : "text-muted/60")}>
                /{String(i + 1).padStart(2, "0")}
              </span>
              {s.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
