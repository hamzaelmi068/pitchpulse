"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { Match } from "@/types/espn";
import { MatchCard } from "@/components/scores/MatchCard";

interface GamesTabProps {
  matches: Match[];
  loading: boolean;
  error: string | null;
  /** Shown when the detail column is hidden — one-line hint to pick a match. */
  showPickDetailHint?: boolean;
  onSelectMatch: (id: string) => void;
}

function SectionHeader({
  label,
  count,
  open,
  onToggle,
}: {
  label: string;
  count: number;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between px-3 py-2.5 text-left transition hover:bg-white/[0.03]"
    >
      <span className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
        {open ? <ChevronDown className="size-3" /> : <ChevronRight className="size-3" />}
        {label}
      </span>
      <span className="rounded-md bg-white/[0.04] px-1.5 py-0.5 text-[10px] tabular-nums text-neutral-500">
        {count}
      </span>
    </button>
  );
}

function EmptyBlock({ text }: { text: string }) {
  return (
    <div className="px-3 pb-3 pt-0.5 text-[11px] leading-relaxed text-neutral-600">
      {text}
    </div>
  );
}

export function GamesTab({
  matches,
  loading,
  error,
  showPickDetailHint = false,
  onSelectMatch,
}: GamesTabProps) {
  const [sections, setSections] = useState({
    live: false,
    upcoming: true,
    results: false,
  });

  const liveMatches = matches.filter((m) => m.state === "in");
  const upcomingMatches = matches.filter((m) => m.state === "pre");
  const resultMatches = matches.filter((m) => m.state === "post");

  function toggleSection(key: keyof typeof sections) {
    setSections((current) => ({ ...current, [key]: !current[key] }));
  }

  if (loading) {
    return (
      <div className="space-y-3 p-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <div className="h-3 w-24 rounded bg-white/10" />
            <div className="h-16 rounded-xl bg-white/5" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center px-4 py-6 text-center">
        <p className="text-xs text-neutral-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 pt-3">
      {showPickDetailHint && (
        <p className="mb-3 text-[11px] leading-snug text-neutral-600">
          Tap a match for standings, head-to-head, and related stories.
        </p>
      )}

      <div className="divide-y divide-white/[0.06] rounded-xl border border-white/[0.06] bg-neutral-950/35">
        <div>
          <SectionHeader
            label="Live"
            count={liveMatches.length}
            open={sections.live}
            onToggle={() => toggleSection("live")}
          />
          {sections.live &&
            (liveMatches.length > 0 ? (
              liveMatches.map((match) => (
                <MatchCard key={match.id} match={match} onSelect={onSelectMatch} />
              ))
            ) : (
              <EmptyBlock text="No live matches right now." />
            ))}
        </div>

        <div>
          <SectionHeader
            label="Upcoming"
            count={upcomingMatches.length}
            open={sections.upcoming}
            onToggle={() => toggleSection("upcoming")}
          />
          {sections.upcoming &&
            (upcomingMatches.length > 0 ? (
              upcomingMatches.map((match) => (
                <MatchCard key={match.id} match={match} onSelect={onSelectMatch} />
              ))
            ) : (
              <EmptyBlock text="No upcoming fixtures in the current feed." />
            ))}
        </div>

        <div>
          <SectionHeader
            label="Results"
            count={resultMatches.length}
            open={sections.results}
            onToggle={() => toggleSection("results")}
          />
          {sections.results &&
            (resultMatches.length > 0 ? (
              resultMatches.map((match) => (
                <MatchCard key={match.id} match={match} onSelect={onSelectMatch} />
              ))
            ) : (
              <EmptyBlock text="No completed matches available yet." />
            ))}
        </div>
      </div>
    </div>
  );
}
