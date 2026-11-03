import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/content/projects";
import { Em, SectionHeading, Tag } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import { ProjectCover } from "./ProjectCover";

export function FeaturedWork() {
  return (
    <section aria-labelledby="work-title" className="border-t border-line py-28 md:py-40">
      <div className="container-site">
        <Reveal className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            index="04"
            label="Selected work"
            id="work-title"
            heading={
              <>
                Case studies from the digester, the flowsheet <Em>and the dataset.</Em>
              </>
            }
          />
          <Link href="/work" className="label inline-flex items-center gap-2 hover:text-ink">
            All projects <ArrowUpRight aria-hidden className="size-3.5" />
          </Link>
        </Reveal>

        <ol className="mt-20 space-y-24 md:mt-28 md:space-y-36">
          {projects.map((p, i) => (
            <li key={p.slug}>
              <article className={cn("grid grid-cols-1 items-center gap-10 xl:grid-cols-12 xl:gap-16")}>
                <Reveal className={cn("xl:col-span-7", i % 2 === 1 && "xl:order-2")}>
                  <Link
                    href={`/work/${p.slug}`}
                    aria-label={`${p.shortTitle} case study`}
                    className="group corners block border border-line bg-bg-deep/60 transition-colors duration-500 hover:border-line-strong"
                  >
                    <div className="flex items-center justify-between border-b border-line px-5 py-3">
                      <span className="font-mono text-[0.6875rem] text-muted">FIG. {String(i + 1).padStart(2, "0")}</span>
                      <span className="font-mono text-[0.6875rem] text-muted">{p.period}</span>
                    </div>
                    <div className="min-h-[260px] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.015]">
                      <ProjectCover project={p} />
                    </div>
                  </Link>
                </Reveal>

                <Reveal delay={0.1} className={cn("xl:col-span-5", i % 2 === 1 && "xl:order-1")}>
                  <p className="font-mono text-sm text-accent">0{i + 1}</p>
                  <p className="label mt-4">{p.kicker}</p>
                  <h3 className="mt-4 text-3xl font-medium tracking-[-0.02em] md:text-4xl">
                    <Link href={`/work/${p.slug}`} className="hover:text-accent">
                      {p.shortTitle}
                    </Link>
                  </h3>
                  <p className="mt-5 text-[0.9375rem] leading-relaxed text-muted">{p.tagline}</p>
                  <dl className="mt-8 grid grid-cols-2 gap-px bg-line">
                    {p.headline.slice(0, 4).map((m) => (
                      <div key={m.label} className="bg-bg py-4 pr-4">
                        <dt className="text-[0.75rem] text-muted">{m.label}</dt>
                        <dd className="mt-1 font-mono text-xl text-ink">{m.value}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="mt-8 flex flex-wrap gap-2">
                    {p.categories.map((c) => (
                      <Tag key={c}>{c}</Tag>
                    ))}
                  </div>
                  <Link
                    href={`/work/${p.slug}`}
                    className="group mt-10 inline-flex items-center gap-3 border-b border-line-strong pb-2 text-sm transition-colors hover:border-accent hover:text-accent"
                  >
                    Read the case study
                    <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </Reveal>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
