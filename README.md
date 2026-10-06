# ProductOS

**A multi-agent, AI-native operating system for product managers.**

ProductOS brings the PM's scattered inputs (Jira, GitHub, Slack and customer feedback) into one workspace, then hands the busywork to specialized AI agents. Each agent owns one part of the PM job, so the PM can spend time on judgment instead of admin.

**Impact goal:** cut manual PM effort by 65%.

## The problem

A PM's week goes into stitching context together: reading feedback, writing PRDs, re-scoring the backlog, updating the roadmap and chasing experiment results. Most of this is repeatable work spread across 4 or 5 tools.

## What it does

| Module | What the agent does |
|---|---|
| Dashboard | One view of product health, open work and agent activity |
| Research Agent | Product discovery from market and user signals |
| Workspace | Drafts and edits PRDs and user stories |
| Insights | Clusters customer feedback into themes |
| Backlog | Prioritizes with RICE scoring and syncs to Jira |
| Roadmap | Now / Next / Later planning with dependencies and risks |
| Experiments | Designs and tracks A/B tests |
| Analytics | Product metrics and trends |
| Release Notes | Writes release notes from shipped work |
| Chat | Ask any agent a question in plain language |
| Integrations | Connects Jira, GitHub, Slack and feedback sources |

## How I built it

I defined the product vision, the agent roles and the workflows, then built it in Google AI Studio with Gemini.

**Stack:** React 19 · TypeScript · Vite · Tailwind CSS · Google Gemini SDK

**Status:** working prototype. Integrations and data are simulated so the full workflow can be demoed end to end.

## Run it locally

```bash
npm install
cp .env.example .env.local   # add your own GEMINI_API_KEY
npm run dev
```

Open http://localhost:3000.

---
Built by [Sumedh Bundele](https://github.com/sumedhbundelework-ship-it), Senior Product Manager.
