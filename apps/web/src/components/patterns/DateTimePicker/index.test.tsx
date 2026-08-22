import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DateTimePicker } from "./index";

const PLACEHOLDER_TRIGGER = /select date and time/i;
const SELECTED_TRIGGER = /22 Aug 2026, 15:30/i;

afterEach(() => {
  cleanup();
});

function getDialog(): HTMLDialogElement {
  const dialog = document.querySelector("dialog");
  if (!dialog) {
    throw new Error("Expected dialog element");
  }

  return dialog;
}

describe("DateTimePicker", () => {
  it("opens the dialog when the trigger is clicked", () => {
    render(<DateTimePicker onChange={vi.fn()} value="" />);

    fireEvent.click(screen.getByRole("button", { name: PLACEHOLDER_TRIGGER }));

    expect(getDialog()).toHaveAttribute("open");
  });

  it("closes the dialog when Done is clicked", () => {
    render(<DateTimePicker onChange={vi.fn()} value="2026-08-22T15:30" />);

    fireEvent.click(screen.getByRole("button", { name: SELECTED_TRIGGER }));
    fireEvent.click(within(getDialog()).getByRole("button", { name: "Done" }));

    expect(getDialog()).not.toHaveAttribute("open");
  });

  it("applies changes and closes when Done is clicked after selecting a day", () => {
    const onChange = vi.fn();

    render(<DateTimePicker onChange={onChange} value="2026-08-22T15:30" />);

    fireEvent.click(screen.getByRole("button", { name: SELECTED_TRIGGER }));
    fireEvent.click(within(getDialog()).getByRole("button", { name: "23" }));
    fireEvent.click(within(getDialog()).getByRole("button", { name: "Done" }));

    expect(onChange).toHaveBeenCalledWith("2026-08-23T15:30");
    expect(getDialog()).not.toHaveAttribute("open");
  });

  it("closes the dialog when clicking outside the picker", () => {
    const { container } = render(
      <div>
        <DateTimePicker onChange={vi.fn()} value="2026-08-22T15:30" />
        <button type="button">Outside</button>
      </div>,
    );

    fireEvent.click(
      within(container).getByRole("button", { name: SELECTED_TRIGGER }),
    );
    fireEvent.mouseDown(screen.getByRole("button", { name: "Outside" }));

    expect(getDialog()).not.toHaveAttribute("open");
  });
});
