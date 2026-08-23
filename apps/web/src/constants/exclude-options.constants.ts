/** Mapbox isochrone exclude parameter values. */
export type ExcludeOptionValue =
  | "cash_only_tolls"
  | "ferry"
  | "motorway"
  | "toll"
  | "unpaved";

/** One selectable road-type exclusion for driving profiles. */
export interface ExcludeOption {
  /** Accessible label for the exclude toggle. */
  ariaLabel: string;
  /** User-facing title. */
  label: string;
  /** Mapbox exclude value. */
  value: ExcludeOptionValue;
}

/** Driving-profile exclude options supported by the Mapbox Isochrone API. */
export const EXCLUDE_OPTIONS: readonly ExcludeOption[] = [
  {
    ariaLabel: "Avoid motorways",
    label: "Motorway",
    value: "motorway",
  },
  {
    ariaLabel: "Avoid toll roads",
    label: "Toll",
    value: "toll",
  },
  {
    ariaLabel: "Avoid ferries",
    label: "Ferry",
    value: "ferry",
  },
  {
    ariaLabel: "Avoid unpaved roads",
    label: "Unpaved",
    value: "unpaved",
  },
  {
    ariaLabel: "Avoid cash-only tolls",
    label: "Cash-only tolls",
    value: "cash_only_tolls",
  },
] as const;

/**
 * Returns whether the travel mode supports Mapbox exclude parameters.
 * @param travelMode Selected routing profile.
 */
export function supportsExcludeProfile(
  travelMode: "bicycle" | "car" | "pedestrian" | "traffic",
): boolean {
  return travelMode === "car" || travelMode === "traffic";
}
