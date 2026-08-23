import type { FeatureCollection, Geometry } from "geojson";
import { supportsExcludeProfile } from "@/constants/exclude-options.constants";
import type { IReachabilityClient } from "@/services/mapbox-isochrone-service";
import type { ReachabilityOrigin } from "@/types/reachability.types";
import { buildContours, type ContourSpec } from "@/utils/build-contours";
import { buildExcludeParam } from "@/utils/build-exclude-param";
import type { ReachabilitySettings } from "./index.types";

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
        buildError instanceof Error ? buildError.message : "Invalid settings.",
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
        exclude: supportsExcludeProfile(settings.travelMode)
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
    return {
      error:
        calcError instanceof Error ? calcError.message : "Calculation failed.",
      ok: false,
    };
  }
}

/**
 * Computes a bounding box for a feature collection.
 */
export function computeBounds(
  collection: FeatureCollection,
): [[number, number], [number, number]] | null {
  let west = Number.POSITIVE_INFINITY;
  let south = Number.POSITIVE_INFINITY;
  let east = Number.NEGATIVE_INFINITY;
  let north = Number.NEGATIVE_INFINITY;

  for (const feature of collection.features) {
    const coords = extractCoordinates(feature.geometry);
    for (const [lon, lat] of coords) {
      west = Math.min(west, lon);
      south = Math.min(south, lat);
      east = Math.max(east, lon);
      north = Math.max(north, lat);
    }
  }

  if (!Number.isFinite(west)) {
    return null;
  }
  return [
    [west, south],
    [east, north],
  ];
}

function extractCoordinates(geometry: Geometry): [number, number][] {
  switch (geometry.type) {
    case "Point":
      return [geometry.coordinates as [number, number]];
    case "MultiPoint":
    case "LineString":
      return geometry.coordinates as [number, number][];
    case "MultiLineString":
    case "Polygon":
      return geometry.coordinates.flat() as [number, number][];
    case "MultiPolygon":
      return geometry.coordinates.flat(2) as [number, number][];
    case "GeometryCollection":
      return geometry.geometries.flatMap(extractCoordinates);
    default:
      return [];
  }
}
