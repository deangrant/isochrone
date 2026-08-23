import { describe, expect, it } from "vitest";
import {
  allContourIndices,
  buildContourExportOptions,
} from "./contour-export-options";

const CONTOURS = {
  features: [
    {
      geometry: { coordinates: [], type: "Polygon" as const },
      properties: { contour: 10 },
      type: "Feature" as const,
    },
    {
      geometry: { coordinates: [], type: "Polygon" as const },
      properties: {},
      type: "Feature" as const,
    },
  ],
  type: "FeatureCollection" as const,
};

describe("buildContourExportOptions", () => {
  it("returns one tile per contour feature", () => {
    const options = buildContourExportOptions(CONTOURS, "Driving");

    expect(options).toHaveLength(2);
    expect(options[0]).toMatchObject({
      index: 0,
      label: "Driving, 10 min",
    });
    expect(options[1]).toMatchObject({
      index: 1,
      label: "Driving, time interval unknown",
    });
  });

  it("orders tiles by contour minutes ascending", () => {
    const contours = {
      features: [
        {
          geometry: { coordinates: [], type: "Polygon" as const },
          properties: { contour: 10 },
          type: "Feature" as const,
        },
        {
          geometry: { coordinates: [], type: "Polygon" as const },
          properties: { contour: 30 },
          type: "Feature" as const,
        },
        {
          geometry: { coordinates: [], type: "Polygon" as const },
          properties: { contour: 20 },
          type: "Feature" as const,
        },
      ],
      type: "FeatureCollection" as const,
    };

    const options = buildContourExportOptions(contours, "Driving");

    expect(options.map((option) => option.index)).toEqual([0, 2, 1]);
    expect(options.map((option) => option.label)).toEqual([
      "Driving, 10 min",
      "Driving, 20 min",
      "Driving, 30 min",
    ]);
  });
});

describe("allContourIndices", () => {
  it("returns every contour index", () => {
    expect(allContourIndices(CONTOURS)).toEqual([0, 1]);
  });
});
