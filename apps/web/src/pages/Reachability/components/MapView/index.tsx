import mapboxgl from "mapbox-gl";
import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  MAP_PANEL_PADDING_LEFT,
  MAPBOX_STYLE_URL,
} from "@/constants/api.constants";
import { getTravelModeLabel } from "@/constants/travel-modes.constants";
import "mapbox-gl/dist/mapbox-gl.css";
import "@/styles/mapbox-overrides.css";
import { MapControls } from "@/pages/Reachability/components/MapControls";
import styles from "./index.module.css";
import type { MapViewProps } from "./index.types";
import {
  isGeoJsonSource,
  nearlyEqual,
  normalizeContourCollection,
  originToGeoJson,
} from "./map-helpers";
import {
  addReachabilityMapLayers,
  CONTOURS_SOURCE_ID,
  ORIGIN_SOURCE_ID,
} from "./map-layers";

const ExportContoursModal = lazy(async () => {
  const module = await import(
    "@/pages/Reachability/components/ExportContoursModal"
  );
  return { default: module.ExportContoursModal };
});

/** Mapbox GL map with reachability contours and origin marker. */
export function MapView({
  mapView,
  origin,
  contours,
  boundsToFit,
  onBoundsFitted,
  onViewChange,
  onFitContours,
  resultTravelMode,
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapReadyRef = useRef(false);
  const initialMapViewRef = useRef(mapView);
  const onViewChangeRef = useRef(onViewChange);
  const onBoundsFittedRef = useRef(onBoundsFitted);
  const applyingExternalViewRef = useRef(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportModalKey, setExportModalKey] = useState(0);
  const accessToken = import.meta.env.VITE_MAPBOX_GL_JS_PUBLIC;
  const hasContours = contours !== null && contours.features.length > 0;
  const profileLabel = getTravelModeLabel(resultTravelMode ?? "car");

  const handleOpenExportModal = useCallback(() => {
    setExportModalKey((key) => key + 1);
    setExportModalOpen(true);
  }, []);

  const handleCloseExportModal = useCallback(() => {
    setExportModalOpen(false);
  }, []);

  useEffect(() => {
    onViewChangeRef.current = onViewChange;
    onBoundsFittedRef.current = onBoundsFitted;
  }, [onBoundsFitted, onViewChange]);

  useEffect(() => {
    const container = containerRef.current;
    const token = import.meta.env.VITE_MAPBOX_GL_JS_PUBLIC;
    if (!(container && token)) {
      return;
    }

    mapboxgl.accessToken = token;
    mapReadyRef.current = false;

    const map = new mapboxgl.Map({
      bearing: 0,
      center: [initialMapViewRef.current.lon, initialMapViewRef.current.lat],
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

    const onMoveEnd = () => {
      if (applyingExternalViewRef.current) {
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
      addReachabilityMapLayers(map);
      mapReadyRef.current = true;
      const center = map.getCenter();
      onViewChangeRef.current({
        lat: center.lat,
        lon: center.lng,
        zoom: map.getZoom(),
      });
    };

    map.on("load", onLoad);
    map.on("moveend", onMoveEnd);

    mapRef.current = map;
    return () => {
      mapReadyRef.current = false;
      mapRef.current = null;
      map.off("load", onLoad);
      map.off("moveend", onMoveEnd);
      map.remove();
    };
  }, []);

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
      padding: {
        bottom: 48,
        left: MAP_PANEL_PADDING_LEFT,
        right: 48,
        top: 48,
      },
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
  }, [boundsToFit]);

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

  if (!accessToken) {
    return (
      <div className={styles.root}>
        <p className={styles.tokenMissing}>
          Set <code>VITE_MAPBOX_GL_JS_PUBLIC</code> in{" "}
          <code>apps/web/.env</code> to enable the map.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <div className={styles.mapCanvas} ref={containerRef} />
      {hasContours ? (
        <MapControls
          onExport={handleOpenExportModal}
          onFitContours={onFitContours}
        />
      ) : null}
      {exportModalOpen && contours ? (
        <Suspense fallback={null}>
          <ExportContoursModal
            contours={contours}
            key={exportModalKey}
            onClose={handleCloseExportModal}
            open
            profileLabel={profileLabel}
          />
        </Suspense>
      ) : null}
    </div>
  );
}
