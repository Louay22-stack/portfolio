import type { Project } from "@/lib/types";

const PPP = "Rapport PPP-BIO4.pdf";
const fig = "/projects/microalgae";

export const microalgae: Project = {
  slug: "microalgae-wastewater",
  order: 4,
  title: "Microalgae Growth on Industrial Wastewater",
  shortTitle: "Microalgae on Wastewater",
  kicker: "Microalgae · Lab experiment and machine learning",
  tagline: "A lab study of which nutrients help Chlorella grow on industrial wastewater, extended with a machine-learning model and a desktop prediction app.",
  summary:
    "A three-person INSAT project that cultivated Chlorella sp. in filtered industrial wastewater under four nutrient conditions for 27 days, then trained a CatBoost model on a mostly interpolated dataset and packaged it in a Tkinter app that predicts the maximum growth rate.",
  plain: {
    goal: "Grow algae on industrial wastewater",
    type: "Team project · INSAT",
    oneLine: "Testing which nutrients help microalgae grow on industrial wastewater, then building a small app that predicts their growth.",
    problem:
      "Microalgae can feed on the nutrients in wastewater, which could turn a waste stream into useful biomass. But they only grow well in the right conditions, and testing each combination in the lab takes weeks.",
    didLabel: "What we did",
    did: "In a team of three, we grew Chlorella microalgae in filtered wastewater under four nutrient conditions for 27 days and measured their growth. We then trained a machine-learning model and built a desktop app that predicts the growth rate.",
    result:
      "Adding phosphorus alone gave the fastest growth: 1.14 per day, against 0.65 with no added nutrient. The model scored R² = 0.96, but on data mostly interpolated from a small base, so it still has to be proven on real cultures.",
    resultSource: `${PPP} p. 26, 29, 31, 37`,
    why: "The project goes from a lab experiment to a usable prediction tool. It also shows why a strong score on simulated data is a starting point, not proof.",
    glossary: [
      { term: "Microalgae", meaning: "Microscopic plant-like organisms that grow in water using light." },
      { term: "Chlorella", meaning: "A common, fast-growing green microalga." },
      { term: "Photobioreactor", meaning: "A closed, lit vessel for growing algae under controlled conditions." },
      { term: "Optical density (OD)", meaning: "How much light a culture blocks. Cloudier means more algae." },
      { term: "Growth rate (µmax)", meaning: "How fast the algae multiply at their fastest, here expressed per day." },
      { term: "Interpolated data", meaning: "Values estimated between real measurements, not measured directly." },
      { term: "CatBoost", meaning: "A machine-learning method that combines many small decision trees." },
      { term: "R²", meaning: "How closely predictions match the data used to test them. 1.0 is a perfect match." },
    ],
    guide: {
      context: "Why grow algae on wastewater at all.",
      objectives: "What the team set out to do.",
      method: "How the cultures were set up and measured.",
      implementation: "How the prediction model and app were built.",
      results: "What the cultures showed, and how the model performed.",
      limitations: "What this work cannot claim, and why.",
      significance: "What the project is worth despite those limits.",
      documentation: "Pictures of the experiment and the app.",
    },
  },
  categories: ["Microalgae", "Machine Learning"],
  period: "May 2025",
  role: "Team member, in a group of three students",
  context: "Personal and Professional Project (PPP), 4th year, INSAT",
  tools: ["Python", "CatBoost", "scikit-learn", "Tkinter", "UV-visible spectrophotometry"],
  headline: [
    { value: "27", label: "Days of culture", detail: "Four nutrient conditions, 500 mL of wastewater each", source: `${PPP} p. 15–17` },
    { value: "1.14", label: "Fastest growth rate, per day", detail: "Phosphorus added · 0.65 with no added nutrient", source: `${PPP} p. 26` },
    { value: "0.96", label: "Model R²", detail: "On a 1,000-row, mostly interpolated dataset · MAE 0.025", source: `${PPP} p. 29, 37` },
    { value: "0.88", label: "App prediction, per day", detail: "For a condition measured at 0.86 · one comparison", source: `${PPP} p. 28` },
  ],
  cover: {
    src: `${fig}/culture-setup.png`,
    alt: "Bottles of green Chlorella culture lying under a lamp",
    width: 417,
    height: 515,
  },
  coverViz: "ma-growth",
  sections: [
    {
      id: "context",
      title: "Context & problem",
      blocks: [
        {
          kind: "lead",
          text: "Microalgae absorb nitrogen and phosphorus to grow, so industrial wastewater is a possible low-cost growth medium. The biomass could then be used for energy, feed or other products.",
        },
        {
          kind: "p",
          text: "The difficulty is that growth depends on several interacting factors: nutrients, light, temperature, pH and aeration. Classical growth models need many measurements and struggle with these interactions, which is why the project combined a lab experiment with machine learning.",
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
            "Measure how Chlorella sp. grows on filtered industrial wastewater with different nutrient additions.",
            "Calculate the maximum growth rate of each condition.",
            "Train a model that estimates the growth rate from culture conditions.",
            "Package the model in a simple interface for trying out conditions.",
          ],
        },
      ],
    },
    {
      id: "method",
      title: "Experimental method",
      blocks: [
        {
          kind: "p",
          text: "The wastewater was filtered (Whatman n°4 paper), then 500 mL per condition was inoculated with 10 mL of Chlorella and given sodium bicarbonate as a carbon source. The cultures were kept at about 26 °C under artificial light, with aeration. Growth was followed by optical density at 680 nm, and the maximum growth rate was taken from the steepest part of the ln(OD) curve.",
        },
        {
          kind: "table",
          caption: "The four culture conditions",
          head: ["Condition", "Sodium nitrate", "Potassium phosphate", "Sodium bicarbonate"],
          rows: [
            ["Control", "None", "None", "0.25 g"],
            ["E1", "0.25 g", "None", "0.25 g"],
            ["E2", "None", "0.25 g", "0.25 g"],
            ["E3", "0.25 g", "0.25 g", "0.5 g"],
          ],
          source: `${PPP} p. 15–16`,
        },
      ],
    },
    {
      id: "implementation",
      title: "Prediction model & app",
      blocks: [
        {
          kind: "p",
          text: "The four measured growth rates and data from the literature formed a small base, which was interpolated to a 1,000-row dataset. A CatBoost regressor (1,000 iterations, learning rate 0.05, depth 6) was trained on seven inputs: bicarbonate, nitrate, phosphate, pH, temperature, light and air flow. The data was split 80/20 between training and testing.",
        },
        {
          kind: "p",
          text: "A Tkinter desktop app lets the user type in culture conditions and returns the estimated growth rate, with error handling for invalid entries.",
        },
      ],
    },
    {
      id: "results",
      title: "Results",
      blocks: [
        {
          kind: "viz",
          id: "ma-growth",
          caption: "Maximum growth rate of each condition. Phosphorus alone gave the fastest growth, which suggests it was the main limiting nutrient in this wastewater.",
          source: `${PPP} p. 26`,
        },
        {
          kind: "table",
          caption: "Growth rate and final culture density",
          head: ["Condition", "Added nutrient", "Growth rate (per day)", "Final OD (day 27)"],
          rows: [
            ["Control", "None", "0.65", "0.47"],
            ["E1", "Nitrogen", "0.96", "0.25"],
            ["E2", "Phosphorus", "1.14", "0.46"],
            ["E3", "Nitrogen and phosphorus", "0.86", "0.71"],
          ],
          source: `${PPP} p. 24, 26`,
        },
        {
          kind: "p",
          text: "The two measures tell different stories. E2 grew fastest, but E3 reached the highest density by day 27, so the best condition depends on whether the goal is speed or final biomass.",
        },
        {
          kind: "metrics",
          items: [
            { value: "0.96", label: "R² on the test set", detail: "MAE 0.025 · RMSE 0.038", source: `${PPP} p. 29` },
            { value: "0.88 vs 0.86", label: "App vs measured growth rate", detail: "One comparison, for condition E3", source: `${PPP} p. 28` },
          ],
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
            "Most of the model's data is interpolated from a small base of measurements and literature values. The R² shows how well it fits that data, and may overstate performance on real cultures.",
            "The app's single comparison uses a condition that also fed the dataset, so it is not an independent test.",
            "The report shows one culture per condition, so the differences between conditions have no error bars.",
            "Growth was measured, but the report contains no pollutant-removal results. The study shows that the algae grow on this wastewater, not how much they clean it.",
            "The model only knows a standard setup. Salinity, mixing and contaminants are not included.",
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
          text: "The experiment gave a practical result: in this wastewater, phosphorus mattered most for growth speed. The model is a working first version, and the clear next steps are to train it on real cultures, measure pollutant removal and test it under plant conditions.",
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
            { src: `${fig}/culture-setup.png`, width: 417, height: 515, alt: "Bottles of green Chlorella culture lying under a lamp", caption: "The Chlorella cultures under artificial light", source: `${PPP} p. 16` },
            { src: `${fig}/growth-predictor-app.png`, width: 573, height: 686, alt: "Desktop app with seven culture inputs and a pop-up showing an estimated growth rate of 0.8772 per day", caption: "The growth prediction app", source: `${PPP} p. 28` },
          ],
        },
      ],
    },
  ],
};
