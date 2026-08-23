import {
  EXCLUDE_OPTIONS,
  type ExcludeOptionValue,
} from "@/pages/Reachability/constants/exclude-options.constants";

/**
 * Builds a comma-separated exclude string for the Mapbox Isochrone API.
 * @param selected Enabled exclude values.
 */
export function buildExcludeParam(
  selected: readonly ExcludeOptionValue[],
): string | undefined {
  const selectedSet = new Set(selected);
  const ordered: ExcludeOptionValue[] = [];

  for (const option of EXCLUDE_OPTIONS) {
    if (selectedSet.has(option.value)) {
      ordered.push(option.value);
    }
  }

  return ordered.length > 0 ? ordered.join(",") : undefined;
}
