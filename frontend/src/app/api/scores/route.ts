import { parseScoreboard } from "@/lib/espn";
import type { ESPNScoreboardResponse } from "@/types/espn";

export const revalidate = 60; // cache for 60 seconds

const ESPN_SCOREBOARD =
  "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard";

export async function GET() {
  try {
    const res = await fetch(ESPN_SCOREBOARD, {
      next: { revalidate },
    });
    if (!res.ok) {
      return Response.json({ error: "Failed to fetch scores" }, { status: 502 });
    }
    const data: ESPNScoreboardResponse = await res.json();
    const matches = parseScoreboard(data);
    return Response.json(
      { matches },
      {
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120",
        },
      }
    );
  } catch (err) {
    console.error("[/api/scores]", err);
    return Response.json(
      { error: "Internal error", detail: String(err) },
      { status: 500 }
    );
  }
}
