/** Short weekday labels for calendar headers (Monday start). */
export const WEEKDAY_LABELS = [
  "Mo",
  "Tu",
  "We",
  "Th",
  "Fr",
  "Sa",
  "Su",
] as const;

const DATE_TIME_LOCAL_PATTERN = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/;

const DATE_TIME_DISPLAY_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  month: "short",
  year: "numeric",
});

const MONTH_HEADING_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  month: "long",
  year: "numeric",
});

/** Formats a date for Mapbox depart_at and internal storage. */
export function formatDateTimeLocal(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/** Formats a date for display in the depart-at trigger. */
export function formatDateTimeDisplay(date: Date): string {
  return DATE_TIME_DISPLAY_FORMATTER.format(date);
}

/**
 * Parses a datetime-local value into a Date.
 * @returns Parsed date, or null when the value is invalid.
 */
export function parseDateTimeLocal(value: string): Date | null {
  const match = DATE_TIME_LOCAL_PATTERN.exec(value);
  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hours = Number(match[4]);
  const minutes = Number(match[5]);
  const date = new Date(year, month - 1, day, hours, minutes);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day ||
    date.getHours() !== hours ||
    date.getMinutes() !== minutes
  ) {
    return null;
  }

  return date;
}

/** Returns day numbers for a month grid with leading empty cells. */
export function getMonthCalendarDays(
  year: number,
  month: number,
): (number | null)[] {
  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = Array.from(
    { length: startOffset },
    () => null,
  );

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(day);
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
}

/** Formats a month heading for the calendar popover. */
export function formatMonthHeading(year: number, month: number): string {
  return MONTH_HEADING_FORMATTER.format(new Date(year, month, 1));
}
