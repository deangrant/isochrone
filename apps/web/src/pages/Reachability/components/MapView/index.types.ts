import type { FeatureCollection } from "geojson";
import type { TravelMode } from "@/constants/travel-modes.constants";

/** Map camera state. */
export interface MapViewState {
  lat: number;
  lon: number;
  zoom: number;
}

/** Props for the reachability MapView container. */
export interface MapViewProps {
  boundsToFit: [[number, number], [number, number]] | null;
  contours: FeatureCollection | null;
  mapView: MapViewState;
  onBoundsFitted: () => void;
  onFitContours: () => void;
  onViewChange: (view: MapViewState) => void;
  origin: { lat: number; lon: number } | null;
  resultTravelMode: TravelMode | null;
}
