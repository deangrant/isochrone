import { useMemo } from "react";
import { ReachabilityProvider } from "@/contexts/ReachabilityContext";
import { ServicesProvider } from "@/contexts/ServicesContext";
import { ReachabilityPage } from "@/pages/Reachability";
import { createServices } from "@/services/app-services";

/** Root application component. */
export function App() {
  const services = useMemo(() => createServices(), []);

  return (
    <ServicesProvider services={services}>
      <ReachabilityProvider>
        <ReachabilityPage />
      </ReachabilityProvider>
    </ServicesProvider>
  );
}
