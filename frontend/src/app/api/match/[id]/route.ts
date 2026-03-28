import { parseSummary } from "@/lib/espn";
import type { ESPNSummaryResponse } from "@/types/espn";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const res = await fetch(
      `https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/summary?event=${id}`
    );
    if (!res.ok) {
      return Response.json({ error: "Failed to fetch match" }, { status: 502 });
    }
    const data: ESPNSummaryResponse = await res.json();
    const detail = parseSummary(data);
    return Response.json({ detail });
  } catch (err) {
    console.error("[/api/match/[id]]", err);
    return Response.json({ error: "Internal error" }, { status: 500 });
  }
}
