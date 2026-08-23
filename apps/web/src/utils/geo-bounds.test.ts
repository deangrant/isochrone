import type { FeatureCollection } from "geojson";
import { describe, expect, it } from "vitest";
import { computeBounds } from "@/utils/geo-bounds";

describe("computeBounds", () => {
  it("returns null for an empty feature collection", () => {
    const collection: FeatureCollection = {
      features: [],
      type: "FeatureCollection",
    };

    expect(computeBounds(collection)).toBeNull();
  });

  it("computes bounds for a point feature", () => {
    const collection: FeatureCollection = {
      features: [
        {
          geometry: { coordinates: [-0.12, 51.5], type: "Point" },
          properties: {},
          type: "Feature",
        },
      ],
      type: "FeatureCollection",
    };

    expect(computeBounds(collection)).toEqual([
      [-0.12, 51.5],
      [-0.12, 51.5],
    ]);
  });

  it("computes bounds for a polygon feature", () => {
    const collection: FeatureCollection = {
      features: [
        {
          geometry: {
            coordinates: [
              [
                [-0.2, 51.4],
                [-0.1, 51.4],
                [-0.1, 51.5],
                [-0.2, 51.5],
                [-0.2, 51.4],
              ],
            ],
            type: "Polygon",
          },
          properties: {},
          type: "Feature",
        },
      ],
      type: "FeatureCollection",
    };

    expect(computeBounds(collection)).toEqual([
      [-0.2, 51.4],
      [-0.1, 51.5],
    ]);
  });

  it("merges bounds across a multipolygon feature", () => {
    const collection: FeatureCollection = {
      features: [
        {
          geometry: {
            coordinates: [
              [
                [
                  [0, 0],
                  [1, 0],
                  [1, 1],
                  [0, 0],
                ],
              ],
              [
                [
                  [5, 5],
                  [6, 5],
                  [6, 6],
                  [5, 5],
                ],
              ],
            ],
            type: "MultiPolygon",
          },
          properties: {},
          type: "Feature",
        },
      ],
      type: "FeatureCollection",
    };

    expect(computeBounds(collection)).toEqual([
      [0, 0],
      [6, 6],
    ]);
  });

  it("returns null when a polygon has no coordinates", () => {
    const collection: FeatureCollection = {
      features: [
        {
          geometry: { coordinates: [], type: "Polygon" },
          properties: {},
          type: "Feature",
        },
      ],
      type: "FeatureCollection",
    };

    expect(computeBounds(collection)).toBeNull();
  });
});
