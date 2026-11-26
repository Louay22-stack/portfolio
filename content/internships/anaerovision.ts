import type { Project } from "@/lib/types";

// Detailed methods, results and figures are withheld while the manuscript is under review.
const AV = "AnaeroVision";
const T1 = `${AV}/TASK1-Methane yield regression`;
const T2 = `${AV}/TASK2-Binary inhibtion classification`;
const T3 = `${AV}/TASK3-Inhibition type classification`;

export const anaerovision: Project = {
  slug: "anaerovision",
  order: 0,
  title: "AnaeroVision",
  shortTitle: "AnaeroVision",
  kicker: "Anaerobic digestion · Machine learning",
  tagline: "AI decision support for anaerobic digestion: methane yield, inhibition risk and inhibition pathway from operating conditions.",
  summary:
    "A three-stage machine-learning framework, built during my end-of-study Mitacs Globalink research internship, that estimates methane yield, screens for process inhibition and diagnoses the probable inhibition mechanism, packaged as one interface for early process diagnosis.",
  plain: {
    goal: "Keep biogas plants healthy",
    type: "End-of-study internship · Canada",
    oneLine: "A tool that warns biogas plant operators when their process is heading for trouble, and suggests why.",
    problem:
      "Biogas plants rely on microbes that turn organic waste into methane, a renewable fuel. When those microbes are stressed, gas production can collapse, and the warning signs often come too late.",
    did: "I built a technical database of anaerobic digestion experiments from the scientific literature, trained three machine-learning models on it and combined them in a single app.",
    result:
      "From a plant's operating conditions, the app estimates gas output (R² of 0.91 on test data), flags inhibition risk with 91.2% accuracy and identifies the likely cause with 92.7% accuracy.",
    resultSource: `${T1}/final_task1_methane_yield_model/ann_tuned_metrics.json · ${T2}/final_task2_inhibition_risk_model/task2_final_model_summary.json · ${T3}/final_task3_inhibition_type_model/task3_final_model_summary.json`,
    why: "Operators get an early first opinion before a problem becomes expensive. It supports measurements and engineering judgement; it does not replace them.",
    glossary: [
      { term: "Anaerobic digestion (AD)", meaning: "Microbes break down organic waste without oxygen and produce biogas." },
      { term: "Biogas", meaning: "A gas mixture, mainly methane and CO₂, that can be used as a renewable fuel." },
      { term: "Methane yield", meaning: "How much methane a given amount of organic matter produces." },
      { term: "Inhibition", meaning: "Something in the digester, such as too much ammonia or salt, slows the microbes down." },
      { term: "R²", meaning: "How closely predictions match real values. 1.0 is a perfect match." },
    ],
    guide: {
      context: "Why biogas plants need an earlier warning system.",
      objectives: "What this project set out to deliver.",
      status: "Where the work stands.",
    },
  },
  categories: ["Biogas", "Machine Learning"],
  period: "May – August 2026",
  role: "Research intern: dataset, modelling, interface",
  context: "End-of-study internship (INSAT) · Mitacs Globalink · Memorial University of Newfoundland, Canada",
  tools: ["Python", "pandas", "scikit-learn", "XGBoost", "MLP / ANN", "Streamlit"],
  headline: [
    {
      value: "3",
      label: "Models in one workflow",
      detail: "Yield · inhibition risk · inhibition type",
      source: `${AV}/README.md`,
    },
    {
      value: "0.91",
      label: "Methane-yield test R²",
      detail: "Methane yield prediction",
      source: `${T1}/final_task1_methane_yield_model/ann_tuned_metrics.json`,
    },
    {
      value: "91.2%",
      label: "Inhibition-risk accuracy",
      detail: "Inhibition risk screening",
      source: `${T2}/final_task2_inhibition_risk_model/task2_final_model_summary.json`,
    },
    {
      value: "92.7%",
      label: "Inhibition-type accuracy",
      detail: "Ammonia, LCFA, salinity, VFA accumulation",
      source: `${T3}/final_task3_inhibition_type_model/task3_final_model_summary.json`,
    },
  ],
  coverViz: "av-pipeline",
  sections: [
    {
      id: "context",
      title: "Context & problem",
      blocks: [
        {
          kind: "lead",
          text: "Anaerobic digesters fail slowly, then suddenly. Ammonia, long-chain fatty acids, salinity or volatile-fatty-acid accumulation can suppress methanogenesis long before an operator sees gas production collapse.",
        },
        {
          kind: "p",
          text: "The question behind AnaeroVision: can a structured database of published operating conditions support an early, data-driven first opinion on yield and stability?",
        },
      ],
    },
    {
      id: "objectives",
      title: "Engineering objectives",
      blocks: [
        {
          kind: "list",
          items: [
            "Build a technical AD database covering feedstocks, reactor configurations, operating conditions, methane yield and inhibition indicators.",
            "Predict methane yield from operating conditions.",
            "Screen whether a set of conditions is at risk of inhibition.",
            "When risk is detected, identify the most probable mechanism.",
            "Integrate the three models into a single interface usable for early process diagnosis.",
          ],
        },
        {
          kind: "viz",
          id: "av-pipeline",
          caption: "Model cascade: each stage only runs when the previous one makes it relevant.",
        },
      ],
    },
    {
      id: "status",
      title: "Status",
      blocks: [
        {
          kind: "callout",
          title: "Manuscript under review",
          text: "This work is written up in a research manuscript that I co-authored, currently under peer review. The detailed methods, results and figures will be shared here once it is published.",
        },
      ],
    },
  ],
};
