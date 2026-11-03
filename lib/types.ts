/**
 * Content schema. Every quantitative claim carries a `source`: a path
 * (relative to the Projects folder) to the file that substantiates it.
 */

export type Metric = {
  value: string;
  label: string;
  detail?: string;
  source: string;
};

export type Figure = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  source: string;
};

export type VizId =
  | "av-pipeline"
  | "av-task1-models"
  | "av-task1-scatter"
  | "av-task2-threshold"
  | "av-task3-confusion"
  | "av-task3-importance"
  | "biogas-pfd"
  | "biogas-validation"
  | "biogas-sensitivity"
  | "bp-footprint"
  | "bp-strains"
  | "bp-validation";

export type Block =
  | { kind: "p"; text: string }
  | { kind: "lead"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "metrics"; items: Metric[] }
  | {
      kind: "table";
      caption?: string;
      head: string[];
      rows: string[][];
      source?: string;
    }
  | { kind: "viz"; id: VizId; caption?: string; source?: string }
  | { kind: "callout"; title: string; text: string }
  | { kind: "figures"; items: Figure[] };

export type Section = {
  id: string;
  title: string;
  blocks: Block[];
};

export type Category =
  | "Biogas"
  | "Process Simulation"
  | "Machine Learning"
  | "Fermentation";

export type Project = {
  slug: string;
  order: number;
  title: string;
  shortTitle: string;
  kicker: string;
  tagline: string;
  summary: string;
  categories: Category[];
  period: string;
  role: string;
  context: string;
  tools: string[];
  headline: Metric[];
  cover: { src: string; alt: string; width: number; height: number };
  coverViz?: VizId;
  repo?: { label: string; href: string };
  sections: Section[];
};
