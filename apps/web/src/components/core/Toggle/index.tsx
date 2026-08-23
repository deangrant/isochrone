import styles from "./index.module.css";
import type { ToggleProps } from "./index.types";

/** Renders an accessible on/off switch used in panel settings. */
export function Toggle({
  id,
  checked,
  disabled = false,
  onChange,
  "aria-label": ariaLabel,
}: ToggleProps) {
  return (
    <label className={styles.root}>
      <input
        aria-label={ariaLabel}
        checked={checked}
        className={styles.input}
        disabled={disabled}
        id={id}
        onChange={onChange}
        type="checkbox"
      />
      <span aria-hidden="true" className={styles.track}>
        <span className={styles.thumb} />
      </span>
    </label>
  );
}
