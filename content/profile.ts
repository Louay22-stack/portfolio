// Sources: cv_Louay Ouhibi.pdf, Personal informations.txt

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://louay-ouhibi.vercel.app";

export const profile = {
  name: "Louay Ouhibi",
  firstName: "Louay",
  title: "Bioprocess Engineer",
  discipline: "Industrial Biology Engineer, INSAT",
  location: "Tunis, Tunisia",
  relocation: "Open to relocation",
  availability: "Available immediately",
  email: "louayouhibi01@gmail.com",
  phone: "+216 93 030 733",
  phoneHref: "tel:+21693030733",
  linkedin: "https://www.linkedin.com/in/louay-ouhibi-038a75359/",
  github: "https://github.com/Louay22-stack",
  cv: "/cv/Louay-Ouhibi-CV.pdf",
  headline: {
    lead: "Engineering living processes,",
    emphasis: "from bioreactor to data.",
  },
  statement:
    "I combine anaerobic-digestion and fermentation fundamentals with process simulation and machine learning to anticipate process instability and turn operating data into process decisions.",
  profileLong: [
    "I am an Industrial Biology Engineer, graduated from the National Institute of Applied Sciences and Technology (INSAT, Tunis), specialising in bioprocess optimisation, biogas production and fermentation.",
    "My work sits where biological engineering meets computation: I build technical datasets from the literature and the lab, model them with Python, and package the results as decision-support tools that an operator or process engineer can actually use.",
    "I am looking for an engineering role in biogas, fermentation or low-carbon bioprocess projects, in industry, consultancy or R&D.",
  ],
  seekingFor: ["Biogas & biomethane", "Fermentation", "Low-carbon bioprocesses"],
  languages: [
    { name: "Arabic", level: "Native" },
    { name: "French", level: "Fluent" },
    { name: "English", level: "Fluent · C1", note: "Duolingo English Test 130/160" },
    { name: "German", level: "Beginner" },
  ],
} as const;

export const pillars = [
  {
    index: "01",
    title: "Bioprocess & biogas",
    text: "Anaerobic digestion, inhibition mechanisms, fermentation and microbial production systems, from substrate to methane or protein.",
    tags: ["Anaerobic digestion", "Inhibition (TAN · VFA · LCFA · salinity)", "Fermentation", "Single-cell protein", "Microalgae"],
  },
  {
    index: "02",
    title: "Process engineering",
    text: "Steady-state flowsheets, mass and energy balances, and PFDs, always checked against hand calculations before they are trusted.",
    tags: ["DWSIM", "Mass & energy balances", "PFD & stream tables", "Sensitivity analysis", "Process optimisation"],
  },
  {
    index: "03",
    title: "Predictive modelling",
    text: "Regression and classification models with honest validation (group splits, cross-validation, threshold tuning), packaged as decision-support tools.",
    tags: ["Python", "scikit-learn", "XGBoost", "ANN / MLP", "Streamlit", "R"],
  },
] as const;
