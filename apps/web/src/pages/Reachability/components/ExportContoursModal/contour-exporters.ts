import {
  downloadGeoJson,
  type GeoJsonDownloadOptions,
} from "@/services/geojson-download-service";
import {
  downloadWkt,
  type WktDownloadOptions,
} from "@/services/wkt-download-service";
import type { ContourExportFormat } from "./index.types";

type ContourExportOptions = GeoJsonDownloadOptions | WktDownloadOptions;

/** Downloads contours in a supported export format. */
export interface ContourExporter {
  download: (options: ContourExportOptions) => void;
}

/** Registry of contour export handlers keyed by format. */
export const CONTOUR_EXPORTERS: Record<ContourExportFormat, ContourExporter> = {
  geojson: { download: downloadGeoJson },
  wkt: { download: downloadWkt },
};
