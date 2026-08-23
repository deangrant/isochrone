import { getMapboxAccessToken } from "@/config/mapbox.config";
import type { IGeocodingService } from "@/services/mapbox-geocoding-service";
import { MapboxGeocodingService } from "@/services/mapbox-geocoding-service";
import type { IReachabilityClient } from "@/services/mapbox-isochrone-service";
import { MapboxIsochroneService } from "@/services/mapbox-isochrone-service";

/** Wired application services. */
export interface AppServices {
  /** Mapbox forward geocoding. */
  geocoding: IGeocodingService;
  /** Mapbox isochrone API client. */
  reachability: IReachabilityClient;
}

/**
 * Creates application services from environment configuration.
 */
export function createServices(): AppServices {
  const mapboxToken = getMapboxAccessToken();

  return {
    geocoding: new MapboxGeocodingService(mapboxToken),
    reachability: new MapboxIsochroneService(mapboxToken),
  };
}
