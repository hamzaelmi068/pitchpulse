import { MapMarker, MarkerContent, MarkerPopup } from "@/components/ui/map";
import { VENUES, COUNTRY_COLORS } from "@/data/venues";
import type { Match } from "@/types/espn";

interface StadiumMarkersProps {
  matches: Match[];
  onSelectMatch?: (id: string) => void;
}

function MatchPopupSection({ match }: { match: Match }) {
  const isLive = match.state === "in";
  const isFinished = match.state === "post";

  return (
    <div className="border-t border-neutral-800 pt-2 mt-2">
      {/* Status */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-neutral-500 uppercase tracking-wider">
          {isLive ? "Live" : isFinished ? "Full Time" : "Upcoming"}
        </span>
        {isLive && (
          <span className="flex items-center gap-1 text-[10px] font-bold text-red-400">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            {match.displayClock}
          </span>
        )}
        {!isLive && (
          <span className="text-[10px] text-neutral-500">{match.statusDetail}</span>
        )}
      </div>

      {/* Teams */}
      <div className="space-y-1">
        {[match.homeTeam, match.awayTeam].map((team) => (
          <div key={team.id} className="flex items-center gap-2">
            {team.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={team.logo}
                alt={team.abbreviation}
                width={16}
                height={16}
                className="w-4 h-4 object-contain flex-shrink-0"
              />
            ) : (
              <div className="w-4 h-4 rounded-full bg-neutral-700 flex-shrink-0" />
            )}
            <span className="flex-1 text-xs text-neutral-300 font-medium">
              {team.abbreviation}
            </span>
            <span className="text-xs font-bold tabular-nums text-neutral-200">
              {match.state === "pre" ? "-" : team.score}
            </span>
          </div>
        ))}
      </div>

      {match.broadcast && (
        <p className="mt-2 text-[10px] text-neutral-600">{match.broadcast}</p>
      )}
    </div>
  );
}

export function StadiumMarkers({ matches, onSelectMatch }: StadiumMarkersProps) {
  // Build a map of venueId → match for O(1) lookup
  const matchByVenueId = new Map<string, Match>();
  for (const match of matches) {
    if (match.venueId) matchByVenueId.set(match.venueId, match);
  }

  return (
    <>
      {VENUES.map((venue) => {
        const match = matchByVenueId.get(venue.id);
        const isLive = match?.state === "in";

        return (
          <MapMarker
            key={venue.id}
            longitude={venue.longitude}
            latitude={venue.latitude}
          >
            <MarkerContent>
              <div className="relative">
                <div
                  className="w-3 h-3 rounded-full border-2 border-white cursor-pointer hover:scale-150 transition-transform duration-150 shadow-lg"
                  style={{ backgroundColor: COUNTRY_COLORS[venue.country] }}
                />
                {/* Pulse ring when a match is live at this venue */}
                {isLive && (
                  <span
                    className="absolute inset-0 rounded-full animate-ping opacity-75"
                    style={{ backgroundColor: COUNTRY_COLORS[venue.country] }}
                  />
                )}
              </div>
            </MarkerContent>

            <MarkerPopup>
              <div className="min-w-[210px] rounded-xl overflow-hidden shadow-2xl border border-white/10">
                <div
                  className="h-1 w-full"
                  style={{ backgroundColor: COUNTRY_COLORS[venue.country] }}
                />
                <div className="p-3 bg-neutral-900 space-y-2">
                  {/* Venue info */}
                  <div>
                    <p className="font-semibold text-sm text-white leading-tight">
                      {venue.name}
                    </p>
                    <p className="text-xs text-neutral-400 mt-0.5">{venue.city}</p>
                  </div>
                  <div className="border-t border-neutral-800 pt-2 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-neutral-500">Capacity</span>
                      <span className="text-xs font-mono text-neutral-200">
                        {venue.capacity.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-neutral-500">Country</span>
                      <span
                        className="text-xs font-semibold"
                        style={{ color: COUNTRY_COLORS[venue.country] }}
                      >
                        {venue.country}
                      </span>
                    </div>
                  </div>

                  {/* Match data if available */}
                  {match && <MatchPopupSection match={match} />}
                  {match && onSelectMatch && (
                    <button
                      type="button"
                      onClick={() => onSelectMatch(match.id)}
                      className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-neutral-100 transition hover:bg-white/10"
                    >
                      Open Match Detail
                    </button>
                  )}
                </div>
              </div>
            </MarkerPopup>
          </MapMarker>
        );
      })}
    </>
  );
}
