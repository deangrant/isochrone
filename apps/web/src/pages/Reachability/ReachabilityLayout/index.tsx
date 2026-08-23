import { lazy, Suspense } from "react";
import { Spinner } from "@/components/core/Spinner";
import { getMapboxAccessToken } from "@/config/mapbox.config";
import { useReachability } from "@/contexts/ReachabilityContext";
import { IsochronePanel } from "@/pages/Reachability/components/IsochronePanel";
import styles from "./index.module.css";

const MapView = lazy(async () => {
  const module = await import("@/pages/Reachability/components/MapView");
  return { default: module.MapView };
});

/** Full-page layout with left isochrone panel and map. */
export function ReachabilityLayout() {
  const { state, actions } = useReachability();

  return (
    <div aria-busy={state.calculating} className={styles.root}>
      <section aria-label="Map" className={styles.mapPane}>
        <Suspense
          fallback={
            <div className={styles.mapFallback}>
              <Spinner label="Loading map…" size="lg" />
            </div>
          }
        >
          <MapView
            boundsToFit={state.boundsToFit}
            contours={state.result}
            mapboxAccessToken={getMapboxAccessToken()}
            mapView={state.mapView}
            onBoundsFitted={actions.clearBoundsToFit}
            onFitContours={actions.fitContoursBounds}
            onViewChange={actions.setMapView}
            origin={state.origin}
            resultTravelMode={state.resultTravelMode}
          />
        </Suspense>
      </section>

      <aside aria-label="Isochrone settings" className={styles.sidePanel}>
        <IsochronePanel />
      </aside>
    </div>
  );
}
