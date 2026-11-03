"use client";

import { motion, useReducedMotion } from "motion/react";
import { Em, SectionHeading } from "@/components/ui/primitives";

const steps = [
  { tag: "U-01", title: "Characterise", text: "Turn literature, lab runs and plant data into a structured, traceable dataset." },
  { tag: "U-02", title: "Model", text: "Mechanistic balances where physics is known; machine learning where data leads." },
  { tag: "U-03", title: "Validate", text: "Hand calculations, grouped splits, leave-one-out. Pick the test that matches the real question." },
  { tag: "U-04", title: "Decide", text: "Package the result as a tool or a number an engineer can act on." },
];

/** "How I work", drawn as a process flow: feed → unit operations → product. */
export function ApproachFlow() {
  const reduce = useReducedMotion();
  const draw = reduce
    ? {}
    : {
        initial: { pathLength: 0 },
        whileInView: { pathLength: 1 },
        viewport: { once: true, margin: "-20%" },
        transition: { duration: 1.8, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <section aria-labelledby="approach-title" className="border-t border-line bg-bg-deep/40 py-28 md:py-40">
      <div className="container-site">
        <SectionHeading
          index="05"
          label="Approach"
          id="approach-title"
          heading={
            <>
              Every project runs like a process line: <Em>feed in, decisions out.</Em>
            </>
          }
        />

        <div className="relative mt-20">
          {/* main stream line (desktop) */}
          <svg aria-hidden className="absolute top-[14px] left-0 hidden h-4 w-[calc(75%+1.5rem)] lg:block" viewBox="0 0 1000 16" preserveAspectRatio="none">
            <motion.path d="M0 8 H1000" stroke="#7fb6a8" strokeWidth="1.5" fill="none" vectorEffect="non-scaling-stroke" {...draw} />
          </svg>

          <div className="mb-10 flex items-center justify-between font-mono text-[0.6875rem] text-muted lg:hidden">
            <span>FEED · data & experiments</span>
          </div>

          <ol className="relative grid gap-10 lg:grid-cols-4 lg:gap-8">
            {steps.map((s, i) => (
              <motion.li
                key={s.tag}
                initial={reduce ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-15%" }}
                transition={{ duration: 0.7, delay: 0.25 + i * 0.18, ease: [0.22, 1, 0.36, 1] }}
                className="relative border-l border-line pl-6 lg:border-l-0 lg:pl-0"
              >
                <div className="relative z-10 grid size-11 place-items-center border border-line-strong bg-bg font-mono text-[0.625rem] text-accent">
                  {s.tag.split("-")[1]}
                </div>
                <p className="mt-6 font-mono text-[0.6875rem] text-muted">{s.tag}</p>
                <h3 className="mt-2 text-xl font-medium">{s.title}</h3>
                <p className="mt-3 max-w-xs text-[0.875rem] leading-relaxed text-muted">{s.text}</p>
              </motion.li>
            ))}
          </ol>

          <div className="mt-12 flex flex-col justify-between gap-2 font-mono text-[0.6875rem] text-muted sm:flex-row">
            <span className="hidden lg:inline">S-IN · data & experiments</span>
            <span className="text-signal">S-OUT · process decisions →</span>
          </div>
        </div>
      </div>
    </section>
  );
}
