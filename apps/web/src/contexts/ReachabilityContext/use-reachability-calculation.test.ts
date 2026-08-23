import { act, renderHook, waitFor } from "@testing-library/react";
import type { FeatureCollection } from "geojson";
import { describe, expect, it, vi } from "vitest";
import type { ReachabilityOrigin } from "@/types/reachability.types";
import type { IReachabilityClient } from "@/types/reachability-client.types";
import type { ReachabilitySettings } from "./index.types";
import { useReachabilityCalculation } from "./use-reachability-calculation";

const ORIGIN: ReachabilityOrigin = { lat: 51.5, lon: -0.12 };

const SETTINGS: ReachabilitySettings = {
  denoise: 0.1,
  departAt: "",
  departAtEnabled: false,
  exclude: [],
  generalize: 0,
  locationQuery: "London",
  timeIntervals: [10],
  travelMode: "car",
};

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

function createDeferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((nextResolve, nextReject) => {
    resolve = nextResolve;
    reject = nextReject;
  });

  return { promise, reject, resolve };
}

function createReachabilityMock(
  computeIsochrones = vi.fn<IReachabilityClient["computeIsochrones"]>(),
): IReachabilityClient {
  return { computeIsochrones };
}

function createOptions(
  reachability: IReachabilityClient,
  setBoundsToFit = vi.fn(),
) {
  return {
    origin: ORIGIN,
    reachability,
    setBoundsToFit,
    settings: SETTINGS,
  };
}

describe("useReachabilityCalculation", () => {
  it("aborts in-flight work on unmount without leaving calculating true", async () => {
    const deferred = createDeferred<FeatureCollection>();
    const reachability = createReachabilityMock(
      vi.fn((_request, signal) => {
        signal?.addEventListener("abort", () => {
          deferred.reject(new DOMException("Aborted", "AbortError"));
        });
        return deferred.promise;
      }),
    );

    const { result, unmount } = renderHook(() =>
      useReachabilityCalculation(createOptions(reachability)),
    );

    const pending = {
      calculate: undefined as Promise<void> | undefined,
    };
    act(() => {
      pending.calculate = result.current.calculate();
    });

    expect(result.current.calculating).toBe(true);

    unmount();

    await act(async () => {
      deferred.reject(new DOMException("Aborted", "AbortError"));
      await pending.calculate?.catch(() => undefined);
    });
  });

  it("keeps calculating true until a superseding calculation finishes", async () => {
    const first = createDeferred<FeatureCollection>();
    const second = createDeferred<FeatureCollection>();
    let callCount = 0;
    const reachability = createReachabilityMock(
      vi.fn((_request, signal) => {
        const deferred = callCount === 0 ? first : second;
        callCount += 1;
        signal?.addEventListener("abort", () => {
          deferred.reject(new DOMException("Aborted", "AbortError"));
        });
        return deferred.promise;
      }),
    );

    const { result } = renderHook(() =>
      useReachabilityCalculation(createOptions(reachability)),
    );

    const calculations = {
      first: undefined as Promise<void> | undefined,
    };
    act(() => {
      calculations.first = result.current.calculate();
    });
    act(() => {
      result.current.calculate();
    });

    expect(result.current.calculating).toBe(true);

    await act(async () => {
      await calculations.first?.catch(() => undefined);
      second.resolve(RESULT);
      await second.promise;
    });

    await waitFor(() => {
      expect(result.current.calculating).toBe(false);
    });

    expect(result.current.result).toEqual(RESULT);
    expect(reachability.computeIsochrones).toHaveBeenCalledTimes(2);
  });

  it("does not set an error when the request is aborted", async () => {
    const first = createDeferred<FeatureCollection>();
    const second = createDeferred<FeatureCollection>();
    let callCount = 0;
    const reachability = createReachabilityMock(
      vi.fn((_request, signal) => {
        const deferred = callCount === 0 ? first : second;
        callCount += 1;
        signal?.addEventListener("abort", () => {
          deferred.reject(new DOMException("Aborted", "AbortError"));
        });
        return deferred.promise;
      }),
    );

    const { result } = renderHook(() =>
      useReachabilityCalculation(createOptions(reachability)),
    );

    const calculations = {
      first: undefined as Promise<void> | undefined,
    };
    act(() => {
      calculations.first = result.current.calculate();
    });

    act(() => {
      result.current.calculate();
    });

    await act(async () => {
      await calculations.first?.catch(() => undefined);
    });

    await act(async () => {
      second.resolve(RESULT);
      await second.promise;
    });

    await waitFor(() => {
      expect(result.current.calculating).toBe(false);
    });

    expect(result.current.error).toBeNull();
    expect(result.current.result).toEqual(RESULT);
  });
});
