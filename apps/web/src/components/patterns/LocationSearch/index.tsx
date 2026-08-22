import { useCallback, useMemo } from "react";
import { Autocomplete } from "@/components/patterns/Autocomplete";
import type { LocationSearchProps } from "./index.types";

/** Place search combobox backed by geocoding suggestions. */
export function LocationSearch({
  id,
  query,
  suggestions,
  placeholder,
  disabled,
  onQueryChange,
  onSelectSuggestion,
}: LocationSearchProps) {
  const labels = useMemo(
    () => suggestions.map((item) => item.label),
    [suggestions],
  );

  const handleSelect = useCallback(
    (label: string) => {
      const match = suggestions.find((item) => item.label === label);
      if (match) {
        onSelectSuggestion(match);
      }
    },
    [onSelectSuggestion, suggestions],
  );

  return (
    <Autocomplete
      disabled={disabled}
      id={id}
      onChange={onQueryChange}
      onSelect={handleSelect}
      placeholder={placeholder}
      suggestions={labels}
      value={query}
    />
  );
}
