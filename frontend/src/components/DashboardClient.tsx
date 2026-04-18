"use client";

import { useEffect, useState } from "react";
import { useScores } from "@/hooks/useScores";
import { useNews } from "@/hooks/useNews";
import { useFeedStandings } from "@/hooks/useFeedStandings";
import { DashboardMap } from "@/components/map/DashboardMap";
import { Header } from "@/components/header/Header";
import { StatsPanel } from "@/components/stats/StatsPanel";
import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";

const WORKSPACE_HEIGHT_KEY = "pitchpulse-workspace-height";
const WORKSPACE_COLLAPSED_KEY = "pitchpulse-bottom-workspace-collapsed";
const DEFAULT_WORKSPACE_HEIGHT = 420;

export function DashboardClient() {
  const { matches, loading, error } = useScores();
  const {
    articles,
    loading: newsLoading,
    error: newsError,
    lastUpdated: newsLastUpdated,
  } = useNews();
  const {
    groups: standingsGroups,
    loading: standingsLoading,
    error: standingsError,
  } = useFeedStandings();
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [workspaceHeight, setWorkspaceHeight] = useState(DEFAULT_WORKSPACE_HEIGHT);
  const [workspaceCollapsed, setWorkspaceCollapsed] = useState(false);
  const [mobileWorkspaceOpen, setMobileWorkspaceOpen] = useState(false);
  const [hasHydratedLayout, setHasHydratedLayout] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const storedHeight = window.localStorage.getItem(WORKSPACE_HEIGHT_KEY);
      if (storedHeight != null) {
        const parsedHeight = Number(storedHeight);
        if (!Number.isNaN(parsedHeight)) {
          setWorkspaceHeight(parsedHeight);
        }
      }

      setWorkspaceCollapsed(
        window.localStorage.getItem(WORKSPACE_COLLAPSED_KEY) === "true"
      );
      setHasHydratedLayout(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!hasHydratedLayout) {
      return;
    }
    window.localStorage.setItem(WORKSPACE_HEIGHT_KEY, String(workspaceHeight));
  }, [hasHydratedLayout, workspaceHeight]);

  useEffect(() => {
    if (!hasHydratedLayout) {
      return;
    }
    window.localStorage.setItem(
      WORKSPACE_COLLAPSED_KEY,
      String(workspaceCollapsed)
    );
  }, [hasHydratedLayout, workspaceCollapsed]);

  function handleSelectMatch(matchId: string) {
    setSelectedMatchId(matchId);
    setWorkspaceCollapsed(false);
    setMobileWorkspaceOpen(true);
  }

  function handleOpenWorkspace() {
    setMobileWorkspaceOpen(true);
  }

  const desktopWorkspaceHeight = workspaceCollapsed ? 44 : workspaceHeight;
  const mobileMapIsOverlay = mobileWorkspaceOpen;

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-background text-foreground">
      <div
        className="relative min-h-0 flex-1"
        style={{
          height: mobileMapIsOverlay
            ? "100%"
            : `calc(100% - ${desktopWorkspaceHeight}px)`,
        }}
      >
        <DashboardMap matches={matches} onSelectMatch={handleSelectMatch} />
        <Header onOpenWorkspace={handleOpenWorkspace} />
        <StatsPanel />
      </div>
      <WorkspaceShell
        matches={matches}
        scoresLoading={loading}
        scoresError={error}
        newsArticles={articles}
        newsLoading={newsLoading}
        newsError={newsError}
        newsLastUpdated={newsLastUpdated}
        selectedMatchId={selectedMatchId}
        collapsed={workspaceCollapsed}
        mobileOpen={mobileWorkspaceOpen}
        height={workspaceHeight}
        onHeightChange={setWorkspaceHeight}
        onCollapseToggle={() => setWorkspaceCollapsed((current) => !current)}
        onMobileOpenChange={setMobileWorkspaceOpen}
        onSelectMatch={handleSelectMatch}
        onClearSelectedMatch={() => {
          setSelectedMatchId(null);
        }}
        standingsGroups={standingsGroups}
        standingsLoading={standingsLoading}
        standingsError={standingsError}
      />
    </main>
  );
}
