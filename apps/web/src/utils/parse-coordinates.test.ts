import { describe, expect, it } from "vitest";
import { parseCoordinates } from "@/utils/parse-coordinates";

describe("parseCoordinates", () => {
  it("parses comma-separated coordinates", () => {
    expect(parseCoordinates("51.5, -0.12")).toEqual({ lat: 51.5, lon: -0.12 });
  });

  it("parses space-separated coordinates", () => {
    expect(parseCoordinates("51.5 -0.12")).toEqual({ lat: 51.5, lon: -0.12 });
  });

  it("returns null for invalid input", () => {
    expect(parseCoordinates("not coordinates")).toBeNull();
    expect(parseCoordinates("91, 0")).toBeNull();
    expect(parseCoordinates("")).toBeNull();
  });

  it("accepts boundary latitude and longitude values", () => {
    expect(parseCoordinates("90, 180")).toEqual({ lat: 90, lon: 180 });
    expect(parseCoordinates("-90, -180")).toEqual({ lat: -90, lon: -180 });
  });

  it("rejects values outside the valid latitude and longitude ranges", () => {
    expect(parseCoordinates("90.1, 0")).toBeNull();
    expect(parseCoordinates("0, 180.1")).toBeNull();
  });

  it("parses lon-first input as lat-first (GeoJSON order is not supported)", () => {
    expect(parseCoordinates("-0.12, 51.5")).toEqual({ lat: -0.12, lon: 51.5 });
  });
});
