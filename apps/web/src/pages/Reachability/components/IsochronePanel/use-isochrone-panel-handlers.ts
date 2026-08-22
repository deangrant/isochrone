import { type ChangeEvent, useCallback } from "react";
import type { ExcludeOptionValue } from "@/constants/exclude-options.constants";
import type { TravelMode } from "@/constants/travel-modes.constants";
import type { ReachabilityActions } from "@/contexts/ReachabilityContext/index.types";
import { formatDateTimeLocal } from "@/utils/datetime-local";

/**
 * Returns stable panel change handlers for isochrone settings.
 * @param actions Reachability context actions.
 * @param departAt Current depart-at value used when enabling the toggle.
 * @param exclude Current enabled exclude values.
 */
export function useIsochronePanelHandlers(
  actions: ReachabilityActions,
  departAt: string,
  exclude: readonly ExcludeOptionValue[],
) {
  const handleCalculate = useCallback(() => {
    actions.calculate().catch(() => undefined);
  }, [actions]);

  const handleTravelModeChange = useCallback(
    (value: TravelMode) => {
      actions.setSettings({ travelMode: value });
    },
    [actions],
  );

  const handleTimeIntervalsChange = useCallback(
    (timeIntervals: number[]) => {
      actions.setSettings({ timeIntervals });
    },
    [actions],
  );

  const handleDenoiseChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      actions.setSettings({ denoise: Number(event.target.value) });
    },
    [actions],
  );

  const handleGeneralizeChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      actions.setSettings({ generalize: Number(event.target.value) });
    },
    [actions],
  );

  const handleDepartAtEnabledChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const enabled = event.target.checked;
      actions.setSettings({
        departAtEnabled: enabled,
        ...(enabled && departAt.length === 0
          ? { departAt: formatDateTimeLocal(new Date()) }
          : {}),
      });
    },
    [actions, departAt],
  );

  const handleDepartAtChange = useCallback(
    (value: string) => {
      actions.setSettings({ departAt: value });
    },
    [actions],
  );

  const handleExcludeToggle = useCallback(
    (value: ExcludeOptionValue, enabled: boolean) => {
      const nextExclude = enabled
        ? [...exclude, value]
        : exclude.filter((item) => item !== value);

      actions.setSettings({ exclude: nextExclude });
    },
    [actions, exclude],
  );

  return {
    handleCalculate,
    handleDenoiseChange,
    handleDepartAtChange,
    handleDepartAtEnabledChange,
    handleExcludeToggle,
    handleGeneralizeChange,
    handleTimeIntervalsChange,
    handleTravelModeChange,
  };
}
