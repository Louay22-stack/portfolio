import type { Project } from "@/lib/types";

const BP = "BioPredict";
const fig = "/projects/biopredict";

export const biopredict: Project = {
  slug: "biopredict",
  order: 3,
  title: "BioPredict: Single-Cell Protein Strain Screening",
  shortTitle: "BioPredict",
  kicker: "Fermentation · Techno-environmental screening",
  tagline: "A screening method that integrates biological, fermentation, cost and environmental data to rank single-cell-protein strains, with an honest look at what six strains can and cannot support.",
  summary:
    "An end-to-end screening workflow for single-cell protein (SCP) production: multi-table integration, composite scoring, benchmarking against conventional proteins and regression models, delivered as a Streamlit decision-support tool. It is built on a synthetic six-strain dataset to develop and stress-test the method.",
  plain: {
    goal: "Choose better protein from microbes",
    type: "Independent project · Synthetic data",
    oneLine: "A method for comparing microbes that could produce protein for food or feed, and choosing the most promising one.",
    problem:
      "Protein grown from microbes could need far less land and water, and emit less, than livestock. But choosing which strain to scale up means weighing growth, cost and environmental impact all at once.",
    did: "I combined biological, production, cost and environmental data, scored six strains on eight criteria, compared them with conventional proteins and built a decision-support app.",
    result:
      "A transparent ranking, led by Strain 6 (highest productivity) and Strain 3 (lowest cost and emissions). Testing also showed that six strains are too few to predict how a new strain would perform.",
    resultSource: `${BP}/scp_eda_notebook.ipynb §11 · ${BP}/scp_model_results.csv`,
    why: "The data is synthetic, so the ranking says nothing about real organisms. What lasts is the method, which is ready for real strain data, and the discipline of testing models honestly.",
    glossary: [
      { term: "Single-cell protein (SCP)", meaning: "Protein-rich microbial biomass grown for food or animal feed." },
      { term: "Strain", meaning: "A specific variety of a microorganism." },
      { term: "Fermentation", meaning: "Growing microorganisms under controlled conditions to make a product." },
      { term: "Fed-batch", meaning: "A fermentation where nutrients are added gradually during the run." },
      { term: "OPEX, CAPEX", meaning: "Running costs and the upfront investment in equipment." },
      { term: "GHG", meaning: "Greenhouse-gas emissions." },
      { term: "Synthetic data", meaning: "Data created to develop and test a method, not measured on real organisms." },
      { term: "Leave-one-out", meaning: "A strict test: the model is trained without one strain, then asked to predict it." },
      { term: "R²", meaning: "How closely predictions match real values. 1.0 is a perfect match, and below 0 is worse than guessing the average." },
    ],
    guide: {
      context: "Why choosing a strain is a difficult, multi-sided decision.",
      objectives: "The four things this project set out to do.",
      method: "What data was used and how the strains were scored. The data is synthetic.",
      implementation: "How the workflow and the decision-support app were built.",
      results: "How the strains ranked, how they compare with conventional proteins, and how far the models can be trusted.",
      limitations: "What this work cannot claim, and why.",
      significance: "What remains useful once real strain data is available.",
      documentation: "The original charts from the project, for readers who want the evidence.",
    },
  },
  categories: ["Fermentation", "Machine Learning"],
  period: "March 2026",
  role: "Independent ML & bioprocess project",
  context: "Methodology demonstrator on a synthetic dataset",
  tools: ["Python", "pandas", "scikit-learn", "Jupyter", "Streamlit", "matplotlib"],
  headline: [
    { value: "5", label: "Data domains integrated", detail: "Kinetics · fermentation · cost · environment · benchmarks", source: `${BP}/*.csv` },
    { value: "18", label: "Fed-batch runs aggregated", detail: "6 strains × 3 replicates", source: `${BP}/fermentation_data.csv` },
    { value: "8", label: "Scoring criteria", detail: "Weighted, min-max normalised, weight-sensitivity tested", source: `${BP}/scp_eda_notebook.ipynb §9–10` },
    { value: "6", label: "Strains ranked", detail: "Validated with leave-one-out on the real strains", source: `${BP}/scp_model_results.csv` },
  ],
  cover: {
    src: `${fig}/modeling-figure-3.png`,
    alt: "Model performance comparison: leave-one-out versus 5-fold R² per target",
    width: 1896,
    height: 588,
  },
  coverViz: "bp-footprint",
  sections: [
    {
      id: "context",
      title: "Context & problem",
      blocks: [
        {
          kind: "lead",
          text: "Single-cell protein (microbial biomass grown for food or feed) promises protein with a fraction of the land, water and emissions of livestock. Choosing which strain to scale, however, is a multi-criteria decision: growth kinetics, protein content, OPEX and footprint all pull in different directions.",
        },
        {
          kind: "p",
          text: "BioPredict asks how to combine those heterogeneous data into one defensible screening decision, and how far predictive models can be trusted when only a handful of strains exist.",
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
            "Integrate strain kinetics, fed-batch fermentation runs, production economics and environmental indicators into one master table.",
            "Rank strains with a transparent, weight-sensitive composite score.",
            "Benchmark SCP against conventional proteins on water, land, GHG and energy.",
            "Test whether protein productivity, OPEX and GHG intensity can be predicted from biological and process features.",
          ],
        },
      ],
    },
    {
      id: "method",
      title: "Data & methodology",
      blocks: [
        {
          kind: "callout",
          title: "About the data",
          text: "The dataset is synthetic: six strains, three fed-batch replicates each, with cost and footprint figures per strain. It was used to design and test the workflow, not to make claims about real organisms.",
        },
        {
          kind: "table",
          caption: "Source tables",
          head: ["Table", "Content"],
          rows: [
            ["strain_data", "µmax, Yx/s, Ks, maintenance, Yx/O₂, protein content"],
            ["fermentation_data", "18 fed-batch runs: biomass, protein titre, productivity, time, heat"],
            ["production_data", "Capacity, OPEX breakdown, CAPEX, utilities"],
            ["environmental_data", "Water, land, GHG, energy, eutrophication"],
            ["comparison_data", "Beef, chicken, pork, soy and pea benchmarks"],
          ],
          source: `${BP}/*.csv`,
        },
        {
          kind: "p",
          text: "Replicates were aggregated per strain and efficiency ratios engineered (substrate efficiency, growth efficiency). Strains were scored on eight min-max-normalised criteria: productivity 30%, protein content 20%, OPEX 15%, biomass 10%, growth 10%, GHG 10%, energy 3% and water 2%. Alternative weight schemes were then tested to check whether the ranking holds.",
        },
      ],
    },
    {
      id: "implementation",
      title: "Technical implementation",
      blocks: [
        {
          kind: "p",
          text: "Linear, Ridge, Lasso and Random Forest regressors were trained for three targets. Because six points cannot train a model, the training set was expanded with ±7% noise-augmented copies, and two validation schemes were compared side by side: 5-fold CV on the augmented set, and leave-one-out (LOO) on the six original strains.",
        },
        {
          kind: "p",
          text: "The workflow is wrapped in a Streamlit app for strain screening, benchmarking, key-driver analysis and viability assessment.",
        },
      ],
    },
    {
      id: "results",
      title: "Results",
      blocks: [
        {
          kind: "viz",
          id: "bp-footprint",
          caption: "Footprint per kg protein: the six SCP strains (mean) against conventional sources. Logarithmic scale.",
          source: `${BP}/comparison_data.csv · ${BP}/environmental_data.csv`,
        },
        {
          kind: "viz",
          id: "bp-strains",
          caption: "Strain screening space: protein productivity vs OPEX. The composite ranking puts Strain 6 (highest productivity, 79% protein) first and Strain 3 (lowest OPEX and GHG) second.",
          source: `${BP}/production_data.csv · ${BP}/scp_eda_notebook.ipynb §11`,
        },
        {
          kind: "viz",
          id: "bp-validation",
          caption: "Same models, two validation schemes. Augmented 5-fold CV looks excellent, but leave-one-out on the real strains shows the models do not yet generalise to unseen strains.",
          source: `${BP}/scp_model_results.csv`,
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
            "The dataset is synthetic. Rankings illustrate the method, not real strain performance.",
            "With noise augmentation, copies of the same strain land in both training and test folds, so the 5-fold scores (R² up to 0.976) measure interpolation, not generalisation.",
            "Leave-one-out R² on the original strains is negative for Random Forest on all three targets. With n = 6, the honest conclusion is that more real strain data is required before any predictive claim.",
          ],
        },
      ],
    },
    {
      id: "significance",
      title: "Engineering significance",
      blocks: [
        {
          kind: "p",
          text: "The lasting value of BioPredict is the screening framework, not the scores: it ties kinetics, economics and footprint into one transparent ranking that can be fed real strain data as it becomes available. It also produced a lesson that now shapes all my modelling: choose the validation that matches the real question, which here means unseen strains.",
        },
      ],
    },
    {
      id: "documentation",
      title: "Visual documentation",
      blocks: [
        {
          kind: "figures",
          items: [
            { src: `${fig}/modeling-figure-1.png`, width: 1657, height: 470, alt: "Histograms of augmented data distributions versus original strain values for three targets", caption: "Augmented distributions (±7% noise) vs original strains", source: `${BP}/scp_modeling_notebook.ipynb` },
            { src: `${fig}/modeling-figure-3.png`, width: 1896, height: 588, alt: "Bar charts comparing leave-one-out and 5-fold R² for four models across three targets", caption: "LOO vs 5-fold R², per model and target", source: `${BP}/scp_modeling_notebook.ipynb` },
            { src: `${fig}/modeling-figure-6.png`, width: 1005, height: 576, alt: "Heatmap of Random Forest feature importances across three targets", caption: "Random Forest feature importance across targets", source: `${BP}/scp_modeling_notebook.ipynb` },
            { src: `${fig}/modeling-figure-7.png`, width: 1896, height: 1454, alt: "Grid of predicted versus actual scatter plots under leave-one-out for four models and three targets", caption: "Predicted vs actual, leave-one-out on the 6 strains", source: `${BP}/scp_modeling_notebook.ipynb` },
          ],
        },
      ],
    },
  ],
};
