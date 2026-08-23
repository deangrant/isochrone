import type { ContourExportFormat } from "@/pages/Reachability/types/export.types";

/** One selectable contour export format. */
export interface ContourExportFormatOption {
  format: ContourExportFormat;
  hint: string;
  label: string;
}

/** Supported contour export formats. */
export const EXPORT_FORMAT_OPTIONS: readonly ContourExportFormatOption[] = [
  {
    format: "geojson",
    hint: "Best for web maps and GIS apps",
    label: "GeoJSON",
  },
  {
    format: "wkt",
    hint: "Best for GIS and spatial databases",
    label: "WKT",
  },
] as const;

/** Default export format when the modal opens. */
export const DEFAULT_EXPORT_FORMAT: ContourExportFormat = "geojson";
