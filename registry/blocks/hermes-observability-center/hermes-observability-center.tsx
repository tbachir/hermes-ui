"use client";

import { HermesAnalyticsOverview } from "@/components/hermes/hermes-analytics-overview";
import { HermesSessionList } from "@/components/hermes/hermes-session-list";

export function HermesObservabilityCenter() {
  return <div className="space-y-6"><HermesAnalyticsOverview /><HermesSessionList /></div>;
}
