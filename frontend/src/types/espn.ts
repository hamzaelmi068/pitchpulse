// ESPN API — FIFA World Cup 2026

export interface ESPNScoreboardResponse {
  events: ESPNEvent[];
  leagues: ESPNLeague[];
  season: { type: number; year: number };
  day: { date: string };
}

export interface ESPNLeague {
  id: string;
  name: string;
  logos: { href: string }[];
}

export interface ESPNEvent {
  id: string;
  uid: string;
  date: string;
  name: string;
  shortName: string;
  status: ESPNStatus;
  competitions: ESPNCompetition[];
}

export interface ESPNStatus {
  clock: number;
  displayClock: string;
  type: {
    id: string;
    name: string;
    state: "pre" | "in" | "post";
    completed: boolean;
    description: string;
    detail: string;
    shortDetail: string;
  };
}

export interface ESPNCompetition {
  id: string;
  date: string;
  venue: ESPNVenue;
  competitors: ESPNCompetitor[];
  odds?: ESPNOdds[];
  broadcasts?: { names: string[] }[];
}

export interface ESPNVenue {
  id: string;
  fullName: string;
  address: {
    city: string;
    country: string;
  };
}

export interface ESPNCompetitor {
  id: string;
  homeAway: "home" | "away";
  score: string;
  team: ESPNTeam;
  winner?: boolean;
}

export interface ESPNTeam {
  id: string;
  displayName: string;
  abbreviation: string;
  logo: string;
  color: string;
  alternateColor: string;
}

export interface ESPNOdds {
  provider: { name: string };
  details: string;
  overUnder: number;
}

// ESPN News

export interface ESPNNewsResponse {
  articles: ESPNArticle[];
}

export interface ESPNArticle {
  dataSourceIdentifier: string;
  headline: string;
  description: string;
  published: string;
  links: {
    web: { href: string };
  };
  images?: { url: string; alt?: string }[];
  byline?: string;
}

// Processed / normalised types used throughout the app

export type MatchState = "pre" | "in" | "post";

export interface MatchTeam {
  id: string;
  name: string;
  abbreviation: string;
  logo: string;
  score: string;
  color: string;
  winner?: boolean;
}

export interface Match {
  id: string;
  date: string;
  name: string;
  state: MatchState;
  statusDescription: string; // "Scheduled", "In Progress", "Final"
  statusDetail: string;      // "6/11 - 3:00 PM EDT", "83'", "FT"
  displayClock: string;
  homeTeam: MatchTeam;
  awayTeam: MatchTeam;
  venue: {
    name: string;
    city: string;
    country: string;
  };
  broadcast?: string;
  /** Our internal venue ID matched from venues.ts */
  venueId?: string;
}

export interface NewsArticle {
  id: string;
  headline: string;
  description: string;
  published: string;
  url: string;
  imageUrl?: string;
  byline?: string;
}

// ── Match Detail (ESPN summary?event={id}) ───────────────────────────────────

export interface ESPNSummaryResponse {
  header: ESPNSummaryHeader;
  boxscore: ESPNBoxscore;
  headToHeadGames?: ESPNHeadToHeadGame[];
  pickcenter?: ESPNPickcenter[];
  broadcasts?: { market: { type: string }; names: string[] }[];
  news?: { articles: ESPNArticle[] };
  standings?: { groups: ESPNStandingGroup[] };
}

export interface ESPNSummaryHeader {
  id: string;
  competitions: ESPNSummaryCompetition[];
  season: { year: number; type: number; name: string };
}

export interface ESPNSummaryCompetition {
  id: string;
  date: string;
  neutralSite: boolean;
  status: ESPNStatus;
  competitors: ESPNSummaryCompetitor[];
  groups?: { name: string; shortName: string };
}

export interface ESPNSummaryCompetitor {
  id: string;
  homeAway: "home" | "away";
  winner: boolean;
  score: { value: number; displayValue: string };
  team: {
    id: string;
    displayName: string;
    abbreviation: string;
    logos: { href: string }[];
    color: string;
  };
  record?: { items: { summary: string; stats: { name: string; value: number }[] }[] };
}

export interface ESPNBoxscore {
  teams: {
    homeAway: "home" | "away";
    team: { id: string; displayName: string; abbreviation: string; logos: { href: string }[] };
  }[];
  gameInfo?: {
    venue?: { fullName: string; address?: { city: string; country: string } };
    attendance?: number;
  };
}

export interface ESPNGameInfo {
  venue?: {
    fullName?: string;
    address?: { city?: string; country?: string };
  };
  attendance?: number;
}

export interface ESPNHeadToHeadGame {
  id: string;
  date: string;
  competitors: {
    homeAway: "home" | "away";
    winner: boolean;
    score: { displayValue: string };
    team: { id: string; abbreviation: string; displayName: string };
  }[];
  season: { year: number };
  competitions?: { status?: { type?: { completed: boolean } }; notes?: { text: string }[] }[];
}

export interface ESPNPickcenter {
  provider: { name: string };
  details: string;
  overUnder: number;
  homeTeamOdds?: { moneyLine: number; spreadOdds: number; favorite: boolean };
  awayTeamOdds?: { moneyLine: number; spreadOdds: number; favorite: boolean };
  drawOdds?: { moneyLine: number };
}

export interface ESPNStandingGroup {
  standings: {
    entries: {
      id: string;
      team: string;
      logo?: { href: string }[];
      stats: { name: string; displayValue: string; value: number }[];
    }[];
  };
}

// ── Normalised match detail ──────────────────────────────────────────────────

export interface MatchDetail {
  id: string;
  group?: string;
  date: string;
  state: MatchState;
  statusDetail: string;
  displayClock: string;
  venue: { name: string; city: string; country: string };
  homeTeam: MatchTeam;
  awayTeam: MatchTeam;
  broadcast?: string;
  odds?: MatchOdds;
  headToHead: H2HGame[];
  news: NewsArticle[];
  groupStandings: GroupStandingEntry[];
}

export interface MatchOdds {
  provider: string;
  details: string;
  overUnder: number;
  homeMoneyline?: number;
  awayMoneyline?: number;
  drawMoneyline?: number;
}

export interface H2HGame {
  id: string;
  date: string;
  season: number;
  competition: string;
  homeTeam: { abbreviation: string; score: string };
  awayTeam: { abbreviation: string; score: string };
  completed: boolean;
}

export interface GroupStandingEntry {
  teamId: string;
  abbreviation: string;
  name: string;
  logo: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}
