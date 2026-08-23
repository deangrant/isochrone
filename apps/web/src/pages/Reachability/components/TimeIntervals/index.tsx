import { useCallback, useEffect, useId, useState } from "react";
import { Button } from "@/components/core/Button";
import { Input } from "@/components/core/Input";
import {
  getNextUniqueInterval,
  getRowActions,
  type IntervalRowActions,
} from "@/pages/Reachability/utils/time-interval-row-actions";
import { MAX_TIME_INTERVAL_MINUTES } from "@/utils/build-contours";
import styles from "./index.module.css";
import { MAX_TIME_INTERVALS, type TimeIntervalsProps } from "./index.types";

interface IntervalRowProps {
  actions: IntervalRowActions;
  disabled: boolean;
  index: number;
  inputId: string;
  interval: number;
  onAdd: () => void;
  onChange: (index: number, value: string) => void;
  onRemove: (index: number) => void;
}

function IntervalRow({
  index,
  interval,
  inputId,
  disabled,
  actions,
  onChange,
  onRemove,
  onAdd,
}: IntervalRowProps) {
  const handleChange = useCallback(
    (value: string) => {
      onChange(index, value);
    },
    [index, onChange],
  );

  const handleRemove = useCallback(() => {
    onRemove(index);
  }, [index, onRemove]);

  const { showAdd, showRemove } = actions;

  return (
    <div className={styles.row}>
      <Input
        disabled={disabled}
        id={inputId}
        max={MAX_TIME_INTERVAL_MINUTES}
        min={1}
        onChange={handleChange}
        type="number"
        value={String(interval)}
      />
      {showAdd || showRemove ? (
        <div className={styles.actions}>
          {showRemove ? (
            <Button
              aria-label={`Remove interval ${index + 1}`}
              className={styles.action}
              disabled={disabled}
              onClick={handleRemove}
              title="Remove interval"
              variant="secondary"
            >
              ×
            </Button>
          ) : null}
          {showAdd ? (
            <Button
              aria-label="Add interval"
              className={styles.action}
              disabled={disabled}
              onClick={onAdd}
              title="Add interval"
              variant="secondary"
            >
              +
            </Button>
          ) : null}
        </div>
      ) : (
        <span aria-hidden="true" className={styles.actionSpacer} />
      )}
    </div>
  );
}

function createRowId(baseId: string): string {
  return `${baseId}-${crypto.randomUUID()}`;
}

/** Renders an editable list of up to three time intervals in minutes. */
export function TimeIntervals({
  intervals,
  onChange,
  disabled = false,
}: TimeIntervalsProps) {
  const baseId = useId();
  const [rowIds, setRowIds] = useState<string[]>(() =>
    intervals.map(() => createRowId(baseId)),
  );

  useEffect(() => {
    setRowIds((current) => {
      if (current.length === intervals.length) {
        return current;
      }

      if (current.length < intervals.length) {
        const additions = Array.from(
          { length: intervals.length - current.length },
          () => createRowId(baseId),
        );
        return [...current, ...additions];
      }

      return current.slice(0, intervals.length);
    });
  }, [baseId, intervals.length]);

  const handleIntervalChange = useCallback(
    (index: number, value: string) => {
      const nextValue = Number(value);
      if (!Number.isFinite(nextValue)) {
        return;
      }

      const isDuplicate = intervals.some(
        (interval, currentIndex) =>
          currentIndex !== index && interval === nextValue,
      );
      if (isDuplicate) {
        return;
      }

      const nextIntervals = intervals.map((interval, currentIndex) =>
        currentIndex === index ? nextValue : interval,
      );
      onChange(nextIntervals);
    },
    [intervals, onChange],
  );

  const handleAddInterval = useCallback(() => {
    if (intervals.length >= MAX_TIME_INTERVALS) {
      return;
    }

    const nextValue = getNextUniqueInterval(intervals);
    if (nextValue === null) {
      return;
    }

    setRowIds((current) => [...current, createRowId(baseId)]);
    onChange([...intervals, nextValue]);
  }, [baseId, intervals, onChange]);

  const handleRemoveInterval = useCallback(
    (index: number) => {
      if (intervals.length <= 1) {
        return;
      }

      setRowIds((current) =>
        current.filter((_, currentIndex) => currentIndex !== index),
      );
      onChange(intervals.filter((_, currentIndex) => currentIndex !== index));
    },
    [intervals, onChange],
  );

  return (
    <div className={styles.list}>
      {intervals.map((interval, index) => {
        const rowId = rowIds[index];
        const inputId = `${rowId}-input`;

        return (
          <IntervalRow
            actions={getRowActions(index, intervals.length)}
            disabled={disabled}
            index={index}
            inputId={inputId}
            interval={interval}
            key={rowId}
            onAdd={handleAddInterval}
            onChange={handleIntervalChange}
            onRemove={handleRemoveInterval}
          />
        );
      })}
    </div>
  );
}
