import { useCallback, useState } from "react";
import type { ReachabilitySettings } from "./index.types";

/** Default isochrone panel settings on first load. */
export const DEFAULT_SETTINGS: ReachabilitySettings = {
  denoise: 0.1,
  departAt: "",
  departAtEnabled: false,
  exclude: [],
  generalize: 0,
  locationQuery: "",
  timeIntervals: [10],
  travelMode: "car",
};

/** Manages isochrone panel settings state. */
export function useReachabilitySettingsState() {
  const [settings, setSettingsState] =
    useState<ReachabilitySettings>(DEFAULT_SETTINGS);

  const setSettings = useCallback((patch: Partial<ReachabilitySettings>) => {
    setSettingsState((current) => ({ ...current, ...patch }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettingsState(DEFAULT_SETTINGS);
  }, []);

  return { resetSettings, setSettings, setSettingsState, settings };
}
