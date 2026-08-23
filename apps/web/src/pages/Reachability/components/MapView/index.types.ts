import type { FeatureCollection } from "geojson";
import type { TravelMode } from "@/constants/travel-modes.constants";
import type {
  MapViewState,
  ReachabilityOrigin,
} from "@/types/reachability.types";

/** Props for the reachability MapView container. */
export interface MapViewProps {
  boundsToFit: [[number, number], [number, number]] | null;
  contours: FeatureCollection | null;
  mapboxAccessToken: string;
  mapView: MapViewState;
  onBoundsFitted: () => void;
  onFitContours: () => void;
  onViewChange: (view: MapViewState) => void;
  origin: ReachabilityOrigin | null;
  resultTravelMode: TravelMode | null;
}
