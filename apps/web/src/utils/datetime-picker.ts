/** Hour options (00–23) for the time picker select. */
export const HOUR_OPTIONS = Array.from({ length: 24 }, (_, hour) => ({
  label: String(hour).padStart(2, "0"),
  value: String(hour),
}));

/** Minute options (00–59) for the time picker select. */
export const MINUTE_OPTIONS = Array.from({ length: 60 }, (_, minute) => ({
  label: String(minute).padStart(2, "0"),
  value: String(minute),
}));

/**
 * Returns the date used when building a calendar selection for the viewed month.
 * @param viewYear Calendar year being displayed.
 * @param viewMonth Calendar month being displayed (0-based).
 * @param selected Currently selected date, if any.
 */
export function defaultDateForView(
  viewYear: number,
  viewMonth: number,
  selected: Date | null,
): Date {
  if (selected) {
    return selected;
  }

  const today = new Date();
  const day =
    viewYear === today.getFullYear() && viewMonth === today.getMonth()
      ? today.getDate()
      : 1;

  return new Date(viewYear, viewMonth, day, 0, 0);
}
