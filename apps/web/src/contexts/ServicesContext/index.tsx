import { createContext, type ReactNode, useContext } from "react";
import type { AppServices } from "@/services/create-services";

const ServicesContext = createContext<AppServices | null>(null);

/** Props for the services provider. */
export interface ServicesProviderProps {
  children: ReactNode;
  services: AppServices;
}

/** Provides wired application services to the tree. */
export function ServicesProvider({
  children,
  services,
}: ServicesProviderProps) {
  return (
    <ServicesContext.Provider value={services}>
      {children}
    </ServicesContext.Provider>
  );
}

/**
 * Returns wired application services from context.
 */
export function useServices(): AppServices {
  const services = useContext(ServicesContext);
  if (!services) {
    throw new Error("useServices must be used within ServicesProvider.");
  }
  return services;
}
