import { HermesControlPlane } from "@/components/hermes/hermes-control-plane";
import { HermesQueryProvider } from "@/components/hermes/hermes-query-provider";

export default function HermesDashboardPage() {
  return (
    <HermesQueryProvider>
      <main className="mx-auto w-full max-w-[1600px] p-4 md:p-6">
        <HermesControlPlane />
      </main>
    </HermesQueryProvider>
  );
}
