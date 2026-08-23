import { describe, expect, it } from "vitest";
import { normalizeContourCollection } from "@/pages/Reachability/utils/map-helpers";

describe("normalizeContourCollection", () => {
  it("keeps fill values that already include a hash", () => {
    const collection = normalizeContourCollection({
      features: [
        {
          geometry: { coordinates: [], type: "Polygon" },
          properties: { fill: "#4286f4" },
          type: "Feature",
        },
      ],
      type: "FeatureCollection",
    });

    expect(collection.features[0]?.properties?.fill).toBe("#4286f4");
  });

  it("adds a hash to fill values without one", () => {
    const collection = normalizeContourCollection({
      features: [
        {
          geometry: { coordinates: [], type: "Polygon" },
          properties: { fill: "a8e6cf" },
          type: "Feature",
        },
      ],
      type: "FeatureCollection",
    });

    expect(collection.features[0]?.properties?.fill).toBe("#a8e6cf");
  });

  it("falls back to color when fill is missing", () => {
    const collection = normalizeContourCollection({
      features: [
        {
          geometry: { coordinates: [], type: "Polygon" },
          properties: { color: "#04e813" },
          type: "Feature",
        },
      ],
      type: "FeatureCollection",
    });

    expect(collection.features[0]?.properties?.fill).toBe("#04e813");
  });
});
