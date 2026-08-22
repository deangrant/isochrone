/** Parsed geographic coordinates. */
export interface ParsedCoordinates {
  lat: number;
  lon: number;
}

const COORDINATE_SPLIT_PATTERN = /[,\s]+/;

/**
 * Parses a latitude/longitude string such as `51.5, -0.12` or `51.5 -0.12`.
 * @param input Raw coordinate string.
 */
export function parseCoordinates(input: string): ParsedCoordinates | null {
  const trimmed = input.trim();
  if (!trimmed) {
    return null;
  }

  const parts = trimmed
    .split(COORDINATE_SPLIT_PATTERN)
    .map((part) => part.trim())
    .filter((part) => part.length > 0);

  if (parts.length !== 2) {
    return null;
  }

  const lat = Number(parts[0]);
  const lon = Number(parts[1]);

  if (!(Number.isFinite(lat) && Number.isFinite(lon))) {
    return null;
  }
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    return null;
  }

  return { lat, lon };
}
