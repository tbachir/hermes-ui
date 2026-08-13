"use client";

import { HermesCronManager } from "@/components/hermes/hermes-cron-manager";
import { HermesWebhookManager } from "@/components/hermes/hermes-webhook-manager";

export function HermesAutomationCenter() {
  return <div className="grid gap-6 xl:grid-cols-2"><HermesCronManager /><HermesWebhookManager /></div>;
}
