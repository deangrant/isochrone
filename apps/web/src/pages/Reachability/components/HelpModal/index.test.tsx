import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { REACHABILITY_HELP_INTRO } from "@/pages/Reachability/constants/reachability-help-content";
import { HelpModal } from "./index";

afterEach(() => {
  cleanup();
});

describe("HelpModal", () => {
  it("renders the intro, section headings, and key topic titles", () => {
    render(<HelpModal onClose={vi.fn()} open />);

    expect(screen.getByText(REACHABILITY_HELP_INTRO)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "User guide" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Plan your trip" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Advanced options" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 4, name: "Start location" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 4, name: "Avoid on route" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Export travel areas" }),
    ).not.toBeInTheDocument();
  });

  it("renders only the footer Close button", () => {
    render(<HelpModal onClose={vi.fn()} open />);

    expect(screen.getAllByRole("button", { name: "Close" })).toHaveLength(1);
    expect(screen.queryByText("×")).not.toBeInTheDocument();
  });

  it("calls onClose when the footer Close button is clicked", () => {
    const onClose = vi.fn();

    render(<HelpModal onClose={onClose} open />);

    fireEvent.click(screen.getByRole("button", { name: "Close" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
