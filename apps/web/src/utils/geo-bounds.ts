import type { FeatureCollection, Geometry } from "geojson";

/**
 * Computes a bounding box for a feature collection.
 * @returns `null` when the collection has no coordinates.
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
