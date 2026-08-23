import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Autocomplete } from "./index";

afterEach(() => {
  cleanup();
});

const SUGGESTIONS = ["London, UK", "London, UK"];

describe("Autocomplete", () => {
  it("selects the active suggestion with Enter", () => {
    const onSelect = vi.fn();

    render(
      <Autocomplete
        onChange={vi.fn()}
        onSelect={onSelect}
        suggestions={SUGGESTIONS}
        value="London"
      />,
    );

    const input = screen.getByRole("combobox");
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(onSelect).toHaveBeenCalledWith(0);
  });

  it("moves the active suggestion with arrow keys and selects by index", () => {
    const onSelect = vi.fn();

    render(
      <Autocomplete
        onChange={vi.fn()}
        onSelect={onSelect}
        suggestions={SUGGESTIONS}
        value="London"
      />,
    );

    const input = screen.getByRole("combobox");
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(onSelect).toHaveBeenCalledWith(1);
  });

  it("closes the listbox on Escape without selecting", () => {
    const onSelect = vi.fn();

    render(
      <Autocomplete
        onChange={vi.fn()}
        onSelect={onSelect}
        suggestions={SUGGESTIONS}
        value="London"
      />,
    );

    const input = screen.getByRole("combobox");
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(screen.getAllByRole("option")).toHaveLength(2);

    fireEvent.keyDown(input, { key: "Escape" });
    expect(screen.queryAllByRole("option")).toHaveLength(0);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("ignores arrow keys when there are no suggestions", () => {
    const onSelect = vi.fn();

    render(
      <Autocomplete
        onChange={vi.fn()}
        onSelect={onSelect}
        suggestions={[]}
        value="London"
      />,
    );

    const input = screen.getByRole("combobox");
    fireEvent.keyDown(input, { key: "ArrowDown" });

    expect(screen.queryAllByRole("option")).toHaveLength(0);
    expect(onSelect).not.toHaveBeenCalled();
  });
});
