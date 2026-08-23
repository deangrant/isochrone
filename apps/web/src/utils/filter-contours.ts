import type { Feature, FeatureCollection } from "geojson";

/**
 * Filters a feature collection to the requested contour indices.
 * @param indices Contour indices to keep, in export order.
 * @throws When a selected index is out of range.
 */
export function filterContours(
  data: FeatureCollection,
  indices: readonly number[],
): FeatureCollection {
  const features: Feature[] = [];

  for (const index of indices) {
    const feature = data.features[index];
    if (!feature) {
      throw new Error("Selected contour index is out of range.");
    }

    features.push(feature);
  }

  return {
    features,
    type: "FeatureCollection",
  };
}
