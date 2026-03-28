import type { Match } from "@/types/espn";

function TeamRow({
  team,
  isWinner,
  state,
}: {
  team: Match["homeTeam"];
  isWinner?: boolean;
  state: Match["state"];
}) {
  return (
    <div className="flex items-center gap-2">
      {team.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={team.logo}
          alt={team.abbreviation}
          width={20}
          height={20}
          className="w-5 h-5 object-contain flex-shrink-0"
        />
      ) : (
        <div className="w-5 h-5 rounded-full bg-neutral-700 flex-shrink-0" />
      )}
      <span
        className={`flex-1 text-xs font-semibold truncate ${
          state === "post" && isWinner ? "text-white" : "text-neutral-200"
        }`}
      >
        {team.name !== "TBD" ? team.name : team.abbreviation}
      </span>
      {state !== "pre" && (
        <span
          className={`text-sm tabular-nums font-bold ${
            state === "post" && isWinner ? "text-white" : "text-neutral-300"
          }`}
        >
          {team.score}
        </span>
      )}
    </div>
  );
}

export function MatchCard({
  match,
  onSelect,
}: {
  match: Match;
  onSelect?: (id: string) => void;
}) {
  const isPre = match.state === "pre";
  const isLive = match.state === "in";

  return (
    <button
      type="button"
      className="w-full text-left px-3 py-3 border-b border-white/5 last:border-0 hover:bg-white/5 active:bg-white/10 transition-colors"
      onClick={() => onSelect?.(match.id)}
    >
      {/* Status / time row */}
      <div className="flex items-center justify-between mb-2">
        {isLive ? (
          <span className="flex items-center gap-1 text-[10px] font-bold text-red-400 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            LIVE {match.displayClock}
          </span>
        ) : isPre ? (
          <span className="text-[10px] font-medium text-emerald-400">
            {match.statusDetail}
          </span>
        ) : (
          <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">
            FT
          </span>
        )}
        {match.broadcast && (
          <span className="text-[10px] text-neutral-600 flex-shrink-0 ml-2">
            {match.broadcast}
          </span>
        )}
      </div>

      {/* Teams */}
      <div className="space-y-1.5">
        <TeamRow
          team={match.homeTeam}
          isWinner={match.homeTeam.winner}
          state={match.state}
        />
        <TeamRow
          team={match.awayTeam}
          isWinner={match.awayTeam.winner}
          state={match.state}
        />
      </div>

      {/* Venue — shown for upcoming matches */}
      {isPre && match.venue.name && (
        <p className="mt-2 text-[10px] text-neutral-600 truncate">
          {match.venue.name}
          {match.venue.city ? ` · ${match.venue.city}` : ""}
        </p>
      )}
    </button>
  );
}
