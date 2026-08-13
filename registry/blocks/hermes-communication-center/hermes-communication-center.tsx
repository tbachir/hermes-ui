"use client";

import { HermesAudioConsole } from "@/components/hermes/hermes-audio-console";
import { HermesMessagingManager } from "@/components/hermes/hermes-messaging-manager";
import { HermesPortalCard } from "@/components/hermes/hermes-portal-card";

export function HermesCommunicationCenter() {
  return <div className="grid gap-5 xl:grid-cols-2"><HermesMessagingManager /><HermesPortalCard /><HermesAudioConsole /></div>;
}
