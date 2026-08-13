import { HermesDeveloperCenter } from "@/components/hermes/hermes-developer-center";
import { HermesQueryProvider } from "@/components/hermes/hermes-query-provider";

export default function HermesDeveloperPage() {
  return <HermesQueryProvider><main className="mx-auto w-full max-w-7xl space-y-6 p-4 md:p-6"><header><h1 className="text-2xl font-semibold tracking-tight">Hermes Developer</h1><p className="mt-1 text-sm text-muted-foreground">Safe developer and operator surfaces.</p></header><HermesDeveloperCenter /></main></HermesQueryProvider>;
}
