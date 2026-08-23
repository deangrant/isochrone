import styles from "./index.module.css";
import type { MapControlsProps } from "./index.types";

/** Renders help, fit-contours, and export controls overlaid on the map. */
export function MapControls({
  onHelp,
  onExport,
  onFitContours,
  showResultControls = false,
}: MapControlsProps) {
  return (
    <div className={styles.mapControls}>
      <button
        aria-label="Help"
        className={styles.mapControl}
        onClick={onHelp}
        title="Help"
        type="button"
      >
        <svg
          aria-hidden="true"
          className={styles.mapControlIcon}
          fill="none"
          focusable="false"
          height="18"
          role="presentation"
          viewBox="0 0 24 24"
          width="18"
        >
          <circle
            cx="12"
            cy="12"
            r="9"
            stroke="currentColor"
            strokeWidth="1.75"
          />
          <path
            d="M9.5 9.25a2.5 2.5 0 1 1 4.2 1.83c-.78.67-1.2 1.17-1.2 2.17"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.75"
          />
          <circle cx="12" cy="16.75" fill="currentColor" r="0.9" />
        </svg>
      </button>
      {showResultControls ? (
        <>
          <button
            aria-label="Fit contours to map"
            className={styles.mapControl}
            onClick={onFitContours}
            title="Fit contours to map"
            type="button"
          >
            <svg
              aria-hidden="true"
              className={styles.mapControlIcon}
              fill="none"
              focusable="false"
              height="18"
              role="presentation"
              viewBox="0 0 24 24"
              width="18"
            >
              <path
                d="M4 9V5h4M20 9V5h-4M4 15v4h4M20 15v4h-4"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.75"
              />
            </svg>
          </button>
          <button
            aria-label="Export travel areas"
            className={styles.mapControl}
            onClick={onExport}
            title="Export travel areas"
            type="button"
          >
            <svg
              aria-hidden="true"
              className={styles.mapControlIcon}
              fill="none"
              focusable="false"
              height="18"
              role="presentation"
              viewBox="0 0 24 24"
              width="18"
            >
              <path
                d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.75"
              />
            </svg>
          </button>
        </>
      ) : null}
    </div>
  );
}
