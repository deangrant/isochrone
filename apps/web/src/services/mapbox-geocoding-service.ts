import type { GeocodingSuggestion } from "@/types/geocoding.types";
import type { IGeocodingService } from "@/types/geocoding-service.types";

/**
 * Mapbox Geocoding API v6 forward search client.
 */
export class MapboxGeocodingService implements IGeocodingService {
  private readonly accessToken: string;

  /**
   * @param accessToken Mapbox public access token.
   */
  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  /**
   * Searches for place suggestions matching a query.
   */
  async search(
    query: string,
    signal?: AbortSignal,
  ): Promise<GeocodingSuggestion[]> {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      return [];
    }

    const params = new URLSearchParams({
      access_token: this.accessToken,
      autocomplete: "true",
      limit: "6",
      q: trimmed,
    });

    const url = `https://api.mapbox.com/search/geocode/v6/forward?${params}`;
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      signal,
    });

    if (!response.ok) {
      throw new Error(`Geocoding request failed (${response.status}).`);
    }

    const body = (await response.json()) as MapboxGeocodeResponse;
    return (body.features ?? [])
      .map((feature) => toSuggestion(feature))
      .filter((item): item is GeocodingSuggestion => item !== null);
  }
}

interface MapboxGeocodeResponse {
  features?: MapboxFeature[];
}

interface MapboxFeature {
  geometry?: { coordinates?: [number, number] };
  properties?: {
    full_address?: string;
    name?: string;
    place_formatted?: string;
  };
}

function toSuggestion(feature: MapboxFeature): GeocodingSuggestion | null {
  const coords = feature.geometry?.coordinates;
  if (!coords || coords.length < 2) {
    return null;
  }
  const [lon, lat] = coords;
  const label =
    feature.properties?.full_address ??
    feature.properties?.place_formatted ??
    feature.properties?.name;
  if (!label) {
    return null;
  }
  return { label, lat, lon };
}
