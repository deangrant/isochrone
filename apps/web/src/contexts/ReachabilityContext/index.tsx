import { type ReactNode, useCallback, useContext, useMemo } from "react";
import { useServices } from "@/contexts/ServicesContext";
import { computeBounds } from "@/pages/Reachability/utils/geo-bounds";
import type { MapViewState } from "@/types/reachability.types";
import type {
  ReachabilityActions,
  ReachabilityContextValue,
  ReachabilityState,
} from "./index.types";
import { ReachabilityContext } from "./reachability-context";
import { useGeocodingSuggestions } from "./use-geocoding-suggestions";
import { useReachabilityCalculation } from "./use-reachability-calculation";
import { useReachabilityMapState } from "./use-reachability-map-state";
import { useReachabilityOrigin } from "./use-reachability-origin";
import { useReachabilitySettingsState } from "./use-reachability-settings-state";

/** Props for the reachability provider. */
export interface ReachabilityProviderProps {
  children: ReactNode;
}

/** Provides reachability state and actions to the page tree. */
export function ReachabilityProvider({ children }: ReachabilityProviderProps) {
  const { geocoding, reachability } = useServices();
  const { settings, setSettings } = useReachabilitySettingsState();
  const {
    boundsToFit,
    clearBoundsToFit,
    mapView,
    setBoundsToFit,
    setMapView: setMapViewState,
  } = useReachabilityMapState();
  const { clearGeocodingSuggestions, geocodingSuggestions } =
    useGeocodingSuggestions(geocoding, settings.locationQuery);
  const { origin, selectGeocodingSuggestion, setLocationQuery } =
    useReachabilityOrigin({
      clearGeocodingSuggestions,
      mapViewZoom: mapView.zoom,
      setMapView: setMapViewState,
      setSettings,
    });
  const {
    calculate,
    calculating,
    error,
    resetCalculation,
    result,
    resultTravelMode,
  } = useReachabilityCalculation({
    origin,
    reachability,
    setBoundsToFit,
    settings,
  });

  const fitContoursBounds = useCallback(() => {
    if (!result) {
      return;
    }

    const bounds = computeBounds(result);
    if (bounds) {
      setBoundsToFit(bounds);
    }
  }, [result, setBoundsToFit]);

  const setMapView = useCallback(
    (view: MapViewState) => {
      setMapViewState(view);
    },
    [setMapViewState],
  );

  const clearLocation = useCallback(() => {
    resetCalculation();
    setLocationQuery("");
    clearGeocodingSuggestions();
    clearBoundsToFit();
  }, [
    clearBoundsToFit,
    clearGeocodingSuggestions,
    resetCalculation,
    setLocationQuery,
  ]);

  const actions = useMemo<ReachabilityActions>(
    () => ({
      calculate,
      clearBoundsToFit,
      clearLocation,
      fitContoursBounds,
      selectGeocodingSuggestion,
      setLocationQuery,
      setMapView,
      setSettings,
    }),
    [
      calculate,
      clearBoundsToFit,
      clearLocation,
      fitContoursBounds,
      selectGeocodingSuggestion,
      setLocationQuery,
      setSettings,
      setMapView,
    ],
  );

  const state = useMemo<ReachabilityState>(
    () => ({
      boundsToFit,
      calculating,
      error,
      geocodingSuggestions,
      mapView,
      origin,
      result,
      resultTravelMode,
      settings,
    }),
    [
      boundsToFit,
      calculating,
      error,
      geocodingSuggestions,
      mapView,
      origin,
      result,
      resultTravelMode,
      settings,
    ],
  );

  const value = useMemo(() => ({ actions, state }), [actions, state]);

  return (
    <ReachabilityContext.Provider value={value}>
      {children}
    </ReachabilityContext.Provider>
  );
}

/**
 * Returns the full reachability state and actions from context.
 * @throws When called outside `ReachabilityProvider`.
 */
export function useReachability(): ReachabilityContextValue {
  const value = useContext(ReachabilityContext);
  if (!value) {
    throw new Error(
      "useReachability must be used within ReachabilityProvider.",
    );
  }
  return value;
}

/** Returns map camera state and map-related actions. */
export function useReachabilityMap() {
  const { state, actions } = useReachability();
  return {
    actions: {
      clearBoundsToFit: actions.clearBoundsToFit,
      fitContoursBounds: actions.fitContoursBounds,
      setMapView: actions.setMapView,
    },
    state: {
      boundsToFit: state.boundsToFit,
      mapView: state.mapView,
      origin: state.origin,
      result: state.result,
      resultTravelMode: state.resultTravelMode,
    },
  };
}

/** Returns isochrone panel settings and location search state. */
export function useReachabilitySettings() {
  const { state, actions } = useReachability();
  return {
    actions: {
      clearLocation: actions.clearLocation,
      selectGeocodingSuggestion: actions.selectGeocodingSuggestion,
      setLocationQuery: actions.setLocationQuery,
      setSettings: actions.setSettings,
    },
    state: {
      geocodingSuggestions: state.geocodingSuggestions,
      origin: state.origin,
      result: state.result,
      settings: state.settings,
    },
  };
}

/** Returns calculation status and the calculate action. */
export function useReachabilityCalculationState() {
  const { state, actions } = useReachability();
  return {
    actions: {
      calculate: actions.calculate,
    },
    state: {
      calculating: state.calculating,
      error: state.error,
      origin: state.origin,
    },
  };
}
