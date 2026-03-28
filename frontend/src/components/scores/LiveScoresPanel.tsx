"use client";

import type { Match } from "@/types/espn";
import { MatchCard } from "./MatchCard";

interface LiveScoresPanelProps {
  matches: Match[];
  loading: boolean;
  error: string | null;
  liveCount: number;
  lastUpdated: Date | null;
  onSelectMatch?: (id: string) => void;
  selectedMatchId?: string | null;
}

function LoadingSkeleton() {
  return (
    <div>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="px-3 py-3 border-b border-white/5 last:border-0 animate-pulse">
          {/* Time + broadcast row */}
          <div className="flex justify-between mb-2.5">
            <div className="h-2.5 w-32 bg-white/5 rounded" />
            <div className="h-2.5 w-8 bg-white/5 rounded" />
          </div>
          {/* Team rows */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-white/5 flex-shrink-0" />
              <div className="h-3 flex-1 bg-white/5 rounded" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-white/5 flex-shrink-0" />
              <div className="h-3 flex-1 bg-white/5 rounded" />
            </div>
          </div>
          {/* Venue row */}
          <div className="h-2 w-36 bg-white/5 rounded mt-2.5" />
        </div>
      ))}
    </div>
  );
}

export function LiveScoresPanel({
  matches,
  loading,
  error,
  liveCount,
  lastUpdated,
  onSelectMatch,
}: LiveScoresPanelProps) {
  const liveMatches = matches.filter((m) => m.state === "in");
  const upcomingMatches = matches.filter((m) => m.state === "pre");
  const finishedMatches = matches.filter((m) => m.state === "post");

  return (
    <div className="absolute top-20 right-4 z-[100] w-64 rounded-xl border border-white/10 bg-neutral-900/90 backdrop-blur-md shadow-2xl overflow-hidden flex flex-col max-h-[calc(100vh-6rem)] pointer-events-auto">

      {/* Header */}
      <div className="px-3 py-2.5 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
            {liveCount > 0 ? "Live Now" : "WC 2026 Matches"}
          </p>
          {liveCount > 0 && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-red-400">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              {liveCount} LIVE
            </span>
          )}
        </div>
        {lastUpdated && !loading && (
          <p className="text-[10px] text-neutral-600 mt-0.5">
            Updated {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
        )}
        {loading && (
          <p className="text-[10px] text-neutral-600 mt-0.5 animate-pulse">
            Loading matches…
          </p>
        )}
      </div>

      {/* Body */}
      <div className="overflow-y-auto flex-1 min-h-0">
        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="px-3 py-5 text-center space-y-1">
            <p className="text-xs text-neutral-400">Could not load matches</p>
            <p className="text-[10px] text-neutral-600">Check your connection and try again</p>
          </div>
        ) : matches.length === 0 ? (
          <div className="px-3 py-6 text-center space-y-1">
            <p className="text-xs text-neutral-400">No matches today</p>
            <p className="text-[10px] text-neutral-600">WC 2026 kicks off June 11</p>
          </div>
        ) : (
          <>
            {/* Live */}
            {liveMatches.map((match) => (
              <MatchCard key={match.id} match={match} onSelect={onSelectMatch} />
            ))}

            {/* Upcoming */}
            {upcomingMatches.length > 0 && (
              <>
                {liveMatches.length > 0 && (
                  <div className="px-3 pt-2 pb-1">
                    <p className="text-[10px] text-neutral-600 uppercase tracking-wider">Upcoming</p>
                  </div>
                )}
                {upcomingMatches.map((match) => (
                  <MatchCard key={match.id} match={match} onSelect={onSelectMatch} />
                ))}
              </>
            )}

            {/* Finished */}
            {finishedMatches.length > 0 && (
              <>
                <div className="px-3 pt-2 pb-1">
                  <p className="text-[10px] text-neutral-600 uppercase tracking-wider">Results</p>
                </div>
                {finishedMatches.map((match) => (
                  <MatchCard key={match.id} match={match} onSelect={onSelectMatch} />
                ))}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
