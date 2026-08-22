/** Props for map overlay controls. */
export interface MapControlsProps {
  /** Opens the export options dialog. */
  onExport: () => void;
  /** Fits the map viewport to the current contours. */
  onFitContours: () => void;
}
