import type { FeatureCollection, Geometry, Position } from "geojson";

const COORD_PRECISION = 6;

/**
 * Converts a GeoJSON feature collection to WKT.
 * @throws When the collection is empty or a feature lacks geometry.
 */
export function featureCollectionToWkt(collection: FeatureCollection): string {
  if (collection.features.length === 0) {
    throw new Error("At least one feature is required for WKT export.");
  }

  if (collection.features.length === 1) {
    const geometry = collection.features[0]?.geometry;
    if (!geometry) {
      throw new Error("Feature geometry is required for WKT export.");
    }

    return geometryToWkt(geometry);
  }

  const geometries = collection.features.map((feature) => {
    if (!feature.geometry) {
      throw new Error("Feature geometry is required for WKT export.");
    }

    return geometryToWkt(feature.geometry);
  });

  return `GEOMETRYCOLLECTION(${geometries.join(", ")})`;
}

/**
 * Converts a GeoJSON geometry to WKT.
 * @throws When the geometry type is not supported for WKT export.
 */
export function geometryToWkt(geometry: Geometry): string {
  switch (geometry.type) {
    case "Point":
      return `POINT (${formatPosition(geometry.coordinates)})`;
    case "MultiPoint":
      return `MULTIPOINT (${geometry.coordinates
        .map((position) => `(${formatPosition(position)})`)
        .join(", ")})`;
    case "LineString":
      return `LINESTRING (${formatPositions(geometry.coordinates)})`;
    case "MultiLineString":
      return `MULTILINESTRING (${geometry.coordinates
        .map((line) => `(${formatPositions(line)})`)
        .join(", ")})`;
    case "Polygon":
      return `POLYGON (${geometry.coordinates
        .map((ring) => `(${formatPositions(ring)})`)
        .join(", ")})`;
    case "MultiPolygon":
      return `MULTIPOLYGON (${geometry.coordinates
        .map(
          (polygon) =>
            `(${polygon.map((ring) => `(${formatPositions(ring)})`).join(", ")})`,
        )
        .join(", ")})`;
    case "GeometryCollection":
      return `GEOMETRYCOLLECTION(${geometry.geometries
        .map((entry) => geometryToWkt(entry))
        .join(", ")})`;
    default:
      throw new Error("Unsupported geometry type for WKT export.");
  }
}

function formatPositions(positions: Position[]): string {
  return positions.map((position) => formatPosition(position)).join(", ");
}

function formatPosition(position: Position): string {
  const [lon, lat] = position;
  return `${formatCoord(lon)} ${formatCoord(lat)}`;
}

function formatCoord(value: number): string {
  return Number(value.toFixed(COORD_PRECISION)).toString();
}
