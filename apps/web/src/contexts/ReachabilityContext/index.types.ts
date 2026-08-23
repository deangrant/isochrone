import type { FeatureCollection } from "geojson";
import type { ExcludeOptionValue } from "@/pages/Reachability/constants/exclude-options.constants";
import type { TravelMode } from "@/pages/Reachability/constants/travel-modes.constants";
import type { GeocodingSuggestion } from "@/types/geocoding.types";

/** Map camera state and geographic origin types re-exported for context consumers. */
export type {
  MapViewState,
  ReachabilityOrigin,
} from "@/types/reachability.types";

import type {
  MapViewState,
  ReachabilityOrigin,
} from "@/types/reachability.types";

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
  /** Location search query or coordinate string. */
  locationQuery: string;
  /** Contour time intervals in minutes. */
  timeIntervals: number[];
  /** Selected travel mode for routing. */
  travelMode: TravelMode;
}

/** Reachability application state exposed by context. */
export interface ReachabilityState {
  /** Contour bounds awaiting fitBounds; null when none pending. */
  boundsToFit: [[number, number], [number, number]] | null;
  /** True while an isochrone request is in flight. */
  calculating: boolean;
  /** User-visible error from the last failed calculation. */
  error: string | null;
  /** Geocoding suggestions for the current location query. */
  geocodingSuggestions: GeocodingSuggestion[];
  /** Map center and zoom persisted across sessions. */
  mapView: MapViewState;
  /** Resolved origin coordinates; null before a valid location is set. */
  origin: ReachabilityOrigin | null;
  /** Latest isochrone GeoJSON result; null before first successful run. */
  result: FeatureCollection | null;
  /** Travel mode used for the current result contours. */
  resultTravelMode: TravelMode | null;
  /** Panel-controlled calculation inputs. */
  settings: ReachabilitySettings;
}

/** Reachability actions exposed by context. */
export interface ReachabilityActions {
  /** Runs an isochrone request from current settings and origin. */
  calculate: () => Promise<void>;
  /** Clears pending boundsToFit without moving the map. */
  clearBoundsToFit: () => void;
  /** Clears the start location, map contours, calculation errors, and panel settings. */
  clearLocation: () => void;
  /** Sets boundsToFit from the current result contours. */
  fitContoursBounds: () => void;
  /** Applies a geocoding suggestion to origin and location query. */
  selectGeocodingSuggestion: (suggestion: GeocodingSuggestion) => void;
  /** Updates the location search field and triggers geocoding. */
  setLocationQuery: (query: string) => void;
  /** Persists map camera state from MapView interactions. */
  setMapView: (view: MapViewState) => void;
  /** Merges partial updates into reachability settings. */
  setSettings: (patch: Partial<ReachabilitySettings>) => void;
}

/** Combined reachability context value. */
export interface ReachabilityContextValue {
  actions: ReachabilityActions;
  state: ReachabilityState;
}
