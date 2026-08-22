import type { ReactNode } from "react";

/** Visual emphasis for the Button control. */
export type ButtonVariant = "primary" | "secondary" | "ghost";

/** Props for the shared Button core control. */
export interface ButtonProps {
  "aria-controls"?: string;
  "aria-expanded"?: boolean;
  "aria-label"?: string;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  title?: string;
  type?: "button" | "submit";
  variant?: ButtonVariant;
}
