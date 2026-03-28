"use client";

import { useEffect, useState } from "react";
import type { MatchDetail } from "@/types/espn";

export function useMatchDetail(matchId: string | null) {
  const [detail, setDetail] = useState<MatchDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!matchId) {
      setDetail(null);
      return;
    }

    let cancelled = false;

    async function fetch_() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/match/${matchId}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data: { detail: MatchDetail } = await res.json();
        if (!cancelled) setDetail(data.detail);
      } catch {
        if (!cancelled) setError("Could not load match details");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetch_();

    return () => {
      cancelled = true;
    };
  }, [matchId]);

  return { detail, loading, error };
}
