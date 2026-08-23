import { lazy, Suspense, useCallback, useState } from "react";
import { getTravelModeLabel } from "@/constants/travel-modes.constants";
import "mapbox-gl/dist/mapbox-gl.css";
import "@/styles/mapbox-overrides.css";
import { MapControls } from "@/pages/Reachability/components/MapControls";
import { useMapboxReachabilityMap } from "@/pages/Reachability/hooks/use-mapbox-reachability-map";
import styles from "./index.module.css";
import type { MapViewProps } from "./index.types";

const ExportContoursModal = lazy(async () => {
  const module = await import(
    "@/pages/Reachability/components/ExportContoursModal"
  );
  return { default: module.ExportContoursModal };
});

const HelpModal = lazy(async () => {
  const module = await import("@/pages/Reachability/components/HelpModal");
  return { default: module.HelpModal };
});

/** Renders the Mapbox GL map with reachability contours and origin marker. */
export function MapView({
  mapView,
  origin,
  contours,
  boundsToFit,
  fitPadding,
  mapboxAccessToken,
  onBoundsFitted,
  onViewChange,
  onFitContours,
  resultTravelMode,
}: MapViewProps) {
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportModalKey, setExportModalKey] = useState(0);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const accessToken = mapboxAccessToken;
  const hasContours = contours !== null && contours.features.length > 0;
  const profileLabel = getTravelModeLabel(resultTravelMode ?? "car");

  const { containerRef } = useMapboxReachabilityMap({
    boundsToFit,
    contours,
    fitPadding,
    mapboxAccessToken,
    mapView,
    onBoundsFitted,
    onViewChange,
    origin,
  });

  const handleOpenExportModal = useCallback(() => {
    setExportModalKey((key) => key + 1);
    setExportModalOpen(true);
  }, []);

  const handleCloseExportModal = useCallback(() => {
    setExportModalOpen(false);
  }, []);

  const handleOpenHelpModal = useCallback(() => {
    setHelpModalOpen(true);
  }, []);

  const handleCloseHelpModal = useCallback(() => {
    setHelpModalOpen(false);
  }, []);

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
      <MapControls
        onExport={handleOpenExportModal}
        onFitContours={onFitContours}
        onHelp={handleOpenHelpModal}
        showResultControls={hasContours}
      />
      {helpModalOpen ? (
        <Suspense fallback={null}>
          <HelpModal onClose={handleCloseHelpModal} open />
        </Suspense>
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
