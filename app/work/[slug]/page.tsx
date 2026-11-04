import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getNextProject, getProject, projects } from "@/content/projects";
import { siteUrl } from "@/content/profile";
import { BlockView, MetricCard } from "@/components/case/Blocks";
import { SectionNav } from "@/components/case/SectionNav";
import { Tag } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return {
    title: p.shortTitle,
    description: p.summary,
    alternates: { canonical: `/work/${p.slug}` },
    openGraph: { title: `${p.shortTitle} · Louay Ouhibi`, description: p.tagline, url: `/work/${p.slug}`, type: "article" },
  };
}

export default async function CaseStudy({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  const next = getNextProject(p.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: p.title,
    abstract: p.summary,
    url: `${siteUrl}/work/${p.slug}`,
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
          <Link href="/work" className="label inline-flex items-center gap-2 hover:text-ink">
            <ArrowLeft aria-hidden className="size-3.5" /> Engineering portfolio
          </Link>
        </Reveal>
        <div className="mt-12 grid grid-cols-1 gap-10 xl:grid-cols-12">
          <Reveal className="xl:col-span-8" delay={0.05}>
            <p className="label text-accent">{p.kicker}</p>
            <h1 className="mt-5 text-[2.5rem] leading-[1.02] font-medium tracking-[-0.03em] text-balance md:text-6xl xl:text-7xl">{p.title}</h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">{p.tagline}</p>
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

        <Reveal delay={0.18} className="mt-16">
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
            next={{ href: `/work/${next.slug}`, title: next.shortTitle }}
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
      <Link href={`/work/${next.slug}`} className="group block border-t border-line">
        <div className="container-site flex flex-col justify-between gap-6 py-16 md:flex-row md:items-end md:py-24">
          <div>
            <p className="label">Next case study</p>
            <p className="mt-4 text-4xl font-medium tracking-[-0.03em] transition-colors group-hover:text-accent md:text-6xl">{next.shortTitle}</p>
            <p className="mt-3 max-w-xl text-[0.9375rem] text-muted">{next.kicker}</p>
          </div>
          <ArrowUpRight aria-hidden className="size-10 text-muted transition-all duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-accent md:size-14" />
        </div>
      </Link>
    </article>
  );
}
