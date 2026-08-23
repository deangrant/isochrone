import type { MouseEvent, RefObject } from "react";

export interface CalendarCell {
  day: number | null;
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
