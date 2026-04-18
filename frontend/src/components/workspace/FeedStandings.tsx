"use client";

import type { StandingsGroupBlock } from "@/types/espn";
import { GroupStandings } from "@/components/match/GroupStandings";

interface FeedStandingsProps {
  groups: StandingsGroupBlock[];
  loading: boolean;
  error: string | null;
}

export function FeedStandings({ groups, loading, error }: FeedStandingsProps) {
  if (loading) {
    return (
      <div className="animate-pulse space-y-3 px-4 py-4">
        <div className="h-3 w-28 rounded bg-white/10" />
        <div className="h-24 rounded-lg bg-white/5" />
      </div>
    );
  }

  if (error) {
    return (
      <p className="px-4 pb-4 text-[11px] leading-relaxed text-neutral-600">{error}</p>
    );
  }

  if (groups.length === 0) {
    return (
      <p className="px-4 pb-4 text-[11px] leading-relaxed text-neutral-600">
        Group tables will fill in as the tournament approaches.
      </p>
    );
  }

  const sorted = [...groups].sort(
    (a, b) => (a.order ?? 999) - (b.order ?? 999)
  );

  return (
    <div className="pb-2">
      
      <div className="max-h-[min(55vh,28rem)] overflow-y-auto overflow-x-hidden overscroll-contain divide-y divide-white/[0.06]">
        {sorted.map((g, i) => (
          <GroupStandings
            key={`${g.order ?? i}-${g.header}`}
            title={g.header}
            entries={g.entries}
            highlightIds={[]}
            showBorderBottom={false}
            variant="feed"
          />
        ))}
      </div>
    </div>
  );
}
