/** UI travel mode identifiers. */
export type TravelMode = "bicycle" | "car" | "pedestrian" | "traffic";

/** One selectable travel mode for the panel. */
export interface TravelModeOption {
  /** User-facing label. */
  label: string;
  /** Mapbox isochrone profile. */
  profile: string;
  /** UI value key. */
  value: TravelMode;
}

/** Supported travel modes and their Mapbox profile mappings. */
export const TRAVEL_MODE_OPTIONS: readonly TravelModeOption[] = [
  {
    label: "Driving",
    profile: "mapbox/driving",
    value: "car",
  },
  {
    label: "Traffic",
    profile: "mapbox/driving-traffic",
    value: "traffic",
  },
  {
    label: "Walking",
    profile: "mapbox/walking",
    value: "pedestrian",
  },
  {
    label: "Cycling",
    profile: "mapbox/cycling",
    value: "bicycle",
  },
] as const;

/**
 * Returns the user-facing label for a travel mode.
 * @param mode Travel mode value.
 */
export function getTravelModeLabel(mode: TravelMode): string {
  return (
    TRAVEL_MODE_OPTIONS.find((option) => option.value === mode)?.label ??
    "Unknown profile"
  );
}

/** Maximum number of contour rings per request. */
export const MAX_CONTOUR_COUNT = 3;

/** Teal gradient hex colors for contour rings (without `#`). */
export const CONTOUR_COLORS = [
  "a8e6cf",
  "7fd4b0",
  "3d9b7a",
  "2f7d62",
  "1f5c48",
] as const;
