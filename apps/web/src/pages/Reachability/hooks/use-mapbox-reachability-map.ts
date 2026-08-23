import type { FeatureCollection } from "geojson";
import type { Map as MapboxMap } from "mapbox-gl";
import { useEffect, useRef } from "react";
import { MAPBOX_STYLE_URL } from "@/constants/api.constants";
import {
  isGeoJsonSource,
  nearlyEqual,
  normalizeContourCollection,
  originToGeoJson,
} from "@/pages/Reachability/utils/map-helpers";
import {
  addReachabilityMapLayers,
  CONTOURS_SOURCE_ID,
  ORIGIN_SOURCE_ID,
} from "@/pages/Reachability/utils/map-layers";
import type {
  MapViewState,
  ReachabilityOrigin,
} from "@/types/reachability.types";
import type { MapFitPadding } from "@/utils/map-fit-padding";

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
  const initialMapViewRef = useRef(mapView);
  const onViewChangeRef = useRef(onViewChange);
  const onBoundsFittedRef = useRef(onBoundsFitted);
  const applyingExternalViewRef = useRef(false);

  useEffect(() => {
    onViewChangeRef.current = onViewChange;
    onBoundsFittedRef.current = onBoundsFitted;
  }, [onBoundsFitted, onViewChange]);

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
  }, [mapboxAccessToken]);

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
  }, [boundsToFit, mapView]);

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
  }, [boundsToFit, fitPadding]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    const applyData = () => {
      const contourSource = map.getSource(CONTOURS_SOURCE_ID);
      if (isGeoJsonSource(contourSource)) {
        contourSource.setData(
          contours
            ? normalizeContourCollection(contours)
            : { features: [], type: "FeatureCollection" },
        );
      }

      const originSource = map.getSource(ORIGIN_SOURCE_ID);
      if (isGeoJsonSource(originSource)) {
        originSource.setData(originToGeoJson(origin));
      }
    };

    if (map.isStyleLoaded()) {
      applyData();
      return;
    }

    map.once("load", applyData);
    return () => {
      map.off("load", applyData);
    };
  }, [contours, origin]);

  return { containerRef };
}
