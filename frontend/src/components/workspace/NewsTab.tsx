"use client";

import type { NewsArticle } from "@/types/espn";

interface NewsTabProps {
  articles: NewsArticle[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diff / 36e5);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function NewsTab({
  articles,
  loading,
  error,
  lastUpdated,
}: NewsTabProps) {
  if (loading) {
    return (
      <div className="space-y-4 p-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <div className="h-24 rounded-xl bg-white/5" />
            <div className="h-3 w-4/5 rounded bg-white/10" />
            <div className="h-3 w-2/5 rounded bg-white/10" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center px-4 py-6 text-center">
        <p className="text-xs text-neutral-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="px-3 py-3">
      {lastUpdated && (
        <p className="mb-3 text-[10px] uppercase tracking-[0.18em] text-neutral-600">
          Updated {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
      )}

      {articles.length === 0 ? (
        <p className="text-xs text-neutral-500">No news articles are available right now.</p>
      ) : (
        <div className="space-y-4">
          {articles.map((article) => (
            <a
              key={article.id}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] transition hover:bg-white/[0.05]"
            >
              {article.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={article.imageUrl}
                  alt=""
                  className="h-36 w-full object-cover"
                />
              )}
              <div className="space-y-2 p-3">
                <p className="text-sm font-semibold leading-snug text-neutral-100 transition group-hover:text-white">
                  {article.headline}
                </p>
                {article.description && (
                  <p className="line-clamp-3 text-xs leading-relaxed text-neutral-400">
                    {article.description}
                  </p>
                )}
                <p className="text-[10px] uppercase tracking-wider text-neutral-600">
                  {timeAgo(article.published)}
                  {article.byline ? ` · ${article.byline}` : ""}
                </p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
