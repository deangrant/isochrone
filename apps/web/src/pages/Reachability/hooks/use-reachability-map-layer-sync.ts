import type { FeatureCollection } from "geojson";
import type { Map as MapboxMap } from "mapbox-gl";
import type { RefObject } from "react";
import { useEffect } from "react";
import {
  isGeoJsonSource,
  normalizeContourCollection,
  originToGeoJson,
} from "@/pages/Reachability/utils/map-helpers";
import {
  CONTOURS_SOURCE_ID,
  ORIGIN_SOURCE_ID,
} from "@/pages/Reachability/utils/map-layers";
import type { ReachabilityOrigin } from "@/types/reachability.types";

/** Options for syncing reachability GeoJSON sources on the map. */
export interface UseReachabilityMapLayerSyncOptions {
  contours: FeatureCollection | null;
  mapRef: RefObject<MapboxMap | null>;
  origin: ReachabilityOrigin | null;
}

/**
 * Updates contour and origin GeoJSON sources when reachability data changes.
 */
export function useReachabilityMapLayerSync({
  contours,
  mapRef,
  origin,
}: UseReachabilityMapLayerSyncOptions): void {
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
  }, [contours, mapRef, origin]);
}
