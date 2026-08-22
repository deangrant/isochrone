import type { FeatureCollection } from "geojson";
import type { GeoJSONSource, Source } from "mapbox-gl";

const DEFAULT_FILL_COLOR = "#3d9b7a";

/** Narrows a Mapbox source to GeoJSON when present. */
export function isGeoJsonSource(
  source: Source | undefined,
): source is GeoJSONSource {
  return source !== undefined && source.type === "geojson";
}

/** True when two numbers differ by less than epsilon. */
export function nearlyEqual(a: number, b: number, epsilon = 1e-9): boolean {
  return Math.abs(a - b) < epsilon;
}

/**
 * Normalizes upstream contour features for map styling.
 * @param collection Raw reachability GeoJSON.
 */
export function normalizeContourCollection(
  collection: FeatureCollection,
): FeatureCollection {
  return {
    features: collection.features.map((feature) => ({
      ...feature,
      properties: {
        ...feature.properties,
        fill: resolveFillColor(feature.properties),
      },
    })),
    type: "FeatureCollection",
  };
}

function resolveFillColor(
  properties: FeatureCollection["features"][number]["properties"],
): string {
  if (!properties) {
    return DEFAULT_FILL_COLOR;
  }

  const { color, fill } = properties;

  if (typeof fill === "string") {
    return toHexColor(fill);
  }

  if (typeof color === "string") {
    return toHexColor(color);
  }

  return DEFAULT_FILL_COLOR;
}

function toHexColor(value: string): string {
  return value.startsWith("#") ? value : `#${value}`;
}

/**
 * Builds a point feature for the origin marker.
 * @param origin Origin coordinates or null.
 */
export function originToGeoJson(
  origin: { lat: number; lon: number } | null,
): FeatureCollection {
  if (!origin) {
    return { features: [], type: "FeatureCollection" };
  }
  return {
    features: [
      {
        geometry: {
          coordinates: [origin.lon, origin.lat],
          type: "Point",
        },
        properties: {},
        type: "Feature",
      },
    ],
    type: "FeatureCollection",
  };
}
