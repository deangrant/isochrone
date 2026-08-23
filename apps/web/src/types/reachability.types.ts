/** Geographic origin for reachability calculation. */
export interface ReachabilityOrigin {
  lat: number;
  lon: number;
}

/** Map camera state. */
export interface MapViewState {
  lat: number;
  lon: number;
  zoom: number;
}
