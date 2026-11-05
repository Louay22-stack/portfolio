import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNextProject, getProject, projects } from "@/content/projects";
import { CaseStudy } from "@/components/case/CaseStudy";

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

export default async function Page({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  return <CaseStudy p={p} next={getNextProject(p.slug)} base="/work" backLabel="All projects" nextLabel="Next project" />;
}
