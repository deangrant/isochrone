/** User-visible error when reach calculation fails unexpectedly. */
export const REACH_CALCULATION_FAILED_MESSAGE =
  "Reach calculation failed. Check your settings and try again.";

/** User-visible error when panel settings fail validation before a request. */
export const INVALID_SETTINGS_MESSAGE =
  "Check your travel times and other settings.";

/** User-visible error when export cannot produce a file. */
export const EXPORT_FAILED_MESSAGE =
  "We could not create a file from the selected areas. Try a different selection or format.";

/** User-visible error when calculate runs without a start location. */
export const MISSING_START_LOCATION_MESSAGE =
  "Choose a start location, then calculate again.";

/** User-visible error when the selected travel mode is invalid. */
export const INVALID_TRAVEL_MODE_MESSAGE =
  "Choose a travel mode, then calculate again.";

/** User-visible error when no travel times are configured. */
export const MISSING_TRAVEL_TIME_MESSAGE = "Add at least one travel time.";

/** User-visible error when too many travel times are configured. */
export const MAX_TRAVEL_TIMES_MESSAGE = "You can add up to 3 travel times.";

/** User-visible error when travel times are duplicated. */
export const DUPLICATE_TRAVEL_TIMES_MESSAGE =
  "Each travel time must be different.";

/** User-visible error when a travel time is outside the allowed range. */
export const TRAVEL_TIME_RANGE_MESSAGE =
  "Enter a travel time between 1 and 60 minutes.";

/** Accessible label for clearing the start location search field. */
export const CLEAR_SEARCH_LABEL = "Clear Search";
