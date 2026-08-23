/** UI travel mode identifiers. */
export type TravelMode = "bicycle" | "car" | "pedestrian" | "traffic";

/** One selectable travel mode for the panel. */
export interface TravelModeOption {
  /** User-facing label. */
  label: string;
  /** Mapbox isochrone profile. */
  profile: string;
  /** When true, Mapbox exclude parameters apply to this mode. */
  supportsExclude: boolean;
  /** UI value key. */
  value: TravelMode;
}

/** Supported travel modes and their Mapbox profile mappings. */
export const TRAVEL_MODE_OPTIONS: readonly TravelModeOption[] = [
  {
    label: "Driving",
    profile: "mapbox/driving",
    supportsExclude: true,
    value: "car",
  },
  {
    label: "Traffic",
    profile: "mapbox/driving-traffic",
    supportsExclude: true,
    value: "traffic",
  },
  {
    label: "Walking",
    profile: "mapbox/walking",
    supportsExclude: false,
    value: "pedestrian",
  },
  {
    label: "Cycling",
    profile: "mapbox/cycling",
    supportsExclude: false,
    value: "bicycle",
  },
] as const;

/**
 * Returns the travel mode option for a mode value.
 * @param mode Travel mode value.
 */
export function getTravelModeOption(
  mode: TravelMode,
): TravelModeOption | undefined {
  return TRAVEL_MODE_OPTIONS.find((option) => option.value === mode);
}

/**
 * Returns the user-facing label for a travel mode.
 * @param mode Travel mode value.
 */
export function getTravelModeLabel(mode: TravelMode): string {
  const option = getTravelModeOption(mode);
  if (!option) {
    return "Unknown travel mode";
  }
  return option.label;
}

/**
 * Returns whether the travel mode supports Mapbox exclude parameters.
 * @param mode Travel mode value.
 */
export function travelModeSupportsExclude(mode: TravelMode): boolean {
  const option = getTravelModeOption(mode);
  if (!option) {
    return false;
  }
  return option.supportsExclude;
}
