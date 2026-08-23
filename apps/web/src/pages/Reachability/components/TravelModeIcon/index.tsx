import type { ReactElement } from "react";
import type { TravelMode } from "@/pages/Reachability/constants/travel-modes.constants";
import type { TravelModeIconProps } from "./index.types";

const TRAVEL_MODE_ICONS: Record<TravelMode, () => ReactElement> = {
  bicycle: () => (
    <svg
      aria-hidden="true"
      fill="none"
      height="22"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.75"
      viewBox="0 0 24 24"
      width="22"
    >
      <circle cx="5.5" cy="17.5" r="3.5" />
      <circle cx="18.5" cy="17.5" r="3.5" />
      <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
      <path d="M12 17.5V9l3-3h2l-3 5" />
      <path d="m9 17.5 3-3.5 3.5 3.5" />
    </svg>
  ),
  car: () => (
    <svg
      aria-hidden="true"
      fill="none"
      height="22"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.75"
      viewBox="0 0 24 24"
      width="22"
    >
      <path d="M5 17h14v-5l-2-5H7l-2 5v5z" />
      <circle cx="7.5" cy="17" r="1.5" />
      <circle cx="16.5" cy="17" r="1.5" />
    </svg>
  ),
  pedestrian: () => (
    <svg
      aria-hidden="true"
      fill="none"
      height="22"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.75"
      viewBox="0 0 24 24"
      width="22"
    >
      <circle cx="12" cy="4.5" r="2" />
      <path d="M10 9.5 8 22" />
      <path d="m14 9.5 2 12.5" />
      <path d="m8 13.5 8-1" />
      <path d="m16 13.5-8-1" />
    </svg>
  ),
  traffic: () => (
    <svg
      aria-hidden="true"
      fill="none"
      height="22"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.75"
      viewBox="0 0 24 24"
      width="22"
    >
      <path d="M5 17h14v-5l-2-5H7l-2 5v5z" />
      <circle cx="7.5" cy="17" r="1.5" />
      <circle cx="16.5" cy="17" r="1.5" />
      <path d="M8 6h8" />
      <path d="M9 4h6" />
      <path d="M10 2h4" />
    </svg>
  ),
};

/** Renders the SVG icon for a travel mode tile. */
export function TravelModeIcon({ mode }: TravelModeIconProps) {
  return TRAVEL_MODE_ICONS[mode]();
}
