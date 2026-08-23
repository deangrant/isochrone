import styles from "./index.module.css";
import type { FormFieldProps } from "./index.types";

/** Renders a label and control wrapper used in the reachability panel. */
export function FormField({ label, htmlFor, children, hint }: FormFieldProps) {
  return (
    <div className={styles.root}>
      <label className={styles.label} htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {hint ? <span className={styles.hint}>{hint}</span> : null}
    </div>
  );
}
