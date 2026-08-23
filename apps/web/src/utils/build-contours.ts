import {
  CONTOUR_COLORS,
  MAX_CONTOUR_COUNT,
} from "@/constants/contours.constants";

/** Maximum allowed time interval in minutes. */
export const MAX_TIME_INTERVAL_MINUTES = 60;

/** One contour sent to the reachability API. */
export interface ContourSpec {
  /** Hex color without `#`. */
  color: string;
  /** Time in minutes. */
  time: number;
}

/**
 * Builds contour specs from explicit time intervals in minutes.
 * @param timeIntervals One to three minute values.
 * @throws When intervals are missing, exceed limits, duplicate, or fall outside 1–60 minutes.
 */
export function buildContours(timeIntervals: number[]): ContourSpec[] {
  if (!Array.isArray(timeIntervals) || timeIntervals.length === 0) {
    throw new Error("At least one time interval is required.");
  }
  if (timeIntervals.length > MAX_CONTOUR_COUNT) {
    throw new Error(`At most ${MAX_CONTOUR_COUNT} time intervals are allowed.`);
  }

  const sorted = [...timeIntervals].sort((left, right) => left - right);

  if (sorted.some((time, index) => index > 0 && time === sorted[index - 1])) {
    throw new Error("Time intervals must be unique.");
  }

  return sorted.map((time, index) => {
    if (
      !Number.isFinite(time) ||
      time < 1 ||
      time > MAX_TIME_INTERVAL_MINUTES
    ) {
      throw new Error(
        `Each time interval must be between 1 and ${MAX_TIME_INTERVAL_MINUTES} minutes.`,
      );
    }

    return {
      color: CONTOUR_COLORS[index % CONTOUR_COLORS.length],
      time,
    };
  });
}
