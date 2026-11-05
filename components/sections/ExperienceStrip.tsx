import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { experience } from "@/content/experience";
import { anaerovision } from "@/content/internships/anaerovision";
import { Em, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectCover } from "./ProjectCover";

export function ExperienceStrip() {
  return (
    <section aria-labelledby="exp-title" className="border-t border-line py-28 md:py-40">
      <div className="container-site">
        <Reveal className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            index="06"
            label="Internships"
            id="exp-title"
            heading={
              <>
                Four internships, <Em>from the lab to the factory floor.</Em>
              </>
            }
          />
          <Link href="/internships" className="label inline-flex items-center gap-2 hover:text-ink">
            All internships <ArrowUpRight aria-hidden className="size-3.5" />
          </Link>
        </Reveal>
        <article className="mt-16 grid grid-cols-1 items-center gap-10 xl:grid-cols-12 xl:gap-16">
          <Reveal className="xl:col-span-7">
            <Link
              href={`/internships/${anaerovision.slug}`}
              aria-label="AnaeroVision, my end-of-study internship"
              className="corners block border border-line bg-bg-deep/60 transition-colors duration-500 hover:border-line-strong"
            >
              <div className="min-h-[260px]">
                <ProjectCover project={anaerovision} />
              </div>
            </Link>
          </Reveal>
          <Reveal delay={0.1} className="xl:col-span-5">
            <p className="label">End-of-study internship · {anaerovision.period}</p>
            <h3 className="mt-4 text-3xl font-medium tracking-[-0.02em] md:text-4xl">
              <Link href={`/internships/${anaerovision.slug}`} className="hover:text-accent">
                {anaerovision.shortTitle}
              </Link>
            </h3>
            <p className="mt-5 text-lg leading-snug text-ink">{anaerovision.plain.oneLine}</p>
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted">{anaerovision.plain.result}</p>
          </Reveal>
        </article>
        <ol className="mt-16 grid gap-px bg-line sm:grid-cols-2 xl:grid-cols-4">
          {experience.map((e, i) => (
            <Reveal as="li" key={e.slug} delay={i * 0.06} className="bg-bg py-8 sm:pr-8 xl:px-8 xl:first:pl-0">
              <Link href={`/internships#${e.slug}`} className="group block">
                <p className="font-mono text-3xl tracking-tight text-ink">{e.year}</p>
                <p className="mt-6 text-[0.9375rem] font-medium transition-colors group-hover:text-accent">{e.goal}</p>
                <p className="mt-1 text-[0.8125rem] text-muted">{e.shortOrg}</p>
                {e.location && <p className="label mt-4">{e.location}</p>}
              </Link>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
