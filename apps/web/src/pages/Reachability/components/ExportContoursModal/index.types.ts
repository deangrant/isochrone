import type { FeatureCollection } from "geojson";

/** Supported contour export formats. */
export type ContourExportFormat = "geojson" | "wkt";

/** Props for the contour export options dialog. */
export interface ExportContoursModalProps {
  /** Isochrone feature collection to export. */
  contours: FeatureCollection;
  /** Called when the dialog should close. */
  onClose: () => void;
  /** When true the dialog is visible. */
  open: boolean;
  /** User-facing routing profile label for contour tiles. */
  profileLabel: string;
}

/** One selectable contour export option. */
export interface ContourExportOption {
  index: number;
  label: string;
}
