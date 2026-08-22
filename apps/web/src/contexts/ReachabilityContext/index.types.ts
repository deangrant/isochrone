import type { FeatureCollection } from "geojson";
import type { ExcludeOptionValue } from "@/constants/exclude-options.constants";
import type { TravelMode } from "@/constants/travel-modes.constants";
import type { GeocodingSuggestion } from "@/services/mapbox-geocoding-service";

/** Geographic origin for reachability calculation. */
export interface ReachabilityOrigin {
  lat: number;
  lon: number;
}

/** Map camera state. */
export interface MapViewState {
  lat: number;
  lon: number;
  zoom: number;
}

/** Isochrone settings controlled by the panel. */
export interface ReachabilitySettings {
  /** Mapbox denoise factor (0–1). */
  denoise: number;
  /** datetime-local value for Mapbox depart_at. */
  departAt: string;
  /** When true, send depart_at to the API. */
  departAtEnabled: boolean;
  /** Enabled Mapbox exclude values for driving profiles. */
  exclude: ExcludeOptionValue[];
  /** Douglas-Peucker tolerance in metres (0 = API default). */
  generalize: number;
  locationQuery: string;
  timeIntervals: number[];
  travelMode: TravelMode;
}

/** Reachability application state exposed by context. */
export interface ReachabilityState {
  boundsToFit: [[number, number], [number, number]] | null;
  calculating: boolean;
  error: string | null;
  geocodingSuggestions: GeocodingSuggestion[];
  mapView: MapViewState;
  origin: ReachabilityOrigin | null;
  result: FeatureCollection | null;
  /** Travel mode used for the current result contours. */
  resultTravelMode: TravelMode | null;
  settings: ReachabilitySettings;
}

/** Reachability actions exposed by context. */
export interface ReachabilityActions {
  calculate: () => Promise<void>;
  clearBoundsToFit: () => void;
  fitContoursBounds: () => void;
  selectGeocodingSuggestion: (suggestion: GeocodingSuggestion) => void;
  setLocationQuery: (query: string) => void;
  setMapView: (view: MapViewState) => void;
  setSettings: (patch: Partial<ReachabilitySettings>) => void;
}

/** Combined reachability context value. */
export interface ReachabilityContextValue {
  actions: ReachabilityActions;
  state: ReachabilityState;
}
