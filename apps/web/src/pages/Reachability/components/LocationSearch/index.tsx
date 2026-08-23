import { useCallback, useMemo } from "react";
import { Autocomplete } from "@/components/patterns/Autocomplete";
import { CLEAR_SEARCH_LABEL } from "@/constants/reachability-ui-copy";
import type { LocationSearchProps } from "./index.types";

/** Renders a place search combobox backed by geocoding suggestions. */
export function LocationSearch({
  id,
  query,
  suggestions,
  placeholder,
  disabled,
  onQueryChange,
  onClearLocation,
  onSelectSuggestion,
}: LocationSearchProps) {
  const labels = useMemo(
    () => suggestions.map((item) => item.label),
    [suggestions],
  );

  const handleSelect = useCallback(
    (index: number) => {
      const match = suggestions[index];
      if (match) {
        onSelectSuggestion(match);
      }
    },
    [onSelectSuggestion, suggestions],
  );

  return (
    <Autocomplete
      clearable
      clearLabel={CLEAR_SEARCH_LABEL}
      disabled={disabled}
      id={id}
      onChange={onQueryChange}
      onClear={onClearLocation}
      onSelect={handleSelect}
      placeholder={placeholder}
      suggestions={labels}
      value={query}
    />
  );
}
