import { useCallback, useState } from "react";
import { DEFAULT_MAP_VIEW } from "@/constants/api.constants";
import type { MapViewState } from "@/types/reachability.types";

/** Manages map camera state and bounds-to-fit requests. */
export function useReachabilityMap() {
  const [mapView, setMapView] = useState<MapViewState>(DEFAULT_MAP_VIEW);
  const [boundsToFit, setBoundsToFit] = useState<
    [[number, number], [number, number]] | null
  >(null);

  const clearBoundsToFit = useCallback(() => {
    setBoundsToFit(null);
  }, []);

  return {
    boundsToFit,
    clearBoundsToFit,
    mapView,
    setBoundsToFit,
    setMapView,
  };
}
