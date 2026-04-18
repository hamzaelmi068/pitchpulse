"use client";

import { useEffect, useState } from "react";
import type { StandingsGroupBlock } from "@/types/espn";

export function useFeedStandings() {
  const [groups, setGroups] = useState<StandingsGroupBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/standings", { cache: "no-store" });
        if (!res.ok) throw new Error("bad response");
        const data: { groups?: StandingsGroupBlock[] } = await res.json();
        if (!cancelled) setGroups(data.groups ?? []);
      } catch {
        if (!cancelled) setError("Could not load standings");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    const t = window.setInterval(load, 120_000);
    return () => {
      cancelled = true;
      window.clearInterval(t);
    };
  }, []);

  return { groups, loading, error };
}
