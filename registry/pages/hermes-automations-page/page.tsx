import { HermesAutomationCenter } from "@/components/hermes/hermes-automation-center";
import { HermesQueryProvider } from "@/components/hermes/hermes-query-provider";

export default function HermesAutomationsPage() {
  return <HermesQueryProvider><main className="mx-auto w-full max-w-[1500px] space-y-6 p-4 md:p-6"><header><h1 className="text-2xl font-semibold tracking-tight">Hermes automations</h1><p className="mt-1 text-sm text-muted-foreground">Scheduled work and webhooks.</p></header><HermesAutomationCenter /></main></HermesQueryProvider>;
}
