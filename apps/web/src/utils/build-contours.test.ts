import { describe, expect, it } from "vitest";
import {
  DUPLICATE_TRAVEL_TIMES_MESSAGE,
  MAX_TRAVEL_TIMES_MESSAGE,
  MISSING_TRAVEL_TIME_MESSAGE,
  TRAVEL_TIME_RANGE_MESSAGE,
} from "@/constants/reachability-ui-copy";
import { buildContours } from "@/utils/build-contours";

describe("buildContours", () => {
  it("builds sorted time contours with colors", () => {
    const contours = buildContours([30, 10, 20]);
    expect(contours).toEqual([
      { color: "a8e6cf", time: 10 },
      { color: "7fd4b0", time: 20 },
      { color: "3d9b7a", time: 30 },
    ]);
  });

  it("accepts a single interval", () => {
    const contours = buildContours([15]);
    expect(contours).toEqual([{ color: "a8e6cf", time: 15 }]);
  });

  it("throws when no intervals are provided", () => {
    expect(() => buildContours([])).toThrow(MISSING_TRAVEL_TIME_MESSAGE);
  });

  it("throws when more than three intervals are provided", () => {
    expect(() => buildContours([5, 10, 15, 20])).toThrow(
      MAX_TRAVEL_TIMES_MESSAGE,
    );
  });

  it("throws when an interval is out of range", () => {
    expect(() => buildContours([0])).toThrow(TRAVEL_TIME_RANGE_MESSAGE);
    expect(() => buildContours([61])).toThrow(TRAVEL_TIME_RANGE_MESSAGE);
  });

  it("throws when intervals are duplicated", () => {
    expect(() => buildContours([10, 10])).toThrow(
      DUPLICATE_TRAVEL_TIMES_MESSAGE,
    );
    expect(() => buildContours([5, 10, 10])).toThrow(
      DUPLICATE_TRAVEL_TIMES_MESSAGE,
    );
  });
});
