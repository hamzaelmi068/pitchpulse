# PitchPulse Roadmap Context

## Discovery

Target window: March 2026

- Finalize the high-level product scope for alpha, beta, and launch.
- Validate the frontend visual direction around the stadium and host-city map experience.
- Choose core data providers for fixtures, live events, standings, and player statistics.
- Decide backend runtime and database approach.
- Define the minimum AI feature set that is realistic before launch.

## Alpha

Target window: April 2026

- Deliver the interactive map with host cities and stadium context.
- Add live scores, fixtures, and essential match state.
- Ship the group-stage standings and knockout bracket tracker.
- Establish the first stable data-fetching path for live sports data.

Dependencies:
- Venue and competition data model
- Map component and geospatial UI direction
- Reliable fixtures and live-score provider

## Beta

Target window: May 2026

- Add AI match insights and post-match summaries.
- Introduce the aggregated news feed.
- Expand player stats beyond basic box-score style data.
- Improve dashboard depth, responsiveness, and empty/loading states.

Dependencies:
- Stable match and player event data
- Selected AI provider and prompt strategy
- News ingestion source and normalization approach

## Launch

Target window: June 2026

- Harden the end-to-end live match experience for World Cup kickoff.
- Verify bracket accuracy, player-stat freshness, and match-summary quality.
- Polish mobile responsiveness and performance under live traffic conditions.
- Tighten monitoring, deployment, and issue-response workflows.

Dependencies:
- Production-ready deployment path
- Final provider quotas and reliability checks
- Clear fallback behavior for delayed or partial third-party data

## Feature slices

- Map experience: venue data, host-city presentation, match overlays, and drill-down interactions
- Live match intelligence: scores, events, timelines, and status transitions
- Competition tracking: groups, standings, bracket, and round progression
- Player intelligence: goals, assists, cards, xG, heatmaps, and trend summaries
- AI layer: predictions, match summaries, and contextual insights
- News layer: source ingestion, normalization, ranking, and display
