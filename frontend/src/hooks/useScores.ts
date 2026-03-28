"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Match } from "@/types/espn";

const LIVE_POLL_MS = 30_000;
const IDLE_POLL_MS = 60_000;
const MAX_BACKOFF_MS = 5 * 60_000;

export function useScores() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const errorCountRef = useRef(0);
  const visibilityRef = useRef(
    typeof document === "undefined" ? "visible" : document.visibilityState
  );
  const matchesRef = useRef<Match[]>([]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const fetchScores = useCallback(async () => {
    try {
      const res = await fetch("/api/scores", {
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok) {
        console.error("[useScores] API error:", data);
        throw new Error(data.detail ?? data.error ?? "Failed to fetch");
      }
      setMatches(data.matches);
      matchesRef.current = data.matches;
      setError(null);
      setLastUpdated(new Date());
      errorCountRef.current = 0;
    } catch (err) {
      console.error("[useScores]", err);
      setError("Could not load scores");
      errorCountRef.current += 1;
    } finally {
      setLoading(false);
    }
  }, []);

  const scheduleNextPoll = useCallback(() => {
    clearTimer();

    if (visibilityRef.current !== "visible") {
      return;
    }

    const hasLive = matchesRef.current.some((match) => match.state === "in");
    const baseDelay = hasLive ? LIVE_POLL_MS : IDLE_POLL_MS;
    const backoffDelay =
      errorCountRef.current > 0
        ? Math.min(
            MAX_BACKOFF_MS,
            baseDelay * 2 ** Math.min(errorCountRef.current, 3)
          )
        : baseDelay;

    timerRef.current = setTimeout(async () => {
      await fetchScores();
      scheduleNextPoll();
    }, backoffDelay);
  }, [clearTimer, fetchScores]);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      await fetchScores();
      if (!cancelled) {
        scheduleNextPoll();
      }
    }

    function handleVisibilityChange() {
      visibilityRef.current = document.visibilityState;
      if (visibilityRef.current === "visible") {
        void fetchScores().then(() => {
          if (!cancelled) {
            scheduleNextPoll();
          }
        });
      } else {
        clearTimer();
      }
    }

    void bootstrap();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelled = true;
      clearTimer();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [clearTimer, fetchScores, scheduleNextPoll]);

  const liveCount = matches.filter((m) => m.state === "in").length;

  return { matches, loading, error, lastUpdated, liveCount };
}
