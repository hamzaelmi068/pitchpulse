"use client";

import { useEffect, useState } from "react";
import { Map, MapControls, useMap } from "@/components/ui/map";
import { StadiumMarkers } from "./StadiumMarkers";
import { MapLoadingSkeleton } from "./MapLoadingSkeleton";

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

export function DashboardMap() {
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  return (
    <div className="absolute inset-0">
      {!isMapLoaded && <MapLoadingSkeleton />}
      <Map
        theme="dark"
        center={[-100, 38]}
        zoom={3}
        maxBounds={[
          [-168, 14],
          [-52, 72],
        ]}
        minZoom={2.5}
        maxZoom={12}
        className="w-full h-full"
      >
        <MapLoadedObserver onLoad={() => setIsMapLoaded(true)} />
        <StadiumMarkers />
        <MapControls position="bottom-right" showZoom showCompass />
      </Map>
    </div>
  );
}
