import { describe, expect, it } from "vitest";
import { featureCollectionToWkt, geometryToWkt } from "@/utils/geojson-to-wkt";

describe("geometryToWkt", () => {
  it("formats a polygon", () => {
    expect(
      geometryToWkt({
        coordinates: [
          [
            [0, 0],
            [1, 0],
            [1, 1],
            [0, 0],
          ],
        ],
        type: "Polygon",
      }),
    ).toBe("POLYGON ((0 0, 1 0, 1 1, 0 0))");
  });

  it("formats a point", () => {
    expect(
      geometryToWkt({
        coordinates: [-0.12, 51.5],
        type: "Point",
      }),
    ).toBe("POINT (-0.12 51.5)");
  });
});

describe("featureCollectionToWkt", () => {
  it("returns a single geometry WKT for one feature", () => {
    expect(
      featureCollectionToWkt({
        features: [
          {
            geometry: {
              coordinates: [
                [
                  [0, 0],
                  [1, 0],
                  [1, 1],
                  [0, 0],
                ],
              ],
              type: "Polygon",
            },
            properties: {},
            type: "Feature",
          },
        ],
        type: "FeatureCollection",
      }),
    ).toBe("POLYGON ((0 0, 1 0, 1 1, 0 0))");
  });

  it("returns a geometry collection for multiple features", () => {
    expect(
      featureCollectionToWkt({
        features: [
          {
            geometry: {
              coordinates: [0, 0],
              type: "Point",
            },
            properties: {},
            type: "Feature",
          },
          {
            geometry: {
              coordinates: [
                [
                  [0, 0],
                  [1, 0],
                  [1, 1],
                  [0, 0],
                ],
              ],
              type: "Polygon",
            },
            properties: {},
            type: "Feature",
          },
        ],
        type: "FeatureCollection",
      }),
    ).toBe("GEOMETRYCOLLECTION(POINT (0 0), POLYGON ((0 0, 1 0, 1 1, 0 0)))");
  });

  it("throws when the collection has no features", () => {
    expect(() =>
      featureCollectionToWkt({
        features: [],
        type: "FeatureCollection",
      }),
    ).toThrow("At least one feature is required for WKT export.");
  });
});
