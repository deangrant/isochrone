import { describe, expect, it, vi } from "vitest";
import { MapboxGeocodingService } from "@/services/mapbox-geocoding-service";

describe("MapboxGeocodingService", () => {
  it("requests forward geocoding with expected URL params", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: async () => ({
        features: [
          {
            geometry: { coordinates: [-0.1278, 51.5074] },
            properties: { full_address: "London, England, United Kingdom" },
          },
        ],
      }),
      ok: true,
    });
    vi.stubGlobal("fetch", fetchMock);

    const service = new MapboxGeocodingService("pk.test");
    const suggestions = await service.search("London");

    const [requestUrl, requestInit] = fetchMock.mock.calls[0] as [
      string,
      RequestInit,
    ];
    expect(requestUrl).toBe(
      "https://api.mapbox.com/search/geocode/v6/forward?access_token=pk.test&autocomplete=true&limit=6&q=London",
    );
    expect(requestInit).toMatchObject({
      headers: { Accept: "application/json" },
    });
    expect(suggestions).toEqual([
      {
        label: "London, England, United Kingdom",
        lat: 51.5074,
        lon: -0.1278,
      },
    ]);

    vi.unstubAllGlobals();
  });

  it("returns an empty array for short queries without calling fetch", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const service = new MapboxGeocodingService("pk.test");

    expect(await service.search("a")).toEqual([]);
    expect(await service.search(" ")).toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();

    vi.unstubAllGlobals();
  });

  it("filters malformed features from the response", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: async () => ({
        features: [
          { geometry: { coordinates: [-0.1, 51.5] }, properties: {} },
          {
            geometry: { coordinates: [-0.2, 51.4] },
            properties: { name: "Valid place" },
          },
        ],
      }),
      ok: true,
    });
    vi.stubGlobal("fetch", fetchMock);

    const service = new MapboxGeocodingService("pk.test");
    const suggestions = await service.search("place");

    expect(suggestions).toEqual([
      { label: "Valid place", lat: 51.4, lon: -0.2 },
    ]);

    vi.unstubAllGlobals();
  });

  it("returns an empty array when the response has no features", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: async () => ({}),
      ok: true,
    });
    vi.stubGlobal("fetch", fetchMock);

    const service = new MapboxGeocodingService("pk.test");

    expect(await service.search("nowhere")).toEqual([]);

    vi.unstubAllGlobals();
  });

  it("throws when the geocoding request fails", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
    });
    vi.stubGlobal("fetch", fetchMock);

    const service = new MapboxGeocodingService("pk.test");

    await expect(service.search("London")).rejects.toThrow(
      "Geocoding request failed (401).",
    );

    vi.unstubAllGlobals();
  });

  it("passes the abort signal to fetch", async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValue(new DOMException("Aborted", "AbortError"));
    vi.stubGlobal("fetch", fetchMock);

    const service = new MapboxGeocodingService("pk.test");
    const controller = new AbortController();
    controller.abort();

    await expect(service.search("London", controller.signal)).rejects.toThrow();

    const [, requestInit] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(requestInit.signal).toBe(controller.signal);

    vi.unstubAllGlobals();
  });
});
