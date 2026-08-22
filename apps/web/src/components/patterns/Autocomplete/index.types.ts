/** Props for the Autocomplete pattern. */
export interface AutocompleteProps {
  disabled?: boolean;
  id?: string;
  onChange: (value: string) => void;
  onSelect: (value: string) => void;
  placeholder?: string;
  suggestions: string[];
  value: string;
}

/** Props for one suggestion row. */
export interface SuggestionItemProps {
  active: boolean;
  id: string;
  onSelect: (value: string) => void;
  suggestion: string;
}
