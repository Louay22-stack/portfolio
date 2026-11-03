import type { Project } from "@/lib/types";
import { AnaeroPipeline } from "@/components/viz/anaerovision";
import { PFDCover } from "@/components/diagrams/InteractivePFD";
import { BPStrains } from "@/components/viz/biopredict";

/** Native, theme-consistent cover visual for each project. */
export function ProjectCover({ project }: { project: Project }) {
  switch (project.slug) {
    case "anaerovision":
      return (
        <div className="flex h-full flex-col justify-center p-5 md:p-8">
          <AnaeroPipeline compact />
        </div>
      );
    case "biogas-process-simulation":
      return (
        <div className="flex h-full items-center p-4 md:p-8">
          <PFDCover />
        </div>
      );
    case "biopredict":
      return (
        <div className="flex h-full items-center p-5 md:p-8">
          <BPStrains />
        </div>
      );
    default:
      return null;
  }
}
