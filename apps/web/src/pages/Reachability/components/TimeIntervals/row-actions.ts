import { MAX_TIME_INTERVALS } from "./index.types";

/** Add/remove affordances for one time-interval row. */
export interface IntervalRowActions {
  showAdd: boolean;
  showRemove: boolean;
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
