import { describe, expect, it } from "vitest";
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
    expect(() => buildContours([])).toThrow(
      "At least one time interval is required.",
    );
  });

  it("throws when more than three intervals are provided", () => {
    expect(() => buildContours([5, 10, 15, 20])).toThrow(
      "At most 3 time intervals are allowed.",
    );
  });

  it("throws when an interval is out of range", () => {
    expect(() => buildContours([0])).toThrow(
      "Each time interval must be between 1 and 60 minutes.",
    );
    expect(() => buildContours([61])).toThrow(
      "Each time interval must be between 1 and 60 minutes.",
    );
  });
});
