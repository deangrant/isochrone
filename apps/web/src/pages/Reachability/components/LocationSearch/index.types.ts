import type { GeocodingSuggestion } from "@/types/geocoding.types";

/** Props for the LocationSearch pattern. */
export interface LocationSearchProps {
  /** Disables typing and suggestion selection. */
  disabled?: boolean;
  /** Associates the combobox with a label element. */
  id?: string;
  /** Notifies the parent when the start location should be cleared. */
  onClearLocation: () => void;
  /** Notifies the parent when the search query changes. */
  onQueryChange: (query: string) => void;
  /** Notifies the parent when a geocoding suggestion is chosen. */
  onSelectSuggestion: (suggestion: GeocodingSuggestion) => void;
  /** Placeholder text shown when empty. */
  placeholder?: string;
  /** Controlled location search query. */
  query: string;
  /** Geocoding suggestions for the current query. */
  suggestions: GeocodingSuggestion[];
}
