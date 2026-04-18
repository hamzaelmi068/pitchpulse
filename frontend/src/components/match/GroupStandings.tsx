import type { GroupStandingEntry } from "@/types/espn";
import { cn } from "@/lib/utils";



function rowGoalDiff(entry: GroupStandingEntry): number {
  const net = entry.goalsFor - entry.goalsAgainst;
  if (
    entry.goalsFor === 0 &&
    entry.goalsAgainst === 0 &&
    entry.goalDifference !== undefined
  ) {
    return entry.goalDifference;
  }
  return net;
}

/** Explicit stat column widths so they never collapse in the workspace grid. */
const FEED_GRID =
  "grid w-full grid-cols-[1.25rem_1fr_2rem_2rem_2rem_2rem_2.25rem_2.25rem] items-center gap-x-1 gap-y-0.5 text-xs";

function FeedStandingsRowHeader() {
  return (
    <div
      className={`${FEED_GRID} mb-1.5 border-b border-white/15 pb-2 text-[10px] font-medium uppercase tracking-wide text-neutral-400`}
    >
      <span className="text-left">#</span>
      <span className="min-w-0 truncate text-left">Team</span>
      <span className="text-center tabular-nums">P</span>
      <span className="text-center tabular-nums">W</span>
      <span className="text-center tabular-nums">D</span>
      <span className="text-center tabular-nums">L</span>
      <span className="text-center tabular-nums">GD</span>
      <span className="text-center font-semibold text-neutral-200 tabular-nums">Pts</span>
    </div>
  );
}

function FeedStandingsDataRow({
  rank,
  abbreviation,
  logo,
  played,
  wins,
  draws,
  losses,
  gdDisplay,
  points,
  highlighted,
}: {
  rank: number;
  abbreviation: string;
  logo: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  gdDisplay: string;
  points: number;
  highlighted: boolean;
}) {
  const n = "text-center tabular-nums text-neutral-200";

  return (
    <div
      className={cn(
        `${FEED_GRID} border-b border-white/[0.06] py-2 last:border-b-0`,
        highlighted && "bg-white/[0.04]"
      )}
    >
      <span className="text-center tabular-nums text-neutral-500">{rank}</span>
      <div className="flex min-w-0 items-center gap-1.5">
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logo}
            alt={abbreviation}
            className="h-4 w-4 shrink-0 object-contain"
          />
        ) : (
          <div className="h-4 w-4 shrink-0 rounded-full bg-neutral-600/40" />
        )}
        <span
          className={cn(
            "truncate font-semibold text-neutral-50",
            highlighted && "text-white"
          )}
        >
          {abbreviation}
        </span>
      </div>
      <span className={n}>{played}</span>
      <span className={n}>{wins}</span>
      <span className={n}>{draws}</span>
      <span className={n}>{losses}</span>
      <span className={n}>{gdDisplay}</span>
      <span className="text-center text-sm font-bold tabular-nums text-white">{points}</span>
    </div>
  );
}

interface GroupStandingsProps {
  entries: GroupStandingEntry[];
  highlightIds: string[]; // home + away team IDs
  /** Table heading; default for match detail. Pass ESPN block header in feeds. */
  title?: string;
  /** Hide the heading row (table only). */
  hideTitle?: boolean;
  /** Default bottom border; disable when stacking multiple tables in one panel. */
  showBorderBottom?: boolean;
  className?: string;
  /** Match-feed panel: serif group titles, stats block to the right. */
  variant?: "default" | "feed";
}

