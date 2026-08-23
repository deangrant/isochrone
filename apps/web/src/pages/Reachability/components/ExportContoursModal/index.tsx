import type { MouseEvent } from "react";
import { useCallback, useState } from "react";
import { Button } from "@/components/core/Button";
import { Modal } from "@/components/core/Modal";
import {
  DEFAULT_EXPORT_FORMAT,
  EXPORT_FORMAT_OPTIONS,
} from "@/constants/contour-export.constants";
import { CONTOUR_EXPORTERS } from "@/pages/Reachability/utils/contour-exporters";
import {
  allContourIndices,
  buildContourExportOptions,
} from "@/utils/contour-export-options";
import styles from "./index.module.css";
import type {
  ContourExportFormat,
  ExportContoursModalProps,
} from "./index.types";

const EXPORT_ERROR_MESSAGE =
  "Export failed. The selected contours could not be converted.";

function parseContourIndex(value: string | undefined): number | null {
  const index = Number(value);
  if (!Number.isInteger(index) || index < 0) {
    return null;
  }

  return index;
}

function isContourExportFormat(
  value: string | undefined,
): value is ContourExportFormat {
  return EXPORT_FORMAT_OPTIONS.some((option) => option.format === value);
}

/** Renders contour scope options and triggers contour download. */
export function ExportContoursModal({
  open,
  onClose,
  contours,
  profileLabel,
}: ExportContoursModalProps) {
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(
    () => new Set(allContourIndices(contours)),
  );
  const [selectedFormat, setSelectedFormat] = useState<ContourExportFormat>(
    DEFAULT_EXPORT_FORMAT,
  );
  const [exportError, setExportError] = useState<string | null>(null);
  const options = buildContourExportOptions(contours, profileLabel);
  const canExport = selectedIndices.size > 0;

  const toggleContour = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    const index = parseContourIndex(event.currentTarget.dataset.contourIndex);
    if (index === null) {
      return;
    }

    setExportError(null);
    setSelectedIndices((current) => {
      const next = new Set(current);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }

      return next;
    });
  }, []);

  const selectFormat = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    const format = event.currentTarget.dataset.exportFormat;
    if (!isContourExportFormat(format)) {
      return;
    }

    setExportError(null);
    setSelectedFormat(format);
  }, []);

  const handleExport = useCallback(() => {
    const contourIndices = [...selectedIndices].sort(
      (left, right) => left - right,
    );
    const exportOptions = {
      contourIndices,
      data: contours,
    };

    try {
      CONTOUR_EXPORTERS[selectedFormat].download(exportOptions);
    } catch {
      setExportError(EXPORT_ERROR_MESSAGE);
      return;
    }

    onClose();
  }, [contours, onClose, selectedFormat, selectedIndices]);

  return (
    <Modal
      closeOnBackdrop={false}
      closeOnEscape={false}
      onClose={onClose}
      open={open}
      showCloseButton={false}
      title="Export contours"
    >
      <p className={styles.hint}>Select one or more contours to export.</p>
      {exportError ? <p className={styles.error}>{exportError}</p> : null}

      <fieldset className={styles.tiles}>
        <legend className={styles.legend}>Contours</legend>
        {options.map((option) => {
          const isSelected = selectedIndices.has(option.index);

          return (
            <button
              aria-label={option.label}
              aria-pressed={isSelected}
              className={[styles.tile, isSelected ? styles.tileSelected : ""]
                .filter(Boolean)
                .join(" ")}
              data-contour-index={String(option.index)}
              key={option.index}
              onClick={toggleContour}
              type="button"
            >
              <span className={styles.tileLabel}>{option.label}</span>
            </button>
          );
        })}
      </fieldset>

      <fieldset className={styles.tiles}>
        <legend className={styles.legend}>Export type</legend>
        {EXPORT_FORMAT_OPTIONS.map((option) => {
          const isSelected = selectedFormat === option.format;

          return (
            <button
              aria-label={option.label}
              aria-pressed={isSelected}
              className={[styles.tile, isSelected ? styles.tileSelected : ""]
                .filter(Boolean)
                .join(" ")}
              data-export-format={option.format}
              key={option.format}
              onClick={selectFormat}
              type="button"
            >
              <span className={styles.tileLabel}>{option.label}</span>
              <span className={styles.tileHint}>{option.hint}</span>
            </button>
          );
        })}
      </fieldset>

      <div className={styles.actions}>
        <Button onClick={onClose} variant="ghost">
          Cancel
        </Button>
        <Button disabled={!canExport} onClick={handleExport} variant="primary">
          Export
        </Button>
      </div>
    </Modal>
  );
}
