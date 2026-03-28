"use client";

import { X } from "lucide-react";
import { useMatchDetail } from "@/hooks/useMatchDetail";
import { MatchDetailHeader } from "./MatchDetailHeader";
import { GroupStandings } from "./GroupStandings";
import { HeadToHead } from "./HeadToHead";
import { MatchNewsSection } from "./MatchNewsSection";

interface MatchDetailPanelProps {
  matchId: string;
  onClose: () => void;
}

function PanelSkeleton() {
  return (
    <div className="p-4 space-y-4 animate-pulse">
      <div className="flex gap-4 items-center justify-center">
        <div className="w-14 h-14 rounded-full bg-muted" />
        <div className="h-8 w-16 rounded bg-muted" />
        <div className="w-14 h-14 rounded-full bg-muted" />
      </div>
      {[80, 60, 100, 60].map((w, i) => (
        <div key={i} className="space-y-1.5">
          <div className="h-2.5 w-24 rounded bg-muted" />
          {Array.from({ length: 3 }).map((_, j) => (
            <div key={j} className={`h-3 rounded bg-muted`} style={{ width: `${w}%` }} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function MatchDetailPanel({ matchId, onClose }: MatchDetailPanelProps) {
  const { detail, loading, error } = useMatchDetail(matchId);

  return (
    <div className="absolute inset-y-0 right-0 z-[200] flex w-80 flex-col border-l border-border/60 bg-neutral-900 shadow-2xl shadow-black/40 pointer-events-auto">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-3 flex-shrink-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Match Details
        </p>
        <button
          onClick={onClose}
          className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X size={14} />
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {loading && <PanelSkeleton />}

        {error && (
          <div className="flex items-center justify-center h-40">
            <p className="text-xs text-muted-foreground">{error}</p>
          </div>
        )}

        {detail && !loading && (
          <>
            <MatchDetailHeader detail={detail} />

            <GroupStandings
              entries={detail.groupStandings}
              highlightIds={[detail.homeTeam.id, detail.awayTeam.id]}
            />

            <HeadToHead games={detail.headToHead} />

            <MatchNewsSection articles={detail.news} />

            {/* Placeholder for future: lineups, stats, timeline */}
            <div className="px-4 py-3 border-t border-border/60">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Lineups
              </p>
              <p className="text-[11px] text-muted-foreground/60">
                Available ~1 hour before kickoff
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
