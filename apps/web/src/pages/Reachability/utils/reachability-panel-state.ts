import type { FeatureCollection } from "geojson";
import type { ReachabilitySettings } from "@/contexts/ReachabilityContext/index.types";
import { DEFAULT_SETTINGS } from "@/contexts/ReachabilityContext/use-reachability-settings-state";
import type { ReachabilityOrigin } from "@/types/reachability.types";

/**
 * Returns whether the panel differs from its default state or has active results.
 */
export function isReachabilityPanelDirty(
  settings: ReachabilitySettings,
  locationQuery: string,
  origin: ReachabilityOrigin | null,
  result: FeatureCollection | null,
): boolean {
  if (locationQuery.length > 0 || origin !== null || result !== null) {
    return true;
  }

  return (
    settings.travelMode !== DEFAULT_SETTINGS.travelMode ||
    settings.denoise !== DEFAULT_SETTINGS.denoise ||
    settings.generalize !== DEFAULT_SETTINGS.generalize ||
    settings.departAtEnabled !== DEFAULT_SETTINGS.departAtEnabled ||
    settings.departAt !== DEFAULT_SETTINGS.departAt ||
    settings.exclude.length !== DEFAULT_SETTINGS.exclude.length ||
    settings.exclude.some(
      (value, index) => value !== DEFAULT_SETTINGS.exclude[index],
    ) ||
    settings.timeIntervals.length !== DEFAULT_SETTINGS.timeIntervals.length ||
    settings.timeIntervals.some(
      (value, index) => value !== DEFAULT_SETTINGS.timeIntervals[index],
    )
  );
}
