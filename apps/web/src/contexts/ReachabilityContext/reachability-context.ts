import { createContext } from "react";
import type { ReachabilityContextValue } from "./index.types";

/** Reachability state and actions shared across the page tree. */
export const ReachabilityContext =
  createContext<ReachabilityContextValue | null>(null);
