import { useCallback, useEffect, useRef, useState } from "react";
import type { IGeocodingService } from "@/services/mapbox-geocoding-service";
import type { GeocodingSuggestion } from "@/types/geocoding.types";
import { parseCoordinates } from "@/utils/parse-coordinates";

/**
 * Debounces forward geocoding for a location search query.
 * @param geocoding Geocoding service port.
 * @param locationQuery Current location search text.
 */
export function useGeocodingSuggestions(
  geocoding: IGeocodingService,
  locationQuery: string,
) {
  const [geocodingSuggestions, setGeocodingSuggestions] = useState<
    GeocodingSuggestion[]
  >([]);
  const geocodeAbortRef = useRef<AbortController | null>(null);

  const clearGeocodingSuggestions = useCallback(() => {
    setGeocodingSuggestions([]);
  }, []);

  useEffect(() => {
    const query = locationQuery.trim();
    if (query.length < 2 || parseCoordinates(query)) {
      setGeocodingSuggestions([]);
      return;
    }

    geocodeAbortRef.current?.abort();
    const controller = new AbortController();
    geocodeAbortRef.current = controller;

    const timer = window.setTimeout(() => {
      geocoding
        .search(query, controller.signal)
        .then((items) => {
          if (!controller.signal.aborted) {
            setGeocodingSuggestions(items);
          }
        })
        .catch(() => {
          if (!controller.signal.aborted) {
            setGeocodingSuggestions([]);
          }
        });
    }, 280);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [geocoding, locationQuery]);

  return { clearGeocodingSuggestions, geocodingSuggestions };
}
