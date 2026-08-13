"use client";

import { RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useHermesPluginAction, useHermesPlugins } from "@/hooks/use-hermes";

export function HermesPluginManager() {
  const query = useHermesPlugins();
  const action = useHermesPluginAction();
  const plugins = query.data?.plugins ?? [];
  return <Card><CardHeader className="flex flex-row items-start justify-between gap-4"><div><CardTitle className="text-base">Plugins</CardTitle><p className="mt-1 text-sm text-muted-foreground">Hermes dashboard and agent plugin surfaces.</p></div><Button size="sm" variant="outline" disabled={action.isPending} onClick={() => action.mutate({ action: "rescan" })}><RefreshCw className="mr-2 size-4" />Rescan</Button></CardHeader><CardContent>{query.isPending ? <Skeleton className="h-36 w-full" /> : query.error ? <p className="text-sm text-destructive">Unable to load plugins.</p> : <div className="divide-y rounded-md border">{plugins.map((plugin, index) => { const name = typeof plugin.name === "string" ? plugin.name : `plugin-${index}`; const enabled = plugin.enabled !== false; return <div key={name} className="flex items-center gap-3 p-3"><div className="min-w-0 flex-1"><div className="flex gap-2"><p className="font-medium">{name}</p>{plugin.hidden ? <Badge variant="outline">hidden</Badge> : null}</div></div><Switch checked={enabled} disabled={action.isPending} onCheckedChange={(value) => action.mutate({ action: value ? "enable" : "disable", name })} /></div>; })}{plugins.length === 0 ? <p className="p-6 text-center text-sm text-muted-foreground">No plugins reported.</p> : null}</div>}</CardContent></Card>;
}
