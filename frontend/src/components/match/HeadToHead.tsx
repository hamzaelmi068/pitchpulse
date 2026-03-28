import type { H2HGame } from "@/types/espn";

function formatH2HDate(iso: string) {
  return new Date(iso).toLocaleDateString([], {
    month: "short",
    year: "numeric",
  });
}

export function HeadToHead({ games }: { games: H2HGame[] }) {
  if (games.length === 0) return null;

  return (
    <div className="px-4 py-3 border-b border-border/60">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
        Head to Head
      </p>
      <div className="space-y-2">
        {games.map((game) => (
          <div key={game.id} className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground/60 w-16 flex-shrink-0 tabular-nums">
              {formatH2HDate(game.date)}
            </span>
            <span className="flex-1 truncate text-muted-foreground/80 text-[10px]">
              {game.competition}
            </span>
            <span className="font-mono font-semibold text-foreground/90 flex-shrink-0">
              {game.homeTeam.abbreviation} {game.homeTeam.score}–{game.awayTeam.score} {game.awayTeam.abbreviation}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
