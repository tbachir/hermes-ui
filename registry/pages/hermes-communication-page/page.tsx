import { HermesCommunicationCenter } from "@/components/hermes/hermes-communication-center";
import { HermesQueryProvider } from "@/components/hermes/hermes-query-provider";

export default function HermesCommunicationPage() {
  return <HermesQueryProvider><main className="mx-auto w-full max-w-7xl space-y-6 p-4 md:p-6"><header><h1 className="text-2xl font-semibold tracking-tight">Hermes Communication</h1><p className="mt-1 text-sm text-muted-foreground">Messaging, Portal and audio surfaces.</p></header><HermesCommunicationCenter /></main></HermesQueryProvider>;
}
