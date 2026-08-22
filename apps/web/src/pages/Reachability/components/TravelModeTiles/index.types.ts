import type { TravelMode } from "@/constants/travel-modes.constants";

/** Props for the travel mode tile picker. */
export interface TravelModeTilesProps {
  /** Disables all tiles. */
  disabled?: boolean;
  /** Called when the user selects a mode. */
  onChange: (value: TravelMode) => void;
  /** Currently selected mode. */
  value: TravelMode;
}
