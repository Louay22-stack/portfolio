# Louay Ouhibi: Engineering Portfolio

Monolithic Next.js 16 (App Router) site. Fully static, with no backend, database or CMS.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (all routes prerendered)
npm start
```

## Content model

Every page reads typed content from `content/`:

| File | What it holds |
|---|---|
| `content/profile.ts` | Identity, links, headline, pillars, languages |
| `content/experience.ts` | Internships, education, CV-only projects, activities |
| `content/skills.ts` | Expertise matrix (with evidence) and credentials |
| `content/projects/*.ts` | One case study per file: metrics, sections and blocks |
| `content/data/*.json` | Chart data extracted from the project folders |

**Rule:** every quantitative claim carries a `source` path (relative to the `Projects/` folder)
pointing to the file that substantiates it. The source is shown in small print under each metric and chart.

To add a case study, create `content/projects/<slug>.ts` exporting a `Project`
(see `lib/types.ts`) and register it in `content/projects/index.ts`.

## Refreshing data and assets from the project folders

```bash
node scripts/extract-data.mjs
```

The script reads, without modifying, `../AnaeroVision`, `../BioPredict`, `../pfd`, the CV and
the Kaggle certificate. It copies curated figures to `public/` and writes JSON to `content/data/`.

## Structure

- `components/hero/`: glass stirred-tank bioreactor with an ML loop (process data → neural network →
  optimised setpoints). A static SVG poster (`ReactorPoster`) renders first. The three.js scene
  (`ReactorCanvas`) lazy-loads after idle, only on capable devices (no reduced-motion, more than 4 cores,
  no Save-Data, WebGL available), and pauses when off-screen. On screens ≥ 1280 × 640 the hero is pinned,
  and scrolling dissolves the reactor into the AnaeroVision dataset (1,500 records: temperature × pH ×
  methane yield, coloured by inhibition status). Data comes from `python scripts/extract-pointcloud.py`.
- `components/viz/`: hand-built SVG/HTML charts (no chart library).
- `components/diagrams/InteractivePFD.tsx`: interactive process flow diagram.
- `components/case/`: case-study blocks, sticky section nav, figure gallery and lightbox.

## Deploy

Vercel works with zero configuration. Set `NEXT_PUBLIC_SITE_URL` to the final domain
(it is used for canonical URLs, the sitemap and JSON-LD).
