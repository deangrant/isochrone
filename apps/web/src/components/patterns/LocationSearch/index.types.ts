import type { GeocodingSuggestion } from "@/services/mapbox-geocoding-service";

/** Props for the LocationSearch pattern. */
export interface LocationSearchProps {
  disabled?: boolean;
  id?: string;
  onQueryChange: (query: string) => void;
  onSelectSuggestion: (suggestion: GeocodingSuggestion) => void;
  placeholder?: string;
  query: string;
  suggestions: GeocodingSuggestion[];
}
