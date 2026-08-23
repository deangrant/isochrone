/** Props for map overlay controls. */
export interface MapControlsProps {
  /** Opens the export options dialog. */
  onExport?: () => void;
  /** Fits the map viewport to the current contours. */
  onFitContours?: () => void;
  /** Opens the in-app help dialog. */
  onHelp: () => void;
  /** When true, shows fit and export controls after results exist. */
  showResultControls?: boolean;
}
