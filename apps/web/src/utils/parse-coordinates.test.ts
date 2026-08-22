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
});
