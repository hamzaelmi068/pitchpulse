import type { GroupStandingEntry } from "@/types/espn";

interface GroupStandingsProps {
  entries: GroupStandingEntry[];
  highlightIds: string[]; // home + away team IDs
}

export function GroupStandings({ entries, highlightIds }: GroupStandingsProps) {
  if (entries.length === 0) return null;

  return (
    <div className="px-4 py-3 border-b border-border/60">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
        Group Standings
      </p>
      <table className="w-full text-xs">
        <thead>
          <tr className="text-[10px] text-muted-foreground/60">
            <th className="text-left font-normal pb-1 w-4">#</th>
            <th className="text-left font-normal pb-1">Team</th>
            <th className="text-center font-normal pb-1">P</th>
            <th className="text-center font-normal pb-1">W</th>
            <th className="text-center font-normal pb-1">D</th>
            <th className="text-center font-normal pb-1">L</th>
            <th className="text-center font-normal pb-1">GD</th>
            <th className="text-center font-normal pb-1 text-foreground/70">Pts</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, i) => {
            const isHighlighted = highlightIds.includes(entry.teamId);
            const gd = entry.goalsFor - entry.goalsAgainst;
            return (
              <tr
                key={entry.teamId}
                className={`${isHighlighted ? "text-foreground" : "text-muted-foreground"}`}
              >
                <td className="py-0.5 pr-1 text-muted-foreground/50">{i + 1}</td>
                <td className="py-0.5">
                  <div className="flex items-center gap-1.5">
                    {entry.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={entry.logo} alt={entry.abbreviation} className="w-4 h-4 object-contain" />
                    ) : (
                      <div className="w-4 h-4 rounded-full bg-muted-foreground/20" />
                    )}
                    <span className={`font-medium ${isHighlighted ? "text-foreground" : ""}`}>
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
                <td className="py-0.5 text-center tabular-nums font-bold text-foreground/90">
                  {entry.points}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
