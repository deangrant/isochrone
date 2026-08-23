import { lazy, Suspense, useRef } from "react";
import { Spinner } from "@/components/core/Spinner";
import { getMapboxAccessToken } from "@/constants/mapbox.constants";
import {
  useReachabilityCalculationState,
  useReachabilityMap,
} from "@/contexts/ReachabilityContext";
import { IsochronePanel } from "@/pages/Reachability/components/IsochronePanel";
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
        aria-label="Isochrone settings"
        className={styles.sidePanel}
        ref={panelRef}
      >
        <IsochronePanel />
      </aside>
    </div>
  );
}
