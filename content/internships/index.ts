import type { Project } from "@/lib/types";
import { adwya } from "./adwya";
import { anaerovision } from "./anaerovision";
import { pasteur } from "./pasteur";

/** Internships with their own page. */
export const internshipStudies: Project[] = [anaerovision, pasteur, adwya].sort((a, b) => a.order - b.order);

export function getInternshipStudy(slug: string) {
  return internshipStudies.find((p) => p.slug === slug);
}

export function getNextInternshipStudy(slug: string) {
  const i = internshipStudies.findIndex((p) => p.slug === slug);
  return internshipStudies[(i + 1) % internshipStudies.length];
}
