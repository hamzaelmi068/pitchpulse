# Frontend Task Prompt

Use this prompt when working on the Next.js frontend.

## Goal

Implement or refine a user-facing frontend change in the existing `frontend/` app while preserving the map-driven PitchPulse product direction.

## Instructions

- Read `../project.md`, `../memory.md`, and the root `../../AGENTS.md` before making changes.
- Treat `frontend/` as the active application workspace.
- Preserve the existing visual language unless the task explicitly asks for a redesign.
- Keep components responsive across desktop and mobile.
- Prefer pragmatic, production-leaning implementations over placeholder-heavy prototypes.
- When introducing new UI states, include loading, empty, and error handling where relevant.
- If the task touches live sports data assumptions, note any dependency on unresolved provider decisions.

## Expected output

- A concise implementation summary
- Any file references that matter for follow-up work
- Any unresolved product or data assumptions that should be captured in `../memory.md`
