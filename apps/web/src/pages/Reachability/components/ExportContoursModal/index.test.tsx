import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { downloadGeoJson } from "@/services/geojson-download-service";
import { downloadWkt } from "@/services/wkt-download-service";
import { ExportContoursModal } from "./index";

const CONTOURS = {
  features: [
    {
      geometry: { coordinates: [], type: "Polygon" as const },
      properties: { contour: 10 },
      type: "Feature" as const,
    },
    {
      geometry: { coordinates: [], type: "Polygon" as const },
      properties: { contour: 20 },
      type: "Feature" as const,
    },
  ],
  type: "FeatureCollection" as const,
};

const EXPORT_OPTIONS = {
  contourIndices: [0, 1],
  data: CONTOURS,
};

vi.mock("@/services/geojson-download-service", () => ({
  downloadGeoJson: vi.fn(),
}));

vi.mock("@/services/wkt-download-service", () => ({
  downloadWkt: vi.fn(),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("ExportContoursModal", () => {
  it("defaults to GeoJSON selected and all contour tiles selected", () => {
    const onClose = vi.fn();

    render(
      <ExportContoursModal
        contours={CONTOURS}
        onClose={onClose}
        open
        profileLabel="Driving"
      />,
    );

    expect(
      screen.queryByRole("button", { name: "Close" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "GeoJSON", pressed: true }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "WKT", pressed: false }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Driving, 10 min", pressed: true }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Driving, 20 min", pressed: true }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Export" }));

    expect(downloadGeoJson).toHaveBeenCalledWith(EXPORT_OPTIONS);
    expect(downloadWkt).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("exports WKT when the WKT format tile is selected", () => {
    const onClose = vi.fn();

    render(
      <ExportContoursModal
        contours={CONTOURS}
        onClose={onClose}
        open
        profileLabel="Driving"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "WKT" }));
    fireEvent.click(screen.getByRole("button", { name: "Export" }));

    expect(downloadWkt).toHaveBeenCalledWith(EXPORT_OPTIONS);
    expect(downloadGeoJson).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("exports only selected contours after deselecting one tile", () => {
    const onClose = vi.fn();

    render(
      <ExportContoursModal
        contours={CONTOURS}
        onClose={onClose}
        open
        profileLabel="Driving"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Driving, 20 min" }));
    fireEvent.click(screen.getByRole("button", { name: "Export" }));

    expect(downloadGeoJson).toHaveBeenCalledWith({
      contourIndices: [0],
      data: CONTOURS,
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("exports a single contour when only one tile remains selected", () => {
    const onClose = vi.fn();

    render(
      <ExportContoursModal
        contours={CONTOURS}
        onClose={onClose}
        open
        profileLabel="Driving"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Driving, 10 min" }));
    fireEvent.click(screen.getByRole("button", { name: "Export" }));

    expect(downloadGeoJson).toHaveBeenCalledWith({
      contourIndices: [1],
      data: CONTOURS,
    });
  });

  it("disables export when no contours are selected", () => {
    const onClose = vi.fn();

    render(
      <ExportContoursModal
        contours={CONTOURS}
        onClose={onClose}
        open
        profileLabel="Driving"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Driving, 10 min" }));
    fireEvent.click(screen.getByRole("button", { name: "Driving, 20 min" }));

    expect(screen.getByRole("button", { name: "Export" })).toBeDisabled();
  });

  it("closes without exporting when Cancel is clicked", () => {
    const onClose = vi.fn();

    render(
      <ExportContoursModal
        contours={CONTOURS}
        onClose={onClose}
        open
        profileLabel="Driving"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(downloadGeoJson).not.toHaveBeenCalled();
    expect(downloadWkt).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
