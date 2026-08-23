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
  calendarCells: CalendarCell[];
  dialogRef: RefObject<HTMLDialogElement | null>;
  disabled: boolean;
  hourSelectId: string;
  minuteSelectId: string;
  onDayClick: (event: MouseEvent<HTMLButtonElement>) => void;
  onDone: () => void;
  onHourChange: (hour: string) => void;
  onMinuteChange: (minute: string) => void;
  onNextMonth: () => void;
  onPreviousMonth: () => void;
  popoverId: string;
  selected: Date | null;
  today: Date;
  viewMonth: number;
  viewYear: number;
}
