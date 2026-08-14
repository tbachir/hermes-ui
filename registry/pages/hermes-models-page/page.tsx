import { HermesModelsCenter } from "@/components/hermes/hermes-models-center";
import { HermesQueryProvider } from "@/components/hermes/hermes-query-provider";

export default function HermesModelsPage() {
  return <HermesQueryProvider><main className="mx-auto w-full max-w-[1500px] space-y-6 p-4 md:p-6"><header><h1 className="text-2xl font-semibold tracking-tight">Hermes models</h1><p className="mt-1 text-sm text-muted-foreground">Profiles, models, providers and credentials.</p></header><HermesModelsCenter /></main></HermesQueryProvider>;
}
