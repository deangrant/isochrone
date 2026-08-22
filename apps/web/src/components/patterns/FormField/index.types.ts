import type { ReactNode } from "react";

/** Props for the FormField pattern. */
export interface FormFieldProps {
  children: ReactNode;
  hint?: string;
  htmlFor?: string;
  label: string;
}
