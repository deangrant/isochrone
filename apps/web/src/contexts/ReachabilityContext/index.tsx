import type { FeatureCollection } from "geojson";
import {
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { DEFAULT_MAP_VIEW } from "@/constants/api.constants";
import {
  TRAVEL_MODE_OPTIONS,
  type TravelMode,
} from "@/constants/travel-modes.constants";
import { useServices } from "@/contexts/ServicesContext";
import type { GeocodingSuggestion } from "@/services/mapbox-geocoding-service";
import { parseCoordinates } from "@/utils/parse-coordinates";
import type {
  MapViewState,
  ReachabilityActions,
  ReachabilityContextValue,
  ReachabilityOrigin,
  ReachabilitySettings,
  ReachabilityState,
} from "./index.types";
import { ReachabilityContext } from "./reachability-context";
import {
  computeBounds,
  runReachabilityCalculation,
} from "./run-reachability-calculation";

const DEFAULT_SETTINGS: ReachabilitySettings = {
  denoise: 0.1,
  departAt: "",
  departAtEnabled: false,
  exclude: [],
  generalize: 0,
  locationQuery: "",
  timeIntervals: [10],
  travelMode: "car",
};

/** Props for the reachability provider. */
export interface ReachabilityProviderProps {
  children: ReactNode;
}

/** Provides reachability state and actions to the page tree. */
export function ReachabilityProvider({ children }: ReachabilityProviderProps) {
  const { geocoding, reachability } = useServices();
  const [settings, setSettingsState] =
    useState<ReachabilitySettings>(DEFAULT_SETTINGS);
  const [origin, setOrigin] = useState<ReachabilityOrigin | null>(null);
  const [result, setResult] = useState<FeatureCollection | null>(null);
  const [resultTravelMode, setResultTravelMode] = useState<TravelMode | null>(
    null,
  );
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mapView, setMapView] = useState<MapViewState>(DEFAULT_MAP_VIEW);
  const [boundsToFit, setBoundsToFit] = useState<
    [[number, number], [number, number]] | null
  >(null);
  const [geocodingSuggestions, setGeocodingSuggestions] = useState<
    GeocodingSuggestion[]
  >([]);
  const abortRef = useRef<AbortController | null>(null);
  const geocodeAbortRef = useRef<AbortController | null>(null);

  const setSettings = useCallback((patch: Partial<ReachabilitySettings>) => {
    setSettingsState((current) => ({ ...current, ...patch }));
  }, []);

  const setLocationQuery = useCallback((query: string) => {
    setSettingsState((current) => ({ ...current, locationQuery: query }));

    const parsed = parseCoordinates(query);
    if (parsed) {
      setOrigin(parsed);
      setMapView((current) => ({
        ...current,
        lat: parsed.lat,
        lon: parsed.lon,
      }));
      setGeocodingSuggestions([]);
      return;
    }

    if (query.trim().length === 0) {
      setOrigin(null);
    }
  }, []);

  const selectGeocodingSuggestion = useCallback(
    (suggestion: GeocodingSuggestion) => {
      setSettingsState((current) => ({
        ...current,
        locationQuery: suggestion.label,
      }));
      setOrigin({ lat: suggestion.lat, lon: suggestion.lon });
      setMapView({
        lat: suggestion.lat,
        lon: suggestion.lon,
        zoom: Math.max(mapView.zoom, 12),
      });
      setGeocodingSuggestions([]);
    },
    [mapView.zoom],
  );

  const clearBoundsToFit = useCallback(() => {
    setBoundsToFit(null);
  }, []);

  const fitContoursBounds = useCallback(() => {
    if (!result) {
      return;
    }

    const bounds = computeBounds(result);
    if (bounds) {
      setBoundsToFit(bounds);
    }
  }, [result]);

  useEffect(() => {
    const query = settings.locationQuery.trim();
    if (query.length < 2 || parseCoordinates(query)) {
      setGeocodingSuggestions([]);
      return;
    }

    geocodeAbortRef.current?.abort();
    const controller = new AbortController();
    geocodeAbortRef.current = controller;

    const timer = window.setTimeout(() => {
      geocoding
        .search(query, controller.signal)
        .then((items) => {
          if (!controller.signal.aborted) {
            setGeocodingSuggestions(items);
          }
        })
        .catch(() => {
          if (!controller.signal.aborted) {
            setGeocodingSuggestions([]);
          }
        });
    }, 280);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [geocoding, settings.locationQuery]);

  const calculate = useCallback(async () => {
    if (!origin) {
      setError("Set a start location before calculating.");
      return;
    }

    const travelOption = TRAVEL_MODE_OPTIONS.find(
      (option) => option.value === settings.travelMode,
    );
    if (!travelOption) {
      setError("Select a valid travel mode.");
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setCalculating(true);
    setError(null);

    const outcome = await runReachabilityCalculation(
      reachability,
      origin,
      settings,
      travelOption.profile,
      controller.signal,
    );

    if (controller.signal.aborted) {
      return;
    }

    if (!outcome.ok) {
      setError(outcome.error);
      setCalculating(false);
      return;
    }

    setResult(outcome.result);
    setResultTravelMode(settings.travelMode);
    if (outcome.bounds) {
      setBoundsToFit(outcome.bounds);
    }
    setCalculating(false);
  }, [origin, reachability, settings]);

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
      setLocationQuery,
      selectGeocodingSuggestion,
      setSettings,
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
