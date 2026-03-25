import { VENUES, COUNTRY_COLORS, COUNTRY_FLAGS } from "@/data/venues";
import { type Country } from "@/types/venue";

const COUNTRIES: Country[] = ["USA", "Canada", "Mexico"];

const STATS = [
  { label: "Host Venues", value: "16" },
  { label: "Countries", value: "3" },
  { label: "Total Matches", value: "104" },
];

export function StatsPanel() {
  const venuesByCountry = COUNTRIES.map((country) => ({
    country,
    count: VENUES.filter((v) => v.country === country).length,
  }));

  return (
    <div className="absolute bottom-8 left-6 z-10 w-56 rounded-xl border border-white/10 bg-neutral-900/80 backdrop-blur-md shadow-2xl overflow-hidden">
      {/* Title */}
      <div className="px-4 pt-3 pb-2 border-b border-white/5">
        <p className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
          Tournament Overview
        </p>
      </div>

      {/* Stats */}
      <div className="px-4 py-3 space-y-2">
        {STATS.map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between">
            <span className="text-xs text-neutral-400">{label}</span>
            <span className="text-sm font-semibold text-white tabular-nums">
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Country legend */}
      <div className="px-4 pt-2 pb-3 border-t border-white/5 space-y-1.5">
        {venuesByCountry.map(({ country, count }) => (
          <div key={country} className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: COUNTRY_COLORS[country] }}
            />
            <span className="text-xs text-neutral-300 flex-1">{country}</span>
            <span className="text-xs text-neutral-500 tabular-nums">
              {COUNTRY_FLAGS[country]} {count} venues
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
