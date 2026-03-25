# PitchPulse Project Snapshot

This file is the stable Codex-oriented project brief for the repository. The root `AGENTS.md` remains the primary instruction source; use this file as a concise operational snapshot of the current product and codebase.

## Product

PitchPulse is a FIFA World Cup 2026 real-time intelligence dashboard with a map-driven interface, live match coverage, player statistics, bracket tracking, AI match insights, and a news aggregation layer.

## Current state

- The repository is no longer empty: `frontend/` exists and contains the active application workspace.
- The frontend is built with Next.js, TypeScript, and Tailwind CSS.
- The project is still in discovery for backend, AI, and data-source architecture.
- `backend/`, `ai/`, and `docs/` are planned directories and are not present yet.

## Active repository shape

```text
pitchpulse/
├── .claude/
├── .codex/
├── frontend/
├── AGENTS.md
└── README.md
```

## Product goals

1. Interactive stadium and host-city map covering Canada, Mexico, and the United States.
2. Live scores, fixtures, timelines, and match events.
3. Group-stage tables and knockout bracket tracking.
4. Player analytics including goals, assists, cards, xG, and heatmaps.
5. AI-generated match predictions and post-match summaries.
6. Aggregated football news feed.

## Proposed stack

- Frontend: Next.js + TypeScript + Tailwind CSS
- Map layer: Mapbox GL or Leaflet.js
- Sports data: BallDontLie WC2026 API and/or Sportmonks
- AI layer: OpenAI API or Gemini
- Backend: Node.js/Express or FastAPI
- Database: PostgreSQL or Supabase
- Deployment: Vercel for frontend, Railway or equivalent for services

## Working conventions

- Treat `AGENTS.md` as the highest-priority repo instruction file.
- Use this file for stable facts, not day-to-day notes.
- Record mutable decisions, open questions, and implementation assumptions in `memory.md`.
- Prefer changes that preserve the existing frontend direction unless the team explicitly decides to rework it.
