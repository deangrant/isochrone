/** Props for the Autocomplete pattern. */
export interface AutocompleteProps {
  /** When true, shows a clear control when the field has a value. */
  clearable?: boolean;
  /** Accessible label for the clear control. */
  clearLabel?: string;
  /** Disables typing and suggestion selection. */
  disabled?: boolean;
  /** Associates the combobox with a label element. */
  id?: string;
  /** Notifies the parent when the query value changes. */
  onChange: (value: string) => void;
  /** Notifies the parent when the clear control is activated. */
  onClear?: () => void;
  /** Notifies the parent when a suggestion is chosen. */
  onSelect: (index: number) => void;
  /** Placeholder text shown when empty. */
  placeholder?: string;
  /** Suggestion labels shown in the listbox. */
  suggestions: string[];
  /** Controlled query value. */
  value: string;
}

/** Props for one suggestion row. */
export interface SuggestionItemProps {
  /** Whether this row is keyboard-highlighted. */
  active: boolean;
  /** Stable id for aria-activedescendant. */
  id: string;
  /** Zero-based index in the suggestions list. */
  index: number;
  /** Notifies the parent when this suggestion is chosen. */
  onSelect: (index: number) => void;
  /** Display label for the suggestion. */
  suggestion: string;
}
