import type {
  ESPNScoreboardResponse,
  ESPNNewsResponse,
  ESPNSummaryResponse,
  Match,
  MatchDetail,
  MatchTeam,
  NewsArticle,
  GroupStandingEntry,
  H2HGame,
} from "@/types/espn";

// Map ESPN venue city names → our internal venue IDs from venues.ts
const CITY_TO_VENUE_ID: Record<string, string> = {
  "East Rutherford": "metlife",
  Inglewood: "sofi",
  Arlington: "att",
  "Santa Clara": "levis",
  "Miami Gardens": "hardrock",
  Atlanta: "mercedesbenz",
  Seattle: "lumen",
  Houston: "nrg",
  "Kansas City": "arrowhead",
  Philadelphia: "lincoln",
  Foxborough: "gillette",
  Toronto: "bmo",
  Vancouver: "bcplace",
  "Mexico City": "azteca",
  Guadalajara: "akron",
  Monterrey: "bbva",
};

function matchVenueId(city: string): string | undefined {
  // Direct match first
  if (CITY_TO_VENUE_ID[city]) return CITY_TO_VENUE_ID[city];
  // Partial match fallback (handles "East Rutherford, NJ" etc.)
  const found = Object.entries(CITY_TO_VENUE_ID).find(([key]) =>
    city.includes(key)
  );
  return found?.[1];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildTeam(competitor: any): MatchTeam {
  const team = competitor?.team ?? {};
  // Scoreboard uses team.logo (string); summary uses team.logos (array)
  const logo: string = team.logo ?? team.logos?.[0]?.href ?? "";
  return {
    id: String(team.id ?? competitor?.id ?? ""),
    name: team.displayName ?? team.name ?? "TBD",
    abbreviation: team.abbreviation ?? "TBD",
    logo,
    score: String(competitor?.score ?? "0"),
    color: team.color ? `#${team.color}` : "#ffffff",
    winner: competitor?.winner ?? false,
  };
}

export function parseScoreboard(data: ESPNScoreboardResponse): Match[] {
  if (!Array.isArray(data?.events)) return [];

  const results: Match[] = [];

  for (const event of data.events) {
    try {
      const competition = event?.competitions?.[0];
      if (!competition) continue;

      const competitors: unknown[] = competition.competitors ?? [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const home = (competitors as any[]).find((c) => c.homeAway === "home")
        ?? competitors[0];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const away = (competitors as any[]).find((c) => c.homeAway === "away")
        ?? competitors[1];

      // Broadcasts can live at competition level or event level
      const broadcasts: unknown[] =
        competition.broadcasts ?? (event as unknown as { broadcasts?: unknown[] }).broadcasts ?? [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const broadcast = (broadcasts as any[])[0]?.names?.join(", ");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const status = event.status ?? (competition as any).status;

      results.push({
        id: event.id,
        date: event.date,
        name: event.name,
        state: status?.type?.state ?? "pre",
        statusDescription: status?.type?.description ?? "Scheduled",
        statusDetail: status?.type?.detail ?? status?.type?.shortDetail ?? "",
        displayClock: status?.displayClock ?? "",
        homeTeam: buildTeam(home),
        awayTeam: buildTeam(away),
        venue: {
          name: competition.venue?.fullName ?? "",
          city: competition.venue?.address?.city ?? "",
          country: competition.venue?.address?.country ?? "",
        },
        broadcast,
        venueId: matchVenueId(competition.venue?.address?.city ?? ""),
      });
    } catch (err) {
      console.error("[parseScoreboard] skipping event", event?.id, err);
    }
  }

  return results;
}

export function parseSummary(data: ESPNSummaryResponse): MatchDetail {
  const competition = data.header.competitions[0];
  const home = competition.competitors.find((c) => c.homeAway === "home")!;
  const away = competition.competitors.find((c) => c.homeAway === "away")!;

  // Team shape from summary differs from scoreboard — logos is an array
  function summaryTeam(c: typeof home): MatchTeam {
    return {
      id: c.team.id,
      name: c.team.displayName,
      abbreviation: c.team.abbreviation,
      logo: c.team.logos?.[0]?.href ?? "",
      score: c.score?.displayValue ?? "0",
      color: c.team.color ? `#${c.team.color}` : "#ffffff",
      winner: c.winner,
    };
  }

  // Venue from boxscore.gameInfo
  const gameInfo = (data as ESPNSummaryResponse & { gameInfo?: { venue?: { fullName?: string; address?: { city?: string; country?: string } } } }).gameInfo
    ?? data.boxscore.gameInfo;
  const venue = {
    name: gameInfo?.venue?.fullName ?? "",
    city: gameInfo?.venue?.address?.city ?? "",
    country: gameInfo?.venue?.address?.country ?? "",
  };

  // Broadcast
  const broadcast = data.broadcasts?.[0]?.names?.join(", ");

  // Odds — first pickcenter entry
  const pick = data.pickcenter?.[0];
  const odds = pick
    ? {
        provider: pick.provider?.name ?? "DraftKings",
        details: pick.details ?? "",
        overUnder: pick.overUnder ?? 0,
        homeMoneyline: pick.homeTeamOdds?.moneyLine,
        awayMoneyline: pick.awayTeamOdds?.moneyLine,
        drawMoneyline: pick.drawOdds?.moneyLine,
      }
    : undefined;

  // Head to head
  const headToHead: H2HGame[] = (data.headToHeadGames ?? []).map((g) => {
    const h2hHome = g.competitors.find((c) => c.homeAway === "home")!;
    const h2hAway = g.competitors.find((c) => c.homeAway === "away")!;
    const noteText = g.competitions?.[0]?.notes?.[0]?.text ?? "";
    const completed = g.competitions?.[0]?.status?.type?.completed ?? true;
    return {
      id: g.id,
      date: g.date,
      season: g.season.year,
      competition: noteText,
      homeTeam: { abbreviation: h2hHome.team.abbreviation, score: h2hHome.score.displayValue },
      awayTeam: { abbreviation: h2hAway.team.abbreviation, score: h2hAway.score.displayValue },
      completed,
    };
  });

  // Group standings
  const groupStandings: GroupStandingEntry[] = [];
  const group = data.standings?.groups?.[0];
  if (group) {
    for (const entry of group.standings.entries) {
      const stat = (name: string) =>
        entry.stats.find((s) => s.name === name)?.value ?? 0;
      groupStandings.push({
        teamId: entry.id,
        abbreviation:
          entry.logo?.[0]?.href
            ? entry.logo[0].href.split("/").pop()?.split(".")[0]?.toUpperCase() ?? entry.team.slice(0, 3).toUpperCase()
            : entry.team.slice(0, 3).toUpperCase(),
        name: entry.team,
        logo: entry.logo?.[0]?.href ?? "",
        played: stat("gamesPlayed"),
        wins: stat("wins"),
        draws: stat("ties"),
        losses: stat("losses"),
        goalsFor: stat("pointsFor"),
        goalsAgainst: stat("pointsAgainst"),
        points: stat("points"),
      });
    }
  }

  // News
  const news: NewsArticle[] = (data.news?.articles ?? []).map((a) => ({
    id: a.dataSourceIdentifier,
    headline: a.headline,
    description: a.description ?? "",
    published: a.published,
    url: a.links?.web?.href ?? "#",
    imageUrl: a.images?.[0]?.url,
    byline: a.byline,
  }));

  return {
    id: competition.id,
    group: competition.groups?.shortName,
    date: competition.date,
    state: competition.status.type.state,
    statusDetail: competition.status.type.detail,
    displayClock: competition.status.displayClock,
    venue,
    homeTeam: summaryTeam(home),
    awayTeam: summaryTeam(away),
    broadcast,
    odds,
    headToHead,
    news,
    groupStandings,
  };
}

export function parseNews(data: ESPNNewsResponse): NewsArticle[] {
  return data.articles.map((article) => ({
    id: article.dataSourceIdentifier,
    headline: article.headline,
    description: article.description ?? "",
    published: article.published,
    url: article.links?.web?.href ?? "#",
    imageUrl: article.images?.[0]?.url,
    byline: article.byline,
  }));
}
