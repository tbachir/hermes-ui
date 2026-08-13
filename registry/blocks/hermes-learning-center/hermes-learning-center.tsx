"use client";

import { HermesLearningOverview } from "@/components/hermes/hermes-learning-overview";
import { HermesMemoryManager } from "@/components/hermes/hermes-memory-manager";

export function HermesLearningCenter() {
  return <div className="grid gap-5 xl:grid-cols-2"><HermesLearningOverview /><HermesMemoryManager /></div>;
}
