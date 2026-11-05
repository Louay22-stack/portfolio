import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNextInternshipStudy, getInternshipStudy, internshipStudies } from "@/content/internships";
import { CaseStudy } from "@/components/case/CaseStudy";

export function generateStaticParams() {
  return internshipStudies.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/internships/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getInternshipStudy(slug);
  if (!p) return {};
  return {
    title: p.shortTitle,
    description: p.summary,
    alternates: { canonical: `/internships/${p.slug}` },
    openGraph: { title: `${p.shortTitle} · Louay Ouhibi`, description: p.tagline, url: `/internships/${p.slug}`, type: "article" },
  };
}

export default async function Page({ params }: PageProps<"/internships/[slug]">) {
  const { slug } = await params;
  const p = getInternshipStudy(slug);
  if (!p) notFound();
  return <CaseStudy p={p} next={getNextInternshipStudy(p.slug)} base="/internships" backLabel="All internships" nextLabel="Next internship" />;
}
