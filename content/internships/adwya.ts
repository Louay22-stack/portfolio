import type { Project } from "@/lib/types";

const REPORT = "Rapport de Stage (Adwya)1.pdf";

export const adwya: Project = {
  slug: "adwya-production",
  order: 2,
  title: "Finding Lost Time on a Pharmaceutical Packaging Line",
  shortTitle: "ADWYA Pharmaceutical",
  kicker: "Pharmaceutical production · Continuous improvement",
  tagline: "A time study in a regulated drug-manufacturing plant, from Good Manufacturing Practice training to measured packaging performance and improvement proposals.",
  summary:
    "A one-month industrial internship in the Alpha production unit of ADWYA: GMP training, observation of a full tablet production cycle, and a time study of secondary packaging that linked output to machine stoppages.",
  plain: {
    goal: "Find where a production line loses time",
    type: "Industrial internship · Tunisia",
    oneLine: "Timing a medicine packaging line to find out what slows it down, and suggesting how to improve it.",
    problem:
      "In drug manufacturing, strict quality rules mean time cannot be saved by cutting corners. To improve a line, you first need to measure exactly where the time goes.",
    did: "After Good Manufacturing Practice training, I followed a tablet's production from weighing to packaging, broke the weighing step into sub-tasks, and timed a packaging line over three one-hour sessions.",
    result:
      "Machine stops had the biggest effect on output. The line packed 1,554 blister packs in the hour with 22 minutes of stops, against 2,352 with about 4 minutes. I proposed automated jam detection and regular maintenance of the leaflet module.",
    resultSource: `${REPORT} p. 21–22`,
    why: "I saw how a regulated factory works day to day, and how a short, careful measurement can point to the most useful fix. The proposals were not tested during the internship.",
    glossary: [
      { term: "Good Manufacturing Practice (GMP)", meaning: "The quality rules that medicines must be produced under." },
      { term: "Blister pack", meaning: "The sealed plastic and foil strip that holds tablets." },
      { term: "Secondary packaging", meaning: "Putting blister packs and leaflets into boxes, then into shipping cartons." },
      { term: "Time study", meaning: "Timing real work to see how long each task takes and where time is lost." },
      { term: "Continuous improvement", meaning: "Making regular small changes to a process, based on measurements." },
      { term: "Traceability", meaning: "Being able to follow every batch and action through written records." },
    ],
    guide: {
      context: "What it means to work in a regulated pharmaceutical plant.",
      objectives: "What this internship set out to do.",
      method: "How I learned the process and measured the line.",
      results: "What the measurements showed, and what I proposed.",
      limitations: "What this work cannot claim, and why.",
      significance: "What this experience brought to my engineering profile.",
    },
  },
  categories: ["Pharmaceutical Production"],
  period: "June – July 2025",
  role: "Industrial intern",
  context: "ADWYA Pharmaceutical, Alpha production unit, Tunisia",
  tools: ["GMP", "Time study", "Lean", "Kaizen", "PDCA", "5S", "Six Sigma (DMAIC)"],
  headline: [
    { value: "3", label: "One-hour timing sessions", detail: "On a line running at 40 blister packs per minute", source: `${REPORT} p. 21` },
    { value: "22 min", label: "Longest machine stoppage", detail: "More than a third of the session", source: `${REPORT} p. 21` },
    { value: "+51%", label: "Output, low-stop vs high-stop session", detail: "2,352 against 1,554 blister packs", source: `${REPORT} p. 21–22` },
    { value: "2", label: "Improvement proposals", detail: "Jam detection · leaflet module maintenance", source: `${REPORT} p. 22` },
  ],
  sections: [
    {
      id: "context",
      title: "Context & problem",
      blocks: [
        {
          kind: "lead",
          text: "ADWYA is a Tunisian pharmaceutical manufacturer founded in 1983. Its Alpha unit mainly produces generic medicines in dry and liquid forms.",
        },
        {
          kind: "p",
          text: "My internship topic was the optimisation of production time. In this setting, every step is documented and controlled, so improvement has to come from understanding the process and removing lost time, without changing how quality is assured.",
        },
      ],
    },
    {
      id: "objectives",
      title: "Objectives",
      blocks: [
        {
          kind: "list",
          items: [
            "Understand Good Manufacturing Practice and how it applies on the production floor.",
            "Follow the full life of a medicine, from raw materials to secondary packaging.",
            "Carry out a time study on a critical operation.",
            "Analyse the results and propose ways to improve.",
          ],
        },
      ],
    },
    {
      id: "method",
      title: "How I worked",
      blocks: [
        {
          kind: "list",
          items: [
            "Completed GMP training with the quality team: hygiene, clean-zone behaviour, traceability, deviations and corrective actions.",
            "Spent two weeks in the Alpha unit observing a tablet's production: weighing, mixing and granulation, drying, compression, coating and packaging.",
            "Broke the weighing operation into sub-tasks, from transferring materials to double-checking and recording.",
            "Timed secondary packaging over three one-hour sessions, on a line run by one machine operator and two operators.",
            "Prepared a short presentation on continuous improvement in pharma, covering Lean, Six Sigma and Quality by Design.",
          ],
        },
      ],
    },
    {
      id: "results",
      title: "Results",
      blocks: [
        {
          kind: "table",
          caption: "Secondary packaging time study (60 minutes observed per session)",
          head: ["Session", "Machine stops", "Blister packs", "Boxes", "Cartons"],
          rows: [
            ["1", "22 min", "1,554", "777", "37"],
            ["2", "4 min 7 s", "2,352", "1,176", "56"],
            ["3", "4 min 3 s", "1,932", "966", "46"],
          ],
          source: `${REPORT} p. 21`,
        },
        {
          kind: "p",
          text: "Output was strongly linked to machine stops, mainly caused by leaflet defects and carton-feed problems. Session 3 shows that stops are not the whole story: with about the same stop time as session 2, it produced 18% less.",
        },
        {
          kind: "callout",
          title: "What I proposed",
          text: "An automated visual check with a level sensor and camera to catch carton-feed jams, and regular maintenance of the leaflet insertion module, including lubrication and alignment.",
        },
      ],
    },
    {
      id: "limitations",
      title: "Limitations",
      blocks: [
        {
          kind: "list",
          items: [
            "Three one-hour sessions on one product give a useful snapshot, not a full picture of the line.",
            "The proposals were not put in place or tested during the internship, so no time saving is claimed.",
          ],
        },
      ],
    },
    {
      id: "significance",
      title: "What I took from it",
      blocks: [
        {
          kind: "p",
          text: "This was my first close look at industrial production under real quality constraints. It showed me how much rigour, traceability and teamwork sit behind each batch, and it strengthened my interest in process validation, quality assurance and biotechnology.",
        },
      ],
    },
  ],
};
