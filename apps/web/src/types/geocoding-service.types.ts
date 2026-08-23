import type { GeocodingSuggestion } from "@/types/geocoding.types";

/**
 * Port for forward geocoding place search.
 */
export interface IGeocodingService {
  /** Searches for place suggestions matching a query. */
  search: (
    query: string,
    signal?: AbortSignal,
  ) => Promise<GeocodingSuggestion[]>;
}
