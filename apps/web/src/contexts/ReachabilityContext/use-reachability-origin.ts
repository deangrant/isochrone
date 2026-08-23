import type { Dispatch, SetStateAction } from "react";
import { useCallback, useState } from "react";
import { parseCoordinates } from "@/pages/Reachability/utils/parse-coordinates";
import type { GeocodingSuggestion } from "@/types/geocoding.types";
import type {
  MapViewState,
  ReachabilityOrigin,
} from "@/types/reachability.types";
import type { ReachabilitySettings } from "./index.types";

interface UseReachabilityOriginOptions {
  clearGeocodingSuggestions: () => void;
  mapViewZoom: number;
  setMapView: Dispatch<SetStateAction<MapViewState>>;
  setSettings: (patch: Partial<ReachabilitySettings>) => void;
}

/** Manages the reachability origin and location query interactions. */
export function useReachabilityOrigin({
  setSettings,
  setMapView,
  clearGeocodingSuggestions,
  mapViewZoom,
}: UseReachabilityOriginOptions) {
  const [origin, setOrigin] = useState<ReachabilityOrigin | null>(null);

  const setLocationQuery = useCallback(
    (query: string) => {
      setSettings({ locationQuery: query });

      const parsed = parseCoordinates(query);
      if (parsed) {
        setOrigin(parsed);
        setMapView((current) => ({
          ...current,
          lat: parsed.lat,
          lon: parsed.lon,
        }));
        clearGeocodingSuggestions();
        return;
      }

      setOrigin(null);
    },
    [clearGeocodingSuggestions, setMapView, setSettings],
  );

  const selectGeocodingSuggestion = useCallback(
    (suggestion: GeocodingSuggestion) => {
      setSettings({ locationQuery: suggestion.label });
      setOrigin({ lat: suggestion.lat, lon: suggestion.lon });
      setMapView({
        lat: suggestion.lat,
        lon: suggestion.lon,
        zoom: Math.max(mapViewZoom, 12),
      });
      clearGeocodingSuggestions();
    },
    [clearGeocodingSuggestions, mapViewZoom, setMapView, setSettings],
  );

  return {
    origin,
    selectGeocodingSuggestion,
    setLocationQuery,
  };
}
