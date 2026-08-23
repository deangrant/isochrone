import { describe, expect, it } from "vitest";
import {
  DEFAULT_EXPORT_FORMAT,
  EXPORT_FORMAT_OPTIONS,
} from "./contour-export.constants";

describe("export-format-options", () => {
  it("lists GeoJSON and WKT formats", () => {
    expect(EXPORT_FORMAT_OPTIONS).toEqual([
      {
        format: "geojson",
        hint: "Best for web maps and GIS apps",
        label: "GeoJSON",
      },
      {
        format: "wkt",
        hint: "Best for GIS and spatial databases",
        label: "WKT",
      },
    ]);
  });

  it("defaults to GeoJSON", () => {
    expect(DEFAULT_EXPORT_FORMAT).toBe("geojson");
  });
});
