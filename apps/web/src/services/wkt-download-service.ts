import type { FeatureCollection } from "geojson";
import { filterContours } from "@/utils/filter-contours";
import { featureCollectionToWkt } from "@/utils/geojson-to-wkt";

/** Options for WKT export. */
export interface WktDownloadOptions {
  /** Optional contour indices to export (0-based). */
  contourIndices?: readonly number[];
  /** Feature collection to download. */
  data: FeatureCollection;
}

/**
 * Triggers a browser download of a WKT file.
 * @param options Export data and optional contour index filter.
 */
export function downloadWkt(options: WktDownloadOptions): void {
  const collection =
    options.contourIndices === undefined
      ? options.data
      : filterContours(options.data, options.contourIndices);

  const blob = new Blob([featureCollectionToWkt(collection)], {
    type: "text/plain",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = buildWktFilename();
  anchor.click();
  URL.revokeObjectURL(url);
}

/**
 * Builds a timestamped WKT export filename.
 */
export function buildWktFilename(): string {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  return `reachability-${stamp}.wkt`;
}
