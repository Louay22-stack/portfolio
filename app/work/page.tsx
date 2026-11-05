import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { projects } from "@/content/projects";
import { Em, IndexLabel, Tag } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectBrief } from "@/components/sections/ProjectBrief";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Engineering projects by Louay Ouhibi, explained simply: biogas heat recovery (DWSIM simulation), choosing protein-producing microbes (BioPredict) and growing microalgae on industrial wastewater.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <div className="container-site pt-32 pb-32 md:pt-44">
      <Reveal>
        <IndexLabel index="04">Projects</IndexLabel>
        <h1 className="mt-8 max-w-4xl text-[2.5rem] leading-[1.02] font-medium tracking-[-0.03em] text-balance md:text-7xl">
          Three engineering projects, <Em>explained simply.</Em>
        </h1>
        <p className="mt-8 max-w-2xl text-[1.0625rem] leading-relaxed text-muted">
          I use biology, process engineering and data to make industrial processes more predictable, such as turning
          waste into energy or growing protein from microbes. No technical background is needed here: each project
          starts with the problem, what I did and the result. The full engineering detail is one click away.
        </p>
      </Reveal>

      {/* How the projects connect */}
      <Reveal delay={0.1} className="mt-14 md:mt-20">
        <nav aria-labelledby="overview-title">
          <p id="overview-title" className="label">
            At a glance
          </p>
          <ol className="mt-4 grid gap-px border border-line bg-line md:grid-cols-3">
            {projects.map((p, i) => (
              <li key={p.slug} className="bg-bg">
                <a href={`#${p.slug}`} className="group flex h-full flex-col p-5 transition-colors hover:bg-bg-elev/60 md:p-6">
                  <span className="font-mono text-sm text-accent">0{i + 1}</span>
                  <span className="mt-3 text-lg leading-snug font-medium">{p.plain.goal}</span>
                  <span className="mt-auto flex items-center justify-between gap-3 pt-5 text-[0.8125rem] text-muted group-hover:text-ink">
                    {p.shortTitle}
                    <ArrowDown aria-hidden className="size-4 shrink-0" />
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </Reveal>

      {/* The projects */}
      <div className="mt-20 space-y-20 md:mt-28 md:space-y-28">
        {projects.map((p, i) => (
          <Reveal key={p.slug}>
            <article id={p.slug} aria-labelledby={`${p.slug}-title`} className="scroll-mt-28 border-t border-line-strong pt-8 md:pt-10">
              <div className="grid gap-8 xl:grid-cols-12 xl:gap-16">
                <div className="xl:col-span-5">
                  <p className="font-mono text-sm text-accent">0{i + 1}</p>
                  <h2 id={`${p.slug}-title`} className="mt-4 text-3xl font-medium tracking-[-0.02em] md:text-4xl">
                    {p.shortTitle}
                  </h2>
                  <p className="mt-4 text-lg leading-snug text-ink md:text-xl">{p.plain.oneLine}</p>
                  <div className="mt-6 flex flex-wrap gap-1.5">
                    <Tag>{p.plain.type}</Tag>
                    <Tag>{p.period}</Tag>
                  </div>
                  <Link
                    href={`/work/${p.slug}`}
                    className="group mt-8 inline-flex items-center gap-3 border-b border-line-strong pb-2 text-sm transition-colors hover:border-accent hover:text-accent"
                  >
                    See the full project
                    <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
                <ProjectBrief plain={p.plain} className="xl:col-span-7" />
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      {/* Pointer to the internships */}
      <Reveal className="mt-28 border-t border-line-strong pt-8 md:mt-40">
        <p className="label">Also worth knowing</p>
        <Link href="/internships" className="group mt-4 inline-flex items-center gap-3 text-2xl font-medium tracking-[-0.02em] hover:text-accent md:text-3xl">
          See my four internships
          <ArrowUpRight aria-hidden className="size-6 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </Reveal>
    </div>
  );
}
