import type { Map as MapboxMap } from "mapbox-gl";

/** GeoJSON source id for reachability contours. */
export const CONTOURS_SOURCE_ID = "reachability-contours";

/** Fill layer id for contour polygons. */
export const CONTOURS_FILL_LAYER_ID = "reachability-contours-fill";

/** Outline layer id for contour polygons. */
export const CONTOURS_LINE_LAYER_ID = "reachability-contours-line";

/** GeoJSON source id for the origin marker. */
export const ORIGIN_SOURCE_ID = "reachability-origin";

/** Circle layer id for the origin marker. */
export const ORIGIN_LAYER_ID = "reachability-origin-point";

/**
 * Registers reachability contour and origin layers on a loaded map.
 * @param map Mapbox map instance after style load.
 */
export function addReachabilityMapLayers(map: MapboxMap): void {
  map.addSource(CONTOURS_SOURCE_ID, {
    data: { features: [], type: "FeatureCollection" },
    type: "geojson",
  });

  map.addLayer({
    id: CONTOURS_FILL_LAYER_ID,
    paint: {
      "fill-color": ["coalesce", ["get", "fill"], "#3d9b7a"],
      "fill-opacity": 0.28,
    },
    source: CONTOURS_SOURCE_ID,
    type: "fill",
  });

  map.addLayer({
    id: CONTOURS_LINE_LAYER_ID,
    paint: {
      "line-color": ["coalesce", ["get", "fill"], "#2f7d62"],
      "line-opacity": 0.9,
      "line-width": 2,
    },
    source: CONTOURS_SOURCE_ID,
    type: "line",
  });

  map.addSource(ORIGIN_SOURCE_ID, {
    data: { features: [], type: "FeatureCollection" },
    type: "geojson",
  });

  map.addLayer({
    id: ORIGIN_LAYER_ID,
    paint: {
      "circle-color": "#3d9b7a",
      "circle-radius": 7,
      "circle-stroke-color": "#ffffff",
      "circle-stroke-width": 2,
    },
    source: ORIGIN_SOURCE_ID,
    type: "circle",
  });
}
