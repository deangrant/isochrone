/** One help section describing a settings panel control. */
export interface HelpTopic {
  description: string;
  id: string;
  limits: readonly string[];
  profiles?: string;
  title: string;
  useCase: string;
}

/** A grouped set of related help topics. */
export interface HelpSection {
  id: string;
  title: string;
  topicIds: readonly string[];
}

/** Opening summary shown before the topic list. */
export const REACHABILITY_HELP_INTRO =
  "Use the settings panel to choose a start location, travel mode, and travel times, then select Calculate to draw reach areas on the map.";

/** Help topics for settings panel controls, in display order. */
export const REACHABILITY_HELP_TOPICS: readonly HelpTopic[] = [
  {
    description:
      "Choose where your travel areas begin. Search for a place name or address, then pick a matching suggestion from the list.",
    id: "start-location",
    limits: [
      "You must select a suggestion so the app knows the exact coordinates.",
    ],
    title: "Start location",
    useCase:
      "Use this when you want reach areas from a home, office, station, or any landmark.",
  },
  {
    description:
      "Pick how you plan to travel. The map draws reach areas for that mode of transport.",
    id: "travel-mode",
    limits: [
      "Driving uses standard road routing.",
      "Traffic uses live traffic data for driving routes.",
      "Walking and Cycling use pedestrian and bicycle paths where available.",
    ],
    title: "Travel mode",
    useCase:
      "Switch modes to compare a drive, a walk, or a bike ride from the same start point.",
  },
  {
    description:
      "Set how many minutes you want to travel from your start location. Each value draws one reach area on the map.",
    id: "travel-times",
    limits: [
      "Add up to 3 travel times.",
      "Each time must be between 1 and 60 minutes.",
      "Each time must be different.",
    ],
    title: "Travel times (minutes)",
    useCase: "Compare a 10-, 20-, and 30-minute reach in a single view.",
  },
  {
    description:
      "Draw reach areas on the map using your current settings. The map zooms to fit the results when they are ready.",
    id: "calculate",
    limits: ["You need a start location before you can calculate."],
    title: "Calculate",
    useCase:
      "Run a new calculation after you change location, travel mode, or travel times.",
  },
  {
    description:
      "Smooth jagged edges on reach area shapes. Higher values produce cleaner outlines.",
    id: "contour-smoothing",
    limits: ["Range is 0 to 1.", "0 turns smoothing off."],
    title: "Contour smoothing",
    useCase:
      "Increase smoothing when polygons look noisy or jagged on the map.",
  },
  {
    description:
      "Simplify reach area shapes to reduce detail. Higher values use fewer points along each boundary.",
    id: "shape-simplification",
    limits: ["Range is 0 to 200 meters.", "0 keeps full detail."],
    title: "Shape simplification",
    useCase:
      "Increase simplification when you need lighter shapes for export or presentation.",
  },
  {
    description:
      "Set a specific date and time to leave from your start location. Enable the toggle, then pick a departure date and time.",
    id: "departure-time",
    limits: [
      "Optional. Leave the toggle off to use current routing conditions.",
    ],
    profiles: "Most useful with Traffic",
    title: "Departure time",
    useCase:
      "Plan a trip that starts at a future time, such as a morning commute or an evening errand.",
  },
  {
    description:
      "Exclude road types you do not want the route to use. Turn on any combination that applies to your trip.",
    id: "avoid-on-route",
    limits: ["Options: Motorway, Toll, Ferry, Unpaved, and Cash-only tolls."],
    profiles: "Driving and Traffic only",
    title: "Avoid on route",
    useCase:
      "Avoid motorways on a local trip, or skip toll roads when you prefer an untolled route.",
  },
] as const;

/** Settings help grouped into scannable sections. */
export const REACHABILITY_HELP_SECTIONS: readonly HelpSection[] = [
  {
    id: "plan",
    title: "Plan your trip",
    topicIds: ["start-location", "travel-mode", "travel-times", "calculate"],
  },
  {
    id: "advanced",
    title: "Advanced options",
    topicIds: [
      "contour-smoothing",
      "shape-simplification",
      "departure-time",
      "avoid-on-route",
    ],
  },
] as const;

const helpTopicsById = new Map(
  REACHABILITY_HELP_TOPICS.map((topic) => [topic.id, topic]),
);

/**
 * Returns help topics for a section in the order defined by topicIds.
 * @param section Help section definition.
 */
export function getHelpTopicsForSection(
  section: HelpSection,
): readonly HelpTopic[] {
  return section.topicIds.map((topicId) => {
    const topic = helpTopicsById.get(topicId);
    if (!topic) {
      throw new Error(`Unknown help topic id: ${topicId}`);
    }

    return topic;
  });
}
