export const HOUR_OPTIONS = Array.from({ length: 24 }, (_, hour) => ({
  label: String(hour).padStart(2, "0"),
  value: String(hour),
}));

export const MINUTE_OPTIONS = Array.from({ length: 60 }, (_, minute) => ({
  label: String(minute).padStart(2, "0"),
  value: String(minute),
}));

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
