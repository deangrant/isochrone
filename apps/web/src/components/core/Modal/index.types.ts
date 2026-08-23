import type { ReactNode } from "react";

/** Props for the shared Modal dialog shell. */
export interface ModalProps {
  /** Optional class name applied to the dialog body container. */
  bodyClassName?: string;
  /** Dialog body content. */
  children: ReactNode;
  /** When true, clicking the backdrop dismisses the dialog. Defaults to true. */
  closeOnBackdrop?: boolean;
  /** When true, Escape dismisses the dialog. Defaults to true. */
  closeOnEscape?: boolean;
  /**
   * Notifies the parent when the dialog is dismissed (close button, backdrop, or Escape),
   * when those affordances are enabled.
   */
  onClose: () => void;
  /** When true the dialog is visible. */
  open: boolean;
  /** Optional class name applied to the dialog panel container. */
  panelClassName?: string;
  /** When true, shows the header close control. Defaults to true. */
  showCloseButton?: boolean;
  /** Accessible title announced by assistive tech. */
  title: string;
  /** Optional id for the title element; generated when omitted. */
  titleId?: string;
}
