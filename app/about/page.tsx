import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Download } from "lucide-react";
import { profile } from "@/content/profile";
import { activities, education, experience } from "@/content/experience";
import { credentials, expertise } from "@/content/skills";
import { Button, Em, IndexLabel } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "About",
  description:
    "Profile of Louay Ouhibi, Industrial Biology Engineer (INSAT): education, research and industrial experience, technical expertise, credentials and languages.",
  alternates: { canonical: "/about" },
};

function Block({ index, label, id, children }: { index: string; label: string; id: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-24 border-t border-line py-20 md:py-28">
      <div className="grid grid-cols-1 gap-10 xl:grid-cols-12">
        <div className="xl:col-span-3">
          <IndexLabel index={index}>
            <span id={`${id}-h`}>{label}</span>
          </IndexLabel>
        </div>
        <div className="xl:col-span-9">{children}</div>
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <div className="container-site pt-32 md:pt-44">
      {/* Intro */}
      <section className="grid grid-cols-1 gap-12 pb-20 md:pb-28 xl:grid-cols-12">
        <Reveal className="xl:col-span-8">
          <IndexLabel index="01">About</IndexLabel>
          <h1 className="mt-8 text-[2.5rem] leading-[1.02] font-medium tracking-[-0.03em] text-balance md:text-7xl">
            An engineer between <Em>the bioreactor and the model.</Em>
          </h1>
          <div className="mt-10 max-w-2xl space-y-5 text-[1rem] leading-[1.75] text-muted">
            {profile.profileLong.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button href={profile.cv} download>
              Download CV
            </Button>
            <Button href="/#contact" variant="ghost">
              Get in touch
            </Button>
          </div>
        </Reveal>
        <Reveal delay={0.1} className="xl:col-span-4 xl:pt-24">
          <dl className="corners divide-y divide-line border border-line bg-bg-deep/50">
            {[
              ["Title", profile.title],
              ["Degree", profile.discipline],
              ["Based in", profile.location],
              ["Mobility", profile.relocation],
              ["Status", profile.availability],
              ["Seeking", profile.seekingFor.join(" · ")],
            ].map(([k, v]) => (
              <div key={k} className="grid grid-cols-[6.5rem_1fr] gap-4 px-5 py-4">
                <dt className="label pt-0.5">{k}</dt>
                <dd className="text-[0.875rem]">{v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      <Block index="02" label="Experience" id="experience">
        <ol className="space-y-px bg-line">
          {experience.map((e) => (
            <li key={e.title} className="grid gap-4 bg-bg py-8 md:grid-cols-[10rem_1fr] md:gap-10">
              <p className="font-mono text-[0.8125rem] text-muted">{e.period}</p>
              <div>
                <h2 className="text-xl font-medium tracking-[-0.01em] md:text-2xl">{e.title}</h2>
                <p className="mt-2 text-[0.875rem] text-ink">
                  {e.role} · <span className="text-muted">{e.org}{e.location ? `, ${e.location}` : ""}</span>
                </p>
                <ul className="mt-4 max-w-3xl space-y-2 text-[0.9375rem] leading-relaxed text-muted">
                  {e.points.map((pt) => (
                    <li key={pt} className="grid grid-cols-[1rem_1fr]">
                      <span aria-hidden className="text-accent">–</span>
                      {pt}
                    </li>
                  ))}
                </ul>
                {e.href && (
                  <Link href={e.href} className="mt-5 inline-flex items-center gap-2 text-[0.8125rem] text-accent hover:underline">
                    Read the case study <ArrowUpRight aria-hidden className="size-3.5" />
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ol>
      </Block>

      <Block index="03" label="Education" id="education">
        {education.map((ed) => (
          <div key={ed.institution} className="grid gap-4 md:grid-cols-[10rem_1fr] md:gap-10">
            <p className="font-mono text-[0.8125rem] text-muted">{ed.period}</p>
            <div>
              <h2 className="text-xl font-medium tracking-[-0.01em] md:text-2xl">{ed.institution}</h2>
              <p className="mt-1 text-[0.875rem] text-muted">{ed.location}</p>
              <ul className="mt-5 space-y-1.5 text-[0.9375rem] text-ink">
                {ed.degrees.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
              <p className="label mt-8 mb-3">Relevant coursework</p>
              <ul className="flex flex-wrap gap-1.5">
                {ed.coursework.map((c) => (
                  <li key={c} className="border border-line px-2.5 py-1 font-mono text-[0.6875rem] text-muted">
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </Block>

      <Block index="04" label="Technical expertise" id="expertise">
        <div className="grid gap-px bg-line md:grid-cols-2">
          {expertise.map((g) => (
            <div key={g.group} className="bg-bg py-6 md:p-8 md:odd:pl-0">
              <h2 className="text-lg font-medium">{g.group}</h2>
              <ul className="mt-5 divide-y divide-line">
                {g.items.map((it) => (
                  <li key={it.name} className="flex items-baseline justify-between gap-4 py-2.5">
                    <span className="text-[0.875rem]">{it.name}</span>
                    <span className="shrink-0 text-right font-mono text-[0.625rem] text-muted">{it.evidence}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-6 font-mono text-[0.6875rem] text-muted">Right column: where each skill is evidenced.</p>
      </Block>

      <Block index="05" label="Credentials" id="credentials">
        <ul className="grid gap-6 md:grid-cols-3">
          {credentials.map((c) => (
            <li key={c.title} className="corners flex flex-col border border-line bg-bg-deep/50 p-5">
              {"image" in c && (
                <div className="mb-5 bg-paper p-2">
                  <Image src={c.image} alt={c.imageAlt} width={1280} height={789} sizes="(min-width: 768px) 33vw, 100vw" className="h-auto w-full" />
                </div>
              )}
              <p className="label">{c.issuer}</p>
              <h2 className="mt-2 text-[1rem] font-medium">{c.title}</h2>
              <p className="mt-1 font-mono text-[0.75rem] text-muted">{c.date}</p>
              {"href" in c && (
                <a href={c.href} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[0.8125rem] text-accent hover:underline">
                  {c.linkLabel} <ArrowUpRight aria-hidden className="size-3.5" />
                </a>
              )}
            </li>
          ))}
        </ul>
      </Block>

      <Block index="06" label="Languages" id="languages">
        <ul className="grid gap-px bg-line sm:grid-cols-2 xl:grid-cols-4">
          {profile.languages.map((l) => (
            <li key={l.name} className="bg-bg py-6 sm:pr-6">
              <p className="text-xl font-medium">{l.name}</p>
              <p className="mt-1 font-mono text-[0.8125rem] text-accent">{l.level}</p>
              {"note" in l && <p className="mt-2 text-[0.75rem] text-muted">{l.note}</p>}
            </li>
          ))}
        </ul>
      </Block>

      <Block index="07" label="Beyond engineering" id="activities">
        <ul className="space-y-px bg-line">
          {activities.map((a) => (
            <li key={a.title} className="grid gap-2 bg-bg py-5 md:grid-cols-[10rem_1fr] md:gap-10">
              <p className="font-mono text-[0.8125rem] text-muted">{a.period}</p>
              <p className="text-[0.9375rem]">
                {a.title} · <span className="text-muted">{a.text}</span>
              </p>
            </li>
          ))}
        </ul>
      </Block>

      <section className="border-t border-line py-20 md:py-28">
        <a href={profile.cv} download="" className="group flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <span>
            <span className="label block">Curriculum vitae</span>
            <span className="mt-4 block text-4xl font-medium tracking-[-0.03em] transition-colors group-hover:text-accent md:text-6xl">
              Download the full CV
            </span>
          </span>
          <Download aria-hidden className="size-10 text-muted transition-colors group-hover:text-accent md:size-14" />
        </a>
      </section>
    </div>
  );
}
