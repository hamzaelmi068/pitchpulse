# PitchPulse Working Memory

Use this file for durable decisions and active assumptions that should survive across sessions.

## Confirmed

- `.codex/` is a shared, committed team workspace for Codex collaboration.
- Root `AGENTS.md` remains the authoritative repository instruction file.
- The repo already has a functioning `frontend/` workspace and should not be described as code-free anymore.

## Current assumptions

- Frontend remains the immediate focus while backend and AI architecture are still being selected.
- The map-centric dashboard concept remains the product anchor for the UI.
- The team is still evaluating final provider choices for match data, news aggregation, and AI summaries.
- Shared assistant configuration should live beside the codebase and stay understandable without tool-specific lock-in.

## Open questions

- Which sports data provider will be the primary source of truth for fixtures, lineups, events, and player stats?
- Will the backend be implemented in Node.js/Express or FastAPI?
- Will the data layer use plain PostgreSQL, Supabase, or a hybrid approach?
- What is the initial AI scope for alpha versus beta: predictions only, summaries only, or both?
- Will the news feed be API-driven, RSS-driven, or a mixed ingestion pipeline?

## Repo conventions

- Keep reusable Codex prompts in `prompts/` and reusable review/run checklists in `checklists/`.
- Keep temporary notes out of this file; consolidate only the parts that remain relevant after the current task ends.
- When repo reality changes, update `project.md` first and then adjust this file if a decision or assumption also changed.
