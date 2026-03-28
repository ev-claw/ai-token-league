# AI Token League

**Engineering Director Dashboard** — a polished enterprise-grade mock dashboard for tracking AI tool token consumption across your engineering organisation.

![Dashboard preview: dark enterprise UI with KPI cards, trend charts, provider breakdown, and user leaderboard](./docs/preview.png)

---

## Overview

AI Token League visualises token consumption metrics for four AI providers:

| Provider | Colour  | Typical users             |
|----------|---------|---------------------------|
| Cursor   | Purple  | Engineers (heavy IDE use) |
| Gemini   | Blue    | ML / Data Science         |
| Claude   | Orange  | Product / Analysis        |
| OpenAI   | Green   | Research / Mixed use      |

### Time periods

Switch between **Today**, **Last 7 Days**, **Month-to-Date**, and **Year-to-Date** with a single click.

### Dashboard sections

- **KPI Cards** — total tokens, active users, average per user, top provider (with trend vs prior period)
- **Token Consumption Trend** — stacked area chart, last 30 days
- **Provider Distribution** — donut chart with per-provider share bars
- **Provider Breakdown** — one card per AI tool with top user and active user count
- **Usage by Department** — segmented horizontal bar chart across teams
- **User Leaderboard** — sortable, searchable table with per-provider bars, pagination, and rank medals

---

## Quick start

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Install & run

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

### Build for production

```bash
npm run build      # outputs to dist/
npm run preview    # serve the built files locally
```

---

## Stack

| Layer     | Library                          |
|-----------|----------------------------------|
| Framework | React 18 + Vite 5                |
| Language  | TypeScript                       |
| Styling   | Tailwind CSS 3                   |
| Charts    | Recharts 2                       |
| Icons     | Lucide React                     |
| Utilities | clsx                             |

All data is generated deterministically in `src/data/mockData.ts` — no backend or API keys required.

---

## Project structure

```
src/
├── data/
│   └── mockData.ts          # Seed-based mock data generation
├── components/
│   ├── Header.tsx            # Top navigation bar
│   ├── PeriodSelector.tsx    # Today / 7D / MTD / YTD tab switcher
│   ├── KPICards.tsx          # Four summary metric cards
│   ├── TrendChart.tsx        # Stacked area chart (30-day trend)
│   ├── ProviderDistribution.tsx  # Donut chart + legend
│   ├── ProviderCards.tsx     # Per-provider metric cards
│   ├── DeptBreakdown.tsx     # Department segmented bars
│   └── UserLeaderboard.tsx   # Sortable user table
├── App.tsx                   # Root layout
├── main.tsx                  # Entry point
└── index.css                 # Tailwind base + utility classes
```

---

## Mock data details

- **25 users** across 8 departments with realistic role-based provider biases
- **88 days** of daily data (Jan 1 – Mar 29, 2026)
- Each user has a personal activity scale factor and per-provider usage bias
- Weekend activity is realistically low (5–15% of weekday usage)
- Usage ramps up gradually over the year
- Deterministic seeding ensures consistent data on every render

---

## Deployment (r3x.io)

The app is a standard Vite SPA. After `npm run build`, serve the `dist/` directory as a static site.
