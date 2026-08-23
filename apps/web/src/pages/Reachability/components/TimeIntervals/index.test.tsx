import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  getNextUniqueInterval,
  getRowActions,
} from "@/pages/Reachability/utils/time-interval-row-actions";
import { TimeIntervals } from "./index";

describe("getNextUniqueInterval", () => {
  it("returns the next unused minute after the last interval", () => {
    expect(getNextUniqueInterval([10])).toBe(15);
  });

  it("skips values already in use", () => {
    expect(getNextUniqueInterval([10, 15])).toBe(20);
    expect(getNextUniqueInterval([60])).toBe(1);
    expect(getNextUniqueInterval([58, 59])).toBe(60);
  });

  it("returns null when every minute from 1 to 60 is already used", () => {
    const allMinutes = Array.from({ length: 60 }, (_, index) => index + 1);

    expect(getNextUniqueInterval(allMinutes)).toBeNull();
  });
});

describe("getRowActions", () => {
  it("shows add only on the last row when one interval exists", () => {
    expect(getRowActions(0, 1)).toEqual({ showAdd: true, showRemove: false });
  });

  it("shows remove on all rows and add on the last row when two intervals exist", () => {
    expect(getRowActions(0, 2)).toEqual({ showAdd: false, showRemove: true });
    expect(getRowActions(1, 2)).toEqual({ showAdd: true, showRemove: true });
  });

  it("shows remove only when at the maximum interval count", () => {
    expect(getRowActions(0, 3)).toEqual({ showAdd: false, showRemove: true });
    expect(getRowActions(1, 3)).toEqual({ showAdd: false, showRemove: true });
    expect(getRowActions(2, 3)).toEqual({ showAdd: false, showRemove: true });
  });
});

describe("TimeIntervals", () => {
  it("lets users remove the last interval when multiple intervals exist", () => {
    const onChange = vi.fn();

    render(<TimeIntervals intervals={[5, 10]} onChange={onChange} />);

    expect(screen.getByLabelText("Remove travel time 2")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Remove travel time 2"));

    expect(onChange).toHaveBeenCalledWith([5]);
  });

  it("does not emit duplicate interval values", () => {
    const onChange = vi.fn();

    render(<TimeIntervals intervals={[5, 10]} onChange={onChange} />);

    fireEvent.change(screen.getAllByRole("spinbutton")[0], {
      target: { value: "10" },
    });

    expect(onChange).not.toHaveBeenCalled();
  });

  it("adds the next unique interval when the default increment would duplicate", () => {
    const onChange = vi.fn();

    const { container } = render(
      <TimeIntervals intervals={[60]} onChange={onChange} />,
    );

    fireEvent.click(
      container.querySelector(
        'button[aria-label="Add travel time"]',
      ) as HTMLButtonElement,
    );

    expect(onChange).toHaveBeenCalledWith([60, 1]);
  });
});
