/** Returns the Mapbox public access token from environment configuration. */
export function getMapboxAccessToken(): string {
  return import.meta.env.VITE_MAPBOX_GL_JS_PUBLIC ?? "";
}
