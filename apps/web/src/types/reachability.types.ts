/** Geographic origin for reachability calculation. */
export interface ReachabilityOrigin {
  lat: number;
  lon: number;
}

/** Map camera state. */
export interface MapViewState {
  /** Map center latitude in degrees. */
  lat: number;
  /** Map center longitude in degrees. */
  lon: number;
  /** Map zoom level. */
  zoom: number;
}
