import { getProject, projects } from "@/content/projects";
import { ogCard, ogSize } from "@/lib/og";

export const alt = "Case study by Louay Ouhibi";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug) ?? projects[0];
  return ogCard({ kicker: p.kicker, title: p.shortTitle, subtitle: p.tagline.slice(0, 120) });
}
