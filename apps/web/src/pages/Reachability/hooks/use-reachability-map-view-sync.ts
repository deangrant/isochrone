import type { Map as MapboxMap } from "mapbox-gl";
import type { RefObject } from "react";
import { useEffect } from "react";
import type { MapFitPadding } from "@/pages/Reachability/utils/map-fit-padding";
import { nearlyEqual } from "@/pages/Reachability/utils/map-helpers";
import type { MapViewState } from "@/types/reachability.types";

/** Options for syncing map camera state and fit-bounds requests. */
export interface UseReachabilityMapViewSyncOptions {
  applyingExternalViewRef: RefObject<boolean>;
  boundsToFit: [[number, number], [number, number]] | null;
  fitPadding: MapFitPadding;
  mapReadyRef: RefObject<boolean>;
  mapRef: RefObject<MapboxMap | null>;
  mapView: MapViewState;
  onBoundsFittedRef: RefObject<() => void>;
  onViewChangeRef: RefObject<(view: MapViewState) => void>;
}

/**
 * Keeps the map camera aligned with external view state and pending fit-bounds.
 */
export function useReachabilityMapViewSync({
  applyingExternalViewRef,
  boundsToFit,
  fitPadding,
  mapReadyRef,
  mapRef,
  mapView,
  onBoundsFittedRef,
  onViewChangeRef,
}: UseReachabilityMapViewSyncOptions): void {
  useEffect(() => {
    const map = mapRef.current;
    if (!(map && mapReadyRef.current) || boundsToFit !== null) {
      return;
    }

    const center = map.getCenter();
    const zoom = map.getZoom();
    if (
      nearlyEqual(center.lat, mapView.lat) &&
      nearlyEqual(center.lng, mapView.lon) &&
      nearlyEqual(zoom, mapView.zoom)
    ) {
      return;
    }

    applyingExternalViewRef.current = true;
    map.jumpTo({ center: [mapView.lon, mapView.lat], zoom: mapView.zoom });
    map.once("moveend", () => {
      applyingExternalViewRef.current = false;
    });
  }, [applyingExternalViewRef, boundsToFit, mapReadyRef, mapRef, mapView]);

  useEffect(() => {
    const map = mapRef.current;
    if (!(map && mapReadyRef.current && boundsToFit)) {
      return;
    }

    applyingExternalViewRef.current = true;
    map.fitBounds(boundsToFit, {
      duration: 700,
      essential: true,
      maxZoom: 15,
      padding: fitPadding,
    });
    map.once("moveend", () => {
      applyingExternalViewRef.current = false;
      const center = map.getCenter();
      onViewChangeRef.current({
        lat: center.lat,
        lon: center.lng,
        zoom: map.getZoom(),
      });
      onBoundsFittedRef.current();
    });
  }, [
    applyingExternalViewRef,
    boundsToFit,
    fitPadding,
    mapReadyRef,
    mapRef,
    onBoundsFittedRef,
    onViewChangeRef,
  ]);
}
