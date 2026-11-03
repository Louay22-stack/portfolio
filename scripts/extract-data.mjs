// Read-only extraction: copies curated figures and converts project result
// files into JSON consumed by the site. Source folders are never modified.
// Usage: node scripts/extract-data.mjs
import { mkdir, readFile, writeFile, copyFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const site = resolve(here, "..");
const src = resolve(site, "..");
const AV = join(src, "AnaeroVision");
const T1 = join(AV, "TASK1-Methane yield regression");
const T2 = join(AV, "TASK2-Binary inhibtion classification");
const T3 = join(AV, "TASK3-Inhibition type classification");
const BP = join(src, "BioPredict");
const PFD = join(src, "pfd");

const dataDir = join(site, "content", "data");
const pub = join(site, "public");

function parseCSV(text) {
  const rows = [];
  let row = [], cell = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') q = false;
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === ",") { row.push(cell); cell = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cell); rows.push(row); row = []; cell = "";
    } else cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows.filter((r) => r.some((x) => x !== ""));
}

async function csvObjects(path) {
  const [head, ...body] = parseCSV((await readFile(path, "utf8")).replace(/^﻿/, ""));
  return body.map((r) =>
    Object.fromEntries(head.map((h, i) => {
      const v = r[i];
      const n = Number(v);
      return [h, v !== "" && v !== undefined && !Number.isNaN(n) ? n : v];
    })),
  );
}

const r = (x, d = 4) => Math.round(x * 10 ** d) / 10 ** d;

async function out(name, data) {
  await writeFile(join(dataDir, name), JSON.stringify(data, null, 2) + "\n");
  console.log("data  ", name);
}

async function cp(from, to) {
  const dest = join(pub, to);
  await mkdir(dirname(dest), { recursive: true });
  await copyFile(from, dest);
  console.log("asset ", to);
}

await mkdir(dataDir, { recursive: true });

// ── CV & credentials ─────────────────────────────────────────────
await cp(join(src, "cv_Louay Ouhibi.pdf"), "cv/Louay-Ouhibi-CV.pdf");
await cp(join(src, "machine learning certif.jpeg"), "credentials/kaggle-intermediate-ml.jpg");

// ── AnaeroVision ─────────────────────────────────────────────────
const avFigures = [
  [join(AV, "Exploratory Data Analysis/EDA outputs/pearson correlation heatmap.png"), "correlation-heatmap.png"],
  [join(AV, "Exploratory Data Analysis/EDA outputs/Boxplots/boxplot_Methane_Yield_mL_CH4_gVS.png"), "boxplot-methane-yield.png"],
  [join(T1, "task1_ann_tuning_outputs/ann_tuned_predicted_vs_actual.png"), "task1-ann-predicted-vs-actual.png"],
  [join(T1, "task1_ann_tuning_outputs/ann_tuned_residuals_vs_predicted.png"), "task1-ann-residuals.png"],
  [join(T2, "task2_group_split_threshold_tuning_outputs/ann_mlp_threshold_tuning_curve.png"), "task2-ann-threshold-curve.png"],
  [join(T2, "task2_group_split_threshold_tuning_outputs/threshold_tuned_f1_comparison.png"), "task2-f1-comparison.png"],
  [join(T3, "task3_cleaned_inhibition_type_outputs/final_merged_inhibition_type_distribution.png"), "task3-class-distribution.png"],
  [join(T3, "task3c_rf_tuning_outputs/rf_task3c_tuned_overall_confusion_matrix.png"), "task3-confusion-matrix.png"],
  [join(T3, "task3c_rf_tuning_outputs/rf_task3c_tuned_feature_importance_top20.png"), "task3-feature-importance.png"],
  [join(T3, "task3c_rf_confidence_threshold_outputs/confidence_threshold_tradeoff.png"), "task3-confidence-tradeoff.png"],
];
for (const [from, name] of avFigures) await cp(from, `projects/anaerovision/${name}`);

await out("av-task1-comparison.json", (await csvObjects(join(T1, "task1_final_regression_comparison_outputs/task1_final_regression_comparison.csv"))).map((m) => ({
  model: m.Model, type: m.Model_Type, trainR2: r(m.Train_R2), testR2: r(m.Test_R2),
  testRMSE: r(m.Test_RMSE_mL_CH4_gVS, 2), testMAE: r(m.Test_MAE_mL_CH4_gVS, 2),
})));

await out("av-task1-test-predictions.json", (await csvObjects(join(T1, "task1_ann_tuning_outputs/ann_tuned_test_predictions.csv"))).map((p) => [
  r(p.Actual_Methane_Yield_mL_CH4_gVS, 1), r(p.Predicted_Methane_Yield_mL_CH4_gVS, 1),
]));

