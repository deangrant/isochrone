import type { MouseEvent, RefObject } from "react";

/** One cell in the calendar month grid. */
export interface CalendarCell {
  /** Day of month, or null for leading or trailing padding cells. */
  day: number | null;
  /** Stable React key for the cell. */
  key: string;
}

/** Props for the date-time picker calendar popover. */
export interface DateTimePickerPopoverProps {
  /** Month grid cells for the visible calendar. */
  calendarCells: CalendarCell[];
  /** Ref attached to the dialog element. */
  dialogRef: RefObject<HTMLDialogElement | null>;
  /** Disables month navigation and time selection. */
  disabled: boolean;
  /** Id of the hour select for label association. */
  hourSelectId: string;
  /** Id of the minute select for label association. */
  minuteSelectId: string;
  /** Notifies the parent when a calendar day is chosen. */
  onDayClick: (event: MouseEvent<HTMLButtonElement>) => void;
  /** Notifies the parent when the user confirms the selection. */
  onDone: () => void;
  /** Notifies the parent when the hour changes. */
  onHourChange: (hour: string) => void;
  /** Notifies the parent when the minute changes. */
  onMinuteChange: (minute: string) => void;
  /** Notifies the parent when the next month is requested. */
  onNextMonth: () => void;
  /** Notifies the parent when the previous month is requested. */
  onPreviousMonth: () => void;
  /** Id of the popover for aria-controls. */
  popoverId: string;
  /** Currently selected date, or null when unset. */
  selected: Date | null;
  /** Today's date for highlighting the current day. */
  today: Date;
  /** Zero-based month index shown in the calendar. */
  viewMonth: number;
  /** Four-digit year shown in the calendar. */
  viewYear: number;
}
