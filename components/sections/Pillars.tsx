import { pillars } from "@/content/profile";
import { Em, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";

export function Pillars() {
  return (
    <section aria-labelledby="pillars-title" className="container-site py-28 md:py-40">
      <Reveal>
        <SectionHeading
          index="03"
          label="Expertise"
          id="pillars-title"
          heading={
            <>
              Biological fundamentals, industrial process thinking, <Em>computational tools.</Em>
            </>
          }
        />
      </Reveal>

      <div className="mt-16 grid gap-px bg-line md:mt-24 md:grid-cols-3">
        {pillars.map((p, i) => (
          <Reveal key={p.index} delay={i * 0.08} className="flex flex-col bg-bg p-0 md:p-10 md:first:pl-0">
            <article className="flex h-full flex-col border-t border-line py-8 md:border-t-0 md:py-0">
              <p className="font-mono text-sm text-accent">{p.index}</p>
              <h3 className="mt-6 text-2xl font-medium tracking-[-0.02em]">{p.title}</h3>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted">{p.text}</p>
              <ul className="mt-8 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <li key={t} className="border border-line px-2.5 py-1 font-mono text-[0.6875rem] text-muted">
                    {t}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
