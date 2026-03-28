"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { Match } from "@/types/espn";
import { MatchCard } from "@/components/scores/MatchCard";

interface GamesTabProps {
  matches: Match[];
  loading: boolean;
  error: string | null;
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
      className="flex w-full items-center justify-between px-3 py-2 text-left"
    >
      <span className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
        {open ? <ChevronDown className="size-3" /> : <ChevronRight className="size-3" />}
        {label}
      </span>
      <span className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-neutral-500">
        {count}
      </span>
    </button>
  );
}

function EmptyBlock({ text }: { text: string }) {
  return (
    <div className="px-4 pb-3 text-xs text-neutral-500">{text}</div>
  );
}

export function GamesTab({
  matches,
  loading,
  error,
  onSelectMatch,
}: GamesTabProps) {
  const [sections, setSections] = useState({
    live: true,
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
      <div className="space-y-3 p-3">
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
    <div className="space-y-2 p-3">
      <div className="rounded-lg border border-white/10 bg-black/10">
        <SectionHeader
          label="Live"
          count={liveMatches.length}
          open={sections.live}
          onToggle={() => toggleSection("live")}
        />
        {sections.live && (
          liveMatches.length > 0 ? (
            liveMatches.map((match) => (
              <MatchCard key={match.id} match={match} onSelect={onSelectMatch} />
            ))
          ) : (
            <EmptyBlock text="No live matches right now." />
          )
        )}
      </div>

      <div className="rounded-lg border border-white/10 bg-black/10">
        <SectionHeader
          label="Upcoming"
          count={upcomingMatches.length}
          open={sections.upcoming}
          onToggle={() => toggleSection("upcoming")}
        />
        {sections.upcoming && (
          upcomingMatches.length > 0 ? (
            upcomingMatches.map((match) => (
              <MatchCard key={match.id} match={match} onSelect={onSelectMatch} />
            ))
          ) : (
            <EmptyBlock text="No upcoming fixtures in the current feed." />
          )
        )}
      </div>

      <div className="rounded-lg border border-white/10 bg-black/10">
        <SectionHeader
          label="Results"
          count={resultMatches.length}
          open={sections.results}
          onToggle={() => toggleSection("results")}
        />
        {sections.results && (
          resultMatches.length > 0 ? (
            resultMatches.map((match) => (
              <MatchCard key={match.id} match={match} onSelect={onSelectMatch} />
            ))
          ) : (
            <EmptyBlock text="No completed matches available yet." />
          )
        )}
      </div>
    </div>
  );
}
