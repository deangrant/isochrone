import type { ContourExportFormat } from "./index.types";

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
    hint: "Feature collection for web maps and GIS tools",
    label: "GeoJSON",
  },
  {
    format: "wkt",
    hint: "Well-Known Text for GIS and spatial tools",
    label: "WKT",
  },
] as const;

/** Default export format when the modal opens. */
export const DEFAULT_EXPORT_FORMAT: ContourExportFormat = "geojson";
