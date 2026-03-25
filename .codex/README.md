# PitchPulse Codex Workspace

This directory contains shared Codex-specific project context for the PitchPulse repository.

The authoritative top-level repository instructions remain in `../AGENTS.md`. Files in this folder extend that guidance with durable project memory, reusable prompts, and lightweight planning assets for Codex-assisted work.

## What belongs here

- `project.md`: Stable project snapshot for Codex workflows. Update when the repo shape, stack choices, delivery plan, or product brief materially changes.
- `memory.md`: Durable decisions, assumptions, open questions, and working conventions. Do not use this for temporary scratch notes.
- `context/roadmap.md`: Milestones, feature slices, and dependency sequencing across discovery, alpha, beta, and launch.
- `prompts/`: Reusable prompt starters for recurring workstreams.
- `checklists/`: Lightweight execution and review checklists for common tasks.

## Update policy

- Humans should update `project.md` when the product direction or repository structure changes.
- Humans or agents may append to `memory.md` when a decision is made, a constraint becomes important, or an open question is resolved.
- Prompt and checklist files should stay reusable. Keep them task-oriented and avoid turning them into logs or status reports.
- Agents should continue to read `../AGENTS.md` first, then use this folder for deeper repo-specific context.

## Current repo truth

- `frontend/` exists and already contains the active Next.js application.
- `backend/`, `ai/`, and `docs/` are planned but do not exist yet.
- `.claude/` already exists as a parallel shared assistant workspace.

Keep this folder committed to the repo so the team has a shared Codex context baseline.
