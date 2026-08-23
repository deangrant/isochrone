import { MAX_TIME_INTERVALS } from "@/pages/Reachability/components/TimeIntervals/index.types";
import { MAX_TIME_INTERVAL_MINUTES } from "@/utils/build-contours";

/** Add/remove affordances for one time-interval row. */
export interface IntervalRowActions {
  showAdd: boolean;
  showRemove: boolean;
}

/**
 * Returns the next unused minute value after the current intervals.
 * @returns Next unused minute, or null when no unused minute exists.
 */
export function getNextUniqueInterval(intervals: number[]): number | null {
  const used = new Set(intervals);
  const lastValue = intervals.at(-1) ?? 5;
  const candidate = Math.min(lastValue + 5, MAX_TIME_INTERVAL_MINUTES);

  if (!used.has(candidate)) {
    return candidate;
  }

  for (
    let minute = candidate + 1;
    minute <= MAX_TIME_INTERVAL_MINUTES;
    minute += 1
  ) {
    if (!used.has(minute)) {
      return minute;
    }
  }

  for (let minute = 1; minute < candidate; minute += 1) {
    if (!used.has(minute)) {
      return minute;
    }
  }

  return null;
}

/**
 * Derives row action visibility for a time-interval list editor.
 * @param index Zero-based row index.
 * @param intervalCount Total number of intervals in the list.
 */
export function getRowActions(
  index: number,
  intervalCount: number,
): IntervalRowActions {
  const isLast = index === intervalCount - 1;

  return {
    showAdd: isLast && intervalCount < MAX_TIME_INTERVALS,
    showRemove: intervalCount > 1,
  };
}
