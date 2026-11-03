import { ogCard, ogSize } from "@/lib/og";

export const alt = "Louay Ouhibi, Bioprocess Engineer";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogCard({
    kicker: "Bioprocess Engineer",
    title: "Engineering living processes, from bioreactor to data.",
    subtitle: "Anaerobic digestion · Fermentation · Process simulation · Machine learning",
  });
}
