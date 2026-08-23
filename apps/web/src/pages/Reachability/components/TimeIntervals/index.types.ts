/** Props for the time interval list editor. */
export interface TimeIntervalsProps {
  /** Disables editing and add/remove actions. */
  disabled?: boolean;
  /** Current minute values. */
  intervals: number[];
  /** Notifies the parent when the interval list changes. */
  onChange: (intervals: number[]) => void;
}
