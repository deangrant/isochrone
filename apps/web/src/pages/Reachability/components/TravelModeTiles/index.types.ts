import type { TravelMode } from "@/pages/Reachability/constants/travel-modes.constants";

/** Props for the travel mode tile picker. */
export interface TravelModeTilesProps {
  /** Disables all tiles. */
  disabled?: boolean;
  /** Notifies the parent when the user selects a mode. */
  onChange: (value: TravelMode) => void;
  /** Currently selected mode. */
  value: TravelMode;
}
