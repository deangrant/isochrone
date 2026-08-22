import { MapboxGeocodingService } from "@/services/mapbox-geocoding-service";
import { MapboxIsochroneService } from "@/services/mapbox-isochrone-service";

/** Wired application services. */
export interface AppServices {
  /** Mapbox forward geocoding. */
  geocoding: MapboxGeocodingService;
  /** Mapbox isochrone API client. */
  reachability: MapboxIsochroneService;
}

/**
 * Creates application services from environment configuration.
 */
export function createServices(): AppServices {
  const mapboxToken = import.meta.env.VITE_MAPBOX_GL_JS_PUBLIC ?? "";

  return {
    geocoding: new MapboxGeocodingService(mapboxToken),
    reachability: new MapboxIsochroneService(mapboxToken),
  };
}
