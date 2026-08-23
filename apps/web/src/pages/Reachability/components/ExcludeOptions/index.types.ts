import type { ExcludeOptionValue } from "@/pages/Reachability/constants/exclude-options.constants";

/** Props for the exclude option list. */
export interface ExcludeOptionsProps {
  disabled?: boolean;
  onToggle: (value: ExcludeOptionValue, enabled: boolean) => void;
  selected: readonly ExcludeOptionValue[];
}
