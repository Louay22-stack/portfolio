import type { VizId } from "@/lib/types";
import { InteractivePFD } from "@/components/diagrams/InteractivePFD";
import { AnaeroPipeline, Task1Models, Task1Scatter, Task2Threshold, Task3Confusion, Task3Importance } from "./anaerovision";
import { BiogasSensitivity, BiogasValidation } from "./biogas";
import { BPFootprint, BPStrains, BPValidation } from "./biopredict";

export function Viz({ id }: { id: VizId }) {
  switch (id) {
    case "av-pipeline": return <AnaeroPipeline />;
    case "av-task1-models": return <Task1Models />;
    case "av-task1-scatter": return <Task1Scatter />;
    case "av-task2-threshold": return <Task2Threshold />;
    case "av-task3-confusion": return <Task3Confusion />;
    case "av-task3-importance": return <Task3Importance />;
    case "biogas-pfd": return <InteractivePFD />;
    case "biogas-validation": return <BiogasValidation />;
    case "biogas-sensitivity": return <BiogasSensitivity />;
    case "bp-footprint": return <BPFootprint />;
    case "bp-strains": return <BPStrains />;
    case "bp-validation": return <BPValidation />;
  }
}
