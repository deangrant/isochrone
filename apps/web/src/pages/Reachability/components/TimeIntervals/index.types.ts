import { MAX_CONTOUR_COUNT } from "@/constants/travel-modes.constants";

/** Props for the time interval list editor. */
export interface TimeIntervalsProps {
  /** Disables editing and add/remove actions. */
  disabled?: boolean;
  /** Current minute values. */
  intervals: number[];
  /** Called when the interval list changes. */
  onChange: (intervals: number[]) => void;
}

/** Maximum number of selectable time intervals. */
export const MAX_TIME_INTERVALS = MAX_CONTOUR_COUNT;
