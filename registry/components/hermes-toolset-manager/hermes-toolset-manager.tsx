"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useHermesTools, useSetHermesTerminalBackend, useToggleHermesToolset } from "@/hooks/use-hermes";

export function HermesToolsetManager({ profile }: { profile?: string }) {
  const query = useHermesTools(profile);
  const toggle = useToggleHermesToolset();
  const terminal = useSetHermesTerminalBackend();
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Toolsets</CardTitle><p className="mt-1 text-sm text-muted-foreground">Enable Hermes native tool capabilities and terminal backend.</p></CardHeader>
      <CardContent className="space-y-5">
        {query.isPending ? <Skeleton className="h-52 w-full" /> : query.error || !query.data ? <p className="text-sm text-destructive">Unable to load toolsets.</p> : (
          <>
            <div className="divide-y rounded-md border">
              {query.data.toolsets.map((toolset) => (
                <div key={toolset.name} className="flex items-center gap-4 p-3">
                  <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="font-medium">{toolset.label || toolset.name}</p><Badge variant={toolset.configured ? "secondary" : "outline"}>{toolset.configured ? "configured" : "setup needed"}</Badge><Badge variant="outline">{toolset.tools.length} tools</Badge></div><p className="mt-1 text-xs text-muted-foreground">{toolset.description}</p></div>
                  <Switch checked={toolset.enabled} disabled={toggle.isPending} onCheckedChange={(enabled) => toggle.mutate({ name: toolset.name, enabled, ...(profile ? { profile } : {}) })} />
                </div>
              ))}
            </div>
            <div className="grid gap-2 sm:grid-cols-[180px_1fr] sm:items-center">
              <p className="text-sm font-medium">Terminal backend</p>
              <Select value={query.data.terminal.active} disabled={terminal.isPending} onValueChange={(backend) => terminal.mutate({ backend, ...(profile ? { profile } : {}) })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{query.data.terminal.backends.map((backend) => <SelectItem key={backend.name} value={backend.name} disabled={backend.status !== "ready"}>{backend.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
