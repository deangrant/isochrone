import type { ChangeEvent } from "react";

/** Props for the shared toggle switch control. */
export interface ToggleProps {
  "aria-label"?: string;
  checked: boolean;
  disabled?: boolean;
  id?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}
