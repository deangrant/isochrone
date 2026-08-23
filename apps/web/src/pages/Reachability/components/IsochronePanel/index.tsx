import { useId } from "react";
import { Button } from "@/components/core/Button";
import buttonStyles from "@/components/core/Button/index.module.css";
import { Spinner } from "@/components/core/Spinner";
import { Toggle } from "@/components/core/Toggle";
import { DateTimePicker } from "@/components/patterns/DateTimePicker";
import { FormField } from "@/components/patterns/FormField";
import { supportsExcludeProfile } from "@/constants/exclude-options.constants";
import { CLEAR_SEARCH_LABEL } from "@/constants/reachability-ui-copy";
import {
  useReachabilityCalculationState,
  useReachabilitySettings,
} from "@/contexts/ReachabilityContext";
import { ExcludeOptions } from "@/pages/Reachability/components/ExcludeOptions";
import { LocationSearch } from "@/pages/Reachability/components/LocationSearch";
import { TimeIntervals } from "@/pages/Reachability/components/TimeIntervals";
import { TravelModeTiles } from "@/pages/Reachability/components/TravelModeTiles";
import { useIsochronePanelHandlers } from "@/pages/Reachability/hooks/use-isochrone-panel-handlers";
import styles from "./index.module.css";

/** Renders the left isochrone settings panel with calculate controls. */
export function IsochronePanel() {
  const { state: settingsState, actions: settingsActions } =
    useReachabilitySettings();
  const { state: calculationState, actions: calculationActions } =
    useReachabilityCalculationState();
  const handlers = useIsochronePanelHandlers(
    {
      calculate: calculationActions.calculate,
      setSettings: settingsActions.setSettings,
    },
    settingsState.settings.departAt,
    settingsState.settings.exclude,
  );
  const locationId = useId();
  const denoiseId = useId();
  const generalizeId = useId();
  const departAtEnabledId = useId();
  const departAtId = useId();
  const excludeAvailable = supportsExcludeProfile(
    settingsState.settings.travelMode,
  );
  const hasSearchToClear =
    settingsState.settings.locationQuery.length > 0 ||
    settingsState.origin !== null ||
    settingsState.result !== null;

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <h1 className={styles.title}>Travel reach</h1>
        <p className={styles.subtitle}>
          See where you can go within the travel times you choose.
        </p>
      </header>

      <div className={styles.body}>
        <FormField htmlFor={locationId} label="Start location">
          <LocationSearch
            disabled={calculationState.calculating}
            id={locationId}
            onClearLocation={settingsActions.clearLocation}
            onQueryChange={settingsActions.setLocationQuery}
            onSelectSuggestion={settingsActions.selectGeocodingSuggestion}
            placeholder="Search for a place or address"
            query={settingsState.settings.locationQuery}
            suggestions={settingsState.geocodingSuggestions}
          />
        </FormField>

        <FormField label="Travel mode">
          <TravelModeTiles
            disabled={calculationState.calculating}
            onChange={handlers.handleTravelModeChange}
            value={settingsState.settings.travelMode}
          />
        </FormField>

        <FormField label="Travel times (minutes)">
          <TimeIntervals
            disabled={calculationState.calculating}
            intervals={settingsState.settings.timeIntervals}
            onChange={handlers.handleTimeIntervalsChange}
          />
        </FormField>

        <FormField htmlFor={denoiseId} label="Contour smoothing">
          <div className={styles.sliderRow}>
            <input
              className={styles.slider}
              disabled={calculationState.calculating}
              id={denoiseId}
              max={1}
              min={0}
              onChange={handlers.handleDenoiseChange}
              step={0.1}
              type="range"
              value={settingsState.settings.denoise}
            />
            <span className={styles.sliderValue}>
              {settingsState.settings.denoise.toFixed(1)}
            </span>
          </div>
        </FormField>

        <FormField htmlFor={generalizeId} label="Shape simplification">
          <div className={styles.sliderRow}>
            <input
              className={styles.slider}
              disabled={calculationState.calculating}
              id={generalizeId}
              max={200}
              min={0}
              onChange={handlers.handleGeneralizeChange}
              step={1}
              type="range"
              value={settingsState.settings.generalize}
            />
            <span className={styles.sliderValue}>
              {settingsState.settings.generalize}
            </span>
          </div>
        </FormField>

        <div className={styles.departAtSection}>
          <div className={styles.departAtHeader}>
            <span className={styles.departAtLabel}>Departure time</span>
            <Toggle
              aria-label="Departure time"
              checked={settingsState.settings.departAtEnabled}
              disabled={calculationState.calculating}
              id={departAtEnabledId}
              onChange={handlers.handleDepartAtEnabledChange}
            />
          </div>
          {settingsState.settings.departAtEnabled ? (
            <DateTimePicker
              clearable
              disabled={calculationState.calculating}
              id={departAtId}
              onChange={handlers.handleDepartAtChange}
              placeholder="Select departure date and time"
              value={settingsState.settings.departAt}
            />
          ) : null}
        </div>

        {excludeAvailable ? (
          <div className={styles.excludeSection}>
            <span className={styles.sectionLabel}>Avoid on route</span>
            <ExcludeOptions
              disabled={calculationState.calculating}
              onToggle={handlers.handleExcludeToggle}
              selected={settingsState.settings.exclude}
            />
          </div>
        ) : null}

        {calculationState.error ? (
          <p className={styles.error}>{calculationState.error}</p>
        ) : null}

        <div className={styles.actions}>
          <Button
            className={`${buttonStyles.fullWidth}`}
            disabled={calculationState.calculating || !calculationState.origin}
            onClick={handlers.handleCalculate}
          >
            {calculationState.calculating ? (
              <Spinner label="Calculating…" />
            ) : (
              "Calculate"
            )}
          </Button>
          {hasSearchToClear ? (
            <Button
              className={buttonStyles.fullWidth}
              disabled={calculationState.calculating}
              onClick={settingsActions.clearLocation}
              variant="ghost"
            >
              {CLEAR_SEARCH_LABEL}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
