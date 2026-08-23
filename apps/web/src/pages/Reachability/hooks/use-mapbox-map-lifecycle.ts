import type { Map as MapboxMap } from "mapbox-gl";
import { type RefObject, useEffect, useRef } from "react";
import { MAPBOX_STYLE_URL } from "@/pages/Reachability/constants/reachability-layout.constants";
import { addReachabilityMapLayers } from "@/pages/Reachability/utils/map-layers";
import type { MapViewState } from "@/types/reachability.types";

/** Options for initializing a Mapbox map instance. */
export interface UseMapboxMapLifecycleOptions {
  applyingExternalViewRef: RefObject<boolean>;
  containerRef: RefObject<HTMLDivElement | null>;
  initialMapView: MapViewState;
  mapboxAccessToken: string;
  mapReadyRef: RefObject<boolean>;
  mapRef: RefObject<MapboxMap | null>;
  onViewChangeRef: RefObject<(view: MapViewState) => void>;
}

/**
 * Creates a Mapbox map instance and tears it down when the token changes.
 */
export function useMapboxMapLifecycle({
  applyingExternalViewRef,
  containerRef,
  initialMapView,
  mapboxAccessToken,
  mapReadyRef,
  mapRef,
  onViewChangeRef,
}: UseMapboxMapLifecycleOptions): void {
  const initialMapViewRef = useRef(initialMapView);

  useEffect(() => {
    const container = containerRef.current;
    if (!(container && mapboxAccessToken)) {
      return;
    }

    let cancelled = false;
    let map: MapboxMap | null = null;

    const onMoveEnd = () => {
      if (!map || applyingExternalViewRef.current) {
        return;
      }
      const center = map.getCenter();
      onViewChangeRef.current({
        lat: center.lat,
        lon: center.lng,
        zoom: map.getZoom(),
      });
    };

    const onLoad = () => {
      if (!map) {
        return;
      }
      addReachabilityMapLayers(map);
      mapReadyRef.current = true;
      const center = map.getCenter();
      onViewChangeRef.current({
        lat: center.lat,
        lon: center.lng,
        zoom: map.getZoom(),
      });
    };

    mapReadyRef.current = false;

    const initMap = async (): Promise<void> => {
      try {
        const mapboxModule = await import("mapbox-gl");
        if (cancelled) {
          return;
        }

        const mapboxgl = mapboxModule.default;
        mapboxgl.accessToken = mapboxAccessToken;

        map = new mapboxgl.Map({
          bearing: 0,
          center: [
            initialMapViewRef.current.lon,
            initialMapViewRef.current.lat,
          ],
          container,
          dragRotate: false,
          pitch: 0,
          pitchWithRotate: false,
          projection: { name: "mercator" },
          renderWorldCopies: false,
          style: MAPBOX_STYLE_URL,
          touchPitch: false,
          zoom: initialMapViewRef.current.zoom,
        });
        map.touchZoomRotate.disableRotation();
        map.on("load", onLoad);
        map.on("moveend", onMoveEnd);
        mapRef.current = map;
      } catch {
        mapReadyRef.current = false;
      }
    };

    initMap();

    return () => {
      cancelled = true;
      mapReadyRef.current = false;
      mapRef.current = null;
      if (map) {
        map.off("load", onLoad);
        map.off("moveend", onMoveEnd);
        map.remove();
      }
    };
  }, [
    applyingExternalViewRef,
    containerRef,
    mapboxAccessToken,
    mapReadyRef,
    mapRef,
    onViewChangeRef,
  ]);
}
