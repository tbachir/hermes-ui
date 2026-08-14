import { HermesQueryProvider } from "@/components/hermes/hermes-query-provider";
import { HermesRunConsole } from "@/components/hermes/hermes-run-console";
import { HermesSessionList } from "@/components/hermes/hermes-session-list";
import { HermesStatusCard } from "@/components/hermes/hermes-status-card";

export default function HermesDashboardPage() {
  return (
    <HermesQueryProvider>
      <main className="mx-auto w-full max-w-[1600px] space-y-4 p-4 md:p-6">
        <HermesStatusCard />
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.6fr)]">
          <HermesRunConsole />
          <HermesSessionList limit={8} />
        </div>
      </main>
    </HermesQueryProvider>
  );
}
