import type { FeatureCollection } from "geojson";
import { describe, expect, it, vi } from "vitest";
import { MISSING_TRAVEL_TIME_MESSAGE } from "@/constants/reachability-ui-copy";
import type { ReachabilityOrigin } from "@/types/reachability.types";
import type {
  IReachabilityClient,
  ReachabilityRequest,
} from "@/types/reachability-client.types";
import type { ReachabilitySettings } from "./index.types";
import { runReachabilityCalculation } from "./run-reachability-calculation";

const ORIGIN: ReachabilityOrigin = { lat: 51.5, lon: -0.12 };

const RESULT: FeatureCollection = {
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

function createSettings(
  patch: Partial<ReachabilitySettings> = {},
): ReachabilitySettings {
  return {
    denoise: 0.1,
    departAt: "",
    departAtEnabled: false,
    exclude: [],
    generalize: 0,
    locationQuery: "London",
    timeIntervals: [10],
    travelMode: "car",
    ...patch,
  };
}

function createReachabilityMock(
  computeIsochrones = vi.fn<IReachabilityClient["computeIsochrones"]>(),
): IReachabilityClient {
  return { computeIsochrones };
}

describe("runReachabilityCalculation", () => {
  it("returns the result and computed bounds on success", async () => {
    const reachability = createReachabilityMock(
      vi.fn().mockResolvedValue(RESULT),
    );

    const outcome = await runReachabilityCalculation(
      reachability,
      ORIGIN,
      createSettings(),
      "mapbox/driving",
    );

    expect(outcome).toEqual({
      bounds: [
        [-0.2, 51.4],
        [-0.1, 51.5],
      ],
      ok: true,
      result: RESULT,
    });
  });

  it("returns a validation error when no travel times are configured", async () => {
    const reachability = createReachabilityMock();

    const outcome = await runReachabilityCalculation(
      reachability,
      ORIGIN,
      createSettings({ timeIntervals: [] }),
      "mapbox/driving",
    );

    expect(outcome).toEqual({
      error: MISSING_TRAVEL_TIME_MESSAGE,
      ok: false,
    });
    expect(reachability.computeIsochrones).not.toHaveBeenCalled();
  });

  it("passes exclude for driving modes only", async () => {
    const computeIsochrones = vi.fn().mockResolvedValue(RESULT);
    const reachability = createReachabilityMock(computeIsochrones);

    await runReachabilityCalculation(
      reachability,
      ORIGIN,
      createSettings({ exclude: ["toll", "motorway"], travelMode: "car" }),
      "mapbox/driving",
    );

    const carRequest = computeIsochrones.mock
      .calls[0]?.[0] as ReachabilityRequest;
    expect(carRequest.exclude).toBe("motorway,toll");

    await runReachabilityCalculation(
      reachability,
      ORIGIN,
      createSettings({ exclude: ["toll"], travelMode: "traffic" }),
      "mapbox/driving-traffic",
    );

    const trafficRequest = computeIsochrones.mock
      .calls[1]?.[0] as ReachabilityRequest;
    expect(trafficRequest.exclude).toBe("toll");

    await runReachabilityCalculation(
      reachability,
      ORIGIN,
      createSettings({ exclude: ["toll"], travelMode: "bicycle" }),
      "mapbox/cycling",
    );

    const bicycleRequest = computeIsochrones.mock
      .calls[2]?.[0] as ReachabilityRequest;
    expect(bicycleRequest.exclude).toBeUndefined();
  });

  it("sends depart_at only when enabled and set", async () => {
    const computeIsochrones = vi.fn().mockResolvedValue(RESULT);
    const reachability = createReachabilityMock(computeIsochrones);

    await runReachabilityCalculation(
      reachability,
      ORIGIN,
      createSettings({
        departAt: "2026-08-22T15:30",
        departAtEnabled: true,
      }),
      "mapbox/driving",
    );

    const enabledRequest = computeIsochrones.mock
      .calls[0]?.[0] as ReachabilityRequest;
    expect(enabledRequest.departAt).toBe("2026-08-22T15:30");

    await runReachabilityCalculation(
      reachability,
      ORIGIN,
      createSettings({
        departAt: "2026-08-22T15:30",
        departAtEnabled: false,
      }),
      "mapbox/driving",
    );

    const disabledRequest = computeIsochrones.mock
      .calls[1]?.[0] as ReachabilityRequest;
    expect(disabledRequest.departAt).toBeUndefined();

    await runReachabilityCalculation(
      reachability,
      ORIGIN,
      createSettings({ departAt: "", departAtEnabled: true }),
      "mapbox/driving",
    );

    const emptyRequest = computeIsochrones.mock
      .calls[2]?.[0] as ReachabilityRequest;
    expect(emptyRequest.departAt).toBeUndefined();
  });

  it("returns an error when the reachability client rejects", async () => {
    const reachability = createReachabilityMock(
      vi.fn().mockRejectedValue(new Error("Network failure")),
    );

    const outcome = await runReachabilityCalculation(
      reachability,
      ORIGIN,
      createSettings(),
      "mapbox/driving",
    );

    expect(outcome).toEqual({
      error: "Network failure",
      ok: false,
    });
  });

  it("rethrows when the request was aborted", async () => {
    const controller = new AbortController();
    controller.abort();

    const reachability = createReachabilityMock(
      vi.fn().mockRejectedValue(new DOMException("Aborted", "AbortError")),
    );

    await expect(
      runReachabilityCalculation(
        reachability,
        ORIGIN,
        createSettings(),
        "mapbox/driving",
        controller.signal,
      ),
    ).rejects.toThrow("Aborted");
  });
});
