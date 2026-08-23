import { MAP_FIT_PADDING_BASE } from "@/constants/api.constants";

/** Padding passed to Mapbox fitBounds. */
export interface MapFitPadding {
  /** Padding in pixels below the fitted bounds. */
  bottom: number;
  /** Padding in pixels to the left of the fitted bounds. */
  left: number;
  /** Padding in pixels to the right of the fitted bounds. */
  right: number;
  /** Padding in pixels above the fitted bounds. */
  top: number;
}

/** Viewport dimensions used when deriving map fit padding. */
export interface MapFitViewport {
  /** Viewport height in pixels. */
  height: number;
  /** Viewport width in pixels. */
  width: number;
}

const DEFAULT_PADDING: MapFitPadding = {
  bottom: MAP_FIT_PADDING_BASE,
  left: MAP_FIT_PADDING_BASE,
  right: MAP_FIT_PADDING_BASE,
  top: MAP_FIT_PADDING_BASE,
};

/**
 * Derives fitBounds padding from the settings panel layout.
 * @param rect Panel bounding box relative to the viewport.
 * @param isBottomSheet Whether the panel is rendered as a bottom sheet.
 */
export function panelRectToFitPadding(
  rect: Pick<DOMRect, "height" | "right" | "top" | "width">,
  viewport: MapFitViewport,
  isBottomSheet: boolean,
): MapFitPadding {
  if (rect.width <= 0 || rect.height <= 0) {
    return DEFAULT_PADDING;
  }

  if (isBottomSheet) {
    return {
      bottom: viewport.height - rect.top + MAP_FIT_PADDING_BASE,
      left: MAP_FIT_PADDING_BASE,
      right: MAP_FIT_PADDING_BASE,
      top: MAP_FIT_PADDING_BASE,
    };
  }

  return {
    bottom: MAP_FIT_PADDING_BASE,
    left: rect.right + MAP_FIT_PADDING_BASE,
    right: MAP_FIT_PADDING_BASE,
    top: MAP_FIT_PADDING_BASE,
  };
}
