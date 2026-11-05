import type { Project } from "@/lib/types";

const P = "pfd";

export const biogas: Project = {
  slug: "biogas-process-simulation",
  order: 2,
  title: "Biogas Conditioning & Combustion: DWSIM Process Simulation",
  shortTitle: "Biogas Process Simulation",
  kicker: "Process simulation · Energy balance",
  tagline: "A steady-state flowsheet that dries, burns and recovers heat from biogas, with every key result checked against hand calculations.",
  summary:
    "Steady-state simulation of a small biogas line in DWSIM (Peng-Robinson): the raw biogas is cooled and dried, reheated, mixed with air, burned in a conversion reactor and its flue gas cooled. Mass and energy balances close and are validated by hand.",
  plain: {
    goal: "Turn biogas into useful heat",
    type: "Independent study",
    oneLine: "A computer model of how raw biogas is dried, burned and turned into recoverable heat.",
    problem:
      "Biogas leaves a digester warm and wet. It has to be dried before it can be used as fuel, and burning it only pays off if the heat can be recovered. Engineers need to know how much energy is really available.",
    did: "I built the whole line step by step in DWSIM, a process simulator, then checked its results against my own hand calculations.",
    result:
      "About 212 kW of heat can be recovered from the exhaust gas, out of 576 kW of fuel energy sent to the burner. Every checked flow matched the hand calculations within 0.3%.",
    resultSource: `${P}/README.md §4–5 · ${P}/DWSIM_Level3_Results(Level 3 Results).csv`,
    why: "That figure frames any decision about recovering the heat. The study uses a textbook case rather than plant data, and it shows how I work: a simulator's numbers are only trusted once they have been checked.",
    glossary: [
      { term: "Process simulation", meaning: "Modelling an industrial process on a computer before building or changing it." },
      { term: "Steady state", meaning: "The process is running normally and its conditions do not change over time." },
      { term: "Flowsheet / PFD", meaning: "A diagram of the equipment and the streams that connect it (process flow diagram)." },
      { term: "Mass & energy balance", meaning: "Checking that everything entering a process is accounted for when it leaves." },
      { term: "Duty", meaning: "The rate at which a piece of equipment adds or removes heat, in kW here." },
      { term: "Flue gas", meaning: "The hot exhaust gas left after burning a fuel." },
      { term: "Excess air", meaning: "Air supplied beyond the minimum needed to burn the fuel completely." },
      { term: "LHV", meaning: "Lower heating value: the usable heat released by burning a fuel." },
      { term: "Peng-Robinson", meaning: "The set of equations the simulator uses to predict how the gases behave." },
    ],
    guide: {
      context: "Why biogas has to be dried, and why the heat matters.",
      objectives: "The four questions the simulation had to answer.",
      method: "The starting assumptions and how the model was built up in stages.",
      implementation: "The equipment in the line. Select any part of the diagram to see its conditions.",
      results: "The energy figures, and how closely they match the hand calculations.",
      limitations: "What the model simplifies and does not cover.",
      significance: "What these numbers mean for a real heat-recovery decision.",
      documentation: "The original diagrams and files from the study, for readers who want the evidence.",
    },
  },
  categories: ["Biogas", "Process Simulation"],
  period: "October 2026",
  role: "Independent process-engineering study",
  context: "Self-directed, built in four incremental levels (L1 → L3b)",
  tools: ["DWSIM 10.2.11", "Peng-Robinson", "draw.io", "Excel"],
  headline: [
    { value: "544.2 kW", label: "Heat removed (reactor + flue-gas cooler)", detail: "Hand estimate ≈ 544 kW", source: `${P}/README.md §5` },
    { value: "212.3 kW", label: "Recoverable flue-gas heat", detail: "800 → 120 °C in E-103", source: `${P}/README.md §4` },
    { value: "14.9%", label: "Excess air", detail: "5.94 vs 5.17 kmol/h O₂ stoichiometric", source: `${P}/README.md §5` },
    { value: "≤ 0.3%", label: "Deviation vs hand calcs", detail: "Across all checked stream flows", source: `${P}/DWSIM_Level3_Results(Level 3 Results).csv` },
  ],
  cover: {
    src: "/projects/biogas/pfd-biogas.png",
    alt: "Process flow diagram of biogas drying, combustion and flue-gas cooling with stream table",
    width: 2844,
    height: 2364,
  },
  coverViz: "biogas-pfd",
  sections: [
    {
      id: "context",
      title: "Context & problem",
      blocks: [
        {
          kind: "lead",
          text: "Raw biogas leaves a digester warm and saturated with water. Before it can be burned, upgraded or fed to an engine, it has to be dried, and the heat released by burning it is only valuable if it can be recovered.",
        },
        {
          kind: "p",
          text: "This study models that chain end to end in a process simulator, with one rule: no simulator number is trusted until it has been checked by hand.",
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
            "Model biogas drying (water removal by cooling) and the associated heat duties.",
            "Burn the dried biogas with air in a conversion reactor and quantify the heat released.",
            "Recover heat from the hot flue gas and verify that the energy balance closes.",
            "Document the flowsheet as a PFD with a complete stream table.",
          ],
        },
      ],
    },
    {
      id: "method",
      title: "Basis & methodology",
      blocks: [
        {
          kind: "table",
          caption: "Design basis",
          head: ["Item", "Value"],
          rows: [
            ["Property package", "Peng-Robinson"],
            ["Feed S1", "4.46 kmol/h · 37 °C · 1.05 bar"],
            ["Feed composition (mol)", "CH₄ 0.58 · CO₂ 0.36 · H₂O 0.06"],
            ["Operating pressure", "1.05 bar throughout (no pressure drops)"],
            ["Air S5", "O₂ 0.21 / N₂ 0.79 · 25 °C · 28.3 kmol/h"],
            ["Reaction", "CH₄ + 2 O₂ → CO₂ + 2 H₂O · 99% CH₄ conversion"],
            ["Reactor outlet", "Fixed at 800 °C (heat removed as Q-R101)"],
          ],
          source: `${P}/README.md §2`,
        },
        {
          kind: "p",
          text: "The flowsheet was built in four levels: cooler and separator (L1), then heater plus a sensitivity study (L2), then mixer and combustion reactor (L3), and finally the 800 °C reactor with a flue-gas cooler (L3b). Each level was converged and checked before the next was added. The feed is a textbook base case rather than plant data.",
        },
      ],
    },
    {
      id: "implementation",
      title: "Flowsheet",
      blocks: [
        {
          kind: "viz",
          id: "biogas-pfd",
          caption: "Interactive PFD, redrawn from the project's draw.io diagram. Select a unit or stream to inspect its conditions.",
          source: `${P}/PFD_Biogas.drawio · ${P}/README.md §4`,
        },
        {
          kind: "table",
          caption: "Units",
          head: ["Tag", "Unit", "Function"],
          rows: [
            ["E-101", "Cooler", "Cools biogas 37 → 5 °C so the water condenses"],
            ["V-101", "Gas–liquid separator", "Splits dry gas (S3) from condensate (S4)"],
            ["E-102", "Heater", "Warms dry gas 5 → 25 °C"],
            ["M-101", "Mixer", "Mixes warmed gas (S3b) with air (S5)"],
            ["R-101", "Conversion reactor", "CH₄ combustion at 99% conversion, outlet 800 °C"],
            ["E-103", "Flue-gas cooler", "Cools flue gas 800 → 120 °C"],
          ],
          source: `${P}/README.md §3`,
        },
      ],
    },
    {
      id: "results",
      title: "Results & validation",
      blocks: [
        {
          kind: "metrics",
          items: [
            { value: "4.08 kW", label: "Q-101 drying duty", detail: "0.239 kmol/h condensate removed", source: `${P}/README.md §4` },
            { value: "331.9 kW", label: "Q-R101 reactor duty", detail: "Heat removed to hold 800 °C", source: `${P}/README.md §4` },
            { value: "576 kW", label: "Thermal input (LHV)", detail: "2.586 kmol/h CH₄ to the burner", source: `${P}/README.md §5` },
          ],
        },
        {
          kind: "viz",
          id: "biogas-validation",
          caption: "Simulator vs hand calculation. Every checked flow agrees within 0.3%, and the energy balance closes: 571 kW released − ≈27 kW product sensible heat ≈ 544 kW, against 331.9 + 212.3 = 544.2 kW in DWSIM.",
          source: `${P}/DWSIM_Level3_Results(Level 3 Results).csv · ${P}/README.md §5`,
        },
        {
          kind: "viz",
          id: "biogas-sensitivity",
          caption: "Level 2 sensitivity: varying the CH₄ fraction from 0.55 to 0.65 moves the drying duty by less than 0.2%, so the duty is dominated by water condensation, not by the CH₄/CO₂ split.",
          source: `${P}/DWSIM_Level2_Sensitivity_Table(Sensitivity).csv`,
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
            "Textbook base-case feed, not plant data. Trace components (H₂S, siloxanes, NH₃) are not modelled.",
            "No pressure drops, and a fixed-conversion reactor rather than equilibrium or kinetic combustion.",
            "The reactor outlet temperature is imposed (800 °C). In the adiabatic case DWSIM gives about 1,724 °C, which is a physical upper bound, not a design point.",
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
          text: "Of the 576 kW of chemical energy fed to the burner, about 212 kW is recoverable from the flue gas between 800 and 120 °C. That number frames any heat-recovery or CHP decision. More importantly, the study shows a working habit: build incrementally, close every balance, read sign conventions carefully and cross-check the simulator before trusting it.",
        },
        {
          kind: "callout",
          title: "Natural extensions",
          text: "Flue-gas heat integration or a CHP block, sensitivity of flame temperature to excess air, a CO₂-removal step to upgrade biogas to biomethane, and an economic estimate of the recovered heat.",
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
              src: "/projects/biogas/pfd-biogas.png",
              width: 2844,
              height: 2364,
              alt: "Original process flow diagram with stream table for S1 to S8, legend and title block",
              caption: "Original PFD and stream table (draw.io). A PDF version is also available.",
              source: `${P}/PFD_Biogas.png.png`,
            },
          ],
        },
      ],
    },
  ],
};
