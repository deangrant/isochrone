/** One geocoding suggestion from a forward geocoding search. */
export interface GeocodingSuggestion {
  /** Display label. */
  label: string;
  /** Latitude. */
  lat: number;
  /** Longitude. */
  lon: number;
}
