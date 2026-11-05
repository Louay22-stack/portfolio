import { getInternshipStudy, internshipStudies } from "@/content/internships";
import { ogCard, ogSize } from "@/lib/og";

export const alt = "Internship by Louay Ouhibi";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return internshipStudies.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getInternshipStudy(slug) ?? internshipStudies[0];
  return ogCard({ kicker: p.kicker, title: p.shortTitle, subtitle: p.tagline.slice(0, 120) });
}
