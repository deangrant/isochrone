/** Props for the themed date and time picker. */
export interface DateTimePickerProps {
  /** When true, shows a clear control when a value is set. */
  clearable?: boolean;
  /** Accessible label for the clear control. */
  clearLabel?: string;
  /** Disables opening the popover and editing the value. */
  disabled?: boolean;
  /** Associates the field with a label element. */
  id?: string;
  /** Notifies the parent when the datetime-local value changes. */
  onChange: (value: string) => void;
  /** Placeholder text shown when empty. */
  placeholder?: string;
  /** Controlled datetime-local value. */
  value: string;
}
