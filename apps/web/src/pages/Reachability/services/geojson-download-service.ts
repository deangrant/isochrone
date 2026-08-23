import type { FeatureCollection } from "geojson";
import { filterContours } from "@/pages/Reachability/utils/filter-contours";

/** Options for GeoJSON export. */
export interface GeoJsonDownloadOptions {
  /** Optional contour indices to export (0-based). */
  contourIndices?: readonly number[];
  /** Feature collection to download. */
  data: FeatureCollection;
}

/**
 * Triggers a browser download of a GeoJSON file.
 * @param options Export data and optional contour index filter.
 */
export function downloadGeoJson(options: GeoJsonDownloadOptions): void {
  const collection =
    options.contourIndices === undefined
      ? options.data
      : filterContours(options.data, options.contourIndices);

  const blob = new Blob([JSON.stringify(collection, null, 2)], {
    type: "application/geo+json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = buildFilename();
  anchor.click();
  URL.revokeObjectURL(url);
}

/**
 * Builds a timestamped export filename.
 */
export function buildFilename(): string {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  return `reachability-${stamp}.geojson`;
}
