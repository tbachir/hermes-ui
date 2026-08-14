import { HermesSystemCenter } from "@/components/hermes/hermes-system-center";
import { HermesQueryProvider } from "@/components/hermes/hermes-query-provider";

export default function HermesSystemPage() {
  return <HermesQueryProvider><main className="mx-auto w-full max-w-[1500px] space-y-6 p-4 md:p-6"><header><h1 className="text-2xl font-semibold tracking-tight">Hermes system</h1><p className="mt-1 text-sm text-muted-foreground">Gateway, memory, plugins and updates.</p></header><HermesSystemCenter /></main></HermesQueryProvider>;
}
