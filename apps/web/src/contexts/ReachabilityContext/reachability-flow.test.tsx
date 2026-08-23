import {
  act,
  cleanup,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
} from "@testing-library/react";
import type { FeatureCollection } from "geojson";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  ReachabilityProvider,
  useReachability,
  useReachabilityMap,
} from "@/contexts/ReachabilityContext";
import { ServicesProvider } from "@/contexts/ServicesContext";
import { IsochronePanel } from "@/pages/Reachability/components/IsochronePanel";
import type { AppServices } from "@/services/app-services";
import type { IGeocodingService } from "@/types/geocoding-service.types";
import type { IReachabilityClient } from "@/types/reachability-client.types";

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
      properties: { contour: 10 },
      type: "Feature",
    },
  ],
  type: "FeatureCollection",
};

function createServices(): AppServices {
  return {
    geocoding: {
      search: vi.fn<IGeocodingService["search"]>().mockResolvedValue([]),
    },
    reachability: {
      computeIsochrones: vi
        .fn<IReachabilityClient["computeIsochrones"]>()
        .mockResolvedValue(RESULT),
    },
  };
}

function renderReachabilityFlow(services = createServices()) {
  return {
    services,
    ...render(
      <ServicesProvider services={services}>
        <ReachabilityProvider>
          <IsochronePanel />
        </ReachabilityProvider>
      </ServicesProvider>,
    ),
  };
}

afterEach(() => {
  cleanup();
});

describe("reachability flow", () => {
  it("calculates reachability after a coordinate origin is entered", async () => {
    const { services } = renderReachabilityFlow();

    fireEvent.change(
      screen.getByPlaceholderText("Search for a place or address"),
      {
        target: { value: "51.5, -0.12" },
      },
    );

    const calculateButton = screen.getByRole("button", { name: "Calculate" });
    expect(calculateButton).not.toBeDisabled();

    fireEvent.click(calculateButton);

    await waitFor(() => {
      expect(services.reachability.computeIsochrones).toHaveBeenCalledTimes(1);
    });

    const [request] = vi.mocked(services.reachability.computeIsochrones).mock
      .calls[0] as Parameters<IReachabilityClient["computeIsochrones"]>;
    expect(request.origin).toEqual({ lat: 51.5, lon: -0.12 });
    expect(request.profile).toBe("mapbox/driving");
    expect(request.contours).toEqual([{ color: "a8e6cf", time: 10 }]);

    await waitFor(() => {
      expect(screen.queryByText("Calculating…")).not.toBeInTheDocument();
    });
    expect(
      screen.queryByText("Choose a start location, then calculate again."),
    ).not.toBeInTheDocument();
  });

  it("sets bounds to fit after a successful calculation and fitContoursBounds", async () => {
    const services = createServices();

    const { result } = renderHook(
      () => ({
        map: useReachabilityMap(),
        reachability: useReachability(),
      }),
      {
        wrapper: ({ children }) => (
          <ServicesProvider services={services}>
            <ReachabilityProvider>{children}</ReachabilityProvider>
          </ServicesProvider>
        ),
      },
    );

    act(() => {
      result.current.reachability.actions.setLocationQuery("51.5, -0.12");
    });

    await act(async () => {
      await result.current.reachability.actions.calculate();
    });

    expect(result.current.map.state.boundsToFit).toEqual([
      [-0.2, 51.4],
      [-0.1, 51.5],
    ]);

    act(() => {
      result.current.map.actions.fitContoursBounds();
    });

    expect(result.current.map.state.boundsToFit).toEqual([
      [-0.2, 51.4],
      [-0.1, 51.5],
    ]);
  });

  it("clears the location, origin, and result when clearLocation runs", async () => {
    const services = createServices();

    const { result } = renderHook(() => useReachability(), {
      wrapper: ({ children }) => (
        <ServicesProvider services={services}>
          <ReachabilityProvider>{children}</ReachabilityProvider>
        </ServicesProvider>
      ),
    });

    act(() => {
      result.current.actions.setLocationQuery("51.5, -0.12");
    });

    await act(async () => {
      await result.current.actions.calculate();
    });

    expect(result.current.state.origin).not.toBeNull();
    expect(result.current.state.result).not.toBeNull();

    act(() => {
      result.current.actions.clearLocation();
    });

    expect(result.current.state.settings.locationQuery).toBe("");
    expect(result.current.state.origin).toBeNull();
    expect(result.current.state.result).toBeNull();
    expect(result.current.state.error).toBeNull();
  });
});
