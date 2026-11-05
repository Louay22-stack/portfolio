import Link from "next/link";
import { ArrowLeft, ArrowUpRight, ChevronDown } from "lucide-react";
import { siteUrl } from "@/content/profile";
import { BlockView, MetricCard } from "@/components/case/Blocks";
import { SectionNav } from "@/components/case/SectionNav";
import { ProjectBrief } from "@/components/sections/ProjectBrief";
import { Tag } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";
import type { Project } from "@/lib/types";

/** The page layout shared by projects and internships. */
export function CaseStudy({
  p,
  next,
  base,
  backLabel,
  nextLabel,
}: { p: Project; next: Project; base: string; backLabel: string; nextLabel: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: p.title,
    abstract: p.summary,
    url: `${siteUrl}${base}/${p.slug}`,
    author: { "@type": "Person", name: "Louay Ouhibi" },
    keywords: [...p.categories, ...p.tools].join(", "),
    ...(p.repo ? { codeRepository: p.repo.href } : {}),
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      {/* Header */}
      <header className="container-site pt-32 md:pt-40">
        <Reveal>
          <Link href={base} className="label inline-flex items-center gap-2 hover:text-ink">
            <ArrowLeft aria-hidden className="size-3.5" /> {backLabel}
          </Link>
        </Reveal>
        <div className="mt-12 grid grid-cols-1 gap-10 xl:grid-cols-12">
          <Reveal className="xl:col-span-8" delay={0.05}>
            <p className="label text-accent">{p.plain.goal}</p>
            <h1 className="mt-5 text-[2.5rem] leading-[1.02] font-medium tracking-[-0.03em] text-balance md:text-6xl xl:text-7xl">{p.title}</h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink md:text-xl">{p.plain.oneLine}</p>
          </Reveal>
          <Reveal className="xl:col-span-4 xl:pt-10" delay={0.12}>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-6 border-t border-line pt-6 xl:grid-cols-1">
              {[
                ["Role", p.role],
                ["Context", p.context],
                ["Period", p.period],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="label">{k}</dt>
                  <dd className="mt-1.5 text-[0.9375rem]">{v}</dd>
                </div>
              ))}
              <div className="col-span-2 xl:col-span-1">
                <dt className="label">Tools</dt>
                <dd className="mt-2.5 flex flex-wrap gap-1.5">
                  {p.tools.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </dd>
              </div>
            </dl>
            {p.repo && (
              <a href={p.repo.href} target="_blank" rel="noopener noreferrer" className="group mt-8 inline-flex items-center gap-2 border-b border-line-strong pb-1.5 text-sm hover:border-accent hover:text-accent">
                {p.repo.label}
                <ArrowUpRight aria-hidden className="size-4" />
              </a>
            )}
          </Reveal>
        </div>

        {/* The short version, for readers without an engineering background */}
        <Reveal delay={0.18} className="mt-16">
          <section aria-labelledby="in-short" className="border border-line bg-bg-deep/40 p-5 md:p-8">
            <h2 id="in-short" className="text-2xl font-medium tracking-[-0.02em] md:text-3xl">
              In short
            </h2>
            <ProjectBrief plain={p.plain} withWhy className="mt-6" />
            <p className="mt-4 font-mono text-[0.5625rem] [overflow-wrap:anywhere] text-muted/60">src · {p.plain.resultSource}</p>
            <details className="group mt-6">
              <summary className="inline-flex cursor-pointer list-none items-center gap-2 text-sm text-ink transition-colors hover:text-accent [&::-webkit-details-marker]:hidden">
                <ChevronDown aria-hidden className="size-4 transition-transform group-open:rotate-180" />
                Technical terms on this page
              </summary>
              <dl className="mt-5 grid gap-x-10 gap-y-4 md:grid-cols-2">
                {p.plain.glossary.map((g) => (
                  <div key={g.term}>
                    <dt className="text-[0.875rem] font-medium">{g.term}</dt>
                    <dd className="mt-0.5 text-[0.875rem] leading-relaxed text-muted">{g.meaning}</dd>
                  </div>
                ))}
              </dl>
            </details>
          </section>
        </Reveal>

        <Reveal className="mt-16">
          <p className="label mb-4">Key numbers</p>
          <div className="grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2 xl:grid-cols-4">
            {p.headline.map((m) => (
              <MetricCard key={m.label} m={m} large />
            ))}
          </div>
        </Reveal>

      </header>

      {/* Body */}
      <div className="container-site mt-24 grid grid-cols-1 gap-12 pb-32 md:mt-32 xl:grid-cols-12">
        <aside className="contents xl:col-span-3 xl:block">
          <SectionNav
            sections={p.sections.map(({ id, title }) => ({ id, title }))}
            next={{ href: `${base}/${next.slug}`, title: next.shortTitle }}
          />
        </aside>
        <div className="space-y-24 md:space-y-32 xl:col-span-9">
          {p.sections.map((s, i) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`} className="scroll-mt-28">
              <Reveal>
                <p className="font-mono text-sm text-accent">/{String(i + 1).padStart(2, "0")}</p>
                <h2 id={`${s.id}-h`} className="mt-3 text-3xl font-medium tracking-[-0.02em] md:text-4xl">
                  {s.title}
                </h2>
                {p.plain.guide[s.id] && <p className="mt-4 max-w-[68ch] text-[1.0625rem] leading-relaxed text-ink/80">{p.plain.guide[s.id]}</p>}
              </Reveal>
              <div className="mt-10 space-y-8">
                {s.blocks.map((b, j) => (
                  <Reveal key={j}>
                    <BlockView block={b} />
                  </Reveal>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* Next project */}
      <Link href={`${base}/${next.slug}`} className="group block border-t border-line">
        <div className="container-site flex flex-col justify-between gap-6 py-16 md:flex-row md:items-end md:py-24">
          <div>
            <p className="label">{nextLabel}</p>
            <p className="mt-4 text-4xl font-medium tracking-[-0.03em] transition-colors group-hover:text-accent md:text-6xl">{next.shortTitle}</p>
            <p className="mt-3 max-w-xl text-[0.9375rem] text-muted">{next.plain.goal}</p>
          </div>
          <ArrowUpRight aria-hidden className="size-10 text-muted transition-all duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-accent md:size-14" />
        </div>
      </Link>
    </article>
  );
}
