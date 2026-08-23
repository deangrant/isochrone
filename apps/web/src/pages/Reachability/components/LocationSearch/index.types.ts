import type { GeocodingSuggestion } from "@/types/geocoding.types";

/** Props for the LocationSearch pattern. */
export interface LocationSearchProps {
  disabled?: boolean;
  id?: string;
  onClearLocation: () => void;
  onQueryChange: (query: string) => void;
  onSelectSuggestion: (suggestion: GeocodingSuggestion) => void;
  placeholder?: string;
  query: string;
  suggestions: GeocodingSuggestion[];
}
