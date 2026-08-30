import { Button } from "@/components/core/Button";
import buttonStyles from "@/components/core/Button/index.module.css";
import { Select } from "@/components/core/Select";
import { formatMonthHeading, WEEKDAY_LABELS } from "@/utils/datetime-local";
import {
  defaultDateForView,
  HOUR_OPTIONS,
  MINUTE_OPTIONS,
} from "@/utils/datetime-picker";
import styles from "../index.module.css";
import type { DateTimePickerPopoverProps } from "./index.types";

/** Renders calendar and time controls shown inside the picker dialog. */
export function DateTimePickerPopover({
  popoverId,
  dialogRef,
  viewYear,
  viewMonth,
  selected,
  today,
  calendarCells,
  disabled,
  hourSelectId,
  minuteSelectId,
  onCancel,
  onClose,
  onPreviousMonth,
  onNextMonth,
  onDayClick,
  onDone,
  onHourChange,
  onMinuteChange,
}: DateTimePickerPopoverProps) {
  const baseDate = defaultDateForView(viewYear, viewMonth, selected);

  return (
    <dialog
      aria-label="Choose departure date and time"
      className={styles.popover}
      id={popoverId}
      onCancel={onCancel}
      ref={dialogRef}
    >
      <button
        aria-label="Close dialog"
        className={styles.backdrop}
        onClick={onClose}
        type="button"
      />
      <div className={styles.panel}>
        <div className={styles.calendarHeader}>
          <button
            aria-label="Previous month"
            className={styles.navButton}
            onClick={onPreviousMonth}
            type="button"
          >
            ‹
          </button>
          <span className={styles.monthLabel}>
            {formatMonthHeading(viewYear, viewMonth)}
          </span>
          <button
            aria-label="Next month"
            className={styles.navButton}
            onClick={onNextMonth}
            type="button"
          >
            ›
          </button>
        </div>
        <div className={styles.weekdays}>
          {WEEKDAY_LABELS.map((weekday) => (
            <span className={styles.weekday} key={weekday}>
              {weekday}
            </span>
          ))}
        </div>
        <div className={styles.days}>
          {calendarCells.map(({ day, key }) => {
            if (day === null) {
              return (
                <span
                  aria-hidden="true"
                  className={styles.dayEmpty}
                  key={key}
                />
              );
            }

            const isSelected =
              selected?.getFullYear() === viewYear &&
              selected.getMonth() === viewMonth &&
              selected.getDate() === day;
            const isToday =
              today.getFullYear() === viewYear &&
              today.getMonth() === viewMonth &&
              today.getDate() === day;

            return (
              <button
                className={[
                  styles.day,
                  isSelected ? styles.daySelected : undefined,
                  isToday ? styles.dayToday : undefined,
                ]
                  .filter(Boolean)
                  .join(" ")}
                data-day={day}
                key={key}
                onClick={onDayClick}
                type="button"
              >
                {day}
              </button>
            );
          })}
        </div>
        <div className={styles.timeRow}>
          <span className={styles.timeLabel}>Time</span>
          <Select
            aria-label="Hour"
            disabled={disabled}
            id={hourSelectId}
            onChange={onHourChange}
            options={HOUR_OPTIONS}
            value={String(baseDate.getHours())}
          />
          <span className={styles.timeSeparator}>:</span>
          <Select
            aria-label="Minute"
            disabled={disabled}
            id={minuteSelectId}
            onChange={onMinuteChange}
            options={MINUTE_OPTIONS}
            value={String(baseDate.getMinutes())}
          />
        </div>
        <div className={styles.doneRow}>
          <Button
            className={buttonStyles.fullWidth}
            onClick={onDone}
            type="button"
            variant="secondary"
          >
            Done
          </Button>
        </div>
      </div>
    </dialog>
  );
}
