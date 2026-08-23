import { getMapboxAccessToken } from "@/constants/mapbox.constants";
import { MapboxGeocodingService } from "@/services/mapbox-geocoding-service";
import { MapboxIsochroneService } from "@/services/mapbox-isochrone-service";
import type { IGeocodingService } from "@/types/geocoding-service.types";
import type { IReachabilityClient } from "@/types/reachability-client.types";

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
