import type { FocusEventHandler, KeyboardEvent } from "react";

/** Props for the shared text Input core control. */
export interface InputProps {
  /** Active descendant id for combobox listbox options. */
  "aria-activedescendant"?: string;
  /** Autocomplete behavior hint for assistive tech. */
  "aria-autocomplete"?: "list" | "none";
  /** Id of the element controlled by this input. */
  "aria-controls"?: string;
  /** Whether the controlled popup is expanded. */
  "aria-expanded"?: boolean;
  /** Accessible name when no visible label is present. */
  "aria-label"?: string;
  /** Native autocomplete token for the field. */
  autoComplete?: string;
  /** When true, shows a clear control when the field has a value. */
  clearable?: boolean;
  /** Accessible label for the clear control. */
  clearLabel?: string;
  /** Disables editing and clear affordances. */
  disabled?: boolean;
  /** Associates the input with a label element. */
  id?: string;
  /** Maximum numeric value for number inputs. */
  max?: number | string;
  /** Minimum numeric value for number inputs. */
  min?: number | string;
  /** Notifies the parent when the input loses focus. */
  onBlur?: FocusEventHandler<HTMLInputElement>;
  /** Notifies the parent when the value changes. */
  onChange: (value: string) => void;
  /** Notifies the parent when the clear control is activated. */
  onClear?: () => void;
  /** Notifies the parent of key presses on the input. */
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  /** Placeholder text shown when empty. */
  placeholder?: string;
  /** Exposes the input as a combobox for assistive tech. */
  role?: "combobox";
  /** Step increment for number inputs. */
  step?: number;
  /** Native input type. */
  type?: "number" | "search" | "text";
  /** Controlled input value. */
  value: string;
}
