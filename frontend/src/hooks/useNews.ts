"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { NewsArticle } from "@/types/espn";

const NEWS_POLL_MS = 30 * 60 * 1000;
const NEWS_BACKOFF_MS = 60 * 60 * 1000;

export function useNews() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const visibilityRef = useRef(
    typeof document === "undefined" ? "visible" : document.visibilityState
  );
  const hadErrorRef = useRef(false);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const fetchNews = useCallback(async () => {
    try {
      const res = await fetch("/api/news", {
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Failed to fetch news");
      }

      setArticles(data.articles ?? []);
      setError(null);
      setLastUpdated(new Date());
      hadErrorRef.current = false;
    } catch {
      setError("Could not load news");
      hadErrorRef.current = true;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    function scheduleNextPoll() {
      clearTimer();

      if (visibilityRef.current !== "visible") {
        return;
      }

      timerRef.current = setTimeout(async () => {
        await fetchNews();
        if (!cancelled) {
          scheduleNextPoll();
        }
      }, hadErrorRef.current ? NEWS_BACKOFF_MS : NEWS_POLL_MS);
    }

    function handleVisibilityChange() {
      visibilityRef.current = document.visibilityState;
      if (visibilityRef.current === "visible") {
        void fetchNews().then(() => {
          if (!cancelled) {
            scheduleNextPoll();
          }
        });
      } else {
        clearTimer();
      }
    }

    void fetchNews().then(() => {
      if (!cancelled) {
        scheduleNextPoll();
      }
    });
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelled = true;
      clearTimer();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [clearTimer, fetchNews]);

  return { articles, loading, error, lastUpdated };
}
