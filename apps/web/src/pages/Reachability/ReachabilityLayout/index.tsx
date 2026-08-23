import { type CSSProperties, lazy, Suspense, useEffect, useRef } from "react";
import { Spinner } from "@/components/core/Spinner";
import { getMapboxAccessToken } from "@/constants/mapbox.constants";
import {
  useReachabilityCalculationState,
  useReachabilityMap,
} from "@/contexts/ReachabilityContext";
import { IsochronePanel } from "@/pages/Reachability/components/IsochronePanel";
import { REACHABILITY_SIDE_PANEL_MAX_WIDTH_PX } from "@/pages/Reachability/constants/reachability-layout.constants";
import { useMapFitPadding } from "@/pages/Reachability/hooks/use-map-fit-padding";
import styles from "./index.module.css";

const MapView = lazy(async () => {
  const module = await import("@/pages/Reachability/components/MapView");
  return { default: module.MapView };
});

/** Renders the full-page reachability layout with panel and map. */
export function ReachabilityLayout() {
  const { state: mapState, actions: mapActions } = useReachabilityMap();
  const { state: calculationState } = useReachabilityCalculationState();
  const panelRef = useRef<HTMLElement>(null);
  const fitPadding = useMapFitPadding(panelRef);

  useEffect(() => {
    import("mapbox-gl").catch(() => undefined);
  }, []);

  return (
    <div aria-busy={calculationState.calculating} className={styles.root}>
      <section aria-label="Map" className={styles.mapPane}>
        <Suspense
          fallback={
            <div className={styles.mapFallback}>
              <Spinner label="Loading map…" size="lg" />
            </div>
          }
        >
          <MapView
            boundsToFit={mapState.boundsToFit}
            contours={mapState.result}
            fitPadding={fitPadding}
            mapboxAccessToken={getMapboxAccessToken()}
            mapView={mapState.mapView}
            onBoundsFitted={mapActions.clearBoundsToFit}
            onFitContours={mapActions.fitContoursBounds}
            onViewChange={mapActions.setMapView}
            origin={mapState.origin}
            resultTravelMode={mapState.resultTravelMode}
          />
        </Suspense>
      </section>

      <aside
        aria-label="Travel reach settings"
        className={styles.sidePanel}
        ref={panelRef}
        style={
          {
            "--reachability-panel-max-width": `${REACHABILITY_SIDE_PANEL_MAX_WIDTH_PX}px`,
          } as CSSProperties
        }
      >
        <IsochronePanel />
      </aside>
    </div>
  );
}
