"use client";

import { useEffect, useState } from "react";
import { Map, MapControls, useMap } from "@/components/ui/map";
import { StadiumMarkers } from "./StadiumMarkers";
import { MapLoadingSkeleton } from "./MapLoadingSkeleton";
import type { Match } from "@/types/espn";

// Watches map load state from inside the Map context and notifies parent
function MapLoadedObserver({ onLoad }: { onLoad: () => void }) {
  const { isLoaded } = useMap();

  useEffect(() => {
    if (isLoaded) {
      onLoad();
    }
  }, [isLoaded, onLoad]);

  return null;
}

interface DashboardMapProps {
  matches: Match[];
  onSelectMatch?: (id: string) => void;
}

export function DashboardMap({ matches, onSelectMatch }: DashboardMapProps) {
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  return (
    <div className="relative h-full w-full overflow-hidden">
      {!isMapLoaded && <MapLoadingSkeleton />}
      <Map
        center={[-100, 38]}
        zoom={1}
        // maxBounds={[
        //   [-168, 14],
        //   [-52, 72],
        // ]}
        minZoom={2.5}
        maxZoom={12}
        className="w-full h-full"
      >
        <MapLoadedObserver onLoad={() => setIsMapLoaded(true)} />
        <StadiumMarkers matches={matches} onSelectMatch={onSelectMatch} />
        <MapControls position="bottom-right" showZoom showCompass />
      </Map>
    </div>
  );
}
