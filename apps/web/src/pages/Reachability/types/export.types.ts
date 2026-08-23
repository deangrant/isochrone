import type { FeatureCollection } from "geojson";

/** Supported contour export formats. */
export type ContourExportFormat = "geojson" | "wkt";

/** Props for the contour export options dialog. */
export interface ExportContoursModalProps {
  /** Isochrone feature collection to export. */
  contours: FeatureCollection;
  /** Notifies the parent that the dialog should close. */
  onClose: () => void;
  /** When true the dialog is visible. */
  open: boolean;
  /** User-facing routing profile label for contour tiles. */
  profileLabel: string;
}

/** One selectable contour export option. */
export interface ContourExportOption {
  /** Zero-based contour index in the source feature collection. */
  index: number;
  /** User-facing label for the export tile. */
  label: string;
}
