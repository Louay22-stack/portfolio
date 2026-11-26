import type { VizId } from "@/lib/types";
import { InteractivePFD } from "@/components/diagrams/InteractivePFD";
import { AnaeroPipeline } from "./anaerovision";
import { BiogasSensitivity, BiogasValidation } from "./biogas";
import { BPFootprint, BPStrains, BPValidation } from "./biopredict";
import { MicroalgaeGrowth } from "./microalgae";

export function Viz({ id }: { id: VizId }) {
  switch (id) {
    case "av-pipeline": return <AnaeroPipeline />;
    case "biogas-pfd": return <InteractivePFD />;
    case "biogas-validation": return <BiogasValidation />;
    case "biogas-sensitivity": return <BiogasSensitivity />;
    case "bp-footprint": return <BPFootprint />;
    case "bp-strains": return <BPStrains />;
    case "bp-validation": return <BPValidation />;
    case "ma-growth": return <MicroalgaeGrowth />;
  }
}
