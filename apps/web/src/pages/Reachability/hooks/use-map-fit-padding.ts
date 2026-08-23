import { type RefObject, useLayoutEffect, useState } from "react";
import { REACHABILITY_LAYOUT_BREAKPOINT_PX } from "@/constants/api.constants";
import {
  desktopSidePanelFallbackPadding,
  type MapFitPadding,
  panelRectToFitPadding,
} from "@/utils/map-fit-padding";

function isBottomSheetLayout(): boolean {
  return window.matchMedia(
    `(max-width: ${REACHABILITY_LAYOUT_BREAKPOINT_PX}px)`,
  ).matches;
}

function getInitialPadding(): MapFitPadding {
  if (typeof window === "undefined") {
    return desktopSidePanelFallbackPadding(false);
  }

  return desktopSidePanelFallbackPadding(isBottomSheetLayout());
}

/**
 * Tracks map fit padding from the live settings panel layout.
 * @param panelRef Ref to the isochrone settings panel element.
 */
export function useMapFitPadding(
  panelRef: RefObject<HTMLElement | null>,
): MapFitPadding {
  const [fitPadding, setFitPadding] =
    useState<MapFitPadding>(getInitialPadding);

  useLayoutEffect(() => {
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
