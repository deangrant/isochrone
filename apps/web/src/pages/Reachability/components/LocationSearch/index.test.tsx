import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CLEAR_SEARCH_LABEL } from "@/constants/reachability-ui-copy";
import type { GeocodingSuggestion } from "@/types/geocoding.types";
import { LocationSearch } from "./index";

afterEach(() => {
  cleanup();
});

const SUGGESTIONS: GeocodingSuggestion[] = [
  { label: "London, UK", lat: 51.5, lon: -0.12 },
  { label: "London, UK", lat: 42.98, lon: -81.25 },
];

function LocationSearchHarness({
  onClearLocation,
  onSelectSuggestion,
}: {
  onClearLocation?: () => void;
  onSelectSuggestion: (suggestion: GeocodingSuggestion) => void;
}) {
  const [query, setQuery] = useState("");

  return (
    <LocationSearch
      onClearLocation={onClearLocation ?? vi.fn()}
      onQueryChange={setQuery}
      onSelectSuggestion={onSelectSuggestion}
      query={query}
      suggestions={SUGGESTIONS}
    />
  );
}

describe("LocationSearch", () => {
  it("selects the suggestion at the chosen index when labels duplicate", () => {
    const onSelectSuggestion = vi.fn();

    render(<LocationSearchHarness onSelectSuggestion={onSelectSuggestion} />);

    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "London" } });
    const options = screen.getAllByRole("option");
    fireEvent.click(options[1]);

    expect(onSelectSuggestion).toHaveBeenCalledWith(SUGGESTIONS[1]);
  });

  it("shows a clear button when the query has text and calls onClearLocation", () => {
    const onClearLocation = vi.fn();
    const onSelectSuggestion = vi.fn();

    render(
      <LocationSearch
        onClearLocation={onClearLocation}
        onQueryChange={vi.fn()}
        onSelectSuggestion={onSelectSuggestion}
        query="London"
        suggestions={SUGGESTIONS}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: CLEAR_SEARCH_LABEL }));

    expect(onClearLocation).toHaveBeenCalledTimes(1);
  });
});
