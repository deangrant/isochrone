import { describe, expect, it } from "vitest";
import { buildFilename } from "@/pages/Reachability/services/geojson-download-service";
import { filterContours } from "@/pages/Reachability/utils/filter-contours";

const GEOJSON_FILENAME_PATTERN = /^reachability-.+\.geojson$/;

const CONTOURS = {
  features: [
    {
      geometry: { coordinates: [], type: "Polygon" as const },
      properties: { contour: 10 },
      type: "Feature" as const,
    },
    {
      geometry: { coordinates: [], type: "Polygon" as const },
      properties: { contour: 20 },
      type: "Feature" as const,
    },
    {
      geometry: { coordinates: [], type: "Polygon" as const },
      properties: { contour: 30 },
      type: "Feature" as const,
    },
  ],
  type: "FeatureCollection" as const,
};

describe("geojson-download-service", () => {
  it("builds a timestamped filename", () => {
    expect(buildFilename()).toMatch(GEOJSON_FILENAME_PATTERN);
  });

  it("filters a single contour index", () => {
    const filtered = filterContours(CONTOURS, [1]);

    expect(filtered.features).toHaveLength(1);
    expect(filtered.features[0]?.properties?.contour).toBe(20);
  });

  it("filters multiple contour indices in request order", () => {
    const filtered = filterContours(CONTOURS, [2, 0]);

    expect(filtered.features).toHaveLength(2);
    expect(filtered.features[0]?.properties?.contour).toBe(30);
    expect(filtered.features[1]?.properties?.contour).toBe(10);
  });

  it("throws when a contour index is out of range", () => {
    expect(() => filterContours(CONTOURS, [3])).toThrow(
      "Selected contour index is out of range.",
    );
  });
});
