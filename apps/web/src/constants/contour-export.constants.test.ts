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
        hint: "Feature collection for web maps and GIS tools",
        label: "GeoJSON",
      },
      {
        format: "wkt",
        hint: "Well-Known Text for GIS and spatial tools",
        label: "WKT",
      },
    ]);
  });

  it("defaults to GeoJSON", () => {
    expect(DEFAULT_EXPORT_FORMAT).toBe("geojson");
  });
});
