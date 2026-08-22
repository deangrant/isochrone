/** Props for the native Select core control. */
export interface SelectProps {
  "aria-label"?: string;
  "aria-labelledby"?: string;
  disabled?: boolean;
  id?: string;
  onChange: (value: string) => void;
  options: readonly { label: string; value: string }[];
  value: string;
}
