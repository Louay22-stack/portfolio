import type { Project } from "@/lib/types";

const M = "MethaTwin";
const fig = "/projects/methatwin";

export const methatwin: Project = {
  slug: "methatwin",
  order: 1,
  title: "MethaTwin: Machine-Learning-Accelerated Digital Twin of a Biomethane Plant",
  shortTitle: "MethaTwin",
  kicker: "Digital twin · ADM1 · DWSIM · Machine learning · Techno-economics",
  tagline:
    "A digital twin of a 200 Nm³/h agricultural biomethane plant, from the digester to the gas grid, fast enough to optimise and stress-test in an interactive app.",
  summary:
    "An end-to-end model of an agricultural biomethane plant built from public data and open-source tools: an IWA ADM1 digester model in Python validated on the BSM2 benchmark, a water-scrubbing upgrading unit solved in DWSIM from Python, machine-learning surrogates trained on 2,000 coupled simulations, and a techno-economic model with optimisation and Monte Carlo risk analysis, delivered as a Streamlit app.",
  plain: {
    goal: "Design a biomethane plant on a computer",
    type: "Independent project",
    oneLine:
      "A computer copy of a biogas plant that turns farm waste into grid gas, fast enough to test thousands of designs and their costs.",
    problem:
      "Before building a biomethane plant, a developer has to choose the feed mix, the digester size and the gas-cleaning settings, and every choice changes how much gas comes out and what it costs. Detailed models give good answers but are too slow to try thousands of options.",
    did: "I modelled the whole plant: the biology of the digester with the international ADM1 model, the gas-cleaning unit in the DWSIM simulator, and the costs. I then trained machine-learning models on 2,000 full simulations so that any design can be evaluated in milliseconds, and wrapped everything in a web app.",
    result:
      "The digester model reproduces the international benchmark on 36 of 36 values within 1%. The cleaned gas meets the grid limit for CO₂ at 0.46%, the fast models match the full simulation with R² of 0.992 to 0.999, and the verified optimal designs cost 140 to 157 €/MWh depending on plant size.",
    resultSource: `${M}/README.md · Key results`,
    why: "It shows the full chain an engineer needs for a biogas project: biology, process simulation, data and money, each one checked before it is trusted. It uses public literature data, not data from a real plant.",
    glossary: [
      { term: "Digital twin", meaning: "A computer model of a real installation that behaves like it and can be used to test changes safely." },
      { term: "Biomethane", meaning: "Biogas cleaned to almost pure methane so it can be injected into the natural gas grid." },
      { term: "ADM1", meaning: "Anaerobic Digestion Model No. 1, the international reference model of the biology inside a digester." },
      { term: "BSM2", meaning: "A published benchmark used to check that an ADM1 implementation is correct." },
      { term: "Water scrubbing", meaning: "Removing CO₂ from biogas by dissolving it in water under pressure." },
      { term: "Methane slip", meaning: "The share of methane lost during gas cleaning." },
      { term: "Surrogate model", meaning: "A fast machine-learning model trained to imitate a slow, detailed simulation." },
      { term: "LCOE", meaning: "Levelised cost of energy: the average cost of each MWh produced over the plant's life." },
      { term: "Monte Carlo", meaning: "Running a model thousands of times with random inputs to see the range of possible outcomes." },
    ],
    guide: {
      context: "Why biomethane plants are hard to design well.",
      objectives: "What the twin had to be able to do.",
      method: "The five building blocks and the data behind them.",
      implementation: "How the blocks connect, and the app that runs them.",
      results: "How each block was validated, and what the optimisation found.",
      limitations: "What the twin does not cover yet.",
      significance: "What this means for a real project.",
      documentation: "The original figures from the project report.",
    },
  },
  categories: ["Biogas", "Process Simulation", "Machine Learning"],
  period: "November 2026",
  role: "Independent process-engineering and data project",
  context: "Self-directed, public data and open-source tools only",
  tools: ["Python", "IWA ADM1", "DWSIM 10.2", "pythonnet", "Scikit-learn", "XGBoost", "Streamlit"],
  headline: [
    { value: "36/36", label: "ADM1 values within 1% of BSM2", detail: "Max error 1.8×10⁻⁵ %", source: `${M}/README.md · Key results` },
    { value: "0.46%", label: "CO₂ in the biomethane", detail: "Methane slip 0.43%", source: `${M}/LOG.md · Step 5` },
    { value: "0.992–0.999", label: "Surrogate test R²", detail: "≈ 2,300× faster than simulation", source: `${M}/README.md · Key results` },
    { value: "140–157 €/MWh", label: "Verified optimal LCOE", detail: "300 → 150 Nm³/h plants", source: `${M}/LOG.md · Step 7` },
  ],
  cover: {
    src: `${fig}/fig02_concept_flow.png`,
    alt: "MethaTwin concept: feedstock, ADM1 digestion, DWSIM upgrading, products and techno-economics, with an ML surrogate and optimisation loop",
    width: 2200,
    height: 638,
  },
  sections: [
    {
      id: "context",
      title: "Context & problem",
      blocks: [
        {
          kind: "lead",
          text: "An agricultural biomethane plant turns cattle slurry and crop silage into grid-quality gas. Its output and its cost depend on dozens of coupled choices: the feed mix, the digester retention time, the scrubber settings and the prices of everything it buys and sells.",
        },
        {
          kind: "p",
          text: "Mechanistic models answer these questions well but take seconds to minutes per design, which is too slow to optimise or to explore risk. MethaTwin couples the mechanistic models and then accelerates them with machine learning, without giving up the checks that make them trustworthy.",
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
            "Model a 200 Nm³/h agricultural biomethane plant from the digester to the gas grid.",
            "Validate the digester model against the BSM2 benchmark and a published lab digester.",
            "Design a water-scrubbing upgrading unit that meets grid specifications, solved in DWSIM from Python.",
            "Train surrogate models fast enough to optimise the design and run Monte Carlo risk analysis.",
            "Anchor the economics on public cost data and verify every optimum with the full simulation.",
          ],
        },
      ],
    },
    {
      id: "method",
      title: "Building blocks",
      blocks: [
        {
          kind: "table",
          caption: "The five blocks of the twin",
          head: ["Block", "What it does", "Basis"],
          rows: [
            ["Feed characterisation", "Cattle slurry, cover-crop (CIVE) silage and maize silage turned into ADM1 inputs", "Literature data, BMP-based fractionation"],
            ["Digester", "IWA ADM1 in BSM2 form, 29 states, steady state", "Rosen & Jeppsson 2006; calibrated kinetics from Bułkowska et al. 2015"],
            ["Upgrading", "High-pressure water scrubbing with biogenic CO₂ recovery", "DWSIM 10.2 flowsheet built and solved from Python"],
            ["Surrogates", "Random Forest, XGBoost and MLP on 2,000 coupled simulations", "Fixed seeds, held-out test set, overfitting check"],
            ["Economics", "CAPEX, OPEX, LCOE and NPV, optimisation and Monte Carlo", "French regulator (CRE) 2024 cost survey"],
          ],
          source: `${M}/README.md`,
        },
      ],
    },
    {
      id: "implementation",
      title: "How it fits together",
      blocks: [
        {
          kind: "figures",
          items: [
            {
              src: `${fig}/fig02_concept_flow.png`,
              width: 2200,
              height: 638,
              alt: "Concept flow of MethaTwin from feedstock to techno-economics",
              caption: "The chain: feed → ADM1 digester → DWSIM upgrading → products → economics, with a design of experiments feeding the ML surrogates used for optimisation.",
              source: `${M}/06_figures/fig02_concept_flow.png`,
            },
          ],
        },
        {
          kind: "p",
          text: "The twin ships as a Streamlit web app that runs without DWSIM. A design console holds every input, and six pages read from it: a plant cockpit with a live process flow diagram, a design explorer, on-demand Monte Carlo risk analysis, a register of verified designs, the validation chain and the documentation.",
        },
      ],
    },
    {
      id: "results",
      title: "Validation & results",
      blocks: [
        {
          kind: "metrics",
          items: [
            { value: "< 10⁻⁶ %", label: "COD, N and C balance closure", detail: "ADM1 implementation", source: `${M}/README.md · Key results` },
            { value: "0.176 kWh/Nm³", label: "Upgrading electricity", detail: "Raw gas basis, literature 0.20–0.30", source: `${M}/LOG.md · Step 5` },
            { value: "≈ 1,600 t/yr", label: "Biogenic CO₂ recovered", detail: "At 99.2% purity", source: `${M}/LOG.md · Step 5` },
          ],
        },
        {
          kind: "table",
          caption: "Check against a published lab digester, with no parameter adjusted",
          head: ["Output", "Model", "Measured", "In range?"],
          rows: [
            ["CH₄ content", "53.6%", "50–58%", "Yes"],
            ["pH", "7.19", "6.8–7.4", "Yes"],
            ["Propionate", "0.69 kg COD/m³", "0.3–0.9", "Yes"],
            ["Acetate", "0.85 kg COD/m³", "0.2–0.6", "No, over-predicted"],
          ],
          source: `${M}/LOG.md · Step 4`,
        },
        {
          kind: "table",
          caption: "Optimal designs, each confirmed by the full simulation",
          head: ["Target", "Net biomethane", "LCOE", "NPV"],
          rows: [
            ["150 Nm³/h", "148.7 Nm³/h", "157.2 €/MWh", "−0.55 M€"],
            ["200 Nm³/h", "198.8 Nm³/h", "149.9 €/MWh", "+0.48 M€"],
            ["250 Nm³/h", "250.5 Nm³/h", "145.2 €/MWh", "+1.60 M€"],
            ["300 Nm³/h", "302.9 Nm³/h", "140.2 €/MWh", "+3.19 M€"],
          ],
          source: `${M}/LOG.md · Step 7`,
        },
        {
          kind: "p",
          text: "The economics reproduce the CRE median cost (129.3 against 129.6 €/MWh after a feed correction), and break-even at the average tariff sits near 180 Nm³/h. The Monte Carlo analysis gives a median LCOE of 166 €/MWh and only a 13% chance of positive NPV: slurry price is the main driver, and robustness to ammonia inhibition costs about 8.4 €/MWh.",
        },
        {
          kind: "callout",
          title: "A trap the optimiser fell into, and the fix",
          text: "The first optimal designs overestimated biomethane by 2 to 5%, because the search lands where the surrogate is optimistic. I added a verify-and-correct loop: every optimum is re-run in the full simulation, and the target is rescaled until the real plant meets it.",
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
            "Validated against a benchmark, a lab digester and hand calculations, not against full-scale plant data.",
            "The digester is solved at steady state; start-up and dynamic upsets are not modelled.",
            "The upgraded gas carries about 1,900 ppm O₂ from the stripping air, above the strict grid limit; vacuum regeneration or deoxygenation would be needed.",
            "Costs are top-down from CRE averages, and the fitted gas-solubility parameters are valid at 10–15 °C.",
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
          text: "The twin turns a detailed but slow model into a design tool: any combination of feed, retention time and scrubber settings can be evaluated in milliseconds, then confirmed by the full simulation. It also shows where the money is: the cost surface is flat within the feasible window, so feed prices and plant size matter more than fine-tuning the design.",
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
            {
              src: `${fig}/fig04_adm1_validation_and_base_case.png`,
              width: 2200,
              height: 880,
              alt: "ADM1 validation against BSM2 and the MethaTwin base case",
              caption: "ADM1 validation against the BSM2 benchmark, and the base-case digester.",
              source: `${M}/06_figures/fig04_adm1_validation_and_base_case.png`,
            },
            {
              src: `${fig}/fig05_upgrading_hpws.png`,
              width: 1857,
              height: 1382,
              alt: "High-pressure water scrubbing design sweep and selected design",
              caption: "Water-scrubbing upgrading: design sweep and selected design.",
              source: `${M}/06_figures/fig05_upgrading_hpws.png`,
            },
            {
              src: `${fig}/fig06_surrogate_test_performance.png`,
              width: 2400,
              height: 1520,
              alt: "Surrogate model predictions against full simulation on the held-out test set",
              caption: "Surrogate models against the full simulation on the held-out test set.",
              source: `${M}/06_figures/fig06_surrogate_test_performance.png`,
            },
            {
              src: `${fig}/fig07_tea_optimisation.png`,
              width: 2300,
              height: 1680,
              alt: "Techno-economic optimisation, Monte Carlo and tornado analysis",
              caption: "Techno-economics: verified optima, Monte Carlo distribution and main cost drivers.",
              source: `${M}/06_figures/fig07_tea_optimisation.png`,
            },
          ],
        },
      ],
    },
  ],
};
