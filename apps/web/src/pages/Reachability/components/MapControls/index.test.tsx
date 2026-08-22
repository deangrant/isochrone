import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MapControls } from "./index";

afterEach(() => {
  cleanup();
});

describe("MapControls", () => {
  it("calls onFitContours when the fit button is clicked", () => {
    const onExport = vi.fn();
    const onFitContours = vi.fn();

    render(<MapControls onExport={onExport} onFitContours={onFitContours} />);

    fireEvent.click(
      screen.getByRole("button", { name: "Fit contours to map" }),
    );

    expect(onFitContours).toHaveBeenCalledTimes(1);
    expect(onExport).not.toHaveBeenCalled();
  });

  it("calls onExport when the export button is clicked", () => {
    const onExport = vi.fn();
    const onFitContours = vi.fn();

    render(<MapControls onExport={onExport} onFitContours={onFitContours} />);

    fireEvent.click(screen.getByRole("button", { name: "Export contours" }));

    expect(onExport).toHaveBeenCalledTimes(1);
    expect(onFitContours).not.toHaveBeenCalled();
  });
});
