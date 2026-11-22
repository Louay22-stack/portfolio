import type { Project } from "@/lib/types";
import { biogas } from "./biogas-process-simulation";
import { biopredict } from "./biopredict";
import { microalgae } from "./microalgae";
import { methatwin } from "./methatwin";

export const projects: Project[] = [methatwin, biogas, biopredict, microalgae].sort(
  (a, b) => a.order - b.order,
);

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function getNextProject(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
}
