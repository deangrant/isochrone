import { describe, expect, it } from "vitest";
import {
  MAP_FIT_PADDING_BASE,
  REACHABILITY_PANEL_INSET_PX,
  REACHABILITY_SIDE_PANEL_MAX_WIDTH_PX,
} from "@/pages/Reachability/constants/reachability-layout.constants";
import {
  desktopSidePanelFallbackPadding,
  panelRectToFitPadding,
} from "@/pages/Reachability/utils/map-fit-padding";

describe("desktopSidePanelFallbackPadding", () => {
  it("uses panel width and inset for desktop left padding", () => {
    expect(desktopSidePanelFallbackPadding(false)).toEqual({
      bottom: MAP_FIT_PADDING_BASE,
      left:
        REACHABILITY_PANEL_INSET_PX +
        REACHABILITY_SIDE_PANEL_MAX_WIDTH_PX +
        MAP_FIT_PADDING_BASE,
      right: MAP_FIT_PADDING_BASE,
      top: MAP_FIT_PADDING_BASE,
    });
  });

  it("uses uniform padding for bottom-sheet layout", () => {
    expect(desktopSidePanelFallbackPadding(true)).toEqual({
      bottom: MAP_FIT_PADDING_BASE,
      left: MAP_FIT_PADDING_BASE,
      right: MAP_FIT_PADDING_BASE,
      top: MAP_FIT_PADDING_BASE,
    });
  });
});

describe("panelRectToFitPadding", () => {
  it("uses left padding for desktop side-panel layout", () => {
    const padding = panelRectToFitPadding(
      { height: 600, right: 372, top: 12, width: 360 },
      { height: 800, width: 1280 },
      false,
    );

    expect(padding).toEqual({
      bottom: MAP_FIT_PADDING_BASE,
      left: 372 + MAP_FIT_PADDING_BASE,
      right: MAP_FIT_PADDING_BASE,
      top: MAP_FIT_PADDING_BASE,
    });
  });

  it("uses bottom padding for bottom-sheet layout", () => {
    const padding = panelRectToFitPadding(
      { height: 400, right: 760, top: 360, width: 736 },
      { height: 800, width: 800 },
      true,
    );

    expect(padding).toEqual({
      bottom: 800 - 360 + MAP_FIT_PADDING_BASE,
      left: MAP_FIT_PADDING_BASE,
      right: MAP_FIT_PADDING_BASE,
      top: MAP_FIT_PADDING_BASE,
    });
  });

  it("falls back to uniform padding when the panel has no size", () => {
    const padding = panelRectToFitPadding(
      { height: 0, right: 0, top: 0, width: 0 },
      { height: 800, width: 1280 },
      false,
    );

    expect(padding).toEqual({
      bottom: MAP_FIT_PADDING_BASE,
      left: MAP_FIT_PADDING_BASE,
      right: MAP_FIT_PADDING_BASE,
      top: MAP_FIT_PADDING_BASE,
    });
  });
});
