import type { FeatureCollection } from "geojson";
import type { ReachabilitySettings } from "@/contexts/ReachabilityContext/index.types";
import {
  INVALID_SETTINGS_MESSAGE,
  REACH_CALCULATION_FAILED_MESSAGE,
} from "@/pages/Reachability/constants/reachability-ui-copy";
import { travelModeSupportsExclude } from "@/pages/Reachability/constants/travel-modes.constants";
import { buildContours } from "@/pages/Reachability/utils/build-contours";
import { buildExcludeParam } from "@/pages/Reachability/utils/build-exclude-param";
import { computeBounds } from "@/pages/Reachability/utils/geo-bounds";
import type { ReachabilityOrigin } from "@/types/reachability.types";
import type {
  ContourSpec,
  IReachabilityClient,
} from "@/types/reachability-client.types";

/** Result of a reachability calculation attempt. */
export type ReachabilityCalculationResult =
  | {
      bounds: [[number, number], [number, number]] | null;
      ok: true;
      result: FeatureCollection;
    }
  | {
      error: string;
      ok: false;
    };

/**
 * Runs a reachability calculation with the given settings.
 * @param reachability Reachability client port.
 * @param origin Start location for the isochrone request.
 * @param settings Panel settings used to build the request.
 * @param profile Mapbox routing profile identifier.
 * @param signal Optional abort signal for in-flight requests.
 * @returns A discriminated union with either the result or an error message.
 */
export async function runReachabilityCalculation(
  reachability: IReachabilityClient,
  origin: ReachabilityOrigin,
  settings: ReachabilitySettings,
  profile: string,
  signal?: AbortSignal,
): Promise<ReachabilityCalculationResult> {
  let contours: ContourSpec[];
  try {
    contours = buildContours(settings.timeIntervals);
  } catch (buildError) {
    return {
      error:
        buildError instanceof Error
          ? buildError.message
          : INVALID_SETTINGS_MESSAGE,
      ok: false,
    };
  }

  try {
    const result = await reachability.computeIsochrones(
      {
        contours,
        denoise: settings.denoise,
        departAt:
          settings.departAtEnabled && settings.departAt
            ? settings.departAt
            : undefined,
        exclude: travelModeSupportsExclude(settings.travelMode)
          ? buildExcludeParam(settings.exclude)
          : undefined,
        generalize: settings.generalize,
        origin,
        profile,
      },
      signal,
    );
    return {
      bounds: computeBounds(result),
      ok: true,
      result,
    };
  } catch (calcError) {
    if (signal?.aborted) {
      throw calcError;
    }

    return {
      error:
        calcError instanceof Error
          ? calcError.message
          : REACH_CALCULATION_FAILED_MESSAGE,
      ok: false,
    };
  }
}
