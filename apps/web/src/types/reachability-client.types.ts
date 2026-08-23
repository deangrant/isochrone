import type { FeatureCollection } from "geojson";
import type { ReachabilityOrigin } from "@/types/reachability.types";

/** One contour sent to the reachability API. */
export interface ContourSpec {
  /** Hex color without `#`. */
  color: string;
  /** Time in minutes. */
  time: number;
}

/** Parameters for a reachability isochrone request. */
export interface ReachabilityRequest {
  contours: ContourSpec[];
  /** Mapbox denoise factor (0–1). */
  denoise?: number;
  /** ISO 8601 local departure time for Mapbox depart_at. */
  departAt?: string;
  /** Comma-separated Mapbox exclude values. */
  exclude?: string;
  /** Douglas-Peucker tolerance in metres (omit when 0). */
  generalize?: number;
  origin: ReachabilityOrigin;
  profile: string;
}

/**
 * Port for computing reachability isochrones.
 */
export interface IReachabilityClient {
  /** Requests isochrone contours for the given parameters. */
  computeIsochrones: (
    request: ReachabilityRequest,
    signal?: AbortSignal,
  ) => Promise<FeatureCollection>;
}
