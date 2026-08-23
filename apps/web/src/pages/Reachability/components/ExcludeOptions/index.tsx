import { type ChangeEvent, useCallback, useId } from "react";
import { Toggle } from "@/components/core/Toggle";
import { EXCLUDE_OPTIONS } from "@/constants/exclude-options.constants";
import styles from "./index.module.css";
import type { ExcludeOptionsProps } from "./index.types";

/** Renders a toggle list for Mapbox driving-profile exclude values. */
export function ExcludeOptions({
  selected,
  onToggle,
  disabled = false,
}: ExcludeOptionsProps) {
  const baseId = useId();

  return (
    <div className={styles.list}>
      {EXCLUDE_OPTIONS.map((option) => {
        const inputId = `${baseId}-${option.value}`;
        const checked = selected.includes(option.value);

        return (
          <ExcludeOptionRow
            ariaLabel={option.ariaLabel}
            checked={checked}
            disabled={disabled}
            inputId={inputId}
            key={option.value}
            label={option.label}
            onToggle={onToggle}
            value={option.value}
          />
        );
      })}
    </div>
  );
}

interface ExcludeOptionRowProps {
  ariaLabel: string;
  checked: boolean;
  disabled: boolean;
  inputId: string;
  label: string;
  onToggle: ExcludeOptionsProps["onToggle"];
  value: ExcludeOptionsProps["selected"][number];
}

function ExcludeOptionRow({
  value,
  label,
  ariaLabel,
  inputId,
  checked,
  disabled,
  onToggle,
}: ExcludeOptionRowProps) {
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onToggle(value, event.target.checked);
    },
    [onToggle, value],
  );

  return (
    <div className={styles.row}>
      <label className={styles.title} htmlFor={inputId}>
        {label}
      </label>
      <Toggle
        aria-label={ariaLabel}
        checked={checked}
        disabled={disabled}
        id={inputId}
        onChange={handleChange}
      />
    </div>
  );
}
