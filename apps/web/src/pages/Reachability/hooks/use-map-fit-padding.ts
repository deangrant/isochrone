import { type RefObject, useEffect, useState } from "react";
import {
  MAP_FIT_PADDING_BASE,
  REACHABILITY_LAYOUT_BREAKPOINT_PX,
} from "@/constants/api.constants";
import {
  type MapFitPadding,
  panelRectToFitPadding,
} from "@/utils/map-fit-padding";

const DEFAULT_PADDING: MapFitPadding = {
  bottom: MAP_FIT_PADDING_BASE,
  left: MAP_FIT_PADDING_BASE,
  right: MAP_FIT_PADDING_BASE,
  top: MAP_FIT_PADDING_BASE,
};

function isBottomSheetLayout(): boolean {
  return window.matchMedia(
    `(max-width: ${REACHABILITY_LAYOUT_BREAKPOINT_PX}px)`,
  ).matches;
}

/**
 * Tracks map fit padding from the live settings panel layout.
 * @param panelRef Ref to the isochrone settings panel element.
 */
export function useMapFitPadding(
  panelRef: RefObject<HTMLElement | null>,
): MapFitPadding {
  const [fitPadding, setFitPadding] = useState<MapFitPadding>(DEFAULT_PADDING);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) {
      return;
    }

    const updatePadding = () => {
      const rect = panel.getBoundingClientRect();
      setFitPadding(
        panelRectToFitPadding(
          rect,
          {
            height: window.innerHeight,
            width: window.innerWidth,
          },
          isBottomSheetLayout(),
        ),
      );
    };

    updatePadding();

    const mediaQuery = window.matchMedia(
      `(max-width: ${REACHABILITY_LAYOUT_BREAKPOINT_PX}px)`,
    );
    const resizeObserver = new ResizeObserver(updatePadding);

    resizeObserver.observe(panel);
    window.addEventListener("resize", updatePadding);
    mediaQuery.addEventListener("change", updatePadding);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updatePadding);
      mediaQuery.removeEventListener("change", updatePadding);
    };
  }, [panelRef]);

  return fitPadding;
}
