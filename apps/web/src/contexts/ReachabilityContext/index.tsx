import { type ReactNode, useCallback, useContext, useMemo } from "react";
import { useServices } from "@/contexts/ServicesContext";
import type {
  ReachabilityActions,
  ReachabilityContextValue,
  ReachabilityState,
} from "./index.types";
import { ReachabilityContext } from "./reachability-context";
import { computeBounds } from "./run-reachability-calculation";
import { useGeocodingSuggestions } from "./use-geocoding-suggestions";
import { useReachabilityCalculation } from "./use-reachability-calculation";
import { useReachabilityMap } from "./use-reachability-map";
import { useReachabilityOrigin } from "./use-reachability-origin";
import { useReachabilitySettings } from "./use-reachability-settings";

/** Props for the reachability provider. */
export interface ReachabilityProviderProps {
  children: ReactNode;
}

/** Provides reachability state and actions to the page tree. */
export function ReachabilityProvider({ children }: ReachabilityProviderProps) {
  const { geocoding, reachability } = useServices();
  const { settings, setSettings } = useReachabilitySettings();
  const { boundsToFit, clearBoundsToFit, mapView, setBoundsToFit, setMapView } =
    useReachabilityMap();
  const { clearGeocodingSuggestions, geocodingSuggestions } =
    useGeocodingSuggestions(geocoding, settings.locationQuery);
  const { origin, selectGeocodingSuggestion, setLocationQuery } =
    useReachabilityOrigin({
      clearGeocodingSuggestions,
      mapViewZoom: mapView.zoom,
      setMapView,
      setSettings,
    });
  const { calculate, calculating, error, result, resultTravelMode } =
    useReachabilityCalculation({
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

  const actions = useMemo<ReachabilityActions>(
    () => ({
      calculate,
      clearBoundsToFit,
      fitContoursBounds,
      selectGeocodingSuggestion,
      setLocationQuery,
      setMapView,
      setSettings,
    }),
    [
      calculate,
      clearBoundsToFit,
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
 * Returns reachability state and actions from context.
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
