import type { Feature, FeatureCollection } from "geojson";
import type { ContourExportOption } from "@/pages/Reachability/components/ExportContoursModal/index.types";

function contourMinutesForSort(feature: Feature): number {
  const contourMinutes = feature.properties?.contour;
  return typeof contourMinutes === "number"
    ? contourMinutes
    : Number.POSITIVE_INFINITY;
}

/**
 * Builds export options from an isochrone feature collection.
 * @param contours Reachability contour features.
 * @param profileLabel User-facing routing profile label.
 */
export function buildContourExportOptions(
  contours: FeatureCollection,
  profileLabel: string,
): ContourExportOption[] {
  const indexedFeatures = contours.features.map((feature, index) => ({
    feature,
    index,
  }));

  indexedFeatures.sort((left, right) => {
    const minutesDelta =
      contourMinutesForSort(left.feature) -
      contourMinutesForSort(right.feature);
    if (minutesDelta !== 0) {
      return minutesDelta;
    }

    return left.index - right.index;
  });

  return indexedFeatures.map(({ feature, index }) => {
    const contourMinutes = feature.properties?.contour;
    const minutesLabel =
      typeof contourMinutes === "number"
        ? `${contourMinutes} min`
        : "time interval unknown";

    return {
      index,
      label: `${profileLabel}, ${minutesLabel}`,
    };
  });
}

/**
 * Returns every contour index for a feature collection.
 * @param contours Reachability contour features.
 */
export function allContourIndices(contours: FeatureCollection): number[] {
  return contours.features.map((_, index) => index);
}
