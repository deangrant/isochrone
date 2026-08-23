import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { GeocodingSuggestion } from "@/types/geocoding.types";
import type { IGeocodingService } from "@/types/geocoding-service.types";
import { useGeocodingSuggestions } from "./use-geocoding-suggestions";

const SUGGESTIONS: GeocodingSuggestion[] = [
  { label: "London, UK", lat: 51.5, lon: -0.12 },
];

function createDeferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((nextResolve, nextReject) => {
    resolve = nextResolve;
    reject = nextReject;
  });

  return { promise, reject, resolve };
}

function createGeocoding(
  search = vi.fn<IGeocodingService["search"]>(),
): IGeocodingService {
  return { search };
}

describe("useGeocodingSuggestions", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("clears suggestions for short queries without searching", () => {
    const geocoding = createGeocoding();

    const { result } = renderHook(() =>
      useGeocodingSuggestions(geocoding, "a"),
    );

    expect(result.current.geocodingSuggestions).toEqual([]);
    expect(geocoding.search).not.toHaveBeenCalled();
  });

  it("clears suggestions for coordinate queries without searching", () => {
    const geocoding = createGeocoding();

    const { result } = renderHook(() =>
      useGeocodingSuggestions(geocoding, "51.5, -0.12"),
    );

    expect(result.current.geocodingSuggestions).toEqual([]);
    expect(geocoding.search).not.toHaveBeenCalled();
  });

  it("debounces search requests", async () => {
    vi.useFakeTimers();
    const geocoding = createGeocoding(vi.fn().mockResolvedValue(SUGGESTIONS));

    const { result, rerender } = renderHook(
      ({ query }) => useGeocodingSuggestions(geocoding, query),
      { initialProps: { query: "Lo" } },
    );

    expect(geocoding.search).not.toHaveBeenCalled();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(280);
    });

    expect(geocoding.search).toHaveBeenCalledWith(
      "Lo",
      expect.any(AbortSignal),
    );
    expect(result.current.geocodingSuggestions).toEqual(SUGGESTIONS);

    rerender({ query: "Lon" });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(280);
    });

    expect(geocoding.search).toHaveBeenCalledTimes(2);
  });

  it("aborts stale requests when the query changes quickly", async () => {
    vi.useFakeTimers();
    const first = createDeferred<GeocodingSuggestion[]>();
    const geocoding = createGeocoding(
      vi
        .fn()
        .mockImplementationOnce((_query, signal) => {
          signal?.addEventListener("abort", () => {
            first.reject(new DOMException("Aborted", "AbortError"));
          });
          return first.promise;
        })
        .mockResolvedValueOnce(SUGGESTIONS),
    );

    const { result, rerender } = renderHook(
      ({ query }) => useGeocodingSuggestions(geocoding, query),
      { initialProps: { query: "London" } },
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(280);
    });

    rerender({ query: "Lond" });

    await act(async () => {
      first.reject(new DOMException("Aborted", "AbortError"));
      await vi.advanceTimersByTimeAsync(280);
    });

    expect(result.current.geocodingSuggestions).toEqual(SUGGESTIONS);
  });

  it("clears suggestions when search rejects", async () => {
    vi.useFakeTimers();
    const geocoding = createGeocoding(
      vi.fn().mockRejectedValue(new Error("Network failure")),
    );

    const { result } = renderHook(() =>
      useGeocodingSuggestions(geocoding, "London"),
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(280);
    });

    expect(result.current.geocodingSuggestions).toEqual([]);
  });

  it("aborts in-flight search on unmount", async () => {
    vi.useFakeTimers();
    const deferred = createDeferred<GeocodingSuggestion[]>();
    const geocoding = createGeocoding(
      vi.fn((_query, signal) => {
        signal?.addEventListener("abort", () => {
          deferred.reject(new DOMException("Aborted", "AbortError"));
        });
        return deferred.promise;
      }),
    );

    const { unmount } = renderHook(() =>
      useGeocodingSuggestions(geocoding, "London"),
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(280);
    });

    unmount();

    act(() => {
      deferred.reject(new DOMException("Aborted", "AbortError"));
    });
  });
});
