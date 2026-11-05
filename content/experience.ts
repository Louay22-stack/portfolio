// Source: cv_Louay Ouhibi.pdf (Professional Experience, Education, Selected Engineering Projects)

export type TimelineItem = {
  period: string;
  year: string;
  title: string;
  org: string;
  role: string;
  location?: string;
  points: string[];
  href?: string;
};

export const experience: TimelineItem[] = [
  {
    period: "May – Aug 2026",
    year: "2026",
    title: "Anaerobic Digestion & Biogas Process Optimisation",
    org: "Memorial University of Newfoundland",
    role: "Mitacs Globalink Research Intern",
    location: "Canada",
    points: [
      "Built a technical anaerobic-digestion database covering feedstocks, reactor configurations, operating conditions, methane yield and inhibition indicators.",
      "Developed decision-support models for methane-yield prediction, inhibition-risk screening and inhibition-pathway diagnosis (ammonia, LCFA, salinity, VFA accumulation).",
      "Developed AnaeroVision, a user-oriented interface integrating the three models into one early-diagnosis workflow.",
    ],
    href: "/work/anaerovision",
  },
  {
    period: "Jun – Jul 2025",
    year: "2025",
    title: "Production Process Optimisation, Pharmaceutical Industry",
    org: "ADWYA Pharmaceutical, Alpha Production Unit",
    role: "Industrial Intern",
    location: "Tunisia",
    points: [
      "Supported continuous-improvement activities aimed at reducing production time and improving process efficiency.",
    ],
  },
  {
    period: "Jul 2024",
    year: "2024",
    title: "Organic Waste Valorisation through Vermicomposting",
    org: "International Centre for Environmental Technologies of Tunis (CITET)",
    role: "Environmental Biotechnology Intern",
    location: "Tunisia",
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

/** Projects documented on the CV only (no project files available). */
export const earlierWork = [
  {
    period: "May 2025",
    title: "Microalgae Cultivation in a Photobioreactor for Wastewater Treatment",
    context: "Independent engineering project, INSAT",
    plain: "Growing microalgae on industrial wastewater to help clean it, and predicting how well they grow.",
    points: [
      "Studied the cultivation of Chlorella sp. in a photobioreactor using industrial wastewater, evaluating the influence of nutrients, temperature, pH, light and aeration on biomass growth.",
      "Developed a predictive model for microalgae growth from environmental and operating parameters (R² = 0.9607, as reported on CV).",
      "Built a Python interface for growth prediction and process-condition assessment in wastewater bioremediation.",
    ],
    tags: ["Photobioreactor", "Chlorella sp.", "Bioremediation", "Python"],
  },
];

export const activities = [
  { period: "Feb 2025", title: "Media Manager, INSAT Theatre Day", text: "Communications, social media and event coverage." },
  { period: "2023", title: "Internal Organisation Manager, Lions Club Tunis INSAT", text: "Coordinated logistics and donation activities." },
];
