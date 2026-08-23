/** Props for the Autocomplete pattern. */
export interface AutocompleteProps {
  clearable?: boolean;
  clearLabel?: string;
  disabled?: boolean;
  id?: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  onSelect: (index: number) => void;
  placeholder?: string;
  suggestions: string[];
  value: string;
}

/** Props for one suggestion row. */
export interface SuggestionItemProps {
  active: boolean;
  id: string;
  index: number;
  onSelect: (index: number) => void;
  suggestion: string;
}
