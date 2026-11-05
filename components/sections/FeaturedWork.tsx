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
            label="Projects"
            id="work-title"
            heading={
              <>
                Three engineering projects, <Em>explained simply.</Em>
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
                    aria-label={`${p.shortTitle} project`}
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
                  <p className="label mt-4">{p.plain.goal}</p>
                  <h3 className="mt-4 text-3xl font-medium tracking-[-0.02em] md:text-4xl">
                    <Link href={`/work/${p.slug}`} className="hover:text-accent">
                      {p.shortTitle}
                    </Link>
                  </h3>
                  <p className="mt-5 text-lg leading-snug text-ink">{p.plain.oneLine}</p>
                  <dl className="mt-6 space-y-4 border-t border-line pt-5">
                    <div>
                      <dt className="label text-accent">The problem</dt>
                      <dd className="mt-1.5 text-[0.9375rem] leading-relaxed text-muted">{p.plain.problem}</dd>
                    </div>
                    <div>
                      <dt className="label text-accent">The result</dt>
                      <dd className="mt-1.5 text-[0.9375rem] leading-relaxed text-muted">{p.plain.result}</dd>
                    </div>
                  </dl>
                  <div className="mt-6 flex flex-wrap gap-2">
                    <Tag>{p.plain.type}</Tag>
                  </div>
                  <Link
                    href={`/work/${p.slug}`}
                    className="group mt-8 inline-flex items-center gap-3 border-b border-line-strong pb-2 text-sm transition-colors hover:border-accent hover:text-accent"
                  >
                    See the full project
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
