/** Props for the themed date and time picker. */
export interface DateTimePickerProps {
  clearable?: boolean;
  clearLabel?: string;
  disabled?: boolean;
  id?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
}
