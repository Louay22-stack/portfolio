import type { Project } from "@/lib/types";

const AV = "AnaeroVision";
const T1 = `${AV}/TASK1-Methane yield regression`;
const T2 = `${AV}/TASK2-Binary inhibtion classification`;
const T3 = `${AV}/TASK3-Inhibition type classification`;
const MS = `${AV}/2026-10-29_Manuscript_-_NS3_edited (1) (1).docx`;
const fig = "/projects/anaerovision";

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
    did: "I worked on a database of 316 experiments from scientific papers, expanded to 1,500 records with generated data to make up for how little is published. I then trained three machine-learning models on it and combined them in a single app.",
    result:
      "From a plant's operating conditions, the app estimates gas output (R² of 0.91 on test data), flags risk with 91.2% accuracy on waste types it had never seen, and identifies the likely cause with 92.7% accuracy. These scores come from the expanded dataset, so they still have to be confirmed on new plant data.",
    resultSource: `${T1}/final_task1_methane_yield_model/ann_tuned_metrics.json · ${T2}/final_task2_inhibition_risk_model/task2_final_model_summary.json · ${T3}/final_task3_inhibition_type_model/task3_final_model_summary.json`,
    why: "Operators get an early first opinion before a problem becomes expensive. It supports measurements and engineering judgement; it does not replace them.",
    glossary: [
      { term: "Anaerobic digestion (AD)", meaning: "Microbes break down organic waste without oxygen and produce biogas." },
      { term: "Biogas", meaning: "A gas mixture, mainly methane and CO₂, that can be used as a renewable fuel." },
      { term: "Methane yield", meaning: "How much methane a given amount of organic matter produces." },
      { term: "Inhibition", meaning: "Something in the digester, such as too much ammonia or salt, slows the microbes down." },
      { term: "TAN, VFA, LCFA", meaning: "Total ammonia nitrogen, volatile fatty acids and long-chain fatty acids: substances that can build up and stress the microbes." },
      { term: "HRT, OLR", meaning: "Hydraulic retention time (how long material stays in the reactor) and organic loading rate (how much is fed each day)." },
      { term: "ANN / MLP", meaning: "Artificial neural network: a type of machine-learning model." },
      { term: "R²", meaning: "How closely predictions match real values. 1.0 is a perfect match." },
      { term: "Recall", meaning: "The share of real problem cases that the model catches." },
    ],
    guide: {
      context: "Why biogas plants need an earlier warning system.",
      objectives: "The five things this project set out to deliver.",
      method: "Where the data came from and how it was prepared.",
      implementation: "How the three models were chosen, tested and put into one app.",
      results: "How well the models performed on data they had not seen during training.",
      limitations: "Where the tool can be wrong, and what should be improved next.",
      significance: "What this changes for someone running or designing a biogas plant.",
      documentation: "The original charts from the project, for readers who want the evidence.",
    },
  },
  categories: ["Biogas", "Machine Learning"],
  period: "May – August 2026",
  role: "Research intern: dataset, modelling, interface",
  context: "End-of-study internship (INSAT) · Mitacs Globalink · Memorial University of Newfoundland, Canada",
  tools: ["Python", "pandas", "scikit-learn", "XGBoost", "MLP / ANN", "Streamlit"],
  headline: [
    {
      value: "316",
      label: "Records from the literature",
      detail: "Expanded to 1,500 with 1,184 generated records",
      source: `${MS} §2.1.2, §2.3`,
    },
    {
      value: "0.91",
      label: "Methane-yield test R²",
      detail: "Tuned ANN, 300-record hold-out",
      source: `${T1}/final_task1_methane_yield_model/ann_tuned_metrics.json`,
    },
    {
      value: "91.2%",
      label: "Inhibition-risk accuracy",
      detail: "Group split: 60 substrates never seen in training",
      source: `${T2}/final_task2_inhibition_risk_model/task2_final_model_summary.json`,
    },
    {
      value: "92.7%",
      label: "Inhibition-type accuracy",
      detail: "Out-of-fold, 5 mechanisms · macro-F1 93.7%",
      source: `${T3}/final_task3_inhibition_type_model/task3_final_model_summary.json`,
    },
  ],
  cover: {
    src: `${fig}/task3-confusion-matrix.png`,
    alt: "Confusion matrix of the tuned Random Forest inhibition-type classifier",
    width: 2700,
    height: 2100,
  },
  coverViz: "av-pipeline",
  repo: { label: "GitHub: Louay22-stack/AnaeroVision", href: "https://github.com/Louay22-stack/AnaeroVision" },
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
          text: "Diagnosing these upsets normally relies on expert judgement and lab analyses that arrive late. The literature contains thousands of reported digestion experiments, but they are scattered across papers and inconsistent in format, so they are rarely used as a predictive resource.",
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
            "Predict specific methane yield (mL CH₄/g VS) from operating conditions.",
            "Screen whether a set of conditions is at risk of inhibition, favouring recall, because a missed inhibition costs more than a false alarm.",
            "When risk is detected, identify the most probable mechanism, and say so when the model is not confident.",
            "Integrate the three models into a single interface usable for early process diagnosis.",
          ],
        },
      ],
    },
    {
      id: "method",
      title: "Data & methodology",
      blocks: [
        {
          kind: "p",
          text: "The dataset started with 500 records: 316 extracted by hand from published studies, and 184 generated to compensate for the scarcity of published data. After quality control, a Gaussian Copula model added 1,000 synthetic records that preserve the statistical structure of the data, for a modelling dataset of 1,500 records. The generated records are a modelling resource, not new experimental evidence. Nine process variables serve as model inputs:",
        },
        {
          kind: "table",
          head: ["Variable", "Unit / type", "Role"],
          rows: [
            ["Substrate / substrate category", "categorical", "Feedstock identity"],
            ["Reactor type", "Batch · CSTR · thermophilic batch · other", "Configuration"],
            ["Temperature", "°C", "Operating condition"],
            ["pH", "–", "Operating condition"],
            ["HRT", "days", "Operating condition"],
            ["OLR", "g VS/L·day", "Operating condition"],
            ["ISR", "–", "Inoculum-to-substrate ratio"],
            ["TAN", "mg/L", "Inhibition indicator"],
            ["VFA", "mg/L", "Inhibition indicator"],
          ],
          source: `${AV}/README.md · ${T3}/final_task3_inhibition_type_model/task3_final_model_summary.json`,
        },
        {
          kind: "p",
          text: "Preprocessing included reactor-type harmonisation (e.g. 'Batch serum bottles' → Batch, 'Serial CSTR' → CSTR), substrate-category mapping, median imputation with missingness tracked separately, and IQR-based outlier screening during exploratory analysis.",
        },
        {
          kind: "viz",
          id: "av-pipeline",
          caption: "Model cascade: each stage only runs when the previous one makes it relevant.",
        },
        {
          kind: "p",
          text: "Every task was treated as a model-selection problem: Random Forest, XGBoost, SVR/SVM, logistic regression and ANN (MLP) baselines were trained, compared and then tuned. Only the best-validated model was packaged.",
        },
      ],
    },
    {
      id: "implementation",
      title: "Technical implementation",
      blocks: [
        {
          kind: "table",
          caption: "Final model per task",
          head: ["Task", "Objective", "Final model", "Validation"],
          rows: [
            ["1", "Methane-yield regression", "Tuned MLP regressor (128-64-32, ReLU)", "80/20 hold-out (300 test records)"],
            ["2", "Inhibition-risk detection", "MLP classifier (128-64), decision threshold 0.14", "Substrate-grouped split: 239 train / 60 unseen test substrates"],
            ["3", "Inhibition-type classification", "Tuned Random Forest", "5-fold cross-validation, out-of-fold predictions (220 labelled cases)"],
          ],
          source: `${AV}/TASK*/final_*/ (model summary and metrics JSON files)`,
        },
        {
          kind: "p",
          text: "Task 2 is where validation design mattered most. A random split lets the same substrate appear in training and test data, which flatters the model. Splitting by substrate forces the model to judge feedstocks it has never seen, which is the realistic use case. The decision threshold was then tuned on that split to balance recall against false alarms.",
        },
        {
          kind: "viz",
          id: "av-task2-threshold",
          caption: "Inhibition-risk ANN: precision, recall and F1 of the 'inhibited' class versus decision threshold (substrate-grouped test set). The selected operating point is 0.14.",
          source: `${T2}/task2_group_split_threshold_tuning_outputs/ann_mlp_threshold_results.csv`,
        },
        {
          kind: "p",
          text: "For Task 3, the classifier only predicts among known mechanisms. Its class probability is turned into a graded answer: ≥ 0.60 is reported as a likely mechanism, 0.45–0.60 as possible, and anything lower is returned as uncertain instead of a forced label.",
        },
        {
          kind: "p",
          text: "The three packaged pipelines (imputers, encoders, scalers and models) are loaded by a Streamlit application that runs the cascade from one set of user inputs.",
        },
      ],
    },
    {
      id: "results",
      title: "Results",
      blocks: [
        {
          kind: "metrics",
          items: [
            { value: "0.909", label: "Test R², methane yield", detail: "RMSE 41.8 · MAE 20.7 mL CH₄/g VS", source: `${T1}/final_task1_methane_yield_model/ann_tuned_metrics.json` },
            { value: "86.2%", label: "Recall, inhibited class", detail: "50 of 58 inhibited cases caught · precision 83.3%", source: `${T2}/final_task2_inhibition_risk_model/task2_final_model_summary.json` },
            { value: "93.7%", label: "Macro-F1, inhibition type", detail: "Balanced accuracy 94.2% · ROC-AUC 0.977", source: `${T3}/final_task3_inhibition_type_model/task3_final_model_summary.json` },
          ],
        },
        {
          kind: "viz",
          id: "av-task1-models",
          caption: "Methane-yield regression: test R² of the six candidate models. The tuned ANN generalised best. Tuning XGBoost improved its training fit but not its test score.",
          source: `${T1}/task1_final_regression_comparison_outputs/task1_final_regression_comparison.csv`,
        },
        {
          kind: "viz",
          id: "av-task1-scatter",
          caption: "Tuned ANN: predicted vs measured methane yield on the 300 hold-out records.",
          source: `${T1}/task1_ann_tuning_outputs/ann_tuned_test_predictions.csv`,
        },
        {
          kind: "viz",
          id: "av-task3-confusion",
          caption: "Inhibition-type classifier: out-of-fold confusion matrix (220 cases). Most residual confusion is ammonia cases predicted as salinity or LCFA.",
          source: `${T3}/task3c_rf_tuning_outputs/rf_task3c_tuned_overall_confusion_matrix.png`,
        },
        {
          kind: "viz",
          id: "av-task3-importance",
          caption: "What drives the mechanism diagnosis: VFA, TAN and pH dominate, which is consistent with digestion chemistry.",
          source: `${T3}/final_task3_inhibition_type_model/task3_feature_importance.csv`,
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
            "Only 316 of the 1,500 modelling records come directly from the literature. The scores describe how well the models capture patterns in this expanded dataset, so external validation on independent experimental data is the key next step.",
            "Literature data is heterogeneous: measurement methods, reporting conventions and missing TAN/VFA values (imputed) vary between studies.",
            "The methane-yield model was validated with a random split, so substrates in the test set may also appear in training. Performance on entirely new feedstocks is likely lower, and a substrate-grouped evaluation, as done for Task 2, is the natural next step.",
            "The inhibition-type model is trained on 220 labelled cases and only knows five mechanism classes. Unusual upsets fall back to the 'uncertain' answer by design.",
            "Models describe correlations in published experiments. Predictions should be read together with measurements and process-engineering judgement, not instead of them.",
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
          text: "AnaeroVision turns a scattered body of published digestion experiments into a structured, reusable asset and a fast first opinion on yield and stability. For a biogas operator or designer, that means screening feedstocks and operating windows before committing reactor time, and having an early, explainable signal pointing at the most likely inhibition pathway.",
        },
        {
          kind: "p",
          text: "This work is also written up in a research manuscript that I co-authored, currently under review.",
        },
        {
          kind: "callout",
          title: "Design choice",
          text: "Wherever there was a choice between a flattering metric and a realistic one, the realistic one was kept. That is why the reported inhibition-risk score comes from substrates the model never saw.",
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
            { src: `${fig}/correlation-heatmap.png`, width: 3600, height: 2700, alt: "Pearson correlation heatmap of the anaerobic digestion dataset variables", caption: "Exploratory analysis: Pearson correlation matrix", source: `${AV}/Exploratory Data Analysis/EDA outputs/pearson correlation heatmap.png` },
            { src: `${fig}/boxplot-methane-yield.png`, width: 4029, height: 4029, alt: "Boxplot of methane yield in mL CH4 per g VS", caption: "Methane-yield distribution and IQR outliers", source: `${AV}/Exploratory Data Analysis/EDA outputs/Boxplots/boxplot_Methane_Yield_mL_CH4_gVS.png` },
            { src: `${fig}/task1-ann-predicted-vs-actual.png`, width: 2100, height: 2100, alt: "Predicted versus actual methane yield for the tuned ANN", caption: "Task 1: tuned ANN, predicted vs actual", source: `${T1}/task1_ann_tuning_outputs/ann_tuned_predicted_vs_actual.png` },
            { src: `${fig}/task1-ann-residuals.png`, width: 2400, height: 1800, alt: "Residuals versus predicted methane yield for the tuned ANN", caption: "Task 1: residual analysis", source: `${T1}/task1_ann_tuning_outputs/ann_tuned_residuals_vs_predicted.png` },
            { src: `${fig}/interface-home.png`, width: 1619, height: 889, alt: "AnaeroVision landing page showing the three-model workflow", caption: "AnaeroVision: landing page", source: `${MS} Fig. S2` },
            { src: `${fig}/interface-input.png`, width: 1587, height: 874, alt: "AnaeroVision form grouping the operating and stability inputs", caption: "AnaeroVision: entering the reactor state", source: `${MS} Fig. S3` },
            { src: `${fig}/interface-result.png`, width: 1561, height: 885, alt: "AnaeroVision result screen showing predicted methane yield, inhibition probability and likely mechanism", caption: "AnaeroVision: example result", source: `${MS} Fig. S4` },
            { src: `${fig}/task2-f1-comparison.png`, width: 2700, height: 1500, alt: "Bar chart comparing threshold-tuned F1 scores of five classifiers", caption: "Task 2: threshold-tuned F1 by model (group split)", source: `${T2}/task2_group_split_threshold_tuning_outputs/threshold_tuned_f1_comparison.png` },
            { src: `${fig}/task3-class-distribution.png`, width: 3000, height: 1800, alt: "Distribution of inhibition-type classes after label cleaning and merging", caption: "Task 3: inhibition-type classes after label cleaning", source: `${T3}/task3_cleaned_inhibition_type_outputs/final_merged_inhibition_type_distribution.png` },
            { src: `${fig}/task3-confidence-tradeoff.png`, width: 5965, height: 3867, alt: "Trade-off between confidence threshold, coverage and accuracy for the inhibition-type model", caption: "Task 3: confidence-threshold trade-off", source: `${T3}/task3c_rf_confidence_threshold_outputs/confidence_threshold_tradeoff.png` },
            { src: `${fig}/task3-feature-importance.png`, width: 3000, height: 2400, alt: "Top 20 feature importances of the tuned Random Forest", caption: "Task 3: tuned Random Forest feature importance", source: `${T3}/task3c_rf_tuning_outputs/rf_task3c_tuned_feature_importance_top20.png` },
          ],
        },
      ],
    },
  ],
};
