import type { FeatureCollection } from "geojson";
import type { Dispatch, SetStateAction } from "react";
import { useCallback, useRef, useState } from "react";
import {
  TRAVEL_MODE_OPTIONS,
  type TravelMode,
} from "@/constants/travel-modes.constants";
import type { IReachabilityClient } from "@/services/mapbox-isochrone-service";
import type { ReachabilityOrigin } from "@/types/reachability.types";
import type { ReachabilitySettings } from "./index.types";
import { runReachabilityCalculation } from "./run-reachability-calculation";

interface UseReachabilityCalculationOptions {
  origin: ReachabilityOrigin | null;
  reachability: IReachabilityClient;
  setBoundsToFit: Dispatch<
    SetStateAction<[[number, number], [number, number]] | null>
  >;
  settings: ReachabilitySettings;
}

/** Runs reachability calculations and tracks result state. */
export function useReachabilityCalculation({
  origin,
  reachability,
  setBoundsToFit,
  settings,
}: UseReachabilityCalculationOptions) {
  const [result, setResult] = useState<FeatureCollection | null>(null);
  const [resultTravelMode, setResultTravelMode] = useState<TravelMode | null>(
    null,
  );
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const calculate = useCallback(async () => {
    if (!origin) {
      setError("Set a start location before calculating.");
      return;
    }

    const travelOption = TRAVEL_MODE_OPTIONS.find(
      (option) => option.value === settings.travelMode,
    );
    if (!travelOption) {
      setError("Select a valid travel mode.");
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setCalculating(true);
    setError(null);

    const outcome = await runReachabilityCalculation(
      reachability,
      origin,
      settings,
      travelOption.profile,
      controller.signal,
    );

    if (controller.signal.aborted) {
      return;
    }

    if (!outcome.ok) {
      setError(outcome.error);
      setCalculating(false);
      return;
    }

    setResult(outcome.result);
    setResultTravelMode(settings.travelMode);
    if (outcome.bounds) {
      setBoundsToFit(outcome.bounds);
    }
    setCalculating(false);
  }, [origin, reachability, setBoundsToFit, settings]);

  return {
    calculate,
    calculating,
    error,
    result,
    resultTravelMode,
  };
}
