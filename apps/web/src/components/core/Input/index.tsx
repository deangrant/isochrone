import { type ChangeEvent, useCallback } from "react";
import styles from "./index.module.css";
import type { InputProps } from "./index.types";

/** Renders a text input used in reachability panel fields. */
export function Input({
  id,
  value,
  placeholder,
  disabled,
  onBlur,
  onChange,
  onClear,
  onKeyDown,
  type = "text",
  autoComplete,
  clearable = false,
  clearLabel = "Clear",
  min,
  max,
  step,
  role,
  "aria-label": ariaLabel,
  "aria-expanded": ariaExpanded,
  "aria-controls": ariaControls,
  "aria-autocomplete": ariaAutocomplete,
  "aria-activedescendant": ariaActivedescendant,
}: InputProps) {
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.value);
    },
    [onChange],
  );

  const handleClear = useCallback(() => {
    if (onClear) {
      onClear();
      return;
    }

    onChange("");
  }, [onChange, onClear]);

  const showClear = clearable && value.length > 0 && !disabled;
  const isCombobox = role === "combobox";

  const input = (
    <input
      {...(isCombobox
        ? {
            "aria-activedescendant": ariaActivedescendant,
            "aria-autocomplete": ariaAutocomplete,
            "aria-controls": ariaControls,
            "aria-expanded": ariaExpanded,
          }
        : {})}
      aria-label={ariaLabel}
      autoComplete={autoComplete}
      className={[styles.root, showClear ? styles.withClear : undefined]
        .filter(Boolean)
        .join(" ")}
      disabled={disabled}
      id={id}
      max={max}
      min={min}
      onBlur={onBlur}
      onChange={handleChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      role={role}
      step={step}
      type={type}
      value={value}
    />
  );

  if (!clearable) {
    return input;
  }

  return (
    <div className={styles.wrap}>
      {input}
      {showClear ? (
        <button
          aria-label={clearLabel}
          className={styles.clear}
          onClick={handleClear}
          type="button"
        >
          <span aria-hidden="true">×</span>
        </button>
      ) : null}
    </div>
  );
}
