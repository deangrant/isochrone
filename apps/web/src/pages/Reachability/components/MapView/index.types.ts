import type { FeatureCollection } from "geojson";
import type { TravelMode } from "@/pages/Reachability/constants/travel-modes.constants";
import type { MapFitPadding } from "@/pages/Reachability/utils/map-fit-padding";
import type {
  MapViewState,
  ReachabilityOrigin,
} from "@/types/reachability.types";

/** Props for the reachability MapView container. */
export interface MapViewProps {
  /** Bounding box to fit after a calculation; cleared once applied. */
  boundsToFit: [[number, number], [number, number]] | null;
  /** Isochrone feature collection to draw on the map. */
  contours: FeatureCollection | null;
  /** Padding applied when fitting bounds around contours. */
  fitPadding: MapFitPadding;
  /** Mapbox GL access token for the map instance. */
  mapboxAccessToken: string;
  /** Current map center and zoom. */
  mapView: MapViewState;
  /** Notifies the parent after boundsToFit has been applied to the map. */
  onBoundsFitted: () => void;
  /** Notifies the parent when the user requests fitting the view to current contours. */
  onFitContours: () => void;
  /** Notifies the parent when the user pans or zooms the map. */
  onViewChange: (view: MapViewState) => void;
  /** Origin point marker; null when unset. */
  origin: ReachabilityOrigin | null;
  /** Travel mode of the displayed contours; drives route layer styling. */
  resultTravelMode: TravelMode | null;
}
