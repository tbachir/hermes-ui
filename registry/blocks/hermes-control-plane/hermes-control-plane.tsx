"use client";

import { HermesAutomationCenter } from "@/components/hermes/hermes-automation-center";
import { HermesCapabilitiesCenter } from "@/components/hermes/hermes-capabilities-center";
import { HermesCommandCenter } from "@/components/hermes/hermes-command-center";
import { HermesCommunicationCenter } from "@/components/hermes/hermes-communication-center";
import { HermesDeveloperCenter } from "@/components/hermes/hermes-developer-center";
import { HermesLearningCenter } from "@/components/hermes/hermes-learning-center";
import { HermesModelsCenter } from "@/components/hermes/hermes-models-center";
import { HermesObservabilityCenter } from "@/components/hermes/hermes-observability-center";
import { HermesSystemCenter } from "@/components/hermes/hermes-system-center";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function HermesControlPlane() {
  return <div className="space-y-6"><header><h1 className="text-2xl font-semibold tracking-tight">Hermes</h1><p className="mt-1 text-sm text-muted-foreground">Native control plane backed by @burner-io/hermes.</p></header><Tabs defaultValue="command" className="space-y-5"><TabsList className="h-auto flex-wrap justify-start"><TabsTrigger value="command">Command</TabsTrigger><TabsTrigger value="capabilities">Capabilities</TabsTrigger><TabsTrigger value="models">Models</TabsTrigger><TabsTrigger value="automations">Automations</TabsTrigger><TabsTrigger value="observability">Observability</TabsTrigger><TabsTrigger value="developer">Developer</TabsTrigger><TabsTrigger value="learning">Learning</TabsTrigger><TabsTrigger value="communication">Communication</TabsTrigger><TabsTrigger value="system">System</TabsTrigger></TabsList><TabsContent value="command"><HermesCommandCenter /></TabsContent><TabsContent value="capabilities"><HermesCapabilitiesCenter /></TabsContent><TabsContent value="models"><HermesModelsCenter /></TabsContent><TabsContent value="automations"><HermesAutomationCenter /></TabsContent><TabsContent value="observability"><HermesObservabilityCenter /></TabsContent><TabsContent value="developer"><HermesDeveloperCenter /></TabsContent><TabsContent value="learning"><HermesLearningCenter /></TabsContent><TabsContent value="communication"><HermesCommunicationCenter /></TabsContent><TabsContent value="system"><HermesSystemCenter /></TabsContent></Tabs></div>;
}
