import { HermesQueryProvider } from "@/components/hermes/hermes-query-provider";
import { HermesSessionList } from "@/components/hermes/hermes-session-list";

export default function HermesSessionsPage() {
  return (
    <HermesQueryProvider>
      <main className="mx-auto w-full max-w-6xl p-4 md:p-6">
        <HermesSessionList limit={100} />
      </main>
    </HermesQueryProvider>
  );
}
