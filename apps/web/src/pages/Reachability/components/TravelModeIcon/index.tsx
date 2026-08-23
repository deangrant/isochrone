import { renderTravelModeIcon } from "@/constants/travel-mode-icons";
import type { TravelModeIconProps } from "./index.types";

/** Renders the SVG icon for a travel mode tile. */
export function TravelModeIcon({ mode }: TravelModeIconProps) {
  return renderTravelModeIcon(mode);
}
