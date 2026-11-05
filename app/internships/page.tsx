import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { experience } from "@/content/experience";
import { Em, IndexLabel, Tag } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectBrief } from "@/components/sections/ProjectBrief";

export const metadata: Metadata = {
  title: "Internships",
  description:
    "Internships by Louay Ouhibi, explained simply: biogas research at Memorial University, bioinformatics at the Institut Pasteur de Tunis, pharmaceutical production at ADWYA and vermicomposting at CITET.",
  alternates: { canonical: "/internships" },
};

export default function InternshipsPage() {
  return (
    <div className="container-site pt-32 pb-32 md:pt-44">
      <Reveal>
        <IndexLabel index="06">Internships</IndexLabel>
        <h1 className="mt-8 max-w-4xl text-[2.5rem] leading-[1.02] font-medium tracking-[-0.03em] text-balance md:text-7xl">
          Four internships, <Em>explained simply.</Em>
        </h1>
        <p className="mt-8 max-w-2xl text-[1.0625rem] leading-relaxed text-muted">
          From my end-of-study internship in Canada to a pharmaceutical plant in Tunisia, each one taught me a different
          side of working with living processes. No technical background is needed here: each one starts with the problem,
          what I did and the result.
        </p>
      </Reveal>

      <Reveal delay={0.1} className="mt-14 md:mt-20">
        <nav aria-labelledby="overview-title">
          <p id="overview-title" className="label">
            At a glance
          </p>
          <ol className="mt-4 grid gap-px border border-line bg-line sm:grid-cols-2 xl:grid-cols-4">
            {experience.map((e) => (
              <li key={e.slug} className="bg-bg">
                <a href={`#${e.slug}`} className="group flex h-full flex-col p-5 transition-colors hover:bg-bg-elev/60 md:p-6">
                  <span className="font-mono text-sm text-accent">{e.year}</span>
                  <span className="mt-3 text-lg leading-snug font-medium">{e.goal}</span>
                  <span className="mt-auto flex items-center justify-between gap-3 pt-5 text-[0.8125rem] text-muted group-hover:text-ink">
                    {e.shortOrg}
                    <ArrowDown aria-hidden className="size-4 shrink-0" />
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </Reveal>

      <div className="mt-20 space-y-20 md:mt-28 md:space-y-28">
        {experience.map((e) => (
          <Reveal key={e.slug}>
            <article id={e.slug} aria-labelledby={`${e.slug}-title`} className="scroll-mt-28 border-t border-line-strong pt-8 md:pt-10">
              <div className="grid gap-8 xl:grid-cols-12 xl:gap-16">
                <div className="xl:col-span-5">
                  <p className="font-mono text-sm text-accent">{e.period}</p>
                  <h2 id={`${e.slug}-title`} className="mt-4 text-3xl font-medium tracking-[-0.02em] md:text-4xl">
                    {e.shortOrg}
                  </h2>
                  <p className="mt-2 text-[0.9375rem] text-muted">{e.role}</p>
                  <p className="mt-4 text-lg leading-snug text-ink md:text-xl">{e.oneLine}</p>
                  <div className="mt-6 flex flex-wrap gap-1.5">
                    <Tag>{e.type}</Tag>
                  </div>
                  {e.href && (
                    <Link
                      href={e.href}
                      className="group mt-8 inline-flex items-center gap-3 border-b border-line-strong pb-2 text-sm transition-colors hover:border-accent hover:text-accent"
                    >
                      See the full internship
                      <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  )}
                </div>
                {e.plain ? (
                  <ProjectBrief plain={e.plain} className="xl:col-span-7" />
                ) : (
                  <ul className="space-y-2 border-t border-line pt-4 text-[0.9375rem] leading-relaxed text-ink/90 xl:col-span-7">
                    {e.points.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
