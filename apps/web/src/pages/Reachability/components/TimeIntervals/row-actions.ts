import { MAX_TIME_INTERVALS } from "./index.types";

export interface IntervalRowActions {
  showAdd: boolean;
  showRemove: boolean;
}

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
