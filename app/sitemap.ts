import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { siteUrl } from "@/content/profile";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/work`, changeFrequency: "monthly", priority: 0.9 },
    ...projects.map((p) => ({ url: `${siteUrl}/work/${p.slug}`, changeFrequency: "yearly" as const, priority: 0.8 })),
    { url: `${siteUrl}/about`, changeFrequency: "monthly", priority: 0.8 },
  ];
}
