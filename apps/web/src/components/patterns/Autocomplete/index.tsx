import type {
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
} from "react";
import { useCallback, useId, useState } from "react";
import { Input } from "@/components/core/Input";
import styles from "./index.module.css";
import type { AutocompleteProps, SuggestionItemProps } from "./index.types";

/** Renders a text input with a lightweight suggestion dropdown. */
export function Autocomplete({
  id,
  value,
  suggestions,
  placeholder,
  disabled,
  clearable = false,
  clearLabel,
  onChange,
  onClear,
  onSelect,
}: AutocompleteProps) {
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const menuOpen = open && suggestions.length > 0;
  const activeOptionIndex =
    activeIndex >= 0 && activeIndex < suggestions.length ? activeIndex : -1;
  const activeOptionId =
    menuOpen && activeOptionIndex >= 0
      ? optionId(listId, activeOptionIndex)
      : undefined;

  const handleChange = useCallback(
    (next: string) => {
      onChange(next);
      setOpen(true);
      setActiveIndex(-1);
    },
    [onChange],
  );

  const handleSelect = useCallback(
    (index: number) => {
      onSelect(index);
      setOpen(false);
      setActiveIndex(-1);
    },
    [onSelect],
  );

  const closeMenu = useCallback(() => {
    setOpen(false);
    setActiveIndex(-1);
  }, []);

  const handleKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLInputElement>) => {
      switch (event.key) {
        case "Escape": {
          if (!open) {
            return;
          }
          event.preventDefault();
          closeMenu();
          return;
        }
        case "ArrowDown": {
          moveActive(event, suggestions, open, 1, setOpen, setActiveIndex);
          return;
        }
        case "ArrowUp": {
          moveActive(event, suggestions, open, -1, setOpen, setActiveIndex);
          return;
        }
        case "Enter": {
          if (!(open && activeOptionIndex >= 0)) {
            return;
          }
          event.preventDefault();
          handleSelect(activeOptionIndex);
          return;
        }
        default: {
          break;
        }
      }
    },
    [activeOptionIndex, closeMenu, handleSelect, open, suggestions],
  );

  return (
    <div className={styles.root}>
      <Input
        aria-activedescendant={activeOptionId}
        aria-autocomplete="list"
        aria-controls={listId}
        aria-expanded={menuOpen}
        autoComplete="off"
        clearable={clearable}
        clearLabel={clearLabel}
        disabled={disabled}
        id={id}
        onBlur={closeMenu}
        onChange={handleChange}
        onClear={onClear}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        role="combobox"
        value={value}
      />
      {menuOpen ? (
        <div className={styles.list} id={listId} role="listbox">
          {suggestions.map((suggestion, index) => (
            <SuggestionItem
              active={index === activeOptionIndex}
              id={optionId(listId, index)}
              index={index}
              key={optionId(listId, index)}
              onSelect={handleSelect}
              suggestion={suggestion}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function optionId(listId: string, index: number): string {
  return `${listId}-option-${index}`;
}

function moveActive(
  event: ReactKeyboardEvent<HTMLInputElement>,
  suggestions: string[],
  open: boolean,
  delta: 1 | -1,
  setOpen: (open: boolean) => void,
  setActiveIndex: (updater: (current: number) => number) => void,
): void {
  if (suggestions.length === 0) {
    return;
  }
  event.preventDefault();
  setOpen(true);
  const last = suggestions.length - 1;
  setActiveIndex((current) => {
    if (!open || current < 0 || current > last) {
      return delta > 0 ? 0 : last;
    }
    return Math.min(Math.max(current + delta, 0), last);
  });
}

function SuggestionItem({
  id,
  suggestion,
  index,
  active,
  onSelect,
}: SuggestionItemProps) {
  const handleClick = useCallback(() => {
    onSelect(index);
  }, [index, onSelect]);

  const handleMouseDown = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      event.preventDefault();
    },
    [],
  );

  const handleKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onSelect(index);
      }
    },
    [index, onSelect],
  );

  return (
    <div
      aria-selected={active}
      className={active ? `${styles.item} ${styles.itemActive}` : styles.item}
      id={id}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseDown={handleMouseDown}
      role="option"
      tabIndex={-1}
    >
      {suggestion}
    </div>
  );
}
