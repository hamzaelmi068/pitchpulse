"use client";

import { useMatchDetail } from "@/hooks/useMatchDetail";
import { MatchDetailHeader } from "@/components/match/MatchDetailHeader";
import { GroupStandings } from "@/components/match/GroupStandings";
import { HeadToHead } from "@/components/match/HeadToHead";
import { MatchNewsSection } from "@/components/match/MatchNewsSection";

interface MatchDetailContentProps {
  matchId: string | null;
  onClearSelection: () => void;
}

function DetailSkeleton() {
  return (
    <div className="space-y-4 p-4 animate-pulse">
      <div className="flex items-center justify-center gap-4">
        <div className="h-14 w-14 rounded-full bg-muted" />
        <div className="h-8 w-16 rounded bg-muted" />
        <div className="h-14 w-14 rounded-full bg-muted" />
      </div>
      {[80, 60, 100].map((width, index) => (
        <div key={index} className="space-y-1.5">
          <div className="h-2.5 w-24 rounded bg-muted" />
          {Array.from({ length: 3 }).map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="h-3 rounded bg-muted"
              style={{ width: `${width}%` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function MatchDetailContent({
  matchId,
  onClearSelection,
}: MatchDetailContentProps) {
  const { detail, loading, error } = useMatchDetail(matchId);

  if (!matchId) {
    return (
      <div className="flex h-full min-h-52 flex-col items-center justify-center px-6 text-center">
        <p className="text-sm font-semibold text-neutral-200">No match selected</p>
        <p className="mt-2 text-xs text-neutral-500">
          Choose a fixture from the Games tab or from a stadium marker to open full details.
        </p>
      </div>
    );
  }

  if (loading) {
    return <DetailSkeleton />;
  }

  if (error) {
    return (
      <div className="flex h-full min-h-52 flex-col items-center justify-center px-6 text-center">
        <p className="text-sm font-semibold text-neutral-200">{error}</p>
        <button
          type="button"
          onClick={onClearSelection}
          className="mt-3 text-xs text-neutral-400 underline underline-offset-4 hover:text-white"
        >
          Clear selection
        </button>
      </div>
    );
  }

  if (!detail) {
    return null;
  }

  return (
    <div className="overflow-hidden">
      <MatchDetailHeader detail={detail} />
      <GroupStandings
        entries={detail.groupStandings}
        highlightIds={[detail.homeTeam.id, detail.awayTeam.id]}
      />
      <HeadToHead games={detail.headToHead} />
      <MatchNewsSection articles={detail.news} />
      <div className="border-t border-border/60 px-4 py-3">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Lineups
        </p>
        <p className="text-[11px] text-muted-foreground/60">
          Available about 1 hour before kickoff
        </p>
      </div>
    </div>
  );
}
