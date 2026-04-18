import {
  groupStandingsLabelFromSummary,
  parseStandingsGroupsFromSummary,
} from "@/lib/espn";
import type { ESPNSummaryResponse, ESPNScoreboardResponse } from "@/types/espn";
import type { StandingsGroupBlock, GroupStandingEntry } from "@/types/espn";

/** Standings are aggregated from many ESPN calls — must not be statically cached as one group. */
export const dynamic = "force-dynamic";

export const revalidate = 60;

const ESPN_SCOREBOARD =
  "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard";
/** Group stage window — broad enough for ESPN to list all WC26 group fixtures. */
const GROUP_STAGE_DATES = "20260611-20260628";
const MAX_GROUPS = 12;
const BATCH = 12;

function firstBlockEntries(summary: ESPNSummaryResponse): GroupStandingEntry[] {
  const blocks = parseStandingsGroupsFromSummary(summary);
  return blocks[0]?.entries ?? [];
}

/** Pull one standings table per competition group (ESPN uses "Group 1" … "Group 12", not A–L). */
async function collectAllGroupStandings(): Promise<StandingsGroupBlock[]> {
  const scoreboardUrl = new URL(ESPN_SCOREBOARD);
  scoreboardUrl.searchParams.set("dates", GROUP_STAGE_DATES);
  scoreboardUrl.searchParams.set("limit", "500");

  const boardRes = await fetch(scoreboardUrl.toString(), {
    next: { revalidate },
  });
  if (!boardRes.ok) {
    throw new Error("scoreboard");
  }
  const boardData: ESPNScoreboardResponse = await boardRes.json();
  let events =
    boardData.events?.filter((e) => e.season?.slug === "group-stage") ?? [];

  if (events.length === 0) {
    events =
      boardData.events?.filter(
        (e) => e.season?.slug && e.season.slug !== "round-of-32"
      ) ?? [];
  }

  if (events.length === 0) {
    const fallbackId = boardData.events?.[0]?.id;
    if (!fallbackId) return [];
    const sum = await fetchSummary(fallbackId);
    if (!sum) return [];
    return buildBlocksFromSingleSummary(sum);
  }

  const seenGroupIds = new Set<string>();
  const out: StandingsGroupBlock[] = [];

  function consume(summary: ESPNSummaryResponse | null) {
    if (!summary) return;



    const comp = summary.header?.competitions?.[0];
    const gid = comp?.groups?.id;
    const entries = firstBlockEntries(summary);

    if (!entries.length) return;

    if (!gid) {
      if (out.length === 0) {
        out.push({
          header:
            groupStandingsLabelFromSummary(summary) ??
            "FIFA World Cup standings",
          entries,
        });
      }
      return;
    }

    if (seenGroupIds.has(gid)) return;
    seenGroupIds.add(gid);

    const label = numberToGroupLetter(
      groupStandingsLabelFromSummary(summary) ??
      parseStandingsGroupsFromSummary(summary)[0]?.header ??
      "Standings"
    );
    const order = Number.parseInt(gid, 10);
    out.push({
      header: label,
      entries,
      order: Number.isFinite(order) ? order : undefined,
    });
  }

  for (let i = 0; i < events.length && seenGroupIds.size < MAX_GROUPS; i += BATCH) {
    const chunk = events.slice(i, i + BATCH);
    const summaries = await Promise.all(chunk.map((e) => fetchSummary(e.id)));

    //console.log("[standings debug]", JSON.stringify(summaries[0]?.standings?.groups?.[0]?.standings?.entries?.[0], null, 2));

    summaries.forEach(consume);
  }

  out.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  return out;
}

function buildBlocksFromSingleSummary(
  summary: ESPNSummaryResponse
): StandingsGroupBlock[] {
  const comp = summary.header?.competitions?.[0];
  const entries = firstBlockEntries(summary);
  if (!entries.length) return [];

  const label = numberToGroupLetter(
    groupStandingsLabelFromSummary(summary) ??
    parseStandingsGroupsFromSummary(summary)[0]?.header ??
    "Standings"
  );

  const gid = comp?.groups?.id;
  const order = gid ? Number.parseInt(gid, 10) : undefined;

  return [
    {
      header: label,
      entries,
      order: Number.isFinite(order) ? order : undefined,
    },
  ];
}

async function fetchSummary(
  eventId: string
): Promise<ESPNSummaryResponse | null> {
  try {
    const u = new URL(
      "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/summary"
    );
    u.searchParams.set("event", eventId);

    const res = await fetch(u.toString(), {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as ESPNSummaryResponse;
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const groups = await collectAllGroupStandings();

    return Response.json(
      { groups },
      {
        headers: {
          "Cache-Control": "private, no-store",
        },
      }
    );
  } catch (err) {
    console.error("[/api/standings]", err);
    return Response.json({ error: "Internal error" }, { status: 500 });
  }
}


function numberToGroupLetter(label: string): string {
  return label.replace(/Group\s+(\d+)/i, (_, n) => {
    const letter = String.fromCharCode(64 + Number(n));
    return `Group ${letter}`;
  });
}
