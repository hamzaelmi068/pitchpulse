import type { NewsArticle } from "@/types/espn";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 36e5);
  if (h < 1) return "Just now";
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function MatchNewsSection({ articles }: { articles: NewsArticle[] }) {
  if (articles.length === 0) return null;

  return (
    <div className="px-4 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
        Related News
      </p>
      <div className="space-y-3">
        {articles.map((article) => (
          <a
            key={article.id}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-2.5 group"
          >
            {article.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={article.imageUrl}
                alt=""
                className="w-16 h-12 object-cover rounded flex-shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground/90 leading-snug line-clamp-2 group-hover:text-foreground transition-colors">
                {article.headline}
              </p>
              <p className="mt-0.5 text-[10px] text-muted-foreground/60">
                {timeAgo(article.published)}
                {article.byline ? ` · ${article.byline}` : ""}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
