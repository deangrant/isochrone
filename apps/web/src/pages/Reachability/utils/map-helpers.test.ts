import { describe, expect, it } from "vitest";
import {
  nearlyEqual,
  normalizeContourCollection,
  originToGeoJson,
} from "@/pages/Reachability/utils/map-helpers";

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

  it("falls back to the default fill when no color properties exist", () => {
    const collection = normalizeContourCollection({
      features: [
        {
          geometry: { coordinates: [], type: "Polygon" },
          properties: {},
          type: "Feature",
        },
      ],
      type: "FeatureCollection",
    });

    expect(collection.features[0]?.properties?.fill).toBe("#3d9b7a");
  });
});

describe("originToGeoJson", () => {
  it("returns an empty collection when origin is null", () => {
    expect(originToGeoJson(null)).toEqual({
      features: [],
      type: "FeatureCollection",
    });
  });

  it("returns a point feature with lon-lat coordinate order", () => {
    expect(originToGeoJson({ lat: 51.5, lon: -0.12 })).toEqual({
      features: [
        {
          geometry: {
            coordinates: [-0.12, 51.5],
            type: "Point",
          },
          properties: {},
          type: "Feature",
        },
      ],
      type: "FeatureCollection",
    });
  });
});

describe("nearlyEqual", () => {
  it("returns true when values differ by less than epsilon", () => {
    expect(nearlyEqual(1, 1.000_000_000_1)).toBe(true);
  });

  it("returns false when values differ by more than epsilon", () => {
    expect(nearlyEqual(1, 1.001)).toBe(false);
  });
});
