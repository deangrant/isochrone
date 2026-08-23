import styles from "./index.module.css";
import type { ButtonProps } from "./index.types";

/** Renders the primary action control used across the reachability chrome. */
export function Button({
  children,
  variant = "primary",
  disabled = false,
  type = "button",
  onClick,
  className,
  title,
  "aria-controls": ariaControls,
  "aria-expanded": ariaExpanded,
  "aria-label": ariaLabel,
}: ButtonProps) {
  const classes = [styles.root, styles[variant], className]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      aria-controls={ariaControls}
      aria-expanded={ariaExpanded}
      aria-label={ariaLabel}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      title={title}
      type={type}
    >
      {children}
    </button>
  );
}
