import { describe, expect, it, vi } from "vitest";
import { MapboxIsochroneService } from "@/services/mapbox-isochrone-service";

describe("MapboxIsochroneService", () => {
  it("requests isochrones with profile, coordinates, and contour minutes", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: async () => ({
        features: [
          {
            geometry: { coordinates: [], type: "Polygon" },
            properties: { contour: 10 },
            type: "Feature",
          },
        ],
        type: "FeatureCollection",
      }),
      ok: true,
    });
    vi.stubGlobal("fetch", fetchMock);

    const service = new MapboxIsochroneService("pk.test");
    const result = await service.computeIsochrones({
      contours: [{ color: "a8e6cf", time: 10 }],
      origin: { lat: 51.5, lon: -0.12 },
      profile: "mapbox/cycling",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.mapbox.com/isochrone/v1/mapbox/cycling/-0.12,51.5?access_token=pk.test&contours_minutes=10&polygons=true&contours_colors=a8e6cf",
      expect.objectContaining({
        headers: { Accept: "application/json" },
      }),
    );
    expect(result.features[0]?.properties?.fill).toBe("a8e6cf");

    vi.unstubAllGlobals();
  });

  it("enriches multiple contours with matching fill colors", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: async () => ({
        features: [
          {
            geometry: { coordinates: [], type: "Polygon" },
            properties: { contour: 10 },
            type: "Feature",
          },
          {
            geometry: { coordinates: [], type: "Polygon" },
            properties: { contour: 20 },
            type: "Feature",
          },
        ],
        type: "FeatureCollection",
      }),
      ok: true,
    });
    vi.stubGlobal("fetch", fetchMock);

    const service = new MapboxIsochroneService("pk.test");
    const result = await service.computeIsochrones({
      contours: [
        { color: "a8e6cf", time: 10 },
        { color: "7fd4b0", time: 20 },
      ],
      origin: { lat: 51.5, lon: -0.12 },
      profile: "mapbox/driving",
    });

    expect(result.features[0]?.properties?.fill).toBe("a8e6cf");
    expect(result.features[1]?.properties?.fill).toBe("7fd4b0");

    vi.unstubAllGlobals();
  });

  it("sends denoise and contour colors when provided", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: async () => ({
        features: [
          {
            geometry: { coordinates: [], type: "Polygon" },
            properties: { contour: 10, fill: "#a8e6cf" },
            type: "Feature",
          },
        ],
        type: "FeatureCollection",
      }),
      ok: true,
    });
    vi.stubGlobal("fetch", fetchMock);

    const service = new MapboxIsochroneService("pk.test");
    await service.computeIsochrones({
      contours: [{ color: "a8e6cf", time: 10 }],
      denoise: 0.5,
      origin: { lat: 51.5, lon: -0.12 },
      profile: "mapbox/walking",
    });

    const [requestUrl] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(requestUrl).toContain("denoise=0.5");
    expect(requestUrl).toContain("contours_colors=a8e6cf");

    vi.unstubAllGlobals();
  });

  it("sends generalize when greater than zero", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: async () => ({
        features: [
          {
            geometry: { coordinates: [], type: "Polygon" },
            properties: { contour: 10 },
            type: "Feature",
          },
        ],
        type: "FeatureCollection",
      }),
      ok: true,
    });
    vi.stubGlobal("fetch", fetchMock);

    const service = new MapboxIsochroneService("pk.test");
    await service.computeIsochrones({
      contours: [{ color: "a8e6cf", time: 10 }],
      generalize: 50,
      origin: { lat: 51.5, lon: -0.12 },
      profile: "mapbox/walking",
    });

    const [requestUrl] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(requestUrl).toContain("generalize=50");

    vi.unstubAllGlobals();
  });

  it("sends depart_at when provided", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: async () => ({
        features: [
          {
            geometry: { coordinates: [], type: "Polygon" },
            properties: { contour: 10 },
            type: "Feature",
          },
        ],
        type: "FeatureCollection",
      }),
      ok: true,
    });
    vi.stubGlobal("fetch", fetchMock);

    const service = new MapboxIsochroneService("pk.test");
    await service.computeIsochrones({
      contours: [{ color: "a8e6cf", time: 10 }],
      departAt: "2026-08-22T15:30",
      origin: { lat: 51.5, lon: -0.12 },
      profile: "mapbox/driving-traffic",
    });

    const [requestUrl] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(requestUrl).toContain("depart_at=2026-08-22T15%3A30");

    vi.unstubAllGlobals();
  });

  it("sends exclude when provided", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: async () => ({
        features: [
          {
            geometry: { coordinates: [], type: "Polygon" },
            properties: { contour: 10 },
            type: "Feature",
          },
        ],
        type: "FeatureCollection",
      }),
      ok: true,
    });
    vi.stubGlobal("fetch", fetchMock);

    const service = new MapboxIsochroneService("pk.test");
    await service.computeIsochrones({
      contours: [{ color: "a8e6cf", time: 10 }],
      exclude: "motorway,toll",
      origin: { lat: 51.5, lon: -0.12 },
      profile: "mapbox/driving",
    });

    const [requestUrl] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(requestUrl).toContain("exclude=motorway%2Ctoll");

    vi.unstubAllGlobals();
  });
});