await out("av-task2-threshold-summary.json", (await csvObjects(join(T2, "task2_group_split_threshold_tuning_outputs/task2_group_split_threshold_tuning_summary.csv"))).map((m) => ({
  model: m.Model, threshold: r(m.Best_F1_Threshold, 2), accuracy: r(m.Best_F1_Accuracy),
  precision: r(m.Best_F1_Precision_Class_1), recall: r(m.Best_F1_Recall_Class_1), f1: r(m.Best_F1_Class_1),
})));

await out("av-task2-ann-threshold-sweep.json", (await csvObjects(join(T2, "task2_group_split_threshold_tuning_outputs/ann_mlp_threshold_results.csv"))).map((m) => ({
  t: r(m.Threshold, 2), precision: r(m.Precision_Class_1), recall: r(m.Recall_Class_1), f1: r(m.F1_Class_1),
})));

await out("av-task2-group-split.json", JSON.parse(await readFile(join(T2, "task2_group_split_sanity_check_outputs/group_split_info.json"), "utf8")));
await out("av-task2-final-summary.json", JSON.parse(await readFile(join(T2, "final_task2_inhibition_risk_model/task2_final_model_summary.json"), "utf8")));
await out("av-task3-final-summary.json", JSON.parse(await readFile(join(T3, "final_task3_inhibition_type_model/task3_final_model_summary.json"), "utf8")));

await out("av-task3-feature-importance.json", (await csvObjects(join(T3, "final_task3_inhibition_type_model/task3_feature_importance.csv"))).map((f) => ({
  feature: f.Feature, importance: r(f.Importance),
})));

// Per-class report (text file → JSON)
const report = await readFile(join(T3, "task3c_rf_tuning_outputs/rf_task3c_tuned_overall_classification_report.txt"), "utf8");
const classes = [];
for (const line of report.split(/\r?\n/)) {
  const m = line.match(/^\s*(Ammonia|LCFA|Other inhibition|Salinity|VFA accumulation)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+(\d+)/);
  if (m) classes.push({ label: m[1], precision: +m[2], recall: +m[3], f1: +m[4], support: +m[5] });
}
await out("av-task3-class-report.json", classes);

// ── Biogas DWSIM ─────────────────────────────────────────────────
await cp(join(PFD, "PFD_Biogas.png.png"), "projects/biogas/pfd-biogas.png");
await cp(join(PFD, "PFD_Biogas.drawio.pdf"), "projects/biogas/pfd-biogas.pdf");

{
  const rows = parseCSV(await readFile(join(PFD, "DWSIM_Level2_Sensitivity_Table(Sensitivity).csv"), "utf8"));
  const start = rows.findIndex((x) => x[0] === "Case");
  const cases = [];
  for (const x of rows.slice(start + 1)) {
    if (!x[0] || !x[1] || Number.isNaN(Number(x[1]))) break;
    cases.push({ case: x[0], ch4: +x[1], co2: +x[2], h2o: +x[3], q101: +x[4], q102: +x[5], s3: +x[7], s4: +x[8] });
  }
  await out("biogas-sensitivity.json", cases);
}
{
  const rows = parseCSV(await readFile(join(PFD, "DWSIM_Level3_Results(Level 3 Results).csv"), "utf8"));
  const checks = rows
    .filter((x) => x[5] && x[5].endsWith("%") && x[3] && x[4])
    .map((x) => ({ item: x[0], stream: x[1], unit: x[2], dwsim: +x[3], hand: +x[4], deviation: x[5] }));
  await out("biogas-level3-checks.json", checks);
}

// ── BioPredict ───────────────────────────────────────────────────
await out("bp-benchmarks.json", await csvObjects(join(BP, "comparison_data.csv")));
await out("bp-environmental.json", await csvObjects(join(BP, "environmental_data.csv")));
await out("bp-production.json", await csvObjects(join(BP, "production_data.csv")));
await out("bp-strains.json", await csvObjects(join(BP, "strain_data.csv")));
await out("bp-model-results.json", await csvObjects(join(BP, "scp_model_results.csv")));

// Embedded notebook figures
{
  const nb = JSON.parse(await readFile(join(BP, "scp_modeling_notebook.ipynb"), "utf8"));
  let i = 0;
  for (const cell of nb.cells) {
    for (const o of cell.outputs ?? []) {
      const png = o.data?.["image/png"];
      if (!png) continue;
      i++;
      const dest = join(pub, `projects/biopredict/modeling-figure-${i}.png`);
      await mkdir(dirname(dest), { recursive: true });
      await writeFile(dest, Buffer.from(Array.isArray(png) ? png.join("") : png, "base64"));
      console.log("asset ", `projects/biopredict/modeling-figure-${i}.png`);
    }
  }
}

console.log("done");
