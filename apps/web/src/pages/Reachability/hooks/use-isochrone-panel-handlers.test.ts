import { act, renderHook } from "@testing-library/react";
import type { ChangeEvent } from "react";
import { describe, expect, it, vi } from "vitest";
import type { ExcludeOptionValue } from "@/constants/exclude-options.constants";
import { useIsochronePanelHandlers } from "./use-isochrone-panel-handlers";

const DATE_TIME_LOCAL_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

function createChangeEvent(
  value: string | boolean,
): ChangeEvent<HTMLInputElement> {
  return {
    target: {
      checked: typeof value === "boolean" ? value : undefined,
      value: typeof value === "string" ? value : "",
    },
  } as ChangeEvent<HTMLInputElement>;
}

describe("useIsochronePanelHandlers", () => {
  it("auto-fills departAt when enabling the toggle with an empty value", () => {
    const setSettings = vi.fn();
    const calculate = vi.fn();

    const { result } = renderHook(() =>
      useIsochronePanelHandlers({ calculate, setSettings }, "", []),
    );

    act(() => {
      result.current.handleDepartAtEnabledChange(createChangeEvent(true));
    });

    expect(setSettings).toHaveBeenCalledWith(
      expect.objectContaining({
        departAt: expect.stringMatching(DATE_TIME_LOCAL_PATTERN),
        departAtEnabled: true,
      }),
    );
  });

  it("adds and removes exclude values", () => {
    const setSettings = vi.fn();
    const calculate = vi.fn();

    const { result, rerender } = renderHook(
      ({ exclude }) =>
        useIsochronePanelHandlers({ calculate, setSettings }, "", exclude),
      { initialProps: { exclude: [] as ExcludeOptionValue[] } },
    );

    act(() => {
      result.current.handleExcludeToggle("toll", true);
    });

    expect(setSettings).toHaveBeenCalledWith({ exclude: ["toll"] });

    rerender({ exclude: ["toll"] });

    act(() => {
      result.current.handleExcludeToggle("toll", false);
    });

    expect(setSettings).toHaveBeenLastCalledWith({ exclude: [] });
  });

  it("parses denoise and generalize slider values", () => {
    const setSettings = vi.fn();
    const calculate = vi.fn();

    const { result } = renderHook(() =>
      useIsochronePanelHandlers({ calculate, setSettings }, "", []),
    );

    act(() => {
      result.current.handleDenoiseChange(createChangeEvent("0.5"));
    });
    act(() => {
      result.current.handleGeneralizeChange(createChangeEvent("25"));
    });

    expect(setSettings).toHaveBeenCalledWith({ denoise: 0.5 });
    expect(setSettings).toHaveBeenCalledWith({ generalize: 25 });
  });
});
