"use client";

import { HermesGatewayControls } from "@/components/hermes/hermes-gateway-controls";
import { HermesMemoryManager } from "@/components/hermes/hermes-memory-manager";
import { HermesPluginManager } from "@/components/hermes/hermes-plugin-manager";
import { HermesStatusCard } from "@/components/hermes/hermes-status-card";
import { HermesUpdateCard } from "@/components/hermes/hermes-update-card";

export function HermesSystemCenter() {
  return <div className="grid gap-6 xl:grid-cols-2"><HermesStatusCard /><HermesGatewayControls /><HermesMemoryManager /><HermesUpdateCard /><div className="xl:col-span-2"><HermesPluginManager /></div></div>;
}