export function GroupStandings({
  entries,
  highlightIds,
  title = "Group standings",
  hideTitle = false,
  showBorderBottom = true,
  className,
  variant = "default",
}: GroupStandingsProps) {
  if (entries.length === 0) return null;

  const isFeed = variant === "feed";

  return (
    <div
      className={cn(
        "px-4 py-3",
        showBorderBottom && "border-b border-border/60",
        className
      )}
    >
      {!hideTitle && (
        <p
          className={cn(
            "mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400",
            isFeed && "font-serif text-[11px] tracking-[0.28em] text-neutral-300"
          )}
        >
          {title}
        </p>
      )}
      {isFeed ? (
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[280px] text-xs">
            <thead>
              <tr className="border-b border-white/15 text-[10px] font-medium uppercase tracking-wide text-neutral-400">
                <th className="pb-2 text-left w-4">#</th>
                <th className="pb-2 text-left">Team</th>
                <th className="pb-2 text-center w-7">P</th>
                <th className="pb-2 text-center w-7">W</th>
                <th className="pb-2 text-center w-7">D</th>
                <th className="pb-2 text-center w-7">L</th>
                <th className="pb-2 text-center w-8">GD</th>
                <th className="pb-2 text-center w-8 text-neutral-200 font-semibold">Pts</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, i) => {
                const isHighlighted = highlightIds.includes(entry.teamId);
                const gd = rowGoalDiff(entry);
                return (
                  <tr key={entry.teamId} className={cn("border-b border-white/[0.06] last:border-b-0", isHighlighted && "bg-white/[0.04]")}>
                    <td className="py-2 text-neutral-500 tabular-nums">{i + 1}</td>
                    <td className="py-2">
                      <div className="flex items-center gap-1.5">
                        {entry.logo
                          ? <img src={entry.logo} alt={entry.abbreviation} className="h-4 w-4 shrink-0 object-contain" />
                          : <div className="h-4 w-4 shrink-0 rounded-full bg-neutral-600/40" />}
                        <span className={cn("font-semibold text-neutral-50", isHighlighted && "text-white")}>{entry.name}</span>
                      </div>
                    </td>
                    <td className="py-2 text-center tabular-nums text-neutral-200">{entry.played}</td>
                    <td className="py-2 text-center tabular-nums text-neutral-200">{entry.wins}</td>
                    <td className="py-2 text-center tabular-nums text-neutral-200">{entry.draws}</td>
                    <td className="py-2 text-center tabular-nums text-neutral-200">{entry.losses}</td>
                    <td className="py-2 text-center tabular-nums text-neutral-200">{gd > 0 ? `+${gd}` : String(gd)}</td>
                    <td className="py-2 text-center font-bold tabular-nums text-white">{entry.points}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <table className="w-full text-xs">
          <thead>
            <tr className="text-[10px] text-muted-foreground/60">
              <th className="w-4 pb-1 text-left font-normal">#</th>
              <th className="pb-1 text-left font-normal">Team</th>
              <th className="pb-1 text-center font-normal">P</th>
              <th className="w-6 pb-1 text-center font-normal">W</th>
              <th className="w-6 pb-1 text-center font-normal">D</th>
              <th className="w-6 pb-1 text-center font-normal">L</th>
              <th className="w-9 pb-1 text-center font-normal">GD</th>
              <th className="pb-1 text-center font-normal text-foreground/70">Pts</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, i) => {
              const isHighlighted = highlightIds.includes(entry.teamId);
              const gd = rowGoalDiff(entry);
              return (
                <tr
                  key={entry.teamId}
                  className={
                    isHighlighted ? "text-foreground" : "text-muted-foreground"
                  }
                >
                  <td className="py-0.5 pr-1 text-muted-foreground/50">{i + 1}</td>
                  <td className="py-0.5">
                    <div className="flex items-center gap-1.5">
                      {entry.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={entry.logo}
                          alt={entry.abbreviation}
                          className="h-4 w-4 object-contain"
                        />
                      ) : (
                        <div className="h-4 w-4 rounded-full bg-muted-foreground/20" />
                      )}
                      <span
                        className={`font-medium ${isHighlighted ? "text-foreground" : ""}`}
                      >
                        {entry.abbreviation}
                      </span>
                    </div>
                  </td>
                  <td className="py-0.5 text-center tabular-nums">{entry.played}</td>
                  <td className="py-0.5 text-center tabular-nums">{entry.wins}</td>
                  <td className="py-0.5 text-center tabular-nums">{entry.draws}</td>
                  <td className="py-0.5 text-center tabular-nums">{entry.losses}</td>
                  <td className="py-0.5 text-center tabular-nums">
                    {gd > 0 ? `+${gd}` : gd}
                  </td>
                  <td className="py-0.5 text-center font-bold tabular-nums text-foreground/90">
                    {entry.points}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
