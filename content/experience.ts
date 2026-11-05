// Sources: cv_Louay Ouhibi.pdf, the internship reports in the Projects folder,
// and the AnaeroVision manuscript.

import { adwya } from "./internships/adwya";
import { anaerovision } from "./internships/anaerovision";
import { pasteur } from "./internships/pasteur";
import type { PlainSummary } from "@/lib/types";

export type TimelineItem = {
  slug: string;
  period: string;
  year: string;
  title: string;
  org: string;
  /** Short name for cards and headings. */
  shortOrg: string;
  role: string;
  location?: string;
  goal: string;
  oneLine: string;
  type: string;
  points: string[];
  /** The plain-language brief, for internships documented by a report. */
  plain?: PlainSummary;
  /** The full page, when the internship has one. */
  href?: string;
};

export const experience: TimelineItem[] = [
  {
    slug: anaerovision.slug,
    period: "May – Aug 2026",
    year: "2026",
    title: "Anaerobic Digestion & Biogas Process Optimisation",
    org: "Memorial University of Newfoundland",
    shortOrg: "AnaeroVision · Memorial University",
    role: "End-of-study research intern, Mitacs Globalink",
    location: "Canada",
    goal: anaerovision.plain.goal,
    oneLine: anaerovision.plain.oneLine,
    type: anaerovision.plain.type,
    plain: anaerovision.plain,
    points: [
      "Built a technical anaerobic-digestion database covering feedstocks, reactor configurations, operating conditions, methane yield and inhibition indicators.",
      "Developed decision-support models for methane-yield prediction, inhibition-risk screening and inhibition-pathway diagnosis (ammonia, LCFA, salinity, VFA accumulation).",
      "Developed AnaeroVision, a user-oriented interface integrating the three models into one early-diagnosis workflow.",
      "Completed as my end-of-study internship for the INSAT engineering degree, and co-authored a research manuscript on it, currently under review.",
    ],
    href: `/internships/${anaerovision.slug}`,
  },
  {
    slug: pasteur.slug,
    period: pasteur.period,
    year: "2025",
    title: "RNA-Seq Analysis of Breast Cancer Samples",
    org: "Institut Pasteur de Tunis",
    shortOrg: "Institut Pasteur de Tunis",
    role: pasteur.role,
    location: "Tunisia",
    goal: pasteur.plain.goal,
    oneLine: pasteur.plain.oneLine,
    type: pasteur.plain.type,
    plain: pasteur.plain,
    points: [
      "Built a complete RNA-Seq pipeline in Galaxy, from raw sequencing files to a gene count matrix.",
      "Explored gene activity across healthy, pre-chemotherapy and post-chemotherapy samples in Python, then ran enrichment analysis with STRING.",
    ],
    href: `/internships/${pasteur.slug}`,
  },
  {
    slug: adwya.slug,
    period: "Jun – Jul 2025",
    year: "2025",
    title: "Production Process Optimisation, Pharmaceutical Industry",
    org: "ADWYA Pharmaceutical, Alpha Production Unit",
    shortOrg: "ADWYA Pharmaceutical",
    role: adwya.role,
    location: "Tunisia",
    goal: adwya.plain.goal,
    oneLine: adwya.plain.oneLine,
    type: adwya.plain.type,
    plain: adwya.plain,
    points: [
      "Completed Good Manufacturing Practice training and followed a tablet's production from weighing to packaging.",
      "Ran a time study of secondary packaging and proposed improvements to reduce machine stops.",
    ],
    href: `/internships/${adwya.slug}`,
  },
  {
    slug: "citet",
    period: "Jul 2024",
    year: "2024",
    title: "Organic Waste Valorisation through Vermicomposting",
    org: "International Centre for Environmental Technologies of Tunis (CITET)",
    shortOrg: "CITET",
    role: "Environmental Biotechnology Intern",
    location: "Tunisia",
    goal: "Turn organic waste into compost",
    oneLine: "Assessing how well worms can turn organic waste into a useful product.",
    type: "Environmental internship · Tunisia",
    points: [
      "Assessed the vermicomposting valorisation potential of organic waste and evaluated the culture conditions affecting worm development and organic-matter conversion.",
    ],
  },
];

export const education = [
  {
    period: "2021 – 2026",
    institution: "National Institute of Applied Sciences and Technology (INSAT)",
    location: "Tunis, Tunisia",
    degrees: [
      "Engineering Degree in Industrial Biology (three-year engineering programme)",
      "Preparatory Cycle in Applied Chemistry and Biology (two-year programme)",
    ],
    coursework: [
      "Process Engineering",
      "Environmental Engineering",
      "Fermentation",
      "Thermodynamics",
      "Fluid Mechanics",
      "Heat & Mass Transfer",
      "Industrial Microbiology",
      "Biochemistry",
    ],
  },
];

export const activities = [
  { period: "Feb 2025", title: "Media Manager, INSAT Theatre Day", text: "Communications, social media and event coverage." },
  { period: "2023", title: "Internal Organisation Manager, Lions Club Tunis INSAT", text: "Coordinated logistics and donation activities." },
];
