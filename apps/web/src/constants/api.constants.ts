/** Default map view on first load (London metro). */
export const DEFAULT_MAP_VIEW = {
  lat: 51.5074,
  lon: -0.1278,
  zoom: 11,
};

/** Fixed Mapbox light style. */
export const MAPBOX_STYLE_URL = "mapbox://styles/mapbox/light-v11";

/** Viewport width at which the isochrone panel becomes a bottom sheet. */
export const REACHABILITY_LAYOUT_BREAKPOINT_PX = 1100;

/** Maximum width of the desktop isochrone side panel in pixels. */
export const REACHABILITY_SIDE_PANEL_MAX_WIDTH_PX = 360;

/** Panel offset from the viewport edge; matches `--space-3` (0.75rem) in layout CSS. */
export const REACHABILITY_PANEL_INSET_PX = 12;

/** Base inset used on each map fitBounds padding edge. */
export const MAP_FIT_PADDING_BASE = 48;
