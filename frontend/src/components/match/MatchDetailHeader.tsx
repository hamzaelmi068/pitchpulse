import type { MatchDetail } from "@/types/espn";

function formatMatchDate(iso: string) {
  return new Date(iso).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

function moneylineLabel(value?: number) {
  if (value == null) return null;
  return value > 0 ? `+${value}` : `${value}`;
}

function TeamBlock({
  team,
  align,
}: {
  team: MatchDetail["homeTeam"];
  align: "left" | "right";
}) {
  return (
    <div className={`flex flex-col items-center gap-2 flex-1 ${align === "right" ? "items-center" : "items-center"}`}>
      {team.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={team.logo} alt={team.name} className="w-14 h-14 object-contain" />
      ) : (
        <div className="w-14 h-14 rounded-full bg-muted-foreground/20" />
      )}
      <span className="text-sm font-bold text-foreground text-center leading-tight">
        {team.name}
      </span>
    </div>
  );
}

export function MatchDetailHeader({ detail }: { detail: MatchDetail }) {
  const isLive = detail.state === "in";
  const isPre = detail.state === "pre";

  return (
    <div className="px-4 pt-4 pb-3 border-b border-border/60">
      {/* Group + status badge */}
      <div className="flex items-center justify-between mb-3">
        {detail.group && (
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {detail.group}
          </span>
        )}
        {isLive && (
          <span className="flex items-center gap-1 text-[10px] font-bold text-red-400 ml-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            {detail.displayClock}
          </span>
        )}
        {!isLive && (
          <span className="text-[10px] text-muted-foreground ml-auto">
            {detail.statusDetail}
          </span>
        )}
      </div>

      {/* Teams + score */}
      <div className="flex items-center gap-2">
        <TeamBlock team={detail.homeTeam} align="left" />

        <div className="flex flex-col items-center gap-1 px-2">
          {isPre ? (
            <span className="text-2xl font-bold text-muted-foreground/40 tabular-nums">
              vs
            </span>
          ) : (
            <span className="text-3xl font-bold text-foreground tabular-nums tracking-tight">
              {detail.homeTeam.score} – {detail.awayTeam.score}
            </span>
          )}
        </div>

        <TeamBlock team={detail.awayTeam} align="right" />
      </div>

      {/* Venue + date */}
      <div className="mt-3 text-center space-y-0.5">
        <p className="text-xs text-muted-foreground">
          {detail.venue.name}
          {detail.venue.city ? ` · ${detail.venue.city}` : ""}
        </p>
        <p className="text-[11px] text-muted-foreground/70">
          {formatMatchDate(detail.date)}
          {detail.broadcast ? ` · ${detail.broadcast}` : ""}
        </p>
      </div>

      {/* Odds strip */}
      {detail.odds && (
        <div className="mt-3 flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2 text-[11px] text-muted-foreground">
          <span>
            <span className="font-semibold text-foreground/80">
              {detail.homeTeam.abbreviation}
            </span>{" "}
            {moneylineLabel(detail.odds.homeMoneyline)}
          </span>
          <span>
            Draw{" "}
            <span className="font-semibold text-foreground/80">
              {moneylineLabel(detail.odds.drawMoneyline)}
            </span>
          </span>
          <span>
            <span className="font-semibold text-foreground/80">
              {detail.awayTeam.abbreviation}
            </span>{" "}
            {moneylineLabel(detail.odds.awayMoneyline)}
          </span>
        </div>
      )}
    </div>
  );
}
