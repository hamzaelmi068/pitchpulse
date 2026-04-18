"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp, GripHorizontal } from "lucide-react";
import type { Match, NewsArticle, StandingsGroupBlock } from "@/types/espn";
import { cn } from "@/lib/utils";
import { NewsTab } from "./NewsTab";
import { GamesTab } from "./GamesTab";
import { FeedStandings } from "./FeedStandings";
import { MatchDetailContent } from "./MatchDetailContent";

interface WorkspaceShellProps {
  matches: Match[];
  scoresLoading: boolean;
  scoresError: string | null;
  newsArticles: NewsArticle[];
  newsLoading: boolean;
  newsError: string | null;
  newsLastUpdated: Date | null;
  selectedMatchId: string | null;
  collapsed: boolean;
  mobileOpen: boolean;
  height: number;
  onHeightChange: (height: number) => void;
  onCollapseToggle: () => void;
  onMobileOpenChange: (open: boolean) => void;
  onSelectMatch: (id: string) => void;
  onClearSelectedMatch: () => void;
  standingsGroups: StandingsGroupBlock[];
  standingsLoading: boolean;
  standingsError: string | null;
}

const DESKTOP_MIN_HEIGHT = 100;
const DESKTOP_MAX_HEIGHT = 920;
const MOBILE_BREAKPOINT = 768;

export function WorkspaceShell({
  matches,
  scoresLoading,
  scoresError,
  newsArticles,
  newsLoading,
  newsError,
  newsLastUpdated,
  selectedMatchId,
  collapsed,
  mobileOpen,
  height,
  onHeightChange,
  onCollapseToggle,
  onMobileOpenChange,
  onSelectMatch,
  onClearSelectedMatch,
  standingsGroups,
  standingsLoading,
  standingsError,
}: WorkspaceShellProps) {
  const [dragging, setDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const detailRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const sync = () => setIsMobile(mediaQuery.matches);

    sync();
    mediaQuery.addEventListener("change", sync);
    return () => mediaQuery.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!dragging || isMobile) {
      return;
    }

    function handlePointerMove(event: PointerEvent) {
      const nextHeight = Math.min(
        DESKTOP_MAX_HEIGHT,
        Math.max(DESKTOP_MIN_HEIGHT, window.innerHeight - event.clientY)
      );
      onHeightChange(nextHeight);
    }

    function handlePointerUp() {
      setDragging(false);
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [dragging, isMobile, onHeightChange]);

  useEffect(() => {
    if (!selectedMatchId || !detailRef.current) {
      return;
    }

    detailRef.current.scrollIntoView({
      behavior: "smooth",
      block: isMobile ? "nearest" : "start",
    });
  }, [isMobile, selectedMatchId]);

  const desktopHeight = collapsed ? 44 : height;
  const mobileHeight = mobileOpen ? "min(72vh, 36rem)" : "3rem";

  return (
    <>
      <div
        className={cn(
          "absolute inset-0 z-[120] bg-black/30 transition-opacity md:hidden",
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => onMobileOpenChange(false)}
      />

      <section
        className={cn(
          "pointer-events-auto absolute inset-x-0 bottom-0 z-[130] flex flex-col border-t border-white/10 bg-neutral-950/95 shadow-2xl shadow-black/40 backdrop-blur-md",
          "transition-transform duration-200",
          "md:left-0 md:right-0 md:bottom-0 md:rounded-t-2xl",
          !isMobile && !dragging && "md:transition-[height,transform]",
          mobileOpen ? "translate-y-0" : "translate-y-[calc(100%-3rem)] md:translate-y-0"
        )}
        style={{ height: isMobile ? mobileHeight : desktopHeight }}
      >
        {!isMobile && !collapsed && (
          <button
            type="button"
            onPointerDown={() => setDragging(true)}
            className={cn(
              "absolute left-0 right-0 top-0 h-3 -translate-y-1/2 cursor-row-resize bg-transparent",
              dragging && "bg-blue-500/20"
            )}
            aria-label="Resize workspace"
          >
            <span className="absolute left-1/2 top-1/2 h-px w-24 -translate-x-1/2 -translate-y-1/2 bg-white/20" />
          </button>
        )}

        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
          <div className="flex items-center gap-3">
            <GripHorizontal className="size-4 text-neutral-600" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-neutral-500">
                Match feed
              </p>
              <p className="text-sm font-medium text-neutral-200">
                News · fixtures
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              if (isMobile) {
                onMobileOpenChange(!mobileOpen);
                return;
              }
              onCollapseToggle();
            }}
            className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-400 transition hover:bg-white/5 hover:text-white"
            aria-label={collapsed ? "Expand workspace" : "Collapse workspace"}
          >
            {collapsed || !mobileOpen ? (
              <ChevronUp className="size-4" />
            ) : (
              <ChevronDown className="size-4" />
            )}
          </button>
        </div>

        {!collapsed && (
          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            <div
              className={cn(
                "grid min-h-0 gap-4",
                selectedMatchId
                  ? "md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,1.05fr)]"
                  : "md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
              )}
            >
              <section className="rounded-xl border border-white/[0.08] bg-black/25">
                <div className="border-b border-white/[0.08] px-4 py-2.5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                    News
                  </p>
                </div>
                <NewsTab
                  articles={newsArticles}
                  loading={newsLoading}
                  error={newsError}
                  lastUpdated={newsLastUpdated}
                />
              </section>

              <section className="min-w-0 rounded-xl border border-white/[0.08] bg-black/25">
                <div className="border-b border-white/[0.08] px-4 py-2.5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                    Games
                  </p>
                </div>
                <GamesTab
                  matches={matches}
                  loading={scoresLoading}
                  error={scoresError}
                  showPickDetailHint={!selectedMatchId}
                  onSelectMatch={(id) => {
                    if (isMobile) {
                      onMobileOpenChange(true);
                    }
                    onSelectMatch(id);
                  }}
                />
                <div className="border-t border-white/[0.08]">
                  <div className="border-b border-white/[0.08] px-4 py-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                      Standings
                    </p>
                  </div>
                  <FeedStandings
                    groups={standingsGroups}
                    loading={standingsLoading}
                    error={standingsError}
                  />
                </div>
              </section>

              {selectedMatchId && (
                <section
                  ref={detailRef}
                  className="rounded-xl border border-white/[0.08] bg-black/25"
                >
                  <div className="border-b border-white/[0.08] px-4 py-2.5">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                        Match detail
                      </p>
                      <button
                        type="button"
                        onClick={onClearSelectedMatch}
                        className="text-[10px] uppercase tracking-[0.18em] text-neutral-500 transition hover:text-neutral-200"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                  <MatchDetailContent
                    matchId={selectedMatchId}
                    onClearSelection={onClearSelectedMatch}
                  />
                </section>
              )}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
