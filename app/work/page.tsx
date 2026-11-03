import type { Metadata } from "next";
import { categories, projects } from "@/content/projects";
import { earlierWork } from "@/content/experience";
import { Em, IndexLabel, Tag } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";
import { WorkIndex } from "@/components/sections/WorkIndex";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Engineering portfolio of Louay Ouhibi: anaerobic-digestion machine learning (AnaeroVision), DWSIM biogas process simulation and single-cell-protein strain screening.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  const rows = projects.map((p) => ({
    slug: p.slug,
    shortTitle: p.shortTitle,
    kicker: p.kicker,
    tagline: p.tagline,
    period: p.period,
    categories: p.categories,
    metric: { value: p.headline[1]?.value ?? p.headline[0].value, label: p.headline[1]?.label ?? p.headline[0].label },
  }));

  return (
    <div className="container-site pt-32 pb-32 md:pt-44">
      <Reveal>
        <IndexLabel index="04">Engineering portfolio</IndexLabel>
        <h1 className="mt-8 max-w-4xl text-[2.5rem] leading-[1.02] font-medium tracking-[-0.03em] text-balance md:text-7xl">
          Case studies in biogas, simulation <Em>and predictive modelling.</Em>
        </h1>
        <p className="mt-8 max-w-2xl text-[0.9375rem] leading-relaxed text-muted">
          Each case study documents the problem, the method, the validation and the limitations. Every figure on this
          site links back to the project file it comes from.
        </p>
      </Reveal>

      <Reveal delay={0.1} className="mt-16 md:mt-24">
        <WorkIndex rows={rows} categories={categories} />
      </Reveal>

      <section aria-labelledby="earlier-title" className="mt-28 md:mt-40">
        <Reveal>
          <p className="label">Earlier work</p>
          <h2 id="earlier-title" className="mt-4 text-2xl font-medium tracking-[-0.02em] md:text-3xl">
            Academic & independent projects
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-px bg-line md:grid-cols-2">
          {earlierWork.map((w) => (
            <Reveal key={w.title} className="bg-bg py-8 md:pr-10">
              <article>
                <p className="font-mono text-[0.75rem] text-muted">{w.period} · {w.context}</p>
                <h3 className="mt-3 text-xl font-medium">{w.title}</h3>
                <ul className="mt-4 space-y-2 text-[0.875rem] leading-relaxed text-muted">
                  {w.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {w.tags.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
          <Reveal className="bg-bg py-8 md:pl-10">
            <p className="font-mono text-[0.75rem] text-muted">Industrial & research internships</p>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
              Pharmaceutical production optimisation at ADWYA (2025) and organic-waste vermicomposting at CITET (2024)
              are described on the <a href="/about#experience" className="text-ink underline decoration-line-strong underline-offset-4 hover:text-accent">About</a> page.
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
