import { useId } from "react";
import { Button } from "@/components/core/Button";
import buttonStyles from "@/components/core/Button/index.module.css";
import { Spinner } from "@/components/core/Spinner";
import { Toggle } from "@/components/core/Toggle";
import { DateTimePicker } from "@/components/patterns/DateTimePicker";
import { FormField } from "@/components/patterns/FormField";
import { LocationSearch } from "@/components/patterns/LocationSearch";
import { supportsExcludeProfile } from "@/constants/exclude-options.constants";
import { useReachability } from "@/contexts/ReachabilityContext";
import { ExcludeOptions } from "@/pages/Reachability/components/ExcludeOptions";
import { TimeIntervals } from "@/pages/Reachability/components/TimeIntervals";
import { TravelModeTiles } from "@/pages/Reachability/components/TravelModeTiles";
import { useIsochronePanelHandlers } from "@/pages/Reachability/hooks/use-isochrone-panel-handlers";
import styles from "./index.module.css";

/** Left panel with isochrone settings, calculate, and export controls. */
export function IsochronePanel() {
  const { state, actions } = useReachability();
  const handlers = useIsochronePanelHandlers(
    actions,
    state.settings.departAt,
    state.settings.exclude,
  );
  const locationId = useId();
  const denoiseId = useId();
  const generalizeId = useId();
  const departAtEnabledId = useId();
  const departAtId = useId();
  const excludeAvailable = supportsExcludeProfile(state.settings.travelMode);

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <h1 className={styles.title}>Isochrones</h1>
        <p className={styles.subtitle}>
          See how far you can travel within selected time limits.
        </p>
      </header>

      <div className={styles.body}>
        <FormField htmlFor={locationId} label="Location">
          <LocationSearch
            disabled={state.calculating}
            id={locationId}
            onQueryChange={actions.setLocationQuery}
            onSelectSuggestion={actions.selectGeocodingSuggestion}
            placeholder="Search"
            query={state.settings.locationQuery}
            suggestions={state.geocodingSuggestions}
          />
        </FormField>

        <FormField label="Routing profile">
          <TravelModeTiles
            disabled={state.calculating}
            onChange={handlers.handleTravelModeChange}
            value={state.settings.travelMode}
          />
        </FormField>

        <FormField label="Time intervals (min)">
          <TimeIntervals
            disabled={state.calculating}
            intervals={state.settings.timeIntervals}
            onChange={handlers.handleTimeIntervalsChange}
          />
        </FormField>

        <FormField htmlFor={denoiseId} label="Denoise">
          <div className={styles.sliderRow}>
            <input
              className={styles.slider}
              disabled={state.calculating}
              id={denoiseId}
              max={1}
              min={0}
              onChange={handlers.handleDenoiseChange}
              step={0.1}
              type="range"
              value={state.settings.denoise}
            />
            <span className={styles.sliderValue}>
              {state.settings.denoise.toFixed(1)}
            </span>
          </div>
        </FormField>

        <FormField htmlFor={generalizeId} label="Generalize">
          <div className={styles.sliderRow}>
            <input
              className={styles.slider}
              disabled={state.calculating}
              id={generalizeId}
              max={200}
              min={0}
              onChange={handlers.handleGeneralizeChange}
              step={1}
              type="range"
              value={state.settings.generalize}
            />
            <span className={styles.sliderValue}>
              {state.settings.generalize}
            </span>
          </div>
        </FormField>

        <div className={styles.departAtSection}>
          <div className={styles.departAtHeader}>
            <span className={styles.departAtLabel}>Depart at</span>
            <Toggle
              aria-label="Depart at"
              checked={state.settings.departAtEnabled}
              disabled={state.calculating}
              id={departAtEnabledId}
              onChange={handlers.handleDepartAtEnabledChange}
            />
          </div>
          {state.settings.departAtEnabled ? (
            <DateTimePicker
              clearable
              disabled={state.calculating}
              id={departAtId}
              onChange={handlers.handleDepartAtChange}
              value={state.settings.departAt}
            />
          ) : null}
        </div>

        {excludeAvailable ? (
          <div className={styles.excludeSection}>
            <span className={styles.sectionLabel}>Exclude</span>
            <ExcludeOptions
              disabled={state.calculating}
              onToggle={handlers.handleExcludeToggle}
              selected={state.settings.exclude}
            />
          </div>
        ) : null}

        {state.error ? <p className={styles.error}>{state.error}</p> : null}

        <div className={styles.actions}>
          <Button
            className={`${buttonStyles.fullWidth}`}
            disabled={state.calculating || !state.origin}
            onClick={handlers.handleCalculate}
          >
            {state.calculating ? <Spinner label="Calculating…" /> : "Calculate"}
          </Button>
        </div>
      </div>
    </div>
  );
}
