import { Button } from "@/components/core/Button";
import { Modal } from "@/components/core/Modal";
import {
  getHelpTopicsForSection,
  REACHABILITY_HELP_INTRO,
  REACHABILITY_HELP_SECTIONS,
} from "@/pages/Reachability/constants/reachability-help-content";
import styles from "./index.module.css";
import type { HelpModalProps } from "./index.types";

/** Renders in-app help for reachability settings panel controls. */
export function HelpModal({ open, onClose }: HelpModalProps) {
  return (
    <Modal
      bodyClassName={styles.body}
      closeOnBackdrop={false}
      closeOnEscape={false}
      onClose={onClose}
      open={open}
      panelClassName={styles.panel}
      showCloseButton={false}
      title="User guide"
    >
      <p className={styles.intro}>{REACHABILITY_HELP_INTRO}</p>

      <div className={styles.scrollRegion}>
        {REACHABILITY_HELP_SECTIONS.map((section) => (
          <section
            aria-labelledby={`help-section-${section.id}`}
            className={styles.section}
            key={section.id}
          >
            <h3
              className={styles.sectionTitle}
              id={`help-section-${section.id}`}
            >
              {section.title}
            </h3>
            <ul className={styles.topicList}>
              {getHelpTopicsForSection(section).map((topic) => (
                <li className={styles.topicCard} key={topic.id}>
                  <h4 className={styles.topicTitle}>{topic.title}</h4>
                  <p className={styles.description}>{topic.description}</p>
                  <div className={styles.metaBlock}>
                    <p className={styles.metaLabel}>When to use it</p>
                    <p className={styles.metaText}>{topic.useCase}</p>
                  </div>
                  {topic.profiles ? (
                    <p className={styles.badge}>Applies to: {topic.profiles}</p>
                  ) : null}
                  <div className={styles.metaBlock}>
                    <p className={styles.metaLabel}>Limits</p>
                    <ul className={styles.limits}>
                      {topic.limits.map((limit) => (
                        <li key={limit}>{limit}</li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <footer className={styles.footer}>
        <Button onClick={onClose} variant="primary">
          Close
        </Button>
      </footer>
    </Modal>
  );
}
