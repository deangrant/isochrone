import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TimeIntervals } from "./index";
import { getRowActions } from "./row-actions";

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

    expect(screen.getByLabelText("Remove interval 2")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Remove interval 2"));

    expect(onChange).toHaveBeenCalledWith([5]);
  });
});
