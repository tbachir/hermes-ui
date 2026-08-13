"use client";

import { HermesKanbanBoard } from "@/components/hermes/hermes-kanban-board";
import { HermesProfileSwitcher } from "@/components/hermes/hermes-profile-switcher";
import { HermesRunConsole } from "@/components/hermes/hermes-run-console";
import { HermesSessionList } from "@/components/hermes/hermes-session-list";
import { HermesStatusCard } from "@/components/hermes/hermes-status-card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export function HermesCommandCenter() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <HermesStatusCard />
        <HermesProfileSwitcher />
      </div>

      <Tabs defaultValue="run" className="space-y-4">
        <TabsList>
          <TabsTrigger value="run">Run</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="kanban">Kanban</TabsTrigger>
        </TabsList>

        <TabsContent value="run">
          <HermesRunConsole />
        </TabsContent>
        <TabsContent value="sessions">
          <HermesSessionList />
        </TabsContent>
        <TabsContent value="kanban">
          <HermesKanbanBoard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
