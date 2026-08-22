import { type ChangeEvent, useCallback } from "react";
import {
  TRAVEL_MODE_OPTIONS,
  type TravelMode,
} from "@/constants/travel-modes.constants";
import styles from "./index.module.css";
import type { TravelModeTilesProps } from "./index.types";

/** Icon tile picker for driving, traffic, walking, and cycling. */
export function TravelModeTiles({
  value,
  onChange,
  disabled = false,
}: TravelModeTilesProps) {
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.value as TravelMode);
    },
    [onChange],
  );

  return (
    <div aria-label="Routing profile" className={styles.root} role="radiogroup">
      {TRAVEL_MODE_OPTIONS.map((option) => {
        const selected = option.value === value;
        const { Icon } = option;
        const inputId = `travel-mode-${option.value}`;

        return (
          <label
            className={`${styles.tile} ${selected ? styles.selected : ""}`}
            htmlFor={inputId}
            key={option.value}
          >
            <input
              checked={selected}
              className={styles.input}
              disabled={disabled}
              id={inputId}
              name="travel-mode"
              onChange={handleChange}
              type="radio"
              value={option.value}
            />
            <Icon />
            <span className={styles.label}>{option.label}</span>
          </label>
        );
      })}
    </div>
  );
}
