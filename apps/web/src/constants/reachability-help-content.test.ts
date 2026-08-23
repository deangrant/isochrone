import { describe, expect, it } from "vitest";
import {
  getHelpTopicsForSection,
  REACHABILITY_HELP_INTRO,
  REACHABILITY_HELP_SECTIONS,
  REACHABILITY_HELP_TOPICS,
} from "./reachability-help-content";

const MAP_EXPORT_TOPIC_IDS = [
  "map-pan-zoom",
  "fit-contours",
  "export-travel-areas",
] as const;

describe("reachability-help-content", () => {
  it("provides a non-empty intro", () => {
    expect(REACHABILITY_HELP_INTRO.length).toBeGreaterThan(0);
  });

  it("documents every topic with required fields", () => {
    for (const topic of REACHABILITY_HELP_TOPICS) {
      expect(topic.title.length).toBeGreaterThan(0);
      expect(topic.description.length).toBeGreaterThan(0);
      expect(topic.useCase.length).toBeGreaterThan(0);
      expect(topic.limits.length).toBeGreaterThan(0);
    }
  });

  it("covers only settings panel topics", () => {
    expect(REACHABILITY_HELP_TOPICS).toHaveLength(8);
    expect(REACHABILITY_HELP_TOPICS.map((topic) => topic.id)).not.toEqual(
      expect.arrayContaining([...MAP_EXPORT_TOPIC_IDS]),
    );
  });

  it("assigns every topic to exactly one section", () => {
    const sectionTopicIds = REACHABILITY_HELP_SECTIONS.flatMap(
      (section) => section.topicIds,
    );

    expect(sectionTopicIds).toHaveLength(REACHABILITY_HELP_TOPICS.length);
    expect(new Set(sectionTopicIds).size).toBe(REACHABILITY_HELP_TOPICS.length);
    expect(sectionTopicIds).toEqual(
      REACHABILITY_HELP_TOPICS.map((topic) => topic.id),
    );
  });

  it("marks profile-restricted topics", () => {
    const restrictedTopics = REACHABILITY_HELP_TOPICS.filter(
      (topic) => topic.profiles !== undefined,
    );

    expect(restrictedTopics.map((topic) => topic.id)).toEqual([
      "departure-time",
      "avoid-on-route",
    ]);
  });

  it("returns section topics in topicIds order", () => {
    const [planSection] = REACHABILITY_HELP_SECTIONS;

    expect(
      getHelpTopicsForSection(planSection).map((topic) => topic.id),
    ).toEqual(planSection.topicIds);
  });
});
