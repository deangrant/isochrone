import type { MouseEvent as ReactMouseEvent, SyntheticEvent } from "react";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  formatDateTimeDisplay,
  formatDateTimeLocal,
  getMonthCalendarDays,
  parseDateTimeLocal,
} from "@/utils/datetime-local";
import { defaultDateForView } from "@/utils/datetime-picker";
import { DateTimePickerPopover } from "./DateTimePickerPopover";
import styles from "./index.module.css";
import type { DateTimePickerProps } from "./index.types";

/** Renders a themed date and time picker with a custom calendar popover. */
export function DateTimePicker({
  id,
  value,
  onChange,
  disabled = false,
  clearable = false,
  clearLabel = "Clear",
  placeholder = "Select date and time",
}: DateTimePickerProps) {
  const popoverId = useId();
  const hourSelectId = useId();
  const minuteSelectId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const selected = parseDateTimeLocal(value);
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(
    () => selected?.getFullYear() ?? new Date().getFullYear(),
  );
  const [viewMonth, setViewMonth] = useState(
    () => selected?.getMonth() ?? new Date().getMonth(),
  );

  const today = useMemo(() => new Date(), []);
  const calendarDays = useMemo(
    () => getMonthCalendarDays(viewYear, viewMonth),
    [viewMonth, viewYear],
  );
  const calendarCells = useMemo(
    () =>
      calendarDays.map((day, offset) => ({
        day,
        key:
          day === null
            ? `${viewYear}-${viewMonth}-empty-${Math.floor(offset / 7)}-${offset % 7}`
            : `${viewYear}-${viewMonth}-${day}`,
      })),
    [calendarDays, viewMonth, viewYear],
  );
  const showClear = clearable && value.length > 0 && !disabled;

  useEffect(() => {
    const parsed = parseDateTimeLocal(value);
    if (!parsed) {
      return;
    }

    setViewYear(parsed.getFullYear());
    setViewMonth(parsed.getMonth());
  }, [value]);

  useEffect(() => {
    const dialog: HTMLDialogElement | null = dialogRef.current;
    if (dialog === null) {
      return;
    }

    const handleDialogClose = () => {
      setOpen(false);
    };

    dialog.addEventListener("close", handleDialogClose);

    if (open) {
      if (!dialog.open) {
        if (typeof dialog.showModal === "function") {
          dialog.showModal();
        } else {
          dialog.setAttribute("open", "");
        }
      }
    } else if (dialog.open) {
      if (typeof dialog.close === "function") {
        dialog.close();
      } else {
        dialog.removeAttribute("open");
      }
    }

    return () => {
      dialog.removeEventListener("close", handleDialogClose);
    };
  }, [open]);

  const updateDateTime = useCallback(
    (date: Date) => {
      onChange(formatDateTimeLocal(date));
    },
    [onChange],
  );

  const handleToggle = useCallback(() => {
    if (disabled) {
      return;
    }

    setOpen((current) => !current);
  }, [disabled]);

  const handleClear = useCallback(() => {
    onChange("");
    setOpen(false);
  }, [onChange]);

  const handleDone = useCallback(() => {
    setOpen(false);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleCancel = useCallback(
    (event: SyntheticEvent<HTMLDialogElement>) => {
      event.preventDefault();
      setOpen(false);
    },
    [],
  );

  const handlePreviousMonth = useCallback(() => {
    if (viewMonth === 0) {
      setViewYear((currentYear) => currentYear - 1);
      setViewMonth(11);
      return;
    }

    setViewMonth((currentMonth) => currentMonth - 1);
  }, [viewMonth]);

  const handleNextMonth = useCallback(() => {
    if (viewMonth === 11) {
      setViewYear((currentYear) => currentYear + 1);
      setViewMonth(0);
      return;
    }

    setViewMonth((currentMonth) => currentMonth + 1);
  }, [viewMonth]);

  const handleDaySelect = useCallback(
    (day: number) => {
      const base = defaultDateForView(viewYear, viewMonth, selected);
      updateDateTime(
        new Date(viewYear, viewMonth, day, base.getHours(), base.getMinutes()),
      );
    },
    [selected, updateDateTime, viewMonth, viewYear],
  );

  const handleDayClick = useCallback(
    (event: ReactMouseEvent<HTMLButtonElement>) => {
      const day = Number(event.currentTarget.dataset.day);
      if (!Number.isFinite(day)) {
        return;
      }

      handleDaySelect(day);
    },
    [handleDaySelect],
  );

  const handleHourChange = useCallback(
    (hour: string) => {
      const base = defaultDateForView(viewYear, viewMonth, selected);
      updateDateTime(
        new Date(
          base.getFullYear(),
          base.getMonth(),
          base.getDate(),
          Number(hour),
          base.getMinutes(),
        ),
      );
    },
    [selected, updateDateTime, viewMonth, viewYear],
  );

  const handleMinuteChange = useCallback(
    (minute: string) => {
      const base = defaultDateForView(viewYear, viewMonth, selected);
      updateDateTime(
        new Date(
          base.getFullYear(),
          base.getMonth(),
          base.getDate(),
          base.getHours(),
          Number(minute),
        ),
      );
    },
    [selected, updateDateTime, viewMonth, viewYear],
  );

  return (
    <div className={styles.root}>
      <div className={styles.triggerRow}>
        <button
          aria-controls={open ? popoverId : undefined}
          aria-expanded={open}
          aria-haspopup="dialog"
          className={[
            styles.trigger,
            showClear ? styles.triggerWithClear : undefined,
          ]
            .filter(Boolean)
            .join(" ")}
          disabled={disabled}
          id={id}
          onClick={handleToggle}
          type="button"
        >
          {selected ? (
            formatDateTimeDisplay(selected)
          ) : (
            <span className={styles.placeholder}>{placeholder}</span>
          )}
        </button>
        {showClear ? (
          <button
            aria-label={clearLabel}
            className={styles.clear}
            onClick={handleClear}
            type="button"
          >
            <span aria-hidden="true">×</span>
          </button>
        ) : null}
      </div>
      <DateTimePickerPopover
        calendarCells={calendarCells}
        dialogRef={dialogRef}
        disabled={disabled}
        hourSelectId={hourSelectId}
        minuteSelectId={minuteSelectId}
        onCancel={handleCancel}
        onClose={handleClose}
        onDayClick={handleDayClick}
        onDone={handleDone}
        onHourChange={handleHourChange}
        onMinuteChange={handleMinuteChange}
        onNextMonth={handleNextMonth}
        onPreviousMonth={handlePreviousMonth}
        popoverId={popoverId}
        selected={selected}
        today={today}
        viewMonth={viewMonth}
        viewYear={viewYear}
      />
    </div>
  );
}
