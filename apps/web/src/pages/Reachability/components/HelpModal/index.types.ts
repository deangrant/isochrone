/** Props for the reachability help dialog. */
export interface HelpModalProps {
  /** Notifies the parent that the dialog should close. */
  onClose: () => void;
  /** When true the dialog is visible. */
  open: boolean;
}
