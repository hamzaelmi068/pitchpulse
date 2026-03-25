# Backend Task Prompt

Use this prompt when planning or implementing backend and service-layer work for PitchPulse.

## Goal

Define or build backend behavior that supports live match data, standings, player stats, AI summaries, or news aggregation without breaking the existing frontend assumptions.

## Instructions

- Read `../project.md`, `../memory.md`, and the root `../../AGENTS.md` first.
- Treat the backend runtime choice as unresolved unless the task explicitly fixes it.
- Prefer interfaces and modules that can survive a provider swap while discovery is still ongoing.
- Separate provider adapters from normalized internal shapes whenever data-source work is involved.
- Document assumptions clearly when a task depends on an undecided service boundary, schema, or deployment choice.

## Expected output

- Clear description of service boundaries or route behavior
- Notes on external provider assumptions
- Required follow-up decisions if the implementation depends on unresolved architecture choices
