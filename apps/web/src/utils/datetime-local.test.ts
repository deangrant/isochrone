import { describe, expect, it } from "vitest";
import {
  formatDateTimeLocal,
  getMonthCalendarDays,
  parseDateTimeLocal,
} from "@/utils/datetime-local";

describe("formatDateTimeLocal", () => {
  it("formats a date with zero-padded month, day, hours, and minutes", () => {
    const date = new Date(2026, 7, 22, 9, 5);

    expect(formatDateTimeLocal(date)).toBe("2026-08-22T09:05");
  });
});

describe("parseDateTimeLocal", () => {
  it("parses a valid datetime-local value", () => {
    const date = parseDateTimeLocal("2026-08-22T09:05");

    expect(date).toEqual(new Date(2026, 7, 22, 9, 5));
  });

  it("returns null for invalid values", () => {
    expect(parseDateTimeLocal("")).toBeNull();
    expect(parseDateTimeLocal("2026-13-01T09:05")).toBeNull();
  });
});

describe("getMonthCalendarDays", () => {
  it("pads the first week with null cells", () => {
    const days = getMonthCalendarDays(2026, 7);

    expect(days.slice(0, 7)).toEqual([null, null, null, null, null, 1, 2]);
    expect(days.at(-1)).toBeNull();
    expect(days.length % 7).toBe(0);
  });
});
