import type { Feature, FeatureCollection } from "geojson";
import type { ContourSpec } from "@/utils/build-contours";

/** Geographic origin for a reachability calculation. */
export interface ReachabilityOrigin {
  lat: number;
  lon: number;
}

/** Parameters for a Mapbox isochrone request. */
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
  /**
   * Requests isochrone contours for the given parameters.
   * @param request Reachability parameters.
   * @param signal Optional abort signal.
   */
  computeIsochrones: (
    request: ReachabilityRequest,
    signal?: AbortSignal,
  ) => Promise<FeatureCollection>;
}

/**
 * Mapbox Isochrone API client.
 */
export class MapboxIsochroneService implements IReachabilityClient {
  private readonly accessToken: string;

  /**
   * @param accessToken Mapbox public access token.
   */
  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  /**
   * Requests isochrone contours for the given parameters.
   * @param request Reachability parameters.
   * @param signal Optional abort signal.
   */
  async computeIsochrones(
    request: ReachabilityRequest,
    signal?: AbortSignal,
  ): Promise<FeatureCollection> {
    if (request.contours.length === 0) {
      throw new Error("At least one contour is required.");
    }

    const contoursMinutes = request.contours
      .map((contour) => contour.time)
      .join(",");
    const params = new URLSearchParams({
      access_token: this.accessToken,
      contours_minutes: contoursMinutes,
      polygons: "true",
    });

    if (request.denoise !== undefined) {
      params.set("denoise", String(request.denoise));
    }

    if (request.generalize !== undefined && request.generalize > 0) {
      params.set("generalize", String(request.generalize));
    }

    if (request.departAt) {
      params.set("depart_at", request.departAt);
    }

    if (request.exclude) {
      params.set("exclude", request.exclude);
    }

    const contoursColors = request.contours
      .map((contour) => contour.color)
      .join(",");
    if (contoursColors.length > 0) {
      params.set("contours_colors", contoursColors);
    }
    const coordinates = `${request.origin.lon},${request.origin.lat}`;
    const url = `https://api.mapbox.com/isochrone/v1/${request.profile}/${coordinates}?${params}`;

    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      signal,
    });

    if (!response.ok) {
      throw new Error(await readErrorMessage(response));
    }

    const body = (await response.json()) as FeatureCollection;
    if (body.type !== "FeatureCollection") {
      throw new Error("Unexpected response format from Mapbox Isochrone API.");
    }

    return enrichFeatureColors(body, request.contours);
  }
}

function enrichFeatureColors(
  collection: FeatureCollection,
  contours: ContourSpec[],
): FeatureCollection {
  const colorByMinute = new Map(
    contours.map((contour) => [contour.time, contour.color]),
  );

  return {
    ...collection,
    features: collection.features.map((feature) =>
      applyFillColor(feature, colorByMinute),
    ),
  };
}

function applyFillColor(
  feature: Feature,
  colorByMinute: Map<number, string>,
): Feature {
  const contour = feature.properties?.contour;
  if (typeof contour !== "number") {
    return feature;
  }

  const fill = colorByMinute.get(contour);
  if (!fill) {
    return feature;
  }

  return {
    ...feature,
    properties: {
      ...feature.properties,
      fill,
    },
  };
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { message?: string };
    return body.message ?? `Isochrone request failed (${response.status}).`;
  } catch {
    return `Isochrone request failed (${response.status}).`;
  }
}
