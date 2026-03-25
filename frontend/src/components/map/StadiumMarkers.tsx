import { MapMarker, MarkerContent, MarkerPopup } from "@/components/ui/map";
import { VENUES, COUNTRY_COLORS } from "@/data/venues";

export function StadiumMarkers() {
  return (
    <>
      {VENUES.map((venue) => (
        <MapMarker
          key={venue.id}
          longitude={venue.longitude}
          latitude={venue.latitude}
        >
          <MarkerContent>
            <div
              className="w-3 h-3 rounded-full border-2 border-white cursor-pointer hover:scale-150 transition-transform duration-150 shadow-lg"
              style={{ backgroundColor: COUNTRY_COLORS[venue.country] }}
            />
          </MarkerContent>
          <MarkerPopup>
            <div className="min-w-[200px] rounded-xl overflow-hidden shadow-2xl border border-white/10">
              {/* Country color accent bar */}
              <div
                className="h-1 w-full"
                style={{ backgroundColor: COUNTRY_COLORS[venue.country] }}
              />
              <div className="p-3 bg-neutral-900 space-y-2">
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
              </div>
            </div>
          </MarkerPopup>
        </MapMarker>
      ))}
    </>
  );
}
