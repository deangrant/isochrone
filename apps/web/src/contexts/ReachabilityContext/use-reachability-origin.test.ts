import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useReachabilityOrigin } from "./use-reachability-origin";

function createOptions() {
  return {
    clearGeocodingSuggestions: vi.fn(),
    mapViewZoom: 10,
    setMapView: vi.fn(),
    setSettings: vi.fn(),
  };
}

describe("useReachabilityOrigin", () => {
  it("sets origin from valid coordinates", () => {
    const options = createOptions();
    const { result } = renderHook(() => useReachabilityOrigin(options));

    act(() => {
      result.current.setLocationQuery("51.5, -0.12");
    });

    expect(result.current.origin).toEqual({ lat: 51.5, lon: -0.12 });
    expect(options.setSettings).toHaveBeenCalledWith({
      locationQuery: "51.5, -0.12",
    });
  });

  it("clears origin when query changes to non-coordinate text", () => {
    const options = createOptions();
    const { result } = renderHook(() => useReachabilityOrigin(options));

    act(() => {
      result.current.setLocationQuery("51.5, -0.12");
    });
    act(() => {
      result.current.setLocationQuery("London");
    });

    expect(result.current.origin).toBeNull();
  });

  it("clears origin when query is empty", () => {
    const options = createOptions();
    const { result } = renderHook(() => useReachabilityOrigin(options));

    act(() => {
      result.current.setLocationQuery("51.5, -0.12");
    });
    act(() => {
      result.current.setLocationQuery("");
    });

    expect(result.current.origin).toBeNull();
  });

  it("sets origin from geocoding suggestion", () => {
    const options = createOptions();
    const { result } = renderHook(() => useReachabilityOrigin(options));

    act(() => {
      result.current.selectGeocodingSuggestion({
        label: "London, England, United Kingdom",
        lat: 51.5074,
        lon: -0.1278,
      });
    });

    expect(result.current.origin).toEqual({ lat: 51.5074, lon: -0.1278 });
    expect(options.setSettings).toHaveBeenCalledWith({
      locationQuery: "London, England, United Kingdom",
    });
  });
});
