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
