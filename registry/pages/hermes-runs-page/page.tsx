import { HermesQueryProvider } from "@/components/hermes/hermes-query-provider";
import { HermesRunConsole } from "@/components/hermes/hermes-run-console";

export default function HermesRunsPage() {
  return (
    <HermesQueryProvider>
      <main className="mx-auto w-full max-w-5xl p-4 md:p-6">
        <HermesRunConsole />
      </main>
    </HermesQueryProvider>
  );
}
