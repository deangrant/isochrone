import { type ChangeEvent, useCallback } from "react";
import styles from "./index.module.css";
import type { SelectProps } from "./index.types";

/** Styled native select for panel dropdowns. */
export function Select({
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  id,
  value,
  options,
  disabled,
  onChange,
}: SelectProps) {
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      onChange(event.target.value);
    },
    [onChange],
  );

  return (
    <select
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={styles.root}
      disabled={disabled}
      id={id}
      onChange={handleChange}
      value={value}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
