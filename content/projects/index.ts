import type { Category, Project } from "@/lib/types";
import { anaerovision } from "./anaerovision";
import { biogas } from "./biogas-process-simulation";
import { biopredict } from "./biopredict";

export const projects: Project[] = [anaerovision, biogas, biopredict].sort(
  (a, b) => a.order - b.order,
);

export const categories: Category[] = [
  "Biogas",
  "Process Simulation",
  "Machine Learning",
  "Fermentation",
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function getNextProject(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
}
