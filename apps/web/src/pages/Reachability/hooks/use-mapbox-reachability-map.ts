import type { FeatureCollection } from "geojson";
import type { Map as MapboxMap } from "mapbox-gl";
import { useEffect, useRef } from "react";
import type { MapFitPadding } from "@/pages/Reachability/utils/map-fit-padding";
import type {
  MapViewState,
  ReachabilityOrigin,
} from "@/types/reachability.types";
import { useMapboxMapLifecycle } from "./use-mapbox-map-lifecycle";
import { useReachabilityMapLayerSync } from "./use-reachability-map-layer-sync";
import { useReachabilityMapViewSync } from "./use-reachability-map-view-sync";

/** Options for initializing and syncing a reachability Mapbox map. */
export interface UseMapboxReachabilityMapOptions {
  boundsToFit: [[number, number], [number, number]] | null;
  contours: FeatureCollection | null;
  fitPadding: MapFitPadding;
  mapboxAccessToken: string;
  mapView: MapViewState;
  onBoundsFitted: () => void;
  onViewChange: (view: MapViewState) => void;
  origin: ReachabilityOrigin | null;
}

/**
 * Initializes a Mapbox map and keeps reachability layers in sync with props.
 */
export function useMapboxReachabilityMap({
  boundsToFit,
  contours,
  fitPadding,
  mapView,
  mapboxAccessToken,
  onBoundsFitted,
  onViewChange,
  origin,
}: UseMapboxReachabilityMapOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapboxMap | null>(null);
  const mapReadyRef = useRef(false);
  const onViewChangeRef = useRef(onViewChange);
  const onBoundsFittedRef = useRef(onBoundsFitted);
  const applyingExternalViewRef = useRef(false);

  useEffect(() => {
    onViewChangeRef.current = onViewChange;
    onBoundsFittedRef.current = onBoundsFitted;
  }, [onBoundsFitted, onViewChange]);

  useMapboxMapLifecycle({
    applyingExternalViewRef,
    containerRef,
    initialMapView: mapView,
    mapboxAccessToken,
    mapReadyRef,
    mapRef,
    onViewChangeRef,
  });

  useReachabilityMapViewSync({
    applyingExternalViewRef,
    boundsToFit,
    fitPadding,
    mapReadyRef,
    mapRef,
    mapView,
    onBoundsFittedRef,
    onViewChangeRef,
  });

  useReachabilityMapLayerSync({
    contours,
    mapRef,
    origin,
  });

  return { containerRef };
}
