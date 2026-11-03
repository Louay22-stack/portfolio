import type { Project } from "@/lib/types";

const AV = "AnaeroVision";
const T1 = `${AV}/TASK1-Methane yield regression`;
const T2 = `${AV}/TASK2-Binary inhibtion classification`;
const T3 = `${AV}/TASK3-Inhibition type classification`;
const fig = "/projects/anaerovision";

export const anaerovision: Project = {
  slug: "anaerovision",
  order: 1,
  title: "AnaeroVision",
  shortTitle: "AnaeroVision",
  kicker: "Anaerobic digestion · Machine learning",
  tagline: "AI decision support for anaerobic digestion: methane yield, inhibition risk and inhibition pathway from operating conditions.",
  summary:
    "A three-stage machine-learning framework, built during a Mitacs Globalink research internship, that estimates methane yield, screens for process inhibition and diagnoses the probable inhibition mechanism, packaged as one interface for early process diagnosis.",
  categories: ["Biogas", "Machine Learning"],
  period: "May – August 2026",
  role: "Research intern: dataset, modelling, interface",
  context: "Mitacs Globalink · Memorial University of Newfoundland, Canada",
  tools: ["Python", "pandas", "scikit-learn", "XGBoost", "MLP / ANN", "Streamlit"],
  headline: [
    {
      value: "1,500",
      label: "AD records compiled",
      detail: "Literature-derived, each traceable to a reference/DOI",
      source: `${AV}/DATASET/Operational-dataset.xlsx`,
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
          text: "The operational dataset holds 1,500 digestion records with 22 fields. Each record keeps its bibliographic reference and DOI, so every data point can be traced back to its source. Nine process variables serve as model inputs:",
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
