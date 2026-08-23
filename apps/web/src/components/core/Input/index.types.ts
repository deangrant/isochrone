import type { FocusEventHandler, KeyboardEvent } from "react";

/** Props for the shared text Input core control. */
export interface InputProps {
  "aria-activedescendant"?: string;
  "aria-autocomplete"?: "list" | "none";
  "aria-controls"?: string;
  "aria-expanded"?: boolean;
  "aria-label"?: string;
  autoComplete?: string;
  clearable?: boolean;
  clearLabel?: string;
  disabled?: boolean;
  id?: string;
  max?: number | string;
  min?: number | string;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  onChange: (value: string) => void;
  onClear?: () => void;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  role?: "combobox";
  step?: number;
  type?: "number" | "search" | "text";
  value: string;
}
