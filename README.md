# Louay Ouhibi: Engineering Portfolio

Monolithic Next.js 16 (App Router) site. All pages are static, with no database or CMS. The only
server code is the chat route, `app/api/chat/route.ts`.

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

Every project also has a `plain` field, written for readers with no engineering background: the
goal, problem, what was done, result, why it matters, a glossary and one sentence per section.
The projects pages lead with it, so a new project needs it too.

## AI assistant

LouAI, the robot mascot (`components/chat/LouAI.tsx`), is drawn in SVG so it can react to the cursor and
the conversation. `components/chat/ChatAssistant.tsx` greets visitors and sends questions to `app/api/chat/route.ts`,
which streams answers from Claude. Its knowledge is built from `content/` by `lib/chat/knowledge.ts`,
so updating the site content updates the assistant.

It needs `ANTHROPIC_API_KEY` (in `.env.local` locally, and in the Vercel project settings). Without
a key the site works normally and the assistant shows Louay's email instead. Set a monthly spend
limit on the Anthropic account: the route's rate limit is per server instance and only best-effort.

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
(it is used for canonical URLs, the sitemap and JSON-LD) and `ANTHROPIC_API_KEY` for the assistant.
