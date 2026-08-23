/** Maximum number of contour rings per request. */
export const MAX_CONTOUR_COUNT = 3;

/** Maximum number of selectable time intervals. */
export const MAX_TIME_INTERVALS = MAX_CONTOUR_COUNT;

/** Teal gradient hex colors for contour rings (without `#`). */
export const CONTOUR_COLORS = [
  "a8e6cf",
  "7fd4b0",
  "3d9b7a",
  "2f7d62",
  "1f5c48",
] as const;
