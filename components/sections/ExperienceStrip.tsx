import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { experience, education } from "@/content/experience";
import { Em, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";

export function ExperienceStrip() {
  const items = [
    ...experience.map((e) => ({ year: e.year, title: e.role, org: e.org, location: e.location })),
    { year: "2021–26", title: "Engineering Degree, Industrial Biology", org: "INSAT", location: education[0].location },
  ];
  return (
    <section aria-labelledby="exp-title" className="border-t border-line py-28 md:py-40">
      <div className="container-site">
        <Reveal className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            index="06"
            label="Experience"
            id="exp-title"
            heading={
              <>
                Research, industry and the lab, <Em>in that order.</Em>
              </>
            }
          />
          <Link href="/about" className="label inline-flex items-center gap-2 hover:text-ink">
            Full profile <ArrowUpRight aria-hidden className="size-3.5" />
          </Link>
        </Reveal>
        <ol className="mt-16 grid gap-px bg-line sm:grid-cols-2 xl:grid-cols-4">
          {items.map((it, i) => (
            <Reveal as="li" key={it.title} delay={i * 0.06} className="bg-bg py-8 sm:pr-8 xl:px-8 xl:first:pl-0">
              <p className="font-mono text-3xl tracking-tight text-ink">{it.year}</p>
              <p className="mt-6 text-[0.9375rem] font-medium">{it.title}</p>
              <p className="mt-1 text-[0.8125rem] text-muted">{it.org}</p>
              {it.location && <p className="label mt-4">{it.location}</p>}
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
