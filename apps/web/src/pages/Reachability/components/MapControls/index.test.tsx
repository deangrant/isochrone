import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MapControls } from "./index";

afterEach(() => {
  cleanup();
});

describe("MapControls", () => {
  it("calls onHelp when the help button is clicked", () => {
    const onHelp = vi.fn();
    const onExport = vi.fn();
    const onFitContours = vi.fn();

    render(
      <MapControls
        onExport={onExport}
        onFitContours={onFitContours}
        onHelp={onHelp}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Help" }));

    expect(onHelp).toHaveBeenCalledTimes(1);
    expect(onExport).not.toHaveBeenCalled();
    expect(onFitContours).not.toHaveBeenCalled();
  });

  it("hides fit and export controls when showResultControls is false", () => {
    render(
      <MapControls
        onExport={vi.fn()}
        onFitContours={vi.fn()}
        onHelp={vi.fn()}
        showResultControls={false}
      />,
    );

    expect(screen.getByRole("button", { name: "Help" })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Fit contours to map" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Export travel areas" }),
    ).not.toBeInTheDocument();
  });

  it("calls onFitContours when the fit button is clicked", () => {
    const onExport = vi.fn();
    const onFitContours = vi.fn();

    render(
      <MapControls
        onExport={onExport}
        onFitContours={onFitContours}
        onHelp={vi.fn()}
        showResultControls
      />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Fit contours to map" }),
    );

    expect(onFitContours).toHaveBeenCalledTimes(1);
    expect(onExport).not.toHaveBeenCalled();
  });

  it("calls onExport when the export button is clicked", () => {
    const onExport = vi.fn();
    const onFitContours = vi.fn();

    render(
      <MapControls
        onExport={onExport}
        onFitContours={onFitContours}
        onHelp={vi.fn()}
        showResultControls
      />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Export travel areas" }),
    );

    expect(onExport).toHaveBeenCalledTimes(1);
    expect(onFitContours).not.toHaveBeenCalled();
  });
});
