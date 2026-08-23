import type { FeatureCollection } from "geojson";
import { describe, expect, it } from "vitest";
import { DEFAULT_SETTINGS } from "@/contexts/ReachabilityContext/use-reachability-settings-state";
import { isReachabilityPanelDirty } from "@/pages/Reachability/utils/reachability-panel-state";

const RESULT: FeatureCollection = {
  features: [
    {
      geometry: { coordinates: [], type: "Polygon" },
      properties: {},
      type: "Feature",
    },
  ],
  type: "FeatureCollection",
};

describe("isReachabilityPanelDirty", () => {
  it("returns false for the default panel state", () => {
    expect(isReachabilityPanelDirty(DEFAULT_SETTINGS, "", null, null)).toBe(
      false,
    );
  });

  it("returns true when the location query is set", () => {
    expect(
      isReachabilityPanelDirty(DEFAULT_SETTINGS, "London", null, null),
    ).toBe(true);
  });

  it("returns true when an origin is set", () => {
    expect(
      isReachabilityPanelDirty(
        DEFAULT_SETTINGS,
        "",
        { lat: 51.5, lon: -0.12 },
        null,
      ),
    ).toBe(true);
  });

  it("returns true when contours are present", () => {
    expect(isReachabilityPanelDirty(DEFAULT_SETTINGS, "", null, RESULT)).toBe(
      true,
    );
  });

  it("returns true when settings differ from defaults", () => {
    expect(
      isReachabilityPanelDirty(
        { ...DEFAULT_SETTINGS, travelMode: "bicycle" },
        "",
        null,
        null,
      ),
    ).toBe(true);
  });
});
