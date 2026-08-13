"use client";

import { HermesCredentialManager } from "@/components/hermes/hermes-credential-manager";
import { HermesModelManager } from "@/components/hermes/hermes-model-manager";
import { HermesProfileSwitcher } from "@/components/hermes/hermes-profile-switcher";
import { HermesProviderManager } from "@/components/hermes/hermes-provider-manager";

export function HermesModelsCenter() {
  return <div className="grid gap-6 xl:grid-cols-2"><HermesProfileSwitcher /><HermesModelManager /><HermesProviderManager /><HermesCredentialManager /></div>;
}
