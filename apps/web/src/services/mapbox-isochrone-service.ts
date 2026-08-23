import type { FeatureCollection } from "geojson";
import type {
  IReachabilityClient,
  ReachabilityRequest,
} from "@/types/reachability-client.types";
import type { ContourSpec } from "@/utils/build-contours";

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
  feature: FeatureCollection["features"][number],
  colorByMinute: Map<number, string>,
): FeatureCollection["features"][number] {
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
